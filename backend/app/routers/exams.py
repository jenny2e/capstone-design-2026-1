from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import ExamSchedule, User
from app.schemas.exam import ExamCreate, ExamResponse
from app.services.auth import get_current_user

router = APIRouter(prefix="/exams", tags=["exams"])


@router.get("", response_model=List[ExamResponse])
def list_exams(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(ExamSchedule).filter(ExamSchedule.user_id == current_user.id).all()


@router.post("", response_model=ExamResponse, status_code=201)
def create_exam(
    data: ExamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam = ExamSchedule(user_id=current_user.id, **data.model_dump())
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return exam


@router.delete("/{exam_id}", status_code=204)
def delete_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam = (
        db.query(ExamSchedule)
        .filter(ExamSchedule.id == exam_id, ExamSchedule.user_id == current_user.id)
        .first()
    )
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    db.delete(exam)
    db.commit()
