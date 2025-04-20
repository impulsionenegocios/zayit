from fastapi import APIRouter, Depends

from auth.auth import verify_token
from auth.client import db  # Firestore client

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/me")
def get_profile(user_data=Depends(verify_token)):
    uid = user_data["uid"]
    print('uid inicial: ', uid)
    doc_ref = db.collection("users").document(uid)
    doc = doc_ref.get()

    if not doc.exists:
        return {"uid": uid, "msg": "Usuário autenticado, mas sem perfil no Firestore"}

    return {
        "uid": uid,
        "email": user_data.get("email"),
        "perfil": doc.to_dict()
    }
