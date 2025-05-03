from fastapi import APIRouter, Depends, HTTPException
from typing import List

from auth.permissions import verify_role
from auth.auth import verify_token
from schemas.status import Status, StatusCreate, StatusUpdate
from services.status_service import (
    get_crm_statuses_service,
    get_status_by_id_service,
    create_status_service,
    update_status_service,
    delete_status_service
)

router = APIRouter(prefix="/crms", tags=["crm-statuses"])

@router.get("/{crm_id}/statuses", response_model=List[Status])
async def get_crm_statuses(
    crm_id: str,
    user_data = Depends(verify_token)
):
    """
    Get all statuses associated with a CRM.
    """
    return get_crm_statuses_service(crm_id, user_data)

@router.get("/{crm_id}/statuses/{status_id}", response_model=Status)
async def get_crm_status_by_id(
    crm_id: str,
    status_id: str,
    user_data = Depends(verify_token)
):
    """
    Get a specific status by ID.
    """
    status = get_status_by_id_service(crm_id, status_id, user_data)
    if not status:
        raise HTTPException(status_code=404, detail="Status not found")
    return status

@router.post("/{crm_id}/statuses", response_model=Status)
async def create_crm_status(
    crm_id: str,
    status: StatusCreate,
    user_data = Depends(verify_token)
):
    """
    Create a new status for a CRM.
    """
    return create_status_service(crm_id, status, user_data)

@router.put("/{crm_id}/statuses/{status_id}", response_model=Status)
async def update_crm_status(
    crm_id: str,
    status_id: str,
    status: StatusUpdate,
    user_data = Depends(verify_token)
):
    """
    Update a specific status.
    """
    updated_status = update_status_service(crm_id, status_id, status, user_data)
    if not updated_status:
        raise HTTPException(status_code=404, detail="Status not found")
    return updated_status

@router.delete("/{crm_id}/statuses/{status_id}")
async def delete_crm_status(
    crm_id: str,
    status_id: str,
    user_data = Depends(verify_token)
):
    """
    Delete a status from a CRM.
    """
    success = delete_status_service(crm_id, status_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Status not found")
    return {"message": "Status deleted successfully"}
