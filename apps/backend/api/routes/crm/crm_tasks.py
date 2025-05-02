from fastapi import APIRouter, Depends, HTTPException
from typing import List

from auth.permissions import verify_role
from auth.auth import verify_token
from schemas.task import Task, TaskCreate, TaskUpdate
from services.task_service import (
    get_lead_tasks_service,
    create_lead_task_service,
    update_lead_task_service,
    delete_lead_task_service,
    toggle_task_completion_service
)

router = APIRouter(prefix="/crms", tags=["crm-tasks"])


@router.get("/{crm_id}/leads/{lead_id}/tasks", response_model=List[Task])
async def get_crm_lead_tasks(
    crm_id: str,
    lead_id: str,
    user_data = Depends(verify_token)
):
    """
    Get all tasks associated with a lead in a CRM.
    """
    return get_lead_tasks_service(crm_id, lead_id, user_data)


@router.post("/{crm_id}/leads/{lead_id}/tasks", response_model=Task)
async def create_crm_lead_task(
    crm_id: str,
    lead_id: str,
    task: TaskCreate,
    user_data = Depends(verify_token)
):
    """
    Create a task for a lead in a CRM.
    """
    return create_lead_task_service(crm_id, lead_id, task, user_data)


@router.put("/{crm_id}/leads/{lead_id}/tasks/{task_id}", response_model=Task)
async def update_crm_lead_task(
    crm_id: str,
    lead_id: str,
    task_id: str,
    task: TaskUpdate,
    user_data = Depends(verify_token)
):
    """
    Update a task for a lead in a CRM.
    """
    updated_task = update_lead_task_service(crm_id, lead_id, task_id, task, user_data)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@router.patch("/{crm_id}/leads/{lead_id}/tasks/{task_id}/toggle")
async def toggle_crm_lead_task_completion(
    crm_id: str,
    lead_id: str,
    task_id: str,
    user_data = Depends(verify_token)
):
    """
    Toggle the completion status of a task for a lead in a CRM.
    """
    new_status = toggle_task_completion_service(crm_id, lead_id, task_id, user_data)
    return {"completed": new_status}

@router.delete("/{crm_id}/leads/{lead_id}/tasks/{task_id}")
async def delete_crm_lead_task(
    crm_id: str,
    lead_id: str,
    task_id: str,
    user_data = Depends(verify_token)
):
    """
    Delete a task from a lead in a CRM.
    """
    success = delete_lead_task_service(crm_id, lead_id, task_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}
