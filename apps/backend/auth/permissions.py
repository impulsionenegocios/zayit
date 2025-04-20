from fastapi import Depends, HTTPException
from typing import List, Callable
from auth.client import db
from auth.auth import verify_token 


def verify_role(roles_permitidas: List[str]) -> Callable:
    """
    Retorna uma dependência do FastAPI que garante que o usuário autenticado
    tenha uma das roles especificadas.
    """

    def dependencia(user_data=Depends(verify_token)):
        uid = user_data.get("uid")
        if not uid:
            raise HTTPException(status_code=401, detail="Usuário inválido")

        # Busca o usuário no Firestore
        user_doc = db.collection("users").document(uid).get()
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        user = user_doc.to_dict()
        role = user.get("role")

        if role not in roles_permitidas:
            raise HTTPException(
                status_code=403,
                detail=f"Acesso negado: requer uma das roles: {roles_permitidas}"
            )

        return user  # ou return user_data, depende do que você quiser acessar no endpoint

    return dependencia
