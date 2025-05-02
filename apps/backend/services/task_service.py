from fastapi import HTTPException
from firebase_admin import firestore
import uuid
from datetime import datetime
from auth.client import db
from schemas.task import TaskCreate, Task
from services.crm_lead_service import verify_lead_in_crm

# Add the missing TaskUpdate class import (assuming it's defined in schema)
from schemas.task import TaskUpdate

def get_lead_tasks_service(crm_id: str, lead_id: str, user_data):
    """Get all tasks for a lead in a CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        # Get the tasks
        tasks_ref = db.collection("tasks").where("lead_id", "==", lead_id).order_by("due_date")
        tasks = []
        
        for doc in tasks_ref.stream():
            task_data = doc.to_dict()
            
            # Convert datetime objects to strings
            if "due_date" in task_data and isinstance(task_data["due_date"], datetime):
                task_data["due_date"] = task_data["due_date"].isoformat()
            
            # Remove fields that are not in the Task schema
            if "user_id" in task_data:
                del task_data["user_id"]
            if "created_at" in task_data:
                del task_data["created_at"]
            
            tasks.append(task_data)
        
        return tasks
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting tasks: {str(e)}")


def create_lead_task_service(crm_id: str, lead_id: str, task: TaskCreate, user_data):
    """Create a task for a lead in a CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        task_id = str(uuid.uuid4())
        now = datetime.now()
        
        # Full data to store in Firestore
        task_data_full = {
            "id": task_id,
            "lead_id": lead_id,
            "title": task.title,
            "description": "",  # Default empty description
            "due_date": task.due_date,
            "completed": False,  # Default to not completed
            "user_id": user_data.get("uid"),
            "created_at": now
        }
        
        # Save to Firestore
        db.collection("tasks").document(task_id).set(task_data_full)
        
        # Return data according to schema (without user_id and created_at)
        task_data_response = task_data_full.copy()
        del task_data_response["user_id"]
        del task_data_response["created_at"]
        
        # Convert datetime to string
        if isinstance(task_data_response["due_date"], datetime):
            task_data_response["due_date"] = task_data_response["due_date"].isoformat()
        
        return task_data_response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating task: {str(e)}")

def update_lead_task_service(crm_id: str, lead_id: str, task_id: str, task: TaskUpdate, user_data):
    """Update a task for a lead in a CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        doc_ref = db.collection("tasks").document(task_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return None
        
        task_data = doc.to_dict()
        
        # Check if the task belongs to the lead
        if task_data.get("lead_id") != lead_id:
            return None
        
        # Prepare update data
        update_data = {}
        
        if hasattr(task, 'title') and task.title is not None:
            update_data["title"] = task.title
        if hasattr(task, 'description') and task.description is not None:
            update_data["description"] = task.description
        if hasattr(task, 'due_date') and task.due_date is not None:
            update_data["due_date"] = task.due_date
        if hasattr(task, 'completed') is not None:
            update_data["completed"] = task.completed
        
        # Update in Firestore
        doc_ref.update(update_data)
        
        # Get updated document
        updated_doc = doc_ref.get()
        updated_data = updated_doc.to_dict()
        
        # Remove fields that are not in the Task schema
        if "user_id" in updated_data:
            del updated_data["user_id"]
        if "created_at" in updated_data:
            del updated_data["created_at"]
            
        # Convert datetime to string
        if "due_date" in updated_data and isinstance(updated_data["due_date"], datetime):
            updated_data["due_date"] = updated_data["due_date"].isoformat()
        
        return updated_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating task: {str(e)}")


def delete_lead_task_service(crm_id: str, lead_id: str, task_id: str, user_data):
    """Delete a task from a lead in a CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        doc_ref = db.collection("tasks").document(task_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        task_data = doc.to_dict()
        
        # Check if the task belongs to the lead
        if task_data.get("lead_id") != lead_id:
            return False
            
        # Check if user is the creator or superadmin
        if task_data.get("user_id") != user_data.get("uid") and user_data.get("role") != "superadmin":
            raise HTTPException(status_code=403, detail="You can only delete your own tasks")
        
        doc_ref.delete()
        return True
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting task: {str(e)}")


def toggle_task_completion_service(crm_id: str, lead_id: str, task_id: str, user_data):
    """Toggle the completion status of a task for a lead in a CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        doc_ref = db.collection("tasks").document(task_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Task not found")
        
        task_data = doc.to_dict()
        
        # Check if the task belongs to the lead
        if task_data.get("lead_id") != lead_id:
            raise HTTPException(status_code=404, detail="Task not associated with this lead")
        
        # Get the current status - handle different data types
        current_status = task_data.get("completed", False)
        if isinstance(current_status, str):
            current_status = current_status.lower() == "true"
        
        # Toggle the status
        new_status = not current_status
        
        # Update in Firestore
        doc_ref.update({"completed": new_status})
        
        return {"completed": new_status}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error toggling task completion: {str(e)}")