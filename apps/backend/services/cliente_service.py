from typing import Optional, Dict, Any
from fastapi import HTTPException, UploadFile
from firebase_admin import auth as firebase_auth, firestore
from firebase.client import db
from schemas.cliente import ClienteBase
from utils.storage import salvar_logo_local

def criar_cliente_service(
    cliente: ClienteBase,
    logo: Optional[UploadFile]
) -> Dict[str, Any]:
    try:
        # 1) Cria usuário no Firebase Auth
        user = firebase_auth.create_user(
            email=cliente.email,
            password=cliente.password,
            display_name=cliente.name
        )
        uid = user.uid

        # 2) Salva a logo (se houver) e obtém URL
        logo_url = salvar_logo_local(logo, uid) if logo else None

        # 3) Persiste dados no Firestore
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
        # você pode refinar os tipos de exceção e usar HTTPException aqui
        raise HTTPException(status_code=500, detail=f"Erro ao criar cliente: {e}")

def listar_clientes_service(role: str) -> Dict[str, Any]:
    try:
        ref = db.collection("users").where("role", "==", role)
        docs = ref.stream()

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
        raise HTTPException(status_code=500, detail=f"Erro ao listar clientes: {e}")

def obter_cliente_service(cliente_id: str) -> Dict[str, Any]:
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

def atualizar_cliente_service(
    cliente_id: str,
    name: str,
    email: str,
    password: Optional[str],
    role: str,
    logo: Optional[UploadFile]
) -> Dict[str, Any]:
    # 1) Verifica existência
    doc_ref = db.collection("users").document(cliente_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    update_data: Dict[str, Any] = {
        "name": name,
        "email": email,
        "role": role,
        "updated_at": firestore.SERVER_TIMESTAMP,
    }

    # 2) Atualiza senha no Auth
    if password:
        firebase_auth.update_user(cliente_id, password=password)
    
    # 3) Troca logo (se houver)
    if logo:
        logo_url = salvar_logo_local(logo, cliente_id)
        update_data["logo_url"] = logo_url

    # 4) Persiste no Firestore
    doc_ref.update(update_data)

    # 5) Atualiza email e displayName no Auth
    firebase_auth.update_user(
        cliente_id,
        email=email,
        display_name=name
    )

    return {"msg": "Cliente atualizado com sucesso"}

def deletar_cliente_service(cliente_id: str) -> Dict[str, Any]:
    doc_ref = db.collection("users").document(cliente_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    # 1) Remove do Auth e do Firestore
    firebase_auth.delete_user(cliente_id)
    doc_ref.delete()

    return {"msg": "Cliente excluído com sucesso"}
