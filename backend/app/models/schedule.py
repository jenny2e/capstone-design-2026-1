import secrets

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    day_of_week = Column(Integer, nullable=False)       # 0=Mon ... 6=Sun
    date = Column(String, nullable=True)                # YYYY-MM-DD (specific date event)
    start_time = Column(String, nullable=False)         # "HH:MM"
    end_time = Column(String, nullable=False)           # "HH:MM"
    location = Column(String, nullable=True)
    color = Column(String, default="#6366F1")
    priority = Column(Integer, default=0)               # 0=normal, 1=high, 2=urgent
    is_completed = Column(Boolean, default=False)
    schedule_type = Column(String, default="class")     # class / event / study

    user = relationship("User", back_populates="schedules")


class ShareToken(Base):
    __tablename__ = "share_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="share_tokens")
