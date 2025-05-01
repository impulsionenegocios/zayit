from fastapi import HTTPException
from firebase_admin import firestore
import uuid
from datetime import datetime
from typing import List, Optional

from auth.client import db
from schemas.crm import CRMCreate, CRMUpdate, CRM


def create_crm_service(crm: CRMCreate, user_data) -> CRM:
    """Create a new CRM belonging to the user"""
    try:
        crm_id = str(uuid.uuid4())
        now = datetime.now()
        
        # Get user_id from the token data
        user_id = user_data.get("uid")
        
        # Prepare the payload
        payload = {
            "id": crm_id,
            "name": crm.name,
            "user_id": user_id,  # Getting user_id from auth token
            "created_at": now,
            "updated_at": now,
        }

        # Persist in Firestore
        db.collection("crms").document(crm_id).set(payload)

        # Return instance of CRM
        return CRM(**payload)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating CRM: {e}")


def get_crms_service(user_data):
    """Get all CRMs belonging to the user"""
    try:
        # Get user_id from the token data
        user_id = user_data.get("uid")
        
        # Get CRMs where user_id matches the authenticated user
        crms_ref = db.collection("crms").where("user_id", "==", user_id).stream()
        crms = []
        
        for doc in crms_ref:
            crm_data = doc.to_dict()
            crms.append(crm_data)
        
        return crms
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting CRMs: {str(e)}")


def get_crm_by_id_service(crm_id: str, user_data):
    """Get a specific CRM by ID"""
    try:
        doc_ref = db.collection("crms").document(crm_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return None
        
        crm_data = doc.to_dict()
        
        # Check if the CRM belongs to the user
        user_id = user_data.get("uid")
        role = user_data.get("role", "")
        
        if crm_data.get("user_id") != user_id and role != "superadmin":
            raise HTTPException(status_code=403, detail="You don't have permission to access this CRM")
        
        return crm_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting CRM: {str(e)}")


def update_crm_service(crm_id: str, crm: CRMUpdate, user_data):
    """Update a CRM"""
    try:
        doc_ref = db.collection("crms").document(crm_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return None
        
        current_data = doc.to_dict()
        
        # Check if the CRM belongs to the user
        user_id = user_data.get("uid")
        role = user_data.get("role", "")
        
        if current_data.get("user_id") != user_id and role != "superadmin":
            raise HTTPException(status_code=403, detail="You don't have permission to update this CRM")
        
        now = datetime.now()
        
        # Prepare update data
        update_data = {
            "updated_at": now
        }
        
        if crm.name is not None:
            update_data["name"] = crm.name
        
        # Update in Firestore
        doc_ref.update(update_data)
        
        # Return the updated CRM
        updated_doc = doc_ref.get()
        return updated_doc.to_dict()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating CRM: {str(e)}")


def delete_crm_service(crm_id: str, user_data):
    """Delete a CRM"""
    try:
        doc_ref = db.collection("crms").document(crm_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        crm_data = doc.to_dict()
        
        # Check if the CRM belongs to the user
        user_id = user_data.get("uid")
        role = user_data.get("role", "")
        
        if crm_data.get("user_id") != user_id and role != "superadmin":
            raise HTTPException(status_code=403, detail="You don't have permission to delete this CRM")
        
        # Delete the CRM
        doc_ref.delete()
        return True
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting CRM: {str(e)}")