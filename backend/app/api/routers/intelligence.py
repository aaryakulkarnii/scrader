from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
import json
from groq import AsyncGroq

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User
from app.repositories.repositories import (
    project_repo,
    signal_repo,
    event_repo,
    threat_score_repo,
    market_opportunity_repo
)
from app.core.config import settings

router = APIRouter()
groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY if hasattr(settings, 'GROQ_API_KEY') and settings.GROQ_API_KEY else "gsk_dummy")

class ChatRequest(BaseModel):
    project_id: str
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def intelligence_chat(
    req: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = await project_repo.get(db, id=req.project_id)
    if not project or str(project.user_id) != str(current_user.id):
        raise HTTPException(status_code=404, detail="Project not found")

    # Fetch context
    recent_signals = await signal_repo.get_recent_for_project(db, project_id=req.project_id, limit=10)
    recent_events = await event_repo.get_recent_for_project(db, project_id=req.project_id, limit=10)
    opportunities = await market_opportunity_repo.get_recent_for_project(db, project_id=req.project_id, limit=5)

    context_data = {
        "signals": [{"type": s.signal_type, "confidence": s.confidence, "implication": s.implication} for s in recent_signals],
        "events": [{"type": e.event_type, "title": e.title, "description": e.description} for e in recent_events],
        "opportunities": [{"title": o.title, "description": o.description} for o in opportunities]
    }

    system_prompt = f"""
    You are Scrader AI, a strategic competitive intelligence advisor.
    Use the following real-time data context from the user's competitive landscape to answer their question.
    If the context doesn't contain the answer, say so, but offer general strategic advice.
    Keep your answers highly strategic, concise, and professional.
    
    CONTEXT:
    {json.dumps(context_data, indent=2)}
    """

    try:
        response = await groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": req.message}
            ],
            model="llama3-70b-8192",
            temperature=0.3,
            max_tokens=1024
        )
        reply = response.choices[0].message.content
    except Exception as e:
        print(f"Groq Chat Error: {e}")
        reply = "I'm currently unable to connect to my intelligence backend. Please try again later."

    return ChatResponse(reply=reply)
