from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


class BaseSchema(BaseModel):
    class Config:
        extra = "forbid"  # Don't allow extra fields


class TagBase(BaseSchema):
    name: str
    color: str


class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: str
    
class LeadBase(BaseSchema):
    name: str = Field(..., min_length=2)
    email: EmailStr
    phone: str
    address: Optional[str] = None
    birth_date: Optional[str] = Field(None, alias="birthDate")
    source: Optional[str] = None
    status: str = Field(..., pattern="^(lead|opportunity|client|lost)$")

class LeadCreate(LeadBase):
    tags: Optional[List[str]] = Field(default_factory=list)

class LeadUpdate(BaseSchema):
    name: Optional[str] = Field(None, min_length=2)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    birth_date: Optional[str] = Field(None, alias="birthDate")
    source: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(lead|opportunity|client|lost)$")
    tags: Optional[List[str]] = None

class Lead(LeadBase):
    id: str
    tags: List[Tag] = []
    created_at: datetime
    updated_at: datetime

class ContactBase(BaseSchema):
    type: str = Field(..., pattern="^(call|whatsapp|email|meeting)$")
    description: str
    date: str


class ContactCreate(ContactBase):
    pass


class Contact(ContactBase):
    id: str
    lead_id: str
    user_id: str


class CommentBase(BaseSchema):
    text: str


class CommentCreate(CommentBase):
    pass


class Comment(CommentBase):
    id: str
    lead_id: str
    user_id: str
    created_at: datetime


class TaskBase(BaseSchema):
    title: str
    description: Optional[str] = None
    due_date: str
    completed: bool = False
    assigned_to: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[str] = None
    completed: Optional[bool] = None
    assigned_to: Optional[str] = None


class Task(TaskBase):
    id: str
    lead_id: str