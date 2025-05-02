from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    due_date: datetime

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None

class Task(BaseModel):
    id: str
    lead_id: str
    title: str
    due_date: str  # Changed to string to match expected format
    completed: bool
    created_at: Optional[datetime] = None
    user_id: Optional[str] = None