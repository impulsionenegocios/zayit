from fastapi import APIRouter, Depends, HTTPException, UploadFile, Form, File
from typing import List, Optional

from auth.permissions import verify_role
from auth.auth import verify_token
from schemas.lead import (
    Lead, 
    LeadCreate, 
    LeadUpdate, 
    Comment, 
    CommentCreate, 
    Contact, 
    ContactCreate, 
    Task, 
    TaskCreate, 
    TaskUpdate,
    Tag
)
from services.crm_lead_service import (
    # Relações entre CRM e leads
    associate_lead_to_crm_service,
    remove_lead_from_crm_service,
    get_crm_leads_service,
    create_lead_for_crm_service,
    get_lead_by_id_service,
    update_lead_service,
    delete_lead_service,
)

from services.comment_service import (
    get_lead_comments_service,
    add_lead_comment_service,
    delete_lead_comment_service,
)
from services.contact_service import (
    get_lead_contacts_service,
    add_lead_contact_service,
    delete_lead_contact_service,
)

from services.task_service import (
    get_lead_tasks_service,
    create_lead_task_service,
    update_lead_task_service,
    delete_lead_task_service,
    toggle_task_completion_service
)

router = APIRouter(prefix="/crms", tags=["crm"])

# ----- CRM-Lead relationship endpoints -----

@router.get("/{crm_id}/leads", response_model=List[Lead])
async def get_crm_leads(
    crm_id: str,
    user_data = Depends(verify_token)
):
    """
    Get all leads associated with a CRM.
    """
    return get_crm_leads_service(crm_id, user_data)


@router.get("/{crm_id}/leads/{lead_id}", response_model=Lead)
async def get_crm_lead_by_id(
    crm_id: str, 
    lead_id: str, 
    user_data = Depends(verify_token)
):
    """
    Get a specific lead associated with a CRM.
    """
    lead = get_lead_by_id_service(crm_id, lead_id, user_data)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.post("/{crm_id}/leads", response_model=Lead)
async def create_lead_for_crm(
    crm_id: str,
    lead: LeadCreate,
    user_data = Depends(verify_token)
):
    """
    Create a new lead and associate it with a CRM.
    """
    return create_lead_for_crm_service(crm_id, lead, user_data)


@router.put("/{crm_id}/leads/{lead_id}", response_model=Lead)
async def update_crm_lead(
    crm_id: str,
    lead_id: str,
    lead: LeadUpdate,
    user_data = Depends(verify_token)
):
    """
    Update a specific lead associated with a CRM.
    """
    updated_lead = update_lead_service(crm_id, lead_id, lead, user_data)
    if not updated_lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return updated_lead


@router.delete("/{crm_id}/leads/{lead_id}")
async def delete_crm_lead(
    crm_id: str,
    lead_id: str,
    user_data = Depends(verify_token)
):
    """
    Delete a lead associated with a CRM.
    """
    success = delete_lead_service(crm_id, lead_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted successfully"}


@router.post("/{crm_id}/leads/{lead_id}/associate")
async def associate_lead_to_crm(
    crm_id: str,
    lead_id: str,
    user_data = Depends(verify_token)
):
    """
    Associate an existing lead with a CRM.
    """
    success = associate_lead_to_crm_service(crm_id, lead_id, user_data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to associate lead with CRM")
    return {"message": "Lead associated with CRM successfully"}


@router.delete("/{crm_id}/leads/{lead_id}/dissociate")
async def remove_lead_from_crm(
    crm_id: str,
    lead_id: str,
    user_data = Depends(verify_token)
):
    """
    Remove a lead association from a CRM without deleting the lead.
    """
    success = remove_lead_from_crm_service(crm_id, lead_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Lead association not found")
    return {"message": "Lead removed from CRM successfully"}


# ----- Comments endpoints -----

@router.get("/{crm_id}/leads/{lead_id}/comments", response_model=List[Comment])
async def get_crm_lead_comments(
    crm_id: str,
    lead_id: str,
    user_data = Depends(verify_token)
):
    """
    Get all comments associated with a lead in a CRM.
    """
    return get_lead_comments_service(crm_id, lead_id, user_data)


@router.post("/{crm_id}/leads/{lead_id}/comments", response_model=Comment)
async def add_crm_lead_comment(
    crm_id: str,
    lead_id: str,
    comment: CommentCreate,
    user_data = Depends(verify_token)
):
    """
    Add a comment to a lead in a CRM.
    """
    return add_lead_comment_service(crm_id, lead_id, comment, user_data)


@router.delete("/{crm_id}/leads/{lead_id}/comments/{comment_id}")
async def delete_crm_lead_comment(
    crm_id: str,
    lead_id: str,
    comment_id: str,
    user_data = Depends(verify_token)
):
    """
    Delete a comment from a lead in a CRM.
    """
    success = delete_lead_comment_service(crm_id, lead_id, comment_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"message": "Comment deleted successfully"}


# ----- Contacts endpoints -----

@router.get("/{crm_id}/leads/{lead_id}/contacts", response_model=List[Contact])
async def get_crm_lead_contacts(
    crm_id: str,
    lead_id: str,
    user_data = Depends(verify_token)
):
    """
    Get all contacts associated with a lead in a CRM.
    """
    return get_lead_contacts_service(crm_id, lead_id, user_data)


@router.post("/{crm_id}/leads/{lead_id}/contacts", response_model=Contact)
async def add_crm_lead_contact(
    crm_id: str,
    lead_id: str,
    contact: ContactCreate,
    user_data = Depends(verify_token)
):
    """
    Add a contact to a lead in a CRM.
    """
    return add_lead_contact_service(crm_id, lead_id, contact, user_data)


@router.delete("/{crm_id}/leads/{lead_id}/contacts/{contact_id}")
async def delete_crm_lead_contact(
    crm_id: str,
    lead_id: str,
    contact_id: str,
    user_data = Depends(verify_token)
):
    """
    Delete a contact from a lead in a CRM.
    """
    success = delete_lead_contact_service(crm_id, lead_id, contact_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted successfully"}


# ----- Tasks endpoints -----

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


