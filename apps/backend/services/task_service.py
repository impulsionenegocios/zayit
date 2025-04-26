from fastapi import HTTPException
from firebase_admin import firestore
import uuid
from datetime import datetime
from auth.client import db
from schemas.task import TaskCreate, Task

def get_lead_tasks_service(lead_id: str, user_data):
    try:
        # Verifica se o lead existe
        lead_doc = db.collection("leads").document(lead_id).get()
        if not lead_doc.exists:
            raise HTTPException(status_code=404, detail="Lead not found")

        tasks_ref = db.collection("tasks").where("lead_id", "==", lead_id).order_by("due_date")
        tasks = []
        for doc in tasks_ref.stream():
            task_data = doc.to_dict()
            tasks.append(task_data)

        return tasks
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting tasks: {str(e)}")


def add_lead_task_service(lead_id: str, task: TaskCreate, user_data):
    try:
        lead_doc = db.collection("leads").document(lead_id).get()
        if not lead_doc.exists:
            raise HTTPException(status_code=404, detail="Lead not found")

        task_id = str(uuid.uuid4())
        now = datetime.now()

        task_data = {
            "id": task_id,
            "lead_id": lead_id,
            "user_id": user_data.get("uid"),
            "title": task.title,
            "due_date": task.due_date,
            "completed": False,
            "created_at": now,
        }

        db.collection("tasks").document(task_id).set(task_data)

        return task_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding task: {str(e)}")


def delete_lead_task_service(lead_id: str, task_id: str, user_data):
    try:
        doc_ref = db.collection("tasks").document(task_id)
        doc = doc_ref.get()

        if not doc.exists:
            return False

        task_data = doc.to_dict()

        if task_data.get("lead_id") != lead_id:
            return False

        if task_data.get("user_id") != user_data.get("uid") and user_data.get("role") != "superadmin":
            raise HTTPException(status_code=403, detail="You can only delete your own tasks")

        doc_ref.delete()
        return True
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting task: {str(e)}")


def toggle_task_completion_service(task_id: str, user_data):
    try:
        doc_ref = db.collection("tasks").document(task_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Task not found")

        task_data = doc.to_dict()

        if task_data.get("user_id") != user_data.get("uid") and user_data.get("role") != "superadmin":
            raise HTTPException(status_code=403, detail="You can only update your own tasks")

        new_status = not task_data.get("completed", False)
        doc_ref.update({"completed": new_status})
        return new_status
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error toggling task completion: {str(e)}")
