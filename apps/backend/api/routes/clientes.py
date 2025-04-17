
from fastapi import APIRouter, Depends, Form, HTTPException, Query, UploadFile
from firebase_admin import auth, firestore

from firebase.auth import verify_token
from firebase.client import db
from schemas.cliente import ClienteBase
from utils.storage import salvar_logo_local

router = APIRouter(prefix="/clientes", tags=["clientes"])

def map_form_to_schema(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...)
) -> ClienteBase:
    return ClienteBase(name=name, email=email, password=password, role=role)

@router.post("/")
async def criar_cliente(
    cliente: ClienteBase = Depends(map_form_to_schema),
    logo: UploadFile = None,
    user_data=Depends(verify_token)
):
    try:
        user = auth.create_user(email=cliente.email, password=cliente.password, display_name=cliente.name)
        uid = user.uid

        logo_url = None
        if logo:
            logo_url = salvar_logo_local(logo, uid)
        db.collection("users").document(uid).set({
            "id": uid,
            "name": cliente.name,
            "email": cliente.email,
            "role": cliente.role,
            "logo_url": logo_url,
            "created_at": firestore.SERVER_TIMESTAMP,
            "updated_at": firestore.SERVER_TIMESTAMP,
        })

        return {"msg": "Cliente criado com sucesso", "uid": uid, "logo_url": logo_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/")
async def listar_clientes(role: str = Query(default="company"), user_data=Depends(verify_token)):
    try:
        clientes_ref = db.collection("users").where("role", "==", role)
        docs = clientes_ref.stream()

        clientes = []
        for doc in docs:
            data = doc.to_dict()
            clientes.append({
                "id": data.get("id"),
                "name": data.get("name"),
                "email": data.get("email"),
                "role": data.get("role"),
                "logo_url": data.get("logo_url"),
                "created_at": data.get("created_at"),
            })

        return {"clientes": clientes}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{cliente_id}")
async def obter_cliente(cliente_id: str, user_data=Depends(verify_token)):
    try:
        doc_ref = db.collection("users").document(cliente_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
            
        data = doc.to_dict()
        return {
            "id": data.get("id"),
            "name": data.get("name"),
            "email": data.get("email"),
            "role": data.get("role"),
            "logo_url": data.get("logo_url"),
            "created_at": data.get("created_at"),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{cliente_id}")
async def atualizar_cliente(
    cliente_id: str,
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(None),
    role: str = Form(...),
    logo_removido: str = Form("false"),
    logo: UploadFile = None,
    user_data=Depends(verify_token)
):
    try:
        doc_ref = db.collection("users").document(cliente_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
        
        update_data = {
            "name": name,
            "email": email,
            "role": role,
            "updated_at": firestore.SERVER_TIMESTAMP,
        }
        
        if password:
            auth.update_user(cliente_id, password=password)
        
        if logo_removido.lower() == "true":
            from utils.storage import remover_logo_local
            remover_logo_local(cliente_id)
            update_data["logo_url"] = None
        elif logo:
            logo_url = salvar_logo_local(logo, cliente_id)
            update_data["logo_url"] = logo_url
        
        doc_ref.update(update_data)
        
        auth.update_user(
            cliente_id,
            email=email,
            display_name=name,
        )
        
        return {"msg": "Cliente atualizado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{cliente_id}")
async def deletar_cliente(cliente_id: str, user_data=Depends(verify_token)):
    try:
        doc_ref = db.collection("users").document(cliente_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
        
        auth.delete_user(cliente_id)
        
        doc_ref.delete()
        
        return {"msg": "Cliente excluído com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
