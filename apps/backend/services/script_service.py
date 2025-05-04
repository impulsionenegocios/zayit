from fastapi import HTTPException
from firebase_admin import firestore
import uuid
from datetime import datetime
from typing import List, Optional

from auth.client import db
from schemas.script import ScriptCreate, ScriptUpdate, Script

def create_script_service(crm_id: str, script: ScriptCreate, user_data) -> dict:
    """Create a new script for a CRM"""
    try:
        from services.crm_service import get_crm_by_id_service
        crm = get_crm_by_id_service(crm_id, user_data)
        if not crm:
            raise HTTPException(status_code=404, detail="CRM not found")
        
        script_id = str(uuid.uuid4())
        now = datetime.now()
        
        firestore_payload = {
            "id": script_id,
            "crm_id": crm_id,
            "name": script.name,
            "type": script.type,
            "content": script.content,
            "created_at": now,
            "updated_at": now,
        }
        
        db.collection("scripts").document(script_id).set(firestore_payload)
        
        return firestore_payload
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating script: {str(e)}")

def get_scripts_service(crm_id: str, user_data) -> List[dict]:
    """Get all scripts for a CRM"""
    try:
        from services.crm_service import get_crm_by_id_service
        crm = get_crm_by_id_service(crm_id, user_data)
        if not crm:
            raise HTTPException(status_code=404, detail="CRM not found")
        
        scripts_ref = db.collection("scripts").where("crm_id", "==", crm_id).stream()
        scripts = []
        
        for doc in scripts_ref:
            script_data = doc.to_dict()
            scripts.append(script_data)
        
        return scripts
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting scripts: {str(e)}")

def get_script_by_id_service(crm_id: str, script_id: str, user_data) -> dict:
    """Get a specific script by ID"""
    try:
        from services.crm_service import get_crm_by_id_service
        crm = get_crm_by_id_service(crm_id, user_data)
        if not crm:
            raise HTTPException(status_code=404, detail="CRM not found")
        
        doc_ref = db.collection("scripts").document(script_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return None
        
        script_data = doc.to_dict()
        
        if script_data.get("crm_id") != crm_id:
            raise HTTPException(status_code=403, detail="Script does not belong to this CRM")
            
        return script_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting script: {str(e)}")

def update_script_service(crm_id: str, script_id: str, script: ScriptUpdate, user_data) -> dict:
    """Update a script"""
    try:
        from services.crm_service import get_crm_by_id_service
        crm = get_crm_by_id_service(crm_id, user_data)
        if not crm:
            raise HTTPException(status_code=404, detail="CRM not found")
        
        doc_ref = db.collection("scripts").document(script_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return None
        
        current_data = doc.to_dict()
        
        if current_data.get("crm_id") != crm_id:
            raise HTTPException(status_code=403, detail="Script does not belong to this CRM")
        
        now = datetime.now()
        
        update_data = {
            "updated_at": now
        }
        
        if script.name is not None:
            update_data["name"] = script.name
            
        if script.type is not None:
            update_data["type"] = script.type
            
        if script.content is not None:
            update_data["content"] = script.content
        
        doc_ref.update(update_data)
        
        updated_doc = doc_ref.get()
        updated_data = updated_doc.to_dict()
                
        return updated_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating script: {str(e)}")

def delete_script_service(crm_id: str, script_id: str, user_data) -> dict:
    """Delete a script"""
    try:
        from services.crm_service import get_crm_by_id_service
        crm = get_crm_by_id_service(crm_id, user_data)
        if not crm:
            raise HTTPException(status_code=404, detail="CRM not found")
        
        doc_ref = db.collection("scripts").document(script_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return {"success": False, "detail": "Script not found"}
        
        script_data = doc.to_dict()
        
        if script_data.get("crm_id") != crm_id:
            raise HTTPException(status_code=403, detail="Script does not belong to this CRM")
        
        doc_ref.delete()
        
        return {
            "success": True,
            "script_id": script_id,
            "detail": "Script deleted successfully"
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting script: {str(e)}")

def delete_crm_scripts_service(crm_id: str, user_data) -> dict:
    """Delete all scripts for a CRM"""
    try:
        scripts_ref = db.collection("scripts").where("crm_id", "==", crm_id).stream()
        
        deleted_count = 0
        failed_count = 0
        
        for doc in scripts_ref:
            try:
                script_id = doc.id
                db.collection("scripts").document(script_id).delete()
                deleted_count += 1
            except Exception:
                failed_count += 1
        
        return {
            "success": True,
            "deleted_count": deleted_count,
            "failed_count": failed_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting CRM scripts: {str(e)}")
