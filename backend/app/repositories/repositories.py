from app.models.models import User, Project, Competitor, Signal, Snapshot, Event, ThreatScore, MarketOpportunity
from app.repositories.base import BaseRepository
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

class UserRepository(BaseRepository[User]):
    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).filter(User.email == email))
        return result.scalars().first()

class ProjectRepository(BaseRepository[Project]):
    async def get_multi_by_user(
        self, db: AsyncSession, *, user_id: str, skip: int = 0, limit: int = 100
    ) -> list[Project]:
        result = await db.execute(
            select(Project)
            .filter(Project.user_id == user_id)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

class CompetitorRepository(BaseRepository[Competitor]):
    async def get_multi_by_project(
        self, db: AsyncSession, *, project_id: str, skip: int = 0, limit: int = 100
    ) -> list[Competitor]:
        result = await db.execute(
            select(Competitor)
            .filter(Competitor.project_id == project_id)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

class SignalRepository(BaseRepository[Signal]):
    async def get_recent_for_project(self, db: AsyncSession, project_id: str, limit: int = 20) -> list[Signal]:
        result = await db.execute(
            select(Signal)
            .join(Event)
            .join(Competitor)
            .filter(Competitor.project_id == project_id)
            .order_by(Signal.id.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

class SnapshotRepository(BaseRepository[Snapshot]):
    async def get_latest_for_competitor(self, db: AsyncSession, competitor_id: str) -> Optional[Snapshot]:
        result = await db.execute(
            select(Snapshot)
            .filter(Snapshot.competitor_id == competitor_id)
            .order_by(Snapshot.scraped_at.desc())
            .limit(1)
        )
        return result.scalars().first()

class EventRepository(BaseRepository[Event]):
    async def get_recent_for_project(self, db: AsyncSession, project_id: str, limit: int = 20) -> list[Event]:
        result = await db.execute(
            select(Event)
            .join(Competitor)
            .filter(Competitor.project_id == project_id)
            .order_by(Event.id.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

class ThreatScoreRepository(BaseRepository[ThreatScore]):
    async def get_recent_for_project(self, db: AsyncSession, project_id: str, limit: int = 10) -> list[ThreatScore]:
        result = await db.execute(
            select(ThreatScore)
            .join(Competitor)
            .filter(Competitor.project_id == project_id)
            .order_by(ThreatScore.scored_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

class MarketOpportunityRepository(BaseRepository[MarketOpportunity]):
    async def get_recent_for_project(self, db: AsyncSession, project_id: str, limit: int = 10) -> list[MarketOpportunity]:
        result = await db.execute(
            select(MarketOpportunity)
            .filter(MarketOpportunity.project_id == project_id)
            .order_by(MarketOpportunity.score.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

user_repo = UserRepository(User)
project_repo = ProjectRepository(Project)
competitor_repo = CompetitorRepository(Competitor)
signal_repo = SignalRepository(Signal)
snapshot_repo = SnapshotRepository(Snapshot)
event_repo = EventRepository(Event)
threat_score_repo = ThreatScoreRepository(ThreatScore)
market_opportunity_repo = MarketOpportunityRepository(MarketOpportunity)
