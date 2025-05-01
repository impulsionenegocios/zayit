from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class BaseSchema(BaseModel):
    class Config:
        extra = "forbid"  # Don't allow extra fields
        allow_population_by_field_name = True
        populate_by_name = True
        validate_by_name = True


class CRMBase(BaseSchema):
    name: str = Field(..., min_length=2)


class CRMCreate(CRMBase):
    pass


class CRMUpdate(BaseSchema):
    name: Optional[str] = Field(None, min_length=2)


class CRM(CRMBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime