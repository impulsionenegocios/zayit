# api/routes/contacts.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List

from auth.permissions import verify_role
from schemas.contact import Contact, ContactCreate
from services.contact_service import (
    get_lead_contacts_service,
    add_lead_contact_service,
    delete_lead_contact_service
)

router = APIRouter(tags=["contacts"])

# These endpoints will be included in the main.py under the lead routes

@router.get("/leads/{lead_id}/contacts", response_model=List[Contact])
async def get_lead_contacts(
    lead_id: str,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Get all contacts for a lead"""
    return get_lead_contacts_service(lead_id, user_data)


@router.post("/leads/{lead_id}/contacts", response_model=Contact)
async def add_lead_contact(
    lead_id: str,
    contact: ContactCreate,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Add a new contact record to a lead"""
    return add_lead_contact_service(lead_id, contact, user_data)


@router.delete("/leads/{lead_id}/contacts/{contact_id}")
async def delete_lead_contact(
    lead_id: str,
    contact_id: str,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Delete a contact record from a lead"""
    success = delete_lead_contact_service(lead_id, contact_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted successfully"}