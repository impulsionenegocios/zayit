from fastapi import APIRouter, Depends, HTTPException
from typing import List
from auth.permissions import verify_role
from schemas.task import Task, TaskCreate
from services.task_service import (
    get_lead_tasks_service,
    create_lead_task_service,
    delete_lead_task_service,
    toggle_task_completion_service,
)

router = APIRouter(tags=["tasks"], deprecated=True)

@router.get("/leads/{lead_id}/tasks", response_model=List[Task])
async def get_lead_tasks(
    lead_id: str,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Get all tasks for a lead"""
    return get_lead_tasks_service(lead_id, user_data)


@router.post("/leads/{lead_id}/tasks", response_model=Task)
async def add_lead_task(
    lead_id: str,
    task: TaskCreate,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Add a new task to a lead"""
    return create_lead_task_service(lead_id, task, user_data)


@router.delete("/leads/{lead_id}/tasks/{task_id}")
async def delete_lead_task(
    lead_id: str,
    task_id: str,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Delete a task from a lead"""
    success = delete_lead_task_service(lead_id, task_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}


@router.patch("/tasks/{task_id}/toggle")
async def toggle_task_completion(
    task_id: str,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Toggle task completion status"""
    new_status = toggle_task_completion_service(task_id, user_data)
    return {"completed": new_status}
