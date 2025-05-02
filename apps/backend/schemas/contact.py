# schemas/contact.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BaseSchema(BaseModel):
    class Config:
        extra = "forbid"  # Don't allow extra fields
        allow_population_by_field_name = True
        populate_by_name = True
        validate_by_name = True


class ContactBase(BaseSchema):
    type: str = Field(..., pattern="^(call|whatsapp|email|meeting)$")
    description: str
    date: str


class ContactCreate(ContactBase):
    pass


class Contact(BaseModel):
    id: str
    lead_id: str
    type: str
    description: str
    date: datetime
    created_at: Optional[datetime] = None