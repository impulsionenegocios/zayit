from typing import List, Dict, Any
from fastapi import HTTPException
from firebase_admin import firestore
from auth.client import db
from schemas.tag import TagCreate, TagUpdate, Tag


def create_tag_service(tag: TagCreate) -> Dict[str, Any]:
    try:
        # Create a new document reference
        doc_ref = db.collection("tags").document()
        tag_id = doc_ref.id
        
        # Prepare the data to be stored
        tag_data = {
            "id": tag_id,
            "name": tag.name,
            "color": tag.color,
            "created_at": firestore.SERVER_TIMESTAMP,
            "updated_at": firestore.SERVER_TIMESTAMP,
        }
        
        # Store the data in Firestore
        doc_ref.set(tag_data)
        
        return {"msg": "Tag created successfully", "id": tag_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating tag: {e}")


def get_tags_service() -> List[Tag]:
    try:
        # Query all tags
        tags_ref = db.collection("tags")
        docs = list(tags_ref.stream())
        
        # Convert Firestore documents to Tag objects
        tags = []
        for doc in docs:
            data = doc.to_dict()
            tags.append({
                "id": doc.id,
                "name": data.get("name"),
                "color": data.get("color"),
                "created_at": data.get("created_at"),
                "updated_at": data.get("updated_at")
            })
        
        return tags
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tags: {e}")


def get_tag_by_id_service(tag_id: str) -> Tag:
    try:
        # Get the tag document
        doc_ref = db.collection("tags").document(tag_id)
        doc = doc_ref.get()
        
        # Check if the document exists
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Tag not found")
        
        # Convert Firestore document to Tag object
        data = doc.to_dict()
        return {
            "id": doc.id,
            "name": data.get("name"),
            "color": data.get("color"),
            "created_at": data.get("created_at"),
            "updated_at": data.get("updated_at")
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tag: {e}")


def update_tag_service(tag_id: str, tag: TagUpdate) -> Dict[str, Any]:
    try:
        # Get a reference to the tag document
        doc_ref = db.collection("tags").document(tag_id)
        doc = doc_ref.get()
        
        # Check if the document exists
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Tag not found")
        
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
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating tag: {e}")


def delete_tag_service(tag_id: str) -> Dict[str, Any]:
    try:
        # Get a reference to the tag document
        doc_ref = db.collection("tags").document(tag_id)
        doc = doc_ref.get()
        
        # Check if the document exists
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Tag not found")
        
        # Delete the tag document
        doc_ref.delete()
        
        return {"msg": "Tag deleted successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting tag: {e}")