import re
import secrets

import requests as http_requests
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserResponse
from app.services.auth import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])

# ── OAuth helpers ──────────────────────────────────────────────────────────────

OAUTH_CONFIGS = {
    "google": {
        "client_id_key": "GOOGLE_CLIENT_ID",
        "client_secret_key": "GOOGLE_CLIENT_SECRET",
        "auth_url": "https://accounts.google.com/o/oauth2/v2/auth",
        "token_url": "https://oauth2.googleapis.com/token",
        "userinfo_url": "https://www.googleapis.com/oauth2/v2/userinfo",
        "scope": "openid email profile",
    },
    "naver": {
        "client_id_key": "NAVER_CLIENT_ID",
        "client_secret_key": "NAVER_CLIENT_SECRET",
        "auth_url": "https://nid.naver.com/oauth2.0/authorize",
        "token_url": "https://nid.naver.com/oauth2.0/token",
        "userinfo_url": "https://openapi.naver.com/v1/nid/me",
        "scope": "name email",
    },
    "kakao": {
        "client_id_key": "KAKAO_CLIENT_ID",
        "client_secret_key": "KAKAO_CLIENT_SECRET",
        "auth_url": "https://kauth.kakao.com/oauth/authorize",
        "token_url": "https://kauth.kakao.com/oauth/token",
        "userinfo_url": "https://kapi.kakao.com/v2/user/me",
        "scope": "profile_nickname account_email",
    },
}


def _get_or_create_social_user(db: Session, provider: str, social_id: str, email: str, display_name: str) -> User:
    """소셜 로그인 사용자를 찾거나 새로 생성한다."""
    # 기존 소셜 계정 확인
    user = db.query(User).filter(
        User.social_provider == provider,
        User.social_id == social_id,
    ).first()
    if user:
        return user

    # 동일 이메일 계정이 있으면 소셜 정보를 연결
    if email:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.social_provider = provider
            user.social_id = social_id
            db.commit()
            db.refresh(user)
            return user

    # 새 계정 생성
    base_username = re.sub(r"[^a-zA-Z0-9_]", "", display_name or provider)[:20] or provider
    username = base_username
    suffix = 1
    while db.query(User).filter(User.username == username).first():
        username = f"{base_username}{suffix}"
        suffix += 1

    fallback_email = email or f"{provider}_{social_id}@social.skema"
    user = User(
        username=username,
        email=fallback_email,
        hashed_password=hash_password(secrets.token_hex(32)),
        social_provider=provider,
        social_id=social_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/token", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ── Social Login (OAuth 2.0) ───────────────────────────────────────────────────

@router.get("/{provider}/authorize")
def oauth_authorize(provider: str):
    """소셜 로그인 시작: 해당 제공자의 OAuth 페이지로 리다이렉트"""
    if provider not in OAUTH_CONFIGS:
        raise HTTPException(status_code=404, detail="Unknown provider")

    cfg = OAUTH_CONFIGS[provider]
    client_id = getattr(settings, cfg["client_id_key"])
    if not client_id:
        # 자격증명 미설정 시 프론트엔드로 에러 리다이렉트
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=oauth_not_configured&provider={provider}"
        )

    redirect_uri = f"http://localhost:8000/auth/{provider}/callback"
    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": cfg["scope"],
    }
    if provider == "naver":
        params["state"] = secrets.token_hex(8)

    query = "&".join(f"{k}={v}" for k, v in params.items() if v)
    return RedirectResponse(url=f"{cfg['auth_url']}?{query}")


@router.get("/{provider}/callback")
def oauth_callback(provider: str, code: str = "", error: str = "", db: Session = Depends(get_db)):
    """소셜 로그인 콜백: code를 교환하고 JWT를 발급해 프론트엔드로 리다이렉트"""
    if provider not in OAUTH_CONFIGS:
        raise HTTPException(status_code=404, detail="Unknown provider")

    if error or not code:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_denied")

    cfg = OAUTH_CONFIGS[provider]
    client_id = getattr(settings, cfg["client_id_key"])
    client_secret = getattr(settings, cfg["client_secret_key"])
    redirect_uri = f"http://localhost:8000/auth/{provider}/callback"

    try:
        # 1. Access token 교환
        token_resp = http_requests.post(
            cfg["token_url"],
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": redirect_uri,
                "client_id": client_id,
                "client_secret": client_secret,
            },
            headers={"Accept": "application/json"},
            timeout=10,
        )
        token_data = token_resp.json()
        access_token = token_data.get("access_token")
        if not access_token:
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=token_exchange_failed")

        # 2. 사용자 정보 조회
        userinfo_resp = http_requests.get(
            cfg["userinfo_url"],
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10,
        )
        userinfo = userinfo_resp.json()

        # 3. 제공자별 사용자 정보 파싱
        if provider == "google":
            social_id = userinfo.get("id", "")
            email = userinfo.get("email", "")
            display_name = userinfo.get("name", "")
        elif provider == "naver":
            response_data = userinfo.get("response", {})
            social_id = response_data.get("id", "")
            email = response_data.get("email", "")
            display_name = response_data.get("nickname", response_data.get("name", ""))
        elif provider == "kakao":
            social_id = str(userinfo.get("id", ""))
            kakao_account = userinfo.get("kakao_account", {})
            email = kakao_account.get("email", "")
            display_name = userinfo.get("properties", {}).get("nickname", "")
        else:
            social_id = ""
            email = ""
            display_name = ""

        if not social_id:
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=userinfo_failed")

        # 4. 사용자 찾기 또는 생성
        user = _get_or_create_social_user(db, provider, social_id, email, display_name)

        # 5. JWT 발급 후 프론트엔드로 리다이렉트
        jwt = create_access_token(data={"sub": user.username})
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?token={jwt}")

    except Exception:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_failed")
