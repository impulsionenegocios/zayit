from fastapi import APIRouter, Depends, HTTPException
from typing import List

from auth.permissions import verify_role
from auth.auth import verify_token
from schemas.contact import Contact, ContactCreate
from services.contact_service import (
    get_lead_contacts_service,
    add_lead_contact_service,
    delete_lead_contact_service,
)

router = APIRouter(prefix="/crms", tags=["crm-contacts"])


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
