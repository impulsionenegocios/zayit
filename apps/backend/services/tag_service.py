from fastapi import HTTPException
import uuid

from auth.client import db
from schemas.lead import TagCreate

def get_tags_service(user_data):
    try:
        tags_ref = db.collection("tags").stream()
        tags = []
        
        for doc in tags_ref:
            tag_data = doc.to_dict()
            tag_data["id"] = doc.id
            tags.append(tag_data)
        
        return tags
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting tags: {str(e)}")

def create_tag_service(tag: TagCreate, user_data):
    try:
        tag_id = str(uuid.uuid4())
        
        tag_data = {
            "name": tag.name,
            "color": tag.color
        }
        
        # Save to Firestore
        db.collection("tags").document(tag_id).set(tag_data)
        
        # Return with id
        return {
            "id": tag_id,
            "name": tag.name,
            "color": tag.color
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating tag: {str(e)}")