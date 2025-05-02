from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from schemas.tag import Tag
from schemas.comment import Comment
from schemas.contact import Contact
from schemas.task import Task


class BaseSchema(BaseModel):
    class Config:
        extra = "forbid"  # Don't allow extra fields
        allow_population_by_field_name = True
        populate_by_name = True
        validate_by_name = True


class LeadBase(BaseSchema):
    name:        str             = Field(..., min_length=2)
    email:       EmailStr
    phone:       str
    address:     Optional[str]   = None
    birth_date:  Optional[str]   = Field(None, alias="birthDate")
    source:      Optional[str]   = None
    status:      str             = Field(..., pattern="^(lead|opportunity|client|lost)$")

class LeadCreate(LeadBase):
    tags: Optional[List[str]] = Field(default_factory=list)

class LeadUpdate(BaseSchema):
    name:        Optional[str]         = Field(None, min_length=2)
    email:       Optional[EmailStr]    = None
    phone:       Optional[str]         = None
    address:     Optional[str]         = None
    birth_date:  Optional[str]         = Field(None, alias="birthDate")
    source:      Optional[str]         = None
    status:      Optional[str]         = Field(None, pattern="^(lead|opportunity|client|lost)$")
    tags:        Optional[List[str]]   = None

class Lead(LeadBase):
    id:          str
    tags:        List[Tag]            = []
    created_at:  datetime
    updated_at:  datetime
