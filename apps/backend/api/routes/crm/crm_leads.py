from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional

from auth.permissions import verify_role
from auth.auth import verify_token
from schemas.lead import Lead, LeadCreate, LeadUpdate
from services.crm_lead_service import (
    associate_lead_to_crm_service,
    remove_lead_from_crm_service,
    get_crm_leads_service,
    create_lead_for_crm_service,
    get_lead_by_id_service,
    update_lead_service,
    delete_lead_service,
)

router = APIRouter(prefix="/crms", tags=["crm-leads"])

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


