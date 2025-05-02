from fastapi import HTTPException
from firebase_admin import firestore
import uuid
from datetime import datetime
from typing import List, Optional

from auth.client import db
from schemas.lead import Lead, LeadCreate, LeadUpdate
from services.lead_service import (
    create_lead_service,
    get_lead_by_id_service,
    update_lead_service,
    delete_lead_service
)


def associate_lead_to_crm_service(crm_id: str, lead_id: str, user_data):
    """Associate an existing lead with a CRM"""
    try:
        # Get user_id from token
        user_id = user_data.get("uid")
        role = user_data.get("role", "")
        
        # Check if the CRM exists and belongs to the user
        crm_doc = db.collection("crms").document(crm_id).get()
        if not crm_doc.exists:
            raise HTTPException(status_code=404, detail="CRM not found")
        
        crm_data = crm_doc.to_dict()
        if crm_data.get("user_id") != user_id and role != "superadmin":
            raise HTTPException(status_code=403, detail="You don't have permission to update this CRM")
        
        # Check if the lead exists
        lead_doc = db.collection("leads").document(lead_id).get()
        if not lead_doc.exists:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        # Create the association record
        association_id = f"{crm_id}_{lead_id}"
        
        db.collection("crm_leads").document(association_id).set({
            "crm_id": crm_id,
            "lead_id": lead_id,
            "created_at": datetime.now()
        })
        
        return True
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error associating lead with CRM: {str(e)}")


def remove_lead_from_crm_service(crm_id: str, lead_id: str, user_data):
    """Remove a lead association from a CRM"""
    try:
        # Get user_id from token
        user_id = user_data.get("uid")
        role = user_data.get("role", "")
        
        # Check if the CRM exists and belongs to the user
        crm_doc = db.collection("crms").document(crm_id).get()
        if not crm_doc.exists:
            raise HTTPException(status_code=404, detail="CRM not found")
        
        crm_data = crm_doc.to_dict()
        if crm_data.get("user_id") != user_id and role != "superadmin":
            raise HTTPException(status_code=403, detail="You don't have permission to update this CRM")
        
        # Delete the association
        association_id = f"{crm_id}_{lead_id}"
        
        doc_ref = db.collection("crm_leads").document(association_id)
        if not doc_ref.get().exists:
            return False
        
        doc_ref.delete()
        return True
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing lead from CRM: {str(e)}")


def get_crm_leads_service(crm_id: str, user_data):
    """Get all leads associated with a CRM"""
    try:
        # validações de permissão…
        crm_doc = db.collection("crms").document(crm_id).get()
        if not crm_doc.exists:
            raise HTTPException(404, "CRM not found")
        crm_data = crm_doc.to_dict()
        if crm_data.get("user_id") != user_data["uid"] and user_data.get("role") != "superadmin":
            raise HTTPException(403, "No permission to view this CRM")

        # busca todas as associações
        assocs = db.collection("crm_leads").where("crm_id", "==", crm_id).stream()
        lead_ids = [d.to_dict()["lead_id"] for d in assocs]
        if not lead_ids:
            return []

        leads = []
        # Firestore só permite até 10 itens em "in" — iteramos por lotes
        for i in range(0, len(lead_ids), 10):
            batch_ids = lead_ids[i : i + 10]
            # monta uma lista de DocumentReference ao invés de strings
            refs = [db.collection("leads").document(lid) for lid in batch_ids]
            query = db.collection("leads").where("__name__", "in", refs).stream()
            for doc in query:
                leads.append(doc.to_dict())

        return leads

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Error getting CRM leads: {e}")



def create_lead_for_crm_service(crm_id: str, lead: LeadCreate, user_data):
    """Create a new lead and associate it with a CRM"""
    try:
        # Get user_id from token
        user_id = user_data.get("uid")
        role = user_data.get("role", "")
        
        # Check if the CRM exists and belongs to the user
        crm_doc = db.collection("crms").document(crm_id).get()
        if not crm_doc.exists:
            raise HTTPException(status_code=404, detail="CRM not found")
        
        crm_data = crm_doc.to_dict()
        if crm_data.get("user_id") != user_id and role != "superadmin":
            raise HTTPException(status_code=403, detail="You don't have permission to update this CRM")
        
        # Create the lead
        created_lead = create_lead_service(lead, user_data)
        
        # Associate the lead with the CRM
        association_id = f"{crm_id}_{created_lead.id}"
        
        db.collection("crm_leads").document(association_id).set({
            "crm_id": crm_id,
            "lead_id": created_lead.id,
            "created_at": datetime.now()
        })
        
        return created_lead
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating lead for CRM: {str(e)}")
def get_lead_by_id_service(crm_id: str, lead_id: str, user_data):
    user_id = user_data.get("uid")
    role = user_data.get("role", "")

    # Verifica se o CRM pertence ao usuário
    crm_doc = db.collection("crms").document(crm_id).get()
    if not crm_doc.exists:
        raise HTTPException(status_code=404, detail="CRM not found")

    crm_data = crm_doc.to_dict()
    if crm_data.get("user_id") != user_id and role != "superadmin":
        raise HTTPException(status_code=403, detail="Not authorized")

    # Busca o lead
    lead_doc = db.collection("leads").document(lead_id).get()
    if not lead_doc.exists:
        raise HTTPException(status_code=404, detail="Lead not found")

    return lead_doc.to_dict()
