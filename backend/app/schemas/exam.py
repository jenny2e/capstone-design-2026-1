from typing import Optional

from pydantic import BaseModel


class ExamCreate(BaseModel):
    title: str
    subject: Optional[str] = None
    exam_date: str              # YYYY-MM-DD
    exam_time: Optional[str] = None  # HH:MM
    location: Optional[str] = None


class ExamResponse(BaseModel):
    id: int
    user_id: int
    title: str
    subject: Optional[str] = None
    exam_date: str
    exam_time: Optional[str] = None
    location: Optional[str] = None

    model_config = {"from_attributes": True}
