from typing import Optional, Dict, Any
from fastapi import HTTPException, UploadFile, Depends
from firebase_admin import auth as firebase_auth, firestore
from auth.client import db
from schemas.role import RoleBase
from auth.permissions import verify_role

def criar_role_service(
    role: RoleBase,
):
    try:
        doc_ref = db.collection("roles").document()
        uid = doc_ref.id
        db.collection("roles").document().set({
            "id": uid,
            "name": role.name,
            "created_at": firestore.SERVER_TIMESTAMP,
            "updated_at": firestore.SERVER_TIMESTAMP,
        })

        return {"msg": "Role criado com sucesso", "uid": uid}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar a role: {e}")
    
def listar_roles_service():
    try:
        ref = db.collection("roles")
        docs = list(ref.stream())

        roles = []
        for doc in docs:
            data = doc.to_dict()
            roles.append({
                "id": doc.id,
                "name": data.get("name"),
                "created_at": data.get("created_at"),
            })

        return {"roles": roles}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar as roles: {e}")
