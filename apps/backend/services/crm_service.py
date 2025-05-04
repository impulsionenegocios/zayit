from fastapi import HTTPException
from firebase_admin import firestore
import uuid
from datetime import datetime
from typing import List, Optional

from auth.client import db
from schemas.crm import CRMCreate, CRMUpdate, CRM
from schemas.status import StatusCreate
from schemas.source import SourceCreate


def create_default_statuses(crm_id: str, user_data: dict):
    """Create default statuses for a new CRM"""
    default_statuses = [
        {"name": "Lead", "color": "#3B82F6", "order": 1, "description": "Novo lead"},
        {"name": "Oportunidade", "color": "#F59E0B", "order": 2, "description": "Lead qualificado"},
        {"name": "Cliente", "color": "#10B981", "order": 3, "description": "Cliente convertido"},
        {"name": "Perdido", "color": "#EF4444", "order": 4, "description": "Lead perdido"}
    ]
    
    for status_data in default_statuses:
        status = StatusCreate(**status_data)
        status_id = str(uuid.uuid4())
        
        firestore_data = status.dict()
        firestore_data["crm_id"] = crm_id
        firestore_data["created_at"] = datetime.now()
        
        db.collection("statuses").document(status_id).set(firestore_data)


def create_crm_service(crm: CRMCreate, user_data) -> CRM:
    """Create a new CRM belonging to the user"""
    try:
        crm_id = str(uuid.uuid4())
        now = datetime.now()
        
        # Get user_id from the token data
        user_id = user_data.get("uid")
        
        # Prepare the complete payload for Firestore
        firestore_payload = {
            "id": crm_id,
            "name": crm.name,
            "created_at": now,
            "updated_at": now,
            "user_id": user_id,
        }

        # Persist in Firestore
        db.collection("crms").document(crm_id).set(firestore_payload)
        
        create_default_statuses(crm_id, user_data)

        # Return the CRM, including user_id
        return firestore_payload
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
        updated_data = updated_doc.to_dict()
            
        return updated_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating CRM: {str(e)}")


def delete_crm_service(crm_id: str, user_data):
    """Delete a CRM and all its associated leads"""
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
        
        from services.crm_lead_service import get_crm_leads_service, delete_lead_service
        from services.script_service import delete_crm_scripts_service
        
        leads = get_crm_leads_service(crm_id, user_data)
        
        deleted_leads_count = 0
        failed_leads_count = 0
        
        for lead in leads:
            try:
                lead_id = lead.get("id")
                if lead_id:
                    delete_lead_service(crm_id, lead_id, user_data)
                    deleted_leads_count += 1
            except Exception as lead_error:
                failed_leads_count += 1
                print(f"Error deleting lead {lead.get('id')} during CRM deletion: {str(lead_error)}")
        
        print(f"CRM {crm_id} deletion: {deleted_leads_count} leads deleted successfully, {failed_leads_count} leads failed to delete")
        
        scripts_result = delete_crm_scripts_service(crm_id, user_data)
        
        # Delete the CRM
        doc_ref.delete()
        
        return {
            "success": True,
            "crm_id": crm_id,
            "leads_deleted": deleted_leads_count,
            "leads_failed": failed_leads_count,
            "scripts_deleted": scripts_result.get("deleted_count", 0),
            "scripts_failed": scripts_result.get("failed_count", 0)
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting CRM: {str(e)}")
