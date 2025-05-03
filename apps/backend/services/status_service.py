from fastapi import HTTPException
from firebase_admin import firestore
from auth.client import db
from schemas.status import Status, StatusCreate, StatusUpdate
from typing import List, Optional
import uuid
from datetime import datetime

def check_crm_permission(crm_id: str, user_data: dict) -> bool:
    """
    Check if the user has permission to access the CRM.
    """
    if user_data.get("role") == "superadmin":
        return True
    
    crm_ref = db.collection("crms").document(crm_id).get()
    if not crm_ref.exists:
        return False
    
    crm_data = crm_ref.to_dict()
    
    return crm_data.get("user_id") == user_data.get("user_id")

def get_crm_statuses_service(crm_id: str, user_data: dict) -> List[Status]:
    """
    Get all statuses associated with a CRM.
    """
    if not check_crm_permission(crm_id, user_data):
        raise HTTPException(status_code=403, detail="Access denied to this CRM")
    
    statuses_ref = db.collection("statuses").where("crm_id", "==", crm_id).stream()
    
    statuses = []
    for status_doc in statuses_ref:
        status_data = status_doc.to_dict()
        status_data["id"] = status_doc.id
        statuses.append(status_data)
    
    statuses.sort(key=lambda x: x.get("order", 0))
    
    return statuses

def get_status_by_id_service(crm_id: str, status_id: str, user_data: dict) -> Optional[Status]:
    """
    Get a specific status by ID.
    """
    if not check_crm_permission(crm_id, user_data):
        raise HTTPException(status_code=403, detail="Access denied to this CRM")
    
    status_ref = db.collection("statuses").document(status_id).get()
    
    if not status_ref.exists:
        return None
    
    status_data = status_ref.to_dict()
    
    if status_data.get("crm_id") != crm_id:
        return None
    
    status_data["id"] = status_ref.id
    return status_data

def create_status_service(crm_id: str, status: StatusCreate, user_data: dict) -> Status:
    """
    Create a new status for a CRM.
    """
    if not check_crm_permission(crm_id, user_data):
        raise HTTPException(status_code=403, detail="Access denied to this CRM")
    
    status_id = str(uuid.uuid4())
    status_data = status.dict()
    status_data["crm_id"] = crm_id
    status_data["created_at"] = datetime.now()
    
    db.collection("statuses").document(status_id).set(status_data)
    
    status_data["id"] = status_id
    return status_data

def update_status_service(crm_id: str, status_id: str, status: StatusUpdate, user_data: dict) -> Optional[Status]:
    """
    Update a specific status.
    """
    if not check_crm_permission(crm_id, user_data):
        raise HTTPException(status_code=403, detail="Access denied to this CRM")
    
    status_ref = db.collection("statuses").document(status_id).get()
    
    if not status_ref.exists:
        return None
    
    status_data = status_ref.to_dict()
    
    if status_data.get("crm_id") != crm_id:
        return None
    
    update_data = {k: v for k, v in status.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.now()
    
    db.collection("statuses").document(status_id).update(update_data)
    
    updated_status_ref = db.collection("statuses").document(status_id).get()
    updated_status_data = updated_status_ref.to_dict()
    updated_status_data["id"] = status_id
    
    return updated_status_data

def delete_status_service(crm_id: str, status_id: str, user_data: dict) -> bool:
    """
    Delete a status from a CRM.
    """
    if not check_crm_permission(crm_id, user_data):
        raise HTTPException(status_code=403, detail="Access denied to this CRM")
    
    status_ref = db.collection("statuses").document(status_id).get()
    
    if not status_ref.exists:
        return False
    
    status_data = status_ref.to_dict()
    
    if status_data.get("crm_id") != crm_id:
        return False
    
    db.collection("statuses").document(status_id).delete()
    
    return True
