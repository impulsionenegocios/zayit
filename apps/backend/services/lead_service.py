from fastapi import HTTPException, UploadFile
from firebase_admin import firestore
import uuid
from datetime import datetime
import os
import shutil
from typing import List, Optional

from auth.client import db
from schemas.lead import (
    LeadCreate, 
    LeadUpdate,
    Lead, 
    CommentCreate, 
    ContactCreate, 
    TaskCreate, 
    TaskUpdate,
    Tag
)
def create_lead_service(lead: LeadCreate, user_data) -> Lead:
    try:
        lead_id = str(uuid.uuid4())
        now = datetime.now()

        # Busca as tags cujo ID (document_id) esteja em lead.tags
        tags = []
        if lead.tags:
            tags_stream = (
                db.collection("tags")
                  .where("__name__", "in", lead.tags)
                  .stream()
            )
            tags = [
                {"id": doc.id, "name": doc.get("name"), "color": doc.get("color")}
                for doc in tags_stream
            ]

        # Monta o payload exatamente como o modelo Lead espera
        payload = {
            "id":         lead_id,
            "name":       lead.name,
            "email":      lead.email,
            "phone":      lead.phone,
            "address":    lead.address,
            "birth_date": lead.birth_date,
            "source":     lead.source,
            "status":     lead.status,
            "tags":       tags,
            "created_at": now,
            "updated_at": now,
        }

        # Persiste no Firestore
        db.collection("leads").document(lead_id).set(payload)

        # Retorna INSTÂNCIA de Lead, e não payload.items()
        return Lead(**payload)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating lead: {e}")

def get_leads_service(user_data):
    try:
        leads_ref = db.collection("leads").stream()
        leads = []
        
        for doc in leads_ref:
            lead_data = doc.to_dict()
            leads.append(lead_data)
        
        return leads
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting leads: {str(e)}")

def get_lead_by_id_service(lead_id: str, user_data):
    try:
        doc_ref = db.collection("leads").document(lead_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return None
        
        lead_data = doc.to_dict()
        return lead_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting lead: {str(e)}")

def update_lead_service(lead_id: str, lead: LeadUpdate, user_data):
    try:
        doc_ref = db.collection("leads").document(lead_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return None
        
        current_data = doc.to_dict()
        now = datetime.now()
        
        # Process tags if they were updated
        tags = current_data.get("tags", [])
        if lead.tags is not None:
            if lead.tags:
                tags_ref = db.collection("tags").where(firestore.field_path.FieldPath.document_id(), "in", lead.tags)
                tags_docs = tags_ref.stream()
                tags = [{"id": doc.id, "name": doc.get("name"), "color": doc.get("color")} for doc in tags_docs]
            else:
                tags = []
        
        # Prepare update data
        update_data = {
            "updated_at": now
        }
        
        if lead.name is not None:
            update_data["name"] = lead.name
        if lead.email is not None:
            update_data["email"] = lead.email
        if lead.phone is not None:
            update_data["phone"] = lead.phone
        if lead.address is not None:
            update_data["address"] = lead.address
        if lead.birth_date is not None:
            update_data["birth_date"] = lead.birth_date
        if lead.source is not None:
            update_data["source"] = lead.source
        if lead.status is not None:
            update_data["status"] = lead.status
        if lead.tags is not None:
            update_data["tags"] = tags
        
        # Update in Firestore
        doc_ref.update(update_data)
        
        # Return the updated lead
        updated_doc = doc_ref.get()
        return updated_doc.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating lead: {str(e)}")

def delete_lead_service(lead_id: str, user_data):
    try:
        doc_ref = db.collection("leads").document(lead_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        # Delete associated data (comments, contacts, tasks, files)
        delete_lead_associated_data(lead_id)
        
        # Delete the lead
        doc_ref.delete()
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting lead: {str(e)}")

def delete_lead_associated_data(lead_id: str):
    """Delete all data associated with a lead"""
    try:
        # Delete comments
        comments_ref = db.collection("comments").where("lead_id", "==", lead_id)
        for doc in comments_ref.stream():
            doc.reference.delete()
        
        # Delete contacts
        contacts_ref = db.collection("contacts").where("lead_id", "==", lead_id)
        for doc in contacts_ref.stream():
            doc.reference.delete()
        
        # Delete tasks
        tasks_ref = db.collection("tasks").where("lead_id", "==", lead_id)
        for doc in tasks_ref.stream():
            doc.reference.delete()
        
        # Delete files (we'll implement file handling later)
    except Exception as e:
        print(f"Error deleting lead associated data: {str(e)}")

# Comments
def get_lead_comments_service(lead_id: str, user_data):
    try:
        comments_ref = db.collection("comments").where("lead_id", "==", lead_id).order_by("created_at", direction=firestore.Query.DESCENDING)
        comments = []
        
        for doc in comments_ref.stream():
            comment_data = doc.to_dict()
            comments.append(comment_data)
        
        return comments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting comments: {str(e)}")

def add_lead_comment_service(lead_id: str, comment: CommentCreate, user_data):
    try:
        # First check if the lead exists
        lead_doc = db.collection("leads").document(lead_id).get()
        if not lead_doc.exists:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        comment_id = str(uuid.uuid4())
        now = datetime.now()
        
        comment_data = {
            "id": comment_id,
            "lead_id": lead_id,
            "user_id": user_data.get("uid"),
            "text": comment.text,
            "created_at": now
        }
        
        # Save to Firestore
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
        
        # Check if the comment belongs to the lead
        if comment_data.get("lead_id") != lead_id:
            return False
        
        # Check if the user is the owner of the comment or a superadmin
        uid = user_data.get("uid")
        if comment_data.get("user_id") != uid and user_data.get("role") != "superadmin":
            raise HTTPException(status_code=403, detail="You can only delete your own comments")
        
        doc_ref.delete()
        return True
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting comment: {str(e)}")

# Contacts
def get_lead_contacts_service(lead_id: str, user_data):
    try:
        contacts_ref = db.collection("contacts").where("lead_id", "==", lead_id).order_by("date", direction=firestore.Query.DESCENDING)
        contacts = []
        
        for doc in contacts_ref.stream():
            contact_data = doc.to_dict()
            contacts.append(contact_data)
        
        return contacts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting contacts: {str(e)}")

def add_lead_contact_service(lead_id: str, contact: ContactCreate, user_data):
    try:
        # First check if the lead exists
        lead_doc = db.collection("leads").document(lead_id).get()
        if not lead_doc.exists:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        contact_id = str(uuid.uuid4())
        
        contact_data = {
            "id": contact_id,
            "lead_id": lead_id,
            "user_id": user_data.get("uid"),
            "type": contact.type,
            "description": contact.description,
            "date": contact.date
        }
        
        # Save to Firestore
        db.collection("contacts").document(contact_id).set(contact_data)
        
        return contact_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding contact: {str(e)}")

def delete_lead_contact_service(lead_id: str, contact_id: str, user_data):
    try:
        doc_ref = db.collection("contacts").document(contact_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        contact_data = doc.to_dict()
        
        # Check if the contact belongs to the lead
        if contact_data.get("lead_id") != lead_id:
            return False
        
        doc_ref.delete()
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting contact: {str(e)}")

# Tasks
def get_lead_tasks_service(lead_id: str, user_data):
    try:
        tasks_ref = db.collection("tasks").where("lead_id", "==", lead_id).order_by("due_date")
        tasks = []
        
        for doc in tasks_ref.stream():
            task_data = doc.to_dict()
            tasks.append(task_data)
        
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting tasks: {str(e)}")

def create_lead_task_service(lead_id: str, task: TaskCreate, user_data):
    try:
        # First check if the lead exists
        lead_doc = db.collection("leads").document(lead_id).get()
        if not lead_doc.exists:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        task_id = str(uuid.uuid4())
        
        task_data = {
            "id": task_id,
            "lead_id": lead_id,
            "title": task.title,
            "description": task.description,
            "due_date": task.due_date,
            "completed": task.completed,
            "assigned_to": task.assigned_to or user_data.get("uid")
        }
        
        # Save to Firestore
        db.collection("tasks").document(task_id).set(task_data)
        
        return task_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating task: {str(e)}")

def update_lead_task_service(lead_id: str, task_id: str, task: TaskUpdate, user_data):
    try:
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
        
        if task.title is not None:
            update_data["title"] = task.title
        if task.description is not None:
            update_data["description"] = task.description
        if task.due_date is not None:
            update_data["due_date"] = task.due_date
        if task.completed is not None:
            update_data["completed"] = task.completed
        if task.assigned_to is not None:
            update_data["assigned_to"] = task.assigned_to
        
        # Update in Firestore
        doc_ref.update(update_data)
        
        # Return the updated task
        updated_doc = doc_ref.get()
        return updated_doc.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating task: {str(e)}")

def delete_lead_task_service(lead_id: str, task_id: str, user_data):
    try:
        doc_ref = db.collection("tasks").document(task_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        task_data = doc.to_dict()
        
        # Check if the task belongs to the lead
        if task_data.get("lead_id") != lead_id:
            return False
        
        doc_ref.delete()
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting task: {str(e)}")

# Files - we'll implement this later
def get_lead_files_service(lead_id: str, user_data):
    return []

def upload_lead_file_service(lead_id: str, file: UploadFile, user_data):
    pass

def delete_lead_file_service(lead_id: str, file_id: str, user_data):
    return True