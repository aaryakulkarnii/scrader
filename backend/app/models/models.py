import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.models.base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    plan = Column(String, default="free")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    projects = relationship("Project", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    settings = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="projects")
    competitors = relationship("Competitor", back_populates="project")
    opportunities = relationship("MarketOpportunity", back_populates="project")
    reports = relationship("Report", back_populates="project")

class Competitor(Base):
    __tablename__ = "competitors"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    domain = Column(String, nullable=False)
    name = Column(String, nullable=False)
    metadata_json = Column(JSONB, default={})

    project = relationship("Project", back_populates="competitors")
    snapshots = relationship("Snapshot", back_populates="competitor")
    threat_scores = relationship("ThreatScore", back_populates="competitor")
    hiring_events = relationship("HiringEvent", back_populates="competitor")
    sentiment_data = relationship("SentimentData", back_populates="competitor")
    events = relationship("Event", back_populates="competitor")

class Snapshot(Base):
    __tablename__ = "snapshots"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    competitor_id = Column(UUID(as_uuid=True), ForeignKey("competitors.id"), nullable=False)
    url = Column(String, nullable=False)
    html_hash = Column(String, nullable=False)
    text_content = Column(Text, nullable=False)
    scraped_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    competitor = relationship("Competitor", back_populates="snapshots")
    changes = relationship("Change", back_populates="snapshot")

class Change(Base):
    __tablename__ = "changes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    snapshot_id = Column(UUID(as_uuid=True), ForeignKey("snapshots.id"), nullable=False)
    change_type = Column(String, nullable=False)
    diff_text = Column(Text, nullable=False)
    severity = Column(Integer, default=0)

    snapshot = relationship("Snapshot", back_populates="changes")

class Event(Base):
    __tablename__ = "events"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    competitor_id = Column(UUID(as_uuid=True), ForeignKey("competitors.id"), nullable=False)
    event_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    ai_summary = Column(Text)
    raw_data = Column(JSONB, default={})

    competitor = relationship("Competitor", back_populates="events")
    signals = relationship("Signal", back_populates="event")

class Signal(Base):
    __tablename__ = "signals"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    signal_type = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    implication = Column(Text)
    threat_delta = Column(Float)

    event = relationship("Event", back_populates="signals")

class ThreatScore(Base):
    __tablename__ = "threat_scores"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    competitor_id = Column(UUID(as_uuid=True), ForeignKey("competitors.id"), nullable=False)
    score = Column(Float, nullable=False)
    breakdown_json = Column(JSONB, default={})
    scored_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    competitor = relationship("Competitor", back_populates="threat_scores")

class MarketOpportunity(Base):
    __tablename__ = "market_opportunities"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    evidence_json = Column(JSONB, default={})
    score = Column(Float)

    project = relationship("Project", back_populates="opportunities")

class HiringEvent(Base):
    __tablename__ = "hiring_events"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    competitor_id = Column(UUID(as_uuid=True), ForeignKey("competitors.id"), nullable=False)
    role_title = Column(String, nullable=False)
    team_category = Column(String)
    count = Column(Integer, default=1)
    detected_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    competitor = relationship("Competitor", back_populates="hiring_events")

class SentimentData(Base):
    __tablename__ = "sentiment_data"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    competitor_id = Column(UUID(as_uuid=True), ForeignKey("competitors.id"), nullable=False)
    source = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    text = Column(Text)
    extracted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    competitor = relationship("Competitor", back_populates="sentiment_data")

class Report(Base):
    __tablename__ = "reports"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    title = Column(String, nullable=False)
    content_json = Column(JSONB, default={})
    generated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="reports")
