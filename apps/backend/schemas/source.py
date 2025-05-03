from pydantic import BaseModel, Field
from typing import Optional

class BaseSchema(BaseModel):
    class Config:
        extra = "forbid"
        allow_population_by_field_name = True
        populate_by_name = True
        validate_by_name = True

class SourceBase(BaseSchema):
    name: str
    description: Optional[str] = None

class SourceCreate(SourceBase):
    pass

class SourceUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None

class Source(SourceBase):
    id: str
    crm_id: str
