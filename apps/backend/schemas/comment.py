from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CommentCreate(BaseModel):
    text: str

class Comment(BaseModel):
    id: str
    lead_id: str
    user_id: str
    text: str
    created_at: datetime
    user_name: Optional[str] = None