from fastapi import HTTPException
from firebase_admin import firestore
import uuid
from datetime import datetime

from auth.client import db
from schemas.comment import CommentCreate, Comment
from services.crm_lead_service import verify_lead_in_crm


def get_lead_comments_service(crm_id: str, lead_id: str, user_data):
    """Get all comments for a lead in a CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        # Get the comments
        comments_ref = db.collection("comments").where("lead_id", "==", lead_id).order_by("created_at", direction=firestore.Query.DESCENDING)
        comments = []
        
        for doc in comments_ref.stream():
            comment_data = doc.to_dict()
            
            # Remove user_name field if it exists to match Comment schema
            if "user_name" in comment_data:
                del comment_data["user_name"]
            
            comments.append(comment_data)
        
        return comments
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting comments: {str(e)}")


def add_lead_comment_service(crm_id: str, lead_id: str, comment: CommentCreate, user_data):
    """Add a comment to a lead in a CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        comment_id = str(uuid.uuid4())
        now = datetime.now()
        
        # Get user name for internal use
        user_name = "Unknown User"
        user_ref = db.collection("users").document(user_data.get("uid")).get()
        if user_ref.exists:
            user_data_dict = user_ref.to_dict()
            user_name = user_data_dict.get("name", "Unknown User")
        
        # Store both user_id and user_name in Firestore, but only return fields in schema
        firestore_data = {
            "id": comment_id,
            "lead_id": lead_id,
            "user_id": user_data.get("uid"),
            "user_name": user_name,  # Store for display purposes
            "text": comment.text,
            "created_at": now
        }
        
        # Save to Firestore
        db.collection("comments").document(comment_id).set(firestore_data)
        
        # Return only the fields that match the schema
        return_data = {
            "id": comment_id,
            "lead_id": lead_id,
            "user_id": user_data.get("uid"),
            "text": comment.text,
            "created_at": now
        }
        
        return return_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding comment: {str(e)}")


def delete_lead_comment_service(crm_id: str, lead_id: str, comment_id: str, user_data):
    """Delete a comment from a lead in a CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        doc_ref = db.collection("comments").document(comment_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        comment_data = doc.to_dict()
        
        # Check if the comment belongs to the lead
        if comment_data.get("lead_id") != lead_id:
            return False
            
        # Check if the user is the owner of the comment or a superadmin
        if comment_data.get("user_id") != user_data.get("uid") and user_data.get("role") != "superadmin":
            raise HTTPException(status_code=403, detail="You can only delete your own comments")
        
        doc_ref.delete()
        return True
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting comment: {str(e)}")


def update_lead_comment_service(crm_id: str, lead_id: str, comment_id: str, comment: CommentCreate, user_data):
    """Update a comment for a lead in a CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        doc_ref = db.collection("comments").document(comment_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Comment not found")
        
        comment_data = doc.to_dict()
        
        # Check if the comment belongs to the lead
        if comment_data.get("lead_id") != lead_id:
            raise HTTPException(status_code=404, detail="Comment not found for this lead")
        
        # Only the comment creator or superadmin can update the comment
        if comment_data.get("user_id") != user_data.get("uid") and user_data.get("role") != "superadmin":
            raise HTTPException(status_code=403, detail="You can only update your own comments")
        
        # Update the comment text
        doc_ref.update({
            "text": comment.text,
            "updated_at": datetime.now()
        })
        
        # Get updated document and remove user_name field before returning
        updated_doc = doc_ref.get()
        updated_data = updated_doc.to_dict()
        
        # Remove user_name to match schema
        if "user_name" in updated_data:
            del updated_data["user_name"]
            
        return updated_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating comment: {str(e)}")