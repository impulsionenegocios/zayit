from fastapi import Depends, HTTPException
from typing import List, Callable, Dict, Any
from auth.client import db
from auth.auth import verify_token
import logging

def verify_role(roles_permitidas: List[str]) -> Callable:
    """
    Retorna uma dependência do FastAPI que garante que o usuário autenticado
    tenha uma das roles especificadas.
    """
    
    async def dependencia(user_data: Dict[str, Any] = Depends(verify_token)):
        uid = user_data.get("uid")
        if not uid:
            logging.warning(f"Tentativa de acesso sem UID válido: {user_data}")
            raise HTTPException(status_code=401, detail="Usuário inválido")

        try:
            # Busca o usuário no Firestore
            user_doc = db.collection("users").document(uid).get()
            
            if not user_doc.exists:
                logging.warning(f"Usuário não encontrado no Firestore: {uid}")
                raise HTTPException(status_code=404, detail="Usuário não encontrado")

            user = user_doc.to_dict()
            role = user.get("role")

            if not role:
                logging.warning(f"Usuário sem role definida: {uid}")
                raise HTTPException(status_code=403, detail="Usuário sem permissão definida")

            if role not in roles_permitidas:
                logging.warning(f"Tentativa de acesso não autorizado: UID={uid}, Role={role}, Roles Permitidas={roles_permitidas}")
                raise HTTPException(
                    status_code=403,
                    detail="Acesso negado: permissão insuficiente"
                )

            # Adiciona a role ao user_data para uso no endpoint
            user_data["role"] = role
            user_data["user_profile"] = user
            
            return user_data

        except HTTPException:
            raise
        except Exception as e:
            logging.error(f"Erro ao verificar permissões: {str(e)}")
            raise HTTPException(status_code=500, detail="Erro interno ao verificar permissões")

    return dependencia

# Funções de middleware adicionais para verificações específicas

def require_superadmin(user_data: Dict[str, Any] = Depends(verify_role(["superadmin"]))):
    return user_data

def require_company(user_data: Dict[str, Any] = Depends(verify_role(["company", "superadmin"]))):
    return user_data

def require_user(user_data: Dict[str, Any] = Depends(verify_role(["user", "company", "superadmin"]))):
    return user_data