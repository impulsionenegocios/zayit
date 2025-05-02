from typing import List, Dict, Any
from fastapi import HTTPException
from firebase_admin import firestore
from auth.client import db
from schemas.tag import TagCreate, TagUpdate, Tag
from services.crm_lead_service import check_crm_permission

def create_tag_service(crm_id: str, tag: TagCreate, user_data) -> Dict[str, Any]:
    try:
        # Check CRM permission
        check_crm_permission(crm_id, user_data)
        
        # Create a new document reference
        doc_ref = db.collection("tags").document()
        tag_id = doc_ref.id
        
        # Prepare the data to be stored
        tag_data = {
            "id": tag_id,
            "crm_id": crm_id,  # Associate tag with CRM
            "name": tag.name,
            "color": tag.color,
            "created_at": firestore.SERVER_TIMESTAMP,
            "updated_at": firestore.SERVER_TIMESTAMP,
            "user_id": user_data.get("uid")  # Track who created the tag
        }
        
        # Store the data in Firestore
        doc_ref.set(tag_data)
        
        return {"msg": "Tag created successfully", "id": tag_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating tag: {e}")


def get_tags_service(crm_id: str, user_data) -> List[Tag]:
    try:
        # Check CRM permission
        check_crm_permission(crm_id, user_data)
        
        # Query tags for this CRM
        tags_ref = db.collection("tags").where("crm_id", "==", crm_id)
        docs = list(tags_ref.stream())
        
        # Convert Firestore documents to Tag objects
        tags = []
        for doc in docs:
            data = doc.to_dict()
            tag_data = {
                "id": doc.id,
                "name": data.get("name"),
                "color": data.get("color"),
                "created_at": data.get("created_at"),
                "updated_at": data.get("updated_at")
            }
            # Don't include crm_id and user_id in response to match schema
            tags.append(tag_data)
        
        return tags
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tags: {e}")


def get_tag_by_id_service(crm_id: str, tag_id: str, user_data) -> Tag:
    try:
        # Check CRM permission
        check_crm_permission(crm_id, user_data)
        
        # Get the tag document
        doc_ref = db.collection("tags").document(tag_id)
        doc = doc_ref.get()
        
        # Check if the document exists
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Tag not found")
        
        # Convert Firestore document to Tag object
        data = doc.to_dict()
        
        # Check if the tag belongs to the specified CRM
        if data.get("crm_id") != crm_id:
            raise HTTPException(status_code=404, detail="Tag not found in this CRM")
        
        return {
            "id": doc.id,
            "name": data.get("name"),
            "color": data.get("color"),
            "created_at": data.get("created_at"),
            "updated_at": data.get("updated_at")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tag: {e}")


def update_tag_service(crm_id: str, tag_id: str, tag: TagUpdate, user_data) -> Dict[str, Any]:
    try:
        # Check CRM permission
        check_crm_permission(crm_id, user_data)
        
        # Get a reference to the tag document
        doc_ref = db.collection("tags").document(tag_id)
        doc = doc_ref.get()
        
        # Check if the document exists
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Tag not found")
        
        # Convert Firestore document to Tag object
        data = doc.to_dict()
        
        # Check if the tag belongs to the specified CRM
        if data.get("crm_id") != crm_id:
            raise HTTPException(status_code=404, detail="Tag not found in this CRM")
        
        # Prepare the data to be updated
        update_data = {}
        if tag.name is not None:
            update_data["name"] = tag.name
        if tag.color is not None:
            update_data["color"] = tag.color
        
        update_data["updated_at"] = firestore.SERVER_TIMESTAMP
        
        # Update the tag document
        doc_ref.update(update_data)
        
        return {"msg": "Tag updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating tag: {e}")


def delete_tag_service(crm_id: str, tag_id: str, user_data) -> Dict[str, Any]:
    try:
        # Check CRM permission
        check_crm_permission(crm_id, user_data)
        
        # Get a reference to the tag document
        doc_ref = db.collection("tags").document(tag_id)
        doc = doc_ref.get()
        
        # Check if the document exists
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Tag not found")
        
        # Convert Firestore document to Tag object
        data = doc.to_dict()
        
        # Check if the tag belongs to the specified CRM
        if data.get("crm_id") != crm_id:
            raise HTTPException(status_code=404, detail="Tag not found in this CRM")
        
        # Delete the tag document
        doc_ref.delete()
        
        return {"msg": "Tag deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting tag: {e}")