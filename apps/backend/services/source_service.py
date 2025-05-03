from fastapi import HTTPException
from firebase_admin import firestore
from auth.client import db
from schemas.source import Source, SourceCreate, SourceUpdate
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

def get_crm_sources_service(crm_id: str, user_data: dict) -> List[Source]:
    """
    Get all sources associated with a CRM.
    """
    if not check_crm_permission(crm_id, user_data):
        raise HTTPException(status_code=403, detail="Access denied to this CRM")
    
    sources_ref = db.collection("sources").where("crm_id", "==", crm_id).stream()
    
    sources = []
    for source_doc in sources_ref:
        source_data = source_doc.to_dict()
        source_data["id"] = source_doc.id
        sources.append(source_data)
    
    return sources

def get_source_by_id_service(crm_id: str, source_id: str, user_data: dict) -> Optional[Source]:
    """
    Get a specific source by ID.
    """
    if not check_crm_permission(crm_id, user_data):
        raise HTTPException(status_code=403, detail="Access denied to this CRM")
    
    source_ref = db.collection("sources").document(source_id).get()
    
    if not source_ref.exists:
        return None
    
    source_data = source_ref.to_dict()
    
    if source_data.get("crm_id") != crm_id:
        return None
    
    source_data["id"] = source_ref.id
    return source_data

def create_source_service(crm_id: str, source: SourceCreate, user_data: dict) -> Source:
    """
    Create a new source for a CRM.
    """
    if not check_crm_permission(crm_id, user_data):
        raise HTTPException(status_code=403, detail="Access denied to this CRM")
    
    source_id = str(uuid.uuid4())
    source_data = source.dict()
    source_data["crm_id"] = crm_id
    source_data["created_at"] = datetime.now()
    
    db.collection("sources").document(source_id).set(source_data)
    
    source_data["id"] = source_id
    return source_data

def update_source_service(crm_id: str, source_id: str, source: SourceUpdate, user_data: dict) -> Optional[Source]:
    """
    Update a specific source.
    """
    if not check_crm_permission(crm_id, user_data):
        raise HTTPException(status_code=403, detail="Access denied to this CRM")
    
    source_ref = db.collection("sources").document(source_id).get()
    
    if not source_ref.exists:
        return None
    
    source_data = source_ref.to_dict()
    
    if source_data.get("crm_id") != crm_id:
        return None
    
    update_data = {k: v for k, v in source.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.now()
    
    db.collection("sources").document(source_id).update(update_data)
    
    updated_source_ref = db.collection("sources").document(source_id).get()
    updated_source_data = updated_source_ref.to_dict()
    updated_source_data["id"] = source_id
    
    return updated_source_data

def delete_source_service(crm_id: str, source_id: str, user_data: dict) -> bool:
    """
    Delete a source from a CRM.
    """
    if not check_crm_permission(crm_id, user_data):
        raise HTTPException(status_code=403, detail="Access denied to this CRM")
    
    source_ref = db.collection("sources").document(source_id).get()
    
    if not source_ref.exists:
        return False
    
    source_data = source_ref.to_dict()
    
    if source_data.get("crm_id") != crm_id:
        return False
    
    db.collection("sources").document(source_id).delete()
    
    return True
