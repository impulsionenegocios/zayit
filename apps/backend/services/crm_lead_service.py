from fastapi import HTTPException
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
    Lead
)

# ----- Utility Functions -----

def check_crm_permission(crm_id: str, user_data):
    """
    Check if the user has permission to access the specified CRM.
    Returns the CRM data if permission is granted, otherwise raises an HTTPException.
    """
    try:
        user_id = user_data.get("uid")
        role = user_data.get("role", "")
        
        # Check if the CRM exists
        crm_doc = db.collection("crms").document(crm_id).get()
        if not crm_doc.exists:
            raise HTTPException(status_code=404, detail="CRM not found")
        
        crm_data = crm_doc.to_dict()
        
        # Check if the CRM belongs to the user or if user is a superadmin
        if crm_data.get("user_id") != user_id and role != "superadmin":
            raise HTTPException(status_code=403, detail="You don't have permission to access this CRM")
        
        return crm_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking CRM permission: {str(e)}")


def check_lead_exists_in_crm(crm_id: str, lead_id: str):
    """
    Check if a lead is associated with the specified CRM.
    Returns True if the association exists, False otherwise.
    """
    try:
        association_id = f"{crm_id}_{lead_id}"
        doc_ref = db.collection("crm_leads").document(association_id)
        
        return doc_ref.get().exists
    except Exception:
        return False


def verify_lead_in_crm(crm_id: str, lead_id: str, user_data):
    """
    Verify that a lead exists and is associated with the specified CRM.
    Also checks if the user has permission to access the CRM.
    Raises HTTPException if any check fails.
    """
    # Check CRM permission
    check_crm_permission(crm_id, user_data)
    
    # Check if lead exists and is associated with the CRM
    if not check_lead_exists_in_crm(crm_id, lead_id):
        # Check if the lead exists at all
        lead_doc = db.collection("leads").document(lead_id).get()
        if not lead_doc.exists:
            raise HTTPException(status_code=404, detail="Lead not found")
        else:
            raise HTTPException(status_code=404, detail="Lead is not associated with this CRM")


# ----- Lead Management Services -----

def associate_lead_to_crm_service(crm_id: str, lead_id: str, user_data):
    """Associate an existing lead with a CRM"""
    try:
        # Check CRM permission
        check_crm_permission(crm_id, user_data)
        
        # Check if the lead exists
        lead_doc = db.collection("leads").document(lead_id).get()
        if not lead_doc.exists:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        # Check if the association already exists
        association_id = f"{crm_id}_{lead_id}"
        assoc_doc = db.collection("crm_leads").document(association_id).get()
        
        if assoc_doc.exists:
            return True  # Association already exists, no need to create it again
        
        # Create the association record
        db.collection("crm_leads").document(association_id).set({
            "crm_id": crm_id,
            "lead_id": lead_id,
            "created_at": datetime.now()
        })
        
        return True
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error associating lead with CRM: {str(e)}")


def remove_lead_from_crm_service(crm_id: str, lead_id: str, user_data):
    """Remove a lead association from a CRM"""
    try:
        # Check CRM permission
        check_crm_permission(crm_id, user_data)
        
        # Delete the association
        association_id = f"{crm_id}_{lead_id}"
        
        doc_ref = db.collection("crm_leads").document(association_id)
        if not doc_ref.get().exists:
            return False
        
        doc_ref.delete()
        return True
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing lead from CRM: {str(e)}")


def get_crm_leads_service(crm_id: str, user_data):
    """Get all leads associated with a CRM"""
    try:
        # Check CRM permission
        check_crm_permission(crm_id, user_data)
        
        # Get all associations for this CRM
        assocs = db.collection("crm_leads").where("crm_id", "==", crm_id).stream()
        lead_ids = [d.to_dict()["lead_id"] for d in assocs]
        
        if not lead_ids:
            return []
        
        # First, get all tags that belong to this CRM
        crm_tags_ref = db.collection("tags").where("crm_id", "==", crm_id).stream()
        crm_tags = {doc.id: {"id": doc.id, "name": doc.get("name"), "color": doc.get("color")} for doc in crm_tags_ref}
        
        leads = []
        # Firestore only allows up to 10 items in "in" queries - iterate in batches
        for i in range(0, len(lead_ids), 10):
            batch_ids = lead_ids[i:i+10]
            # Create a list of DocumentReference objects instead of strings
            refs = [db.collection("leads").document(lid) for lid in batch_ids]
            query = db.collection("leads").where("__name__", "in", refs).stream()
            
            for doc in query:
                lead_data = doc.to_dict()
                
                # Process tags if they're stored as IDs
                tags = lead_data.get("tags", [])
                if tags and isinstance(tags[0], str):
                    # Filter tags to only include those belonging to this CRM
                    filtered_tags = [crm_tags[tag_id] for tag_id in tags if tag_id in crm_tags]
                    lead_data["tags"] = filtered_tags
                
                leads.append(lead_data)
        
        return leads
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting CRM leads: {str(e)}")

def get_lead_by_id_service(crm_id: str, lead_id: str, user_data):
    """Get a specific lead associated with a CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        # Get the lead data
        doc_ref = db.collection("leads").document(lead_id)
        doc = doc_ref.get()
        
        lead_data = doc.to_dict()
        
        # Get all tags that belong to this CRM
        crm_tags_ref = db.collection("tags").where("crm_id", "==", crm_id).stream()
        crm_tags = {doc.id: {"id": doc.id, "name": doc.get("name"), "color": doc.get("color")} for doc in crm_tags_ref}
        
        # Process tags if they're stored as IDs
        tags = lead_data.get("tags", [])
        if tags and isinstance(tags[0], str):
            # Filter tags to only include those belonging to this CRM
            filtered_tags = [crm_tags[tag_id] for tag_id in tags if tag_id in crm_tags]
            lead_data["tags"] = filtered_tags
        
        return lead_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting lead: {str(e)}")


def create_lead_for_crm_service(crm_id: str, lead: LeadCreate, user_data):
    """Create a new lead and associate it with a CRM"""
    try:
        # Check CRM permission
        check_crm_permission(crm_id, user_data)
        
        # Create a new lead
        lead_id = str(uuid.uuid4())
        now = datetime.now()
        
        # Process tags - first get all tags from this CRM
        tags = []
        if lead.tags:
            # First get all tags belonging to this CRM
            crm_tags_ref = db.collection("tags").where("crm_id", "==", crm_id).stream()
            crm_tags = {doc.id: {"id": doc.id, "name": doc.get("name"), "color": doc.get("color")} 
                        for doc in crm_tags_ref}
            
            # Then filter the tags to only include those the user requested
            tags = [crm_tags[tag_id] for tag_id in lead.tags if tag_id in crm_tags]
        
        # Create the lead payload
        payload = {
            "id": lead_id,
            "name": lead.name,
            "email": lead.email,
            "phone": lead.phone,
            "address": lead.address,
            "birth_date": lead.birth_date,
            "source": lead.source,
            "status": lead.status,
            "tags": tags,
            "created_at": now,
            "updated_at": now,
        }
        
        # Save the lead to Firestore
        db.collection("leads").document(lead_id).set(payload)
        
        # Create the association between the lead and the CRM
        association_id = f"{crm_id}_{lead_id}"
        db.collection("crm_leads").document(association_id).set({
            "crm_id": crm_id,
            "lead_id": lead_id,
            "created_at": now
        })
        
        # Return the created lead
        return Lead(**payload)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating lead for CRM: {str(e)}")

def update_lead_service(crm_id: str, lead_id: str, lead: LeadUpdate, user_data):
    """Update a lead associated with a CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        # Get the current lead data
        doc_ref = db.collection("leads").document(lead_id)
        doc = doc_ref.get()
        
        current_data = doc.to_dict()
        now = datetime.now()
        
        # Process tags if they were updated
        tags = current_data.get("tags", [])
        if lead.tags is not None:
            if lead.tags:
                # First get all tags belonging to this CRM
                crm_tags_ref = db.collection("tags").where("crm_id", "==", crm_id).stream()
                crm_tags = {doc.id: {"id": doc.id, "name": doc.get("name"), "color": doc.get("color")} 
                            for doc in crm_tags_ref}
                
                # Then filter the tags to only include those the user requested
                tags = [crm_tags[tag_id] for tag_id in lead.tags if tag_id in crm_tags]
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating lead: {str(e)}")


def delete_lead_service(crm_id: str, lead_id: str, user_data):
    """Delete a lead and remove it from the CRM"""
    try:
        # Verify the lead exists in the CRM and the user has permission
        verify_lead_in_crm(crm_id, lead_id, user_data)
        
        # Remove the association
        association_id = f"{crm_id}_{lead_id}"
        db.collection("crm_leads").document(association_id).delete()
        
        # Delete the lead and its associated data
        delete_lead_associated_data(lead_id)
        
        doc_ref = db.collection("leads").document(lead_id)
        doc_ref.delete()
        
        return True
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting lead: {str(e)}")


def delete_lead_associated_data(lead_id: str):
    """Delete all data associated with a lead"""
    try:
        # Delete comments
        comments_ref = db.collection("comments").where("lead_id", "==", lead_id)
        batch = db.batch()
        count = 0
        
        for doc in comments_ref.stream():
            batch.delete(doc.reference)
            count += 1
            
            if count >= 500:  # Firestore allows max 500 operations per batch
                batch.commit()
                batch = db.batch()
                count = 0
        
        if count > 0:
            batch.commit()
        
        # Delete contacts
        contacts_ref = db.collection("contacts").where("lead_id", "==", lead_id)
        batch = db.batch()
        count = 0
        
        for doc in contacts_ref.stream():
            batch.delete(doc.reference)
            count += 1
            
            if count >= 500:
                batch.commit()
                batch = db.batch()
                count = 0
        
        if count > 0:
            batch.commit()
        
        # Delete tasks
        tasks_ref = db.collection("tasks").where("lead_id", "==", lead_id)
        batch = db.batch()
        count = 0
        
        for doc in tasks_ref.stream():
            batch.delete(doc.reference)
            count += 1
            
            if count >= 500:
                batch.commit()
                batch = db.batch()
                count = 0
        
        if count > 0:
            batch.commit()
        
        # TODO: Delete files (implement file handling)
    except Exception as e:
        print(f"Error deleting lead associated data: {str(e)}")