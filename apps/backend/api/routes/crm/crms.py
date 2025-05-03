from fastapi import APIRouter, Depends, HTTPException
from typing import List

from auth.permissions import verify_role
from auth.auth import verify_token
from schemas.crm import CRM, CRMCreate, CRMUpdate
from services.crm_service import (
    create_crm_service,
    get_crms_service,
    get_crm_by_id_service,
    update_crm_service,
    delete_crm_service
)

router = APIRouter(prefix="/crms", tags=["crm"])

# CRM endpoints
@router.post("/", response_model=CRM)
async def create_crm(
    crm: CRMCreate,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """
    Create a new CRM for the authenticated user.
    """
    return create_crm_service(crm, user_data)


@router.get("/", response_model=List[CRM])
async def get_crms(
    user_data = Depends(verify_token)  
):
    """
    Get all CRMs belonging to the authenticated user.
    """
    return get_crms_service(user_data)


@router.get("/{crm_id}", response_model=CRM)
async def get_crm_by_id(
    crm_id: str,
    user_data = Depends(verify_token)  
):
    """
    Get a specific CRM by ID.
    """
    crm = get_crm_by_id_service(crm_id, user_data)
    if not crm:
        raise HTTPException(status_code=404, detail="CRM not found")
    return crm


@router.put("/{crm_id}", response_model=CRM)
async def update_crm(
    crm_id: str,
    crm: CRMUpdate,
    user_data = Depends(verify_token)  
):
    """
    Update a CRM.
    """
    updated_crm = update_crm_service(crm_id, crm, user_data)
    if not updated_crm:
        raise HTTPException(status_code=404, detail="CRM not found")
    return updated_crm


@router.delete("/{crm_id}")
async def delete_crm(
    crm_id: str,
    user_data = Depends(verify_token)  
):
    """
    Delete a CRM.
    """
    success = delete_crm_service(crm_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="CRM not found")
    return {"message": "CRM deleted successfully"}