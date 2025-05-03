from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BaseSchema(BaseModel):
    class Config:
        extra = "forbid"
        allow_population_by_field_name = True
        populate_by_name = True
        validate_by_name = True

class StatusBase(BaseSchema):
    name: str
    color: str
    order: int = Field(..., ge=0)
    description: Optional[str] = None

class StatusCreate(StatusBase):
    pass

class StatusUpdate(BaseSchema):
    name: Optional[str] = None
    color: Optional[str] = None
    order: Optional[int] = Field(None, ge=0)
    description: Optional[str] = None
    updated_at: Optional[datetime] = None
class Status(StatusBase):
    id: str
    crm_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None