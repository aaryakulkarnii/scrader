import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional, Any

# -- User --
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    plan: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# -- Project --
class ProjectBase(BaseModel):
    name: str
    settings: Optional[dict] = {}

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# -- Competitor --
class CompetitorBase(BaseModel):
    domain: str
    name: str

class CompetitorCreate(CompetitorBase):
    pass

class CompetitorResponse(CompetitorBase):
    id: uuid.UUID
    project_id: uuid.UUID
    metadata_json: dict
    model_config = ConfigDict(from_attributes=True)

# -- Signal --
class SignalResponse(BaseModel):
    id: uuid.UUID
    event_id: uuid.UUID
    signal_type: str
    confidence: float
    implication: Optional[str] = None
    threat_delta: Optional[float] = None
    model_config = ConfigDict(from_attributes=True)

# -- Token --
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class GoogleAuthRequest(BaseModel):
    credential: str
