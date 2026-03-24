from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.schedule import Schedule
from app.models.user import User
from app.schemas.schedule import ScheduleCreate, ScheduleResponse, ScheduleUpdate
from app.services.auth import get_current_user

router = APIRouter(prefix="/schedules", tags=["schedules"])


@router.get("", response_model=List[ScheduleResponse])
def list_schedules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Schedule).filter(Schedule.user_id == current_user.id).all()


@router.post("", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_schedule(
    data: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    schedule = Schedule(user_id=current_user.id, **data.model_dump())
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule


@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(
    schedule_id: int,
    data: ScheduleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    schedule = (
        db.query(Schedule)
        .filter(Schedule.id == schedule_id, Schedule.user_id == current_user.id)
        .first()
    )
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(schedule, key, value)
    db.commit()
    db.refresh(schedule)
    return schedule


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    schedule = (
        db.query(Schedule)
        .filter(Schedule.id == schedule_id, Schedule.user_id == current_user.id)
        .first()
    )
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    db.delete(schedule)
    db.commit()
