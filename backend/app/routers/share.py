import secrets
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.schedule import Schedule, ShareToken
from app.models.user import User
from app.schemas.schedule import ScheduleResponse, ShareTokenResponse
from app.services.auth import get_current_user

router = APIRouter(prefix="/share", tags=["share"])


@router.post("", response_model=ShareTokenResponse)
def create_share_link(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    token_str = secrets.token_urlsafe(16)
    share_token = ShareToken(user_id=current_user.id, token=token_str)
    db.add(share_token)
    db.commit()
    db.refresh(share_token)

    base_url = str(request.base_url).rstrip("/")
    # Frontend share URL (port 5173 in dev)
    share_url = f"http://localhost:5173/share/{token_str}"
    return {"token": token_str, "share_url": share_url}


@router.get("/{token}", response_model=List[ScheduleResponse])
def get_shared_timetable(token: str, db: Session = Depends(get_db)):
    share_token = db.query(ShareToken).filter(ShareToken.token == token).first()
    if not share_token:
        raise HTTPException(status_code=404, detail="Share link not found")

    schedules = (
        db.query(Schedule)
        .filter(Schedule.user_id == share_token.user_id)
        .all()
    )
    return schedules
