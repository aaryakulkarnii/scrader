import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from arq import create_pool
from arq.connections import RedisSettings

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User
from app.schemas.schemas import CompetitorCreate, CompetitorResponse
from app.services.services import competitor_service, project_service
from app.core.config import settings

router = APIRouter()

@router.post("/", response_model=CompetitorResponse)
async def create_competitor(
    project_id: uuid.UUID,
    comp_in: CompetitorCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if project exists and belongs to user
    projects = await project_service.get_projects_by_user(db, current_user.id)
    if project_id not in [p.id for p in projects]:
        raise HTTPException(status_code=404, detail="Project not found")
        
    comp = await competitor_service.add_competitor(db=db, comp_in=comp_in, project_id=project_id)
    
    # Trigger background discovery using ARQ
    try:
        redis = await create_pool(RedisSettings(host=settings.REDIS_HOST, port=settings.REDIS_PORT))
        await redis.enqueue_job('discover_competitor_pages', str(comp.id), comp.domain)
        redis.close()
        await redis.wait_closed()
    except Exception as e:
        print(f"Failed to enqueue discovery: {e}")
        
    return comp

@router.get("/{project_id}", response_model=List[CompetitorResponse])
async def read_competitors(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    projects = await project_service.get_projects_by_user(db, current_user.id)
    if project_id not in [p.id for p in projects]:
        raise HTTPException(status_code=404, detail="Project not found")
        
    return await competitor_service.get_competitors_by_project(db=db, project_id=project_id)
