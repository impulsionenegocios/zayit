from fastapi import HTTPException
from firebase_admin import firestore
import uuid
from datetime import datetime
from auth.client import db
from schemas.comment import CommentCreate, Comment

def get_lead_comments_service(lead_id: str, user_data):
    try:
        # Verify if the lead exists
        lead_doc = db.collection("leads").document(lead_id).get()
        if not lead_doc.exists:
            raise HTTPException(status_code=404, detail="Lead not found")

        # Get all comments for the lead, ordered by created_at descending (newest first)
        comments_ref = db.collection("comments").where("lead_id", "==", lead_id).order_by("created_at", direction=firestore.Query.DESCENDING)
        comments = []
        
        for doc in comments_ref.stream():
            comment_data = doc.to_dict()
            
            # Fetch user name if available
            if comment_data.get("user_id"):
                user_ref = db.collection("users").document(comment_data["user_id"]).get()
                if user_ref.exists:
                    user_data_dict = user_ref.to_dict()
                    comment_data["user_name"] = user_data_dict.get("name", "Unknown User")
            
            comments.append(comment_data)

        return comments
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting comments: {str(e)}")


def add_lead_comment_service(lead_id: str, comment: CommentCreate, user_data):
    try:
        # Verify if the lead exists
        lead_doc = db.collection("leads").document(lead_id).get()
        if not lead_doc.exists:
            raise HTTPException(status_code=404, detail="Lead not found")

        comment_id = str(uuid.uuid4())
        now = datetime.now()

        # Get user name
        user_name = "Unknown User"
        user_ref = db.collection("users").document(user_data.get("uid")).get()
        if user_ref.exists:
            user_data_dict = user_ref.to_dict()
            user_name = user_data_dict.get("name", "Unknown User")

        comment_data = {
            "id": comment_id,
            "lead_id": lead_id,
            "user_id": user_data.get("uid"),
            "user_name": user_name,
            "text": comment.text,
            "created_at": now,
        }

        db.collection("comments").document(comment_id).set(comment_data)

        return comment_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding comment: {str(e)}")


def delete_lead_comment_service(lead_id: str, comment_id: str, user_data):
    try:
        doc_ref = db.collection("comments").document(comment_id)
        doc = doc_ref.get()

        if not doc.exists:
            return False

        comment_data = doc.to_dict()

        if comment_data.get("lead_id") != lead_id:
            return False

        # Only the comment creator or superadmin can delete the comment
        if comment_data.get("user_id") != user_data.get("uid") and user_data.get("role") != "superadmin":
            raise HTTPException(status_code=403, detail="You can only delete your own comments")

        doc_ref.delete()
        return True
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting comment: {str(e)}")


def update_lead_comment_service(lead_id: str, comment_id: str, comment: CommentCreate, user_data):
    try:
        doc_ref = db.collection("comments").document(comment_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Comment not found")

        comment_data = doc.to_dict()

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
        
        # Get updated document
        updated_doc = doc_ref.get()
        return updated_doc.to_dict()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating comment: {str(e)}")