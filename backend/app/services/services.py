import uuid
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import User, Project, Competitor
from app.repositories.repositories import user_repo, project_repo, competitor_repo
from app.schemas.schemas import UserCreate, ProjectCreate, CompetitorCreate
from app.core.security import get_password_hash

class UserService:
    async def create_user(self, db: AsyncSession, user_in: UserCreate) -> User:
        hashed_password = get_password_hash(user_in.password)
        db_obj = {"email": user_in.email, "password_hash": hashed_password}
        return await user_repo.create(db=db, obj_in=db_obj)

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        return await user_repo.get_by_email(db, email)

class ProjectService:
    async def create_project(self, db: AsyncSession, project_in: ProjectCreate, user_id: uuid.UUID) -> Project:
        obj_in = project_in.model_dump()
        obj_in["user_id"] = user_id
        return await project_repo.create(db=db, obj_in=obj_in)

    async def get_projects_by_user(self, db: AsyncSession, user_id: uuid.UUID) -> List[Project]:
        return await project_repo.get_multi_by_user(db=db, user_id=str(user_id))

class CompetitorService:
    async def add_competitor(self, db: AsyncSession, comp_in: CompetitorCreate, project_id: uuid.UUID) -> Competitor:
        obj_in = comp_in.model_dump()
        obj_in["project_id"] = project_id
        return await competitor_repo.create(db=db, obj_in=obj_in)

    async def get_competitors_by_project(self, db: AsyncSession, project_id: uuid.UUID) -> List[Competitor]:
        return await competitor_repo.get_multi_by_project(db=db, project_id=str(project_id))

user_service = UserService()
project_service = ProjectService()
competitor_service = CompetitorService()
