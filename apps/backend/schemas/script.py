from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BaseSchema(BaseModel):
    class Config:
        extra = "forbid"  # Don't allow extra fields
        allow_population_by_field_name = True
        populate_by_name = True
        validate_by_name = True


class ScriptBase(BaseSchema):
    name: str = Field(..., min_length=2)
    type: str = Field(..., min_length=2)
    content: str = Field(..., min_length=2)


class ScriptCreate(ScriptBase):
    pass


class ScriptUpdate(BaseSchema):
    name: Optional[str] = Field(None, min_length=2)
    type: Optional[str] = Field(None, min_length=2)
    content: Optional[str] = Field(None, min_length=2)
    updated_at: Optional[datetime] = None


class Script(ScriptBase):
    id: str
    crm_id: str
    created_at: datetime
    updated_at: datetime
