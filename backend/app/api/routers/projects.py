import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User
from app.schemas.schemas import ProjectCreate, ProjectResponse
from app.services.services import project_service
from app.repositories.repositories import market_opportunity_repo

router = APIRouter()

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await project_service.create_project(db=db, project_in=project_in, user_id=current_user.id)

@router.get("/", response_model=List[ProjectResponse])
async def read_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await project_service.get_projects_by_user(db=db, user_id=current_user.id)

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: uuid.UUID,
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.repositories.repositories import project_repo
    from fastapi import HTTPException
    project = await project_repo.get(db, id=str(project_id))
    if not project or project.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return await project_repo.update(db=db, db_obj=project, obj_in=project_in.model_dump())

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = await project_service.delete_project(db, project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")

@router.get("/{project_id}/opportunities")
async def get_opportunities(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    opps = await market_opportunity_repo.get_recent_for_project(db, project_id=str(project_id), limit=10)
    return [
        {
            "id": str(o.id),
            "title": o.title,
            "description": o.description,
            "score": o.score,
            "evidence": o.evidence_json
        } for o in opps
    ]
