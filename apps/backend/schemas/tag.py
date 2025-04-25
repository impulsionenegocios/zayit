from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# Base schema with shared fields
class TagBase(BaseModel):
    name: str = Field(..., min_length=2)
    color: str = Field(..., min_length=4)  # HEX color


# Schema for creating tags
class TagCreate(TagBase):
    pass


# Schema for updating tags (all fields optional)
class TagUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2)
    color: Optional[str] = Field(None, min_length=4)


# Schema for tag responses
class Tag(TagBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# Schema specifically for Firestore operations
class TagFirestore(TagBase):
    id: str