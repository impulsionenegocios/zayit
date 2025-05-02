from fastapi import HTTPException
from firebase_admin import firestore
import uuid
from datetime import datetime
from typing import List, Optional

from auth.client import db
from schemas.contact import ContactCreate, Contact
from services.crm_lead_service import verify_lead_in_crm


def get_lead_contacts_service(crm_id: str, lead_id: str, user_data):
    """Get all contacts for a lead in a CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        # Get the contacts
        contacts_ref = db.collection("contacts").where("lead_id", "==", lead_id).order_by("date", direction=firestore.Query.DESCENDING)
        contacts = []
        
        for doc in contacts_ref.stream():
            contact_data = doc.to_dict()
            
            # Remove fields that aren't in the Contact schema
            if "user_id" in contact_data:
                del contact_data["user_id"]
            if "created_at" in contact_data:
                del contact_data["created_at"]
                
            contacts.append(contact_data)
        
        return contacts
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting contacts: {str(e)}")


def add_lead_contact_service(crm_id: str, lead_id: str, contact: ContactCreate, user_data):
    """Add a contact to a lead in a CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        contact_id = str(uuid.uuid4())
        now = datetime.now()
        
        # Full data to store in Firestore
        contact_data_full = {
            "id": contact_id,
            "lead_id": lead_id,
            "user_id": user_data.get("uid"),
            "type": contact.type,
            "description": contact.description,
            "date": contact.date,
            "created_at": now
        }
        
        # Save to Firestore
        db.collection("contacts").document(contact_id).set(contact_data_full)
        
        # Return data according to schema (without user_id and created_at)
        contact_data_response = contact_data_full.copy()
        del contact_data_response["user_id"]
        del contact_data_response["created_at"]
        
        return contact_data_response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding contact: {str(e)}")


def delete_lead_contact_service(crm_id: str, lead_id: str, contact_id: str, user_data):
    """Delete a contact from a lead in a CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        doc_ref = db.collection("contacts").document(contact_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        contact_data = doc.to_dict()
        
        # Check if the contact belongs to the lead
        if contact_data.get("lead_id") != lead_id:
            return False
        
        # Check if user is authorized (is owner or admin)
        if contact_data.get("user_id") != user_data.get("uid") and user_data.get("role") != "superadmin":
            raise HTTPException(status_code=403, detail="You can only delete your own contacts")
        
        doc_ref.delete()
        return True
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting contact: {str(e)}")