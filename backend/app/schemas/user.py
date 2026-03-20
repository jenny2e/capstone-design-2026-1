from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class UserProfileUpdate(BaseModel):
    occupation: Optional[str] = None
    sleep_start: Optional[str] = None   # HH:MM
    sleep_end: Optional[str] = None     # HH:MM
    onboarding_completed: Optional[bool] = None


class UserProfileResponse(BaseModel):
    id: int
    user_id: int
    occupation: Optional[str] = None
    sleep_start: Optional[str] = "23:00"
    sleep_end: Optional[str] = "07:00"
    onboarding_completed: bool = False

    model_config = {"from_attributes": True}
