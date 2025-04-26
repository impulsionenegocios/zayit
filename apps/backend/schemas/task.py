from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    due_date: datetime

class Task(BaseModel):
    id: str
    lead_id: str
    title: str
    due_date: datetime
    completed: bool
    created_at: datetime
