from typing import Optional

from pydantic import BaseModel


class ScheduleCreate(BaseModel):
    title: str
    day_of_week: int           # 0=Mon ... 6=Sun
    date: Optional[str] = None # YYYY-MM-DD for specific date events
    start_time: str            # "HH:MM"
    end_time: str              # "HH:MM"
    location: Optional[str] = None
    color: Optional[str] = "#6366F1"
    priority: Optional[int] = 0
    schedule_type: Optional[str] = "class"


class ScheduleUpdate(BaseModel):
    title: Optional[str] = None
    day_of_week: Optional[int] = None
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location: Optional[str] = None
    color: Optional[str] = None
    priority: Optional[int] = None
    is_completed: Optional[bool] = None
    schedule_type: Optional[str] = None


class ScheduleResponse(BaseModel):
    id: int
    user_id: int
    title: str
    day_of_week: int
    date: Optional[str] = None
    start_time: str
    end_time: str
    location: Optional[str] = None
    color: str
    priority: int = 0
    is_completed: bool = False
    schedule_type: str = "class"

    model_config = {"from_attributes": True}


class ShareTokenResponse(BaseModel):
    token: str
    share_url: str
