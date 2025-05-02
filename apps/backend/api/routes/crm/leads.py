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
from services.lead_service import (
    create_lead_service,
    get_leads_service,
    get_lead_by_id_service,
    update_lead_service,
    delete_lead_service,
    
    get_lead_comments_service,
    add_lead_comment_service,
    delete_lead_comment_service,
    
    get_lead_contacts_service,
    add_lead_contact_service,
    delete_lead_contact_service,
    
    get_lead_tasks_service,
    create_lead_task_service,
    update_lead_task_service,
    delete_lead_task_service,
    
    get_lead_files_service,
    upload_lead_file_service,
    delete_lead_file_service
)

router = APIRouter(prefix="/crm/leads", tags=["crm"], deprecated=True)

# Leads endpoints
@router.post("/", response_model=Lead)
async def create_lead(
    lead: LeadCreate,
    user_data = Depends(verify_role(["superadmin"]))
):
    """
    Cria um novo lead. Só superadmins conseguem.
    """
    return create_lead_service(lead, user_data)

@router.get("/", response_model=List[Lead])
async def get_leads(
    user_data=Depends(verify_role(["superadmin"]))
):
    return get_leads_service(user_data)


@router.get("/{lead_id}", response_model=Lead)
async def get_lead_by_id(
    lead_id: str,
    user_data=Depends(verify_role(["superadmin"]))
):
    lead = get_lead_by_id_service(lead_id, user_data)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.put("/{lead_id}", response_model=Lead)
async def update_lead(
    lead_id: str,
    lead: LeadUpdate,
    user_data=Depends(verify_role(["superadmin"]))
):
    updated_lead = update_lead_service(lead_id, lead, user_data)
    if not updated_lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return updated_lead


@router.delete("/{lead_id}")
async def delete_lead(
    lead_id: str,
    user_data=Depends(verify_role(["superadmin"]))
):
    success = delete_lead_service(lead_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted successfully"}

# Comments endpoints
@router.get("/{lead_id}/comments", response_model=List[Comment])
async def get_lead_comments(
    lead_id: str,
    user_data=Depends(verify_role(["superadmin"]))
):
    return get_lead_comments_service(lead_id, user_data)


@router.post("/{lead_id}/comments", response_model=Comment)
async def add_lead_comment(
    lead_id: str,
    comment: CommentCreate,
    user_data=Depends(verify_role(["superadmin"]))
):
    return add_lead_comment_service(lead_id, comment, user_data)


@router.delete("/{lead_id}/comments/{comment_id}")
async def delete_lead_comment(
    lead_id: str,
    comment_id: str,
    user_data=Depends(verify_role(["superadmin"]))
):
    success = delete_lead_comment_service(lead_id, comment_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"message": "Comment deleted successfully"}

# Contacts endpoints
@router.get("/{lead_id}/contacts", response_model=List[Contact])
async def get_lead_contacts(
    lead_id: str,
    user_data=Depends(verify_role(["superadmin"]))
):
    return get_lead_contacts_service(lead_id, user_data)


@router.post("/{lead_id}/contacts", response_model=Contact)
async def add_lead_contact(
    lead_id: str,
    contact: ContactCreate,
    user_data=Depends(verify_role(["superadmin"]))
):
    return add_lead_contact_service(lead_id, contact, user_data)


@router.delete("/{lead_id}/contacts/{contact_id}")
async def delete_lead_contact(
    lead_id: str,
    contact_id: str,
    user_data=Depends(verify_role(["superadmin"]))
):
    success = delete_lead_contact_service(lead_id, contact_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted successfully"}

# Tasks endpoints
@router.get("/{lead_id}/tasks", response_model=List[Task])
async def get_lead_tasks(
    lead_id: str,
    user_data=Depends(verify_role(["superadmin"]))
):
    return get_lead_tasks_service(lead_id, user_data)


@router.post("/{lead_id}/tasks", response_model=Task)
async def create_lead_task(
    lead_id: str,
    task: TaskCreate,
    user_data=Depends(verify_role(["superadmin"]))
):
    return create_lead_task_service(lead_id, task, user_data)


@router.put("/{lead_id}/tasks/{task_id}", response_model=Task)
async def update_lead_task(
    lead_id: str,
    task_id: str,
    task: TaskUpdate,
    user_data=Depends(verify_role(["superadmin"]))
):
    updated_task = update_lead_task_service(lead_id, task_id, task, user_data)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task


@router.delete("/{lead_id}/tasks/{task_id}")
async def delete_lead_task(
    lead_id: str,
    task_id: str,
    user_data=Depends(verify_role(["superadmin"]))
):
    success = delete_lead_task_service(lead_id, task_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}

# Files endpoints
@router.get("/{lead_id}/files")
async def get_lead_files(
    lead_id: str,
    user_data=Depends(verify_role(["superadmin"]))
):
    return get_lead_files_service(lead_id, user_data)


@router.post("/{lead_id}/files")
async def upload_lead_file(
    lead_id: str,
    file: UploadFile = File(...),
    user_data=Depends(verify_role(["superadmin"]))
):
    return upload_lead_file_service(lead_id, file, user_data)


@router.delete("/{lead_id}/files/{file_id}")
async def delete_lead_file(
    lead_id: str,
    file_id: str,
    user_data=Depends(verify_role(["superadmin"]))
):
    success = delete_lead_file_service(lead_id, file_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": "File deleted successfully"}
