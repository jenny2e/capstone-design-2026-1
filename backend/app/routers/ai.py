from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database import get_db
from app.models.user import User
from app.services.ai_agent import run_ai_agent
from app.services.auth import get_current_user

router = APIRouter(prefix="/ai", tags=["ai"])


class ChatMessage(BaseModel):
    role: str   # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    messages: List[ChatMessage] = []   # conversation history


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Set GEMINI_API_KEY in .env",
        )

    # Convert ChatMessage objects to plain dicts for the agent
    history = [{"role": m.role, "content": m.content} for m in request.messages]

    reply = run_ai_agent(db, current_user.id, request.message, conversation_history=history)
    return {"reply": reply}
