from fastapi import APIRouter, Depends, HTTPException
from typing import List

from auth.permissions import verify_role
from auth.auth import verify_token
from schemas.lead import Lead, LeadCreate
from services.crm_lead_service import (
    associate_lead_to_crm_service,
    remove_lead_from_crm_service,
    get_crm_leads_service,
    create_lead_for_crm_service,
    get_lead_by_id_service
)

router = APIRouter(prefix="/crms", tags=["crm"])

# CRM-Lead relationship endpoints
@router.get("/{crm_id}/leads", response_model=List[Lead])
async def get_crm_leads(
    crm_id: str,
    user_data = Depends(verify_token)  # Using verify_token directly
):
    """
    Get all leads associated with a CRM.
    """
    return get_crm_leads_service(crm_id, user_data)

@router.get("/{crm_id}/leads/{lead_id}", response_model=Lead)
async def get_lead_by_id_for_crm(crm_id: str, lead_id: str, user_data = Depends(verify_token)):
    return get_lead_by_id_service(crm_id, lead_id, user_data)


@router.post("/{crm_id}/leads", response_model=Lead)
async def create_lead_for_crm(
    crm_id: str,
    lead: LeadCreate,
    user_data = Depends(verify_role(["superadmin"]))  # Using verify_role for superadmin permission
):
    """
    Create a new lead and associate it with a CRM.
    Only superadmins can create leads based on your permissions.
    """
    return create_lead_for_crm_service(crm_id, lead, user_data)


@router.post("/{crm_id}/leads/{lead_id}")
async def associate_lead_to_crm(
    crm_id: str,
    lead_id: str,
    user_data = Depends(verify_token)  # Using verify_token directly
):
    """
    Associate an existing lead with a CRM.
    """
    success = associate_lead_to_crm_service(crm_id, lead_id, user_data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to associate lead with CRM")
    return {"message": "Lead associated with CRM successfully"}


@router.delete("/{crm_id}/leads/{lead_id}")
async def remove_lead_from_crm(
    crm_id: str,
    lead_id: str,
    user_data = Depends(verify_token)  # Using verify_token directly
):
    """
    Remove a lead association from a CRM.
    """
    success = remove_lead_from_crm_service(crm_id, lead_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Lead association not found")
    return {"message": "Lead removed from CRM successfully"}