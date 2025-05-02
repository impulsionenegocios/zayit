from fastapi import APIRouter, Depends

from auth.auth import verify_token
from auth.client import db  # Firestore client

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/me")
def get_profile(user_data=Depends(verify_token)):
    uid = user_data["uid"]
    doc_ref = db.collection("users").document(uid)
    doc = doc_ref.get()
    
    # Verificação se o perfil existe
    if not doc.exists:
        return {
            "authenticated": True,
            "email": user_data.get("email"),
            "profile_exists": False
        }
    
    # Obter o perfil e remover campos sensíveis ou desnecessários
    perfil = doc.to_dict()
    
    # Remover o UID do perfil se não for absolutamente necessário
    if "uid" in perfil:
        del perfil["uid"]  # O frontend não precisa do UID
    
    return {
        "authenticated": True,
        "email": user_data.get("email"),
        "profile_exists": True,
        "perfil": perfil
    }