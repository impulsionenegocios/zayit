# routers/clientes_router.py

from fastapi import APIRouter, Depends, Form, UploadFile
from typing import List, Optional

from auth.permissions import verify_role
from schemas.cliente import ClienteIn, ClienteOut, ClienteUpdate
from services.cliente_service import (
    criar_cliente_service,
    listar_clientes_service,
    obter_cliente_service,
    atualizar_cliente_service,
    deletar_cliente_service,
)

router = APIRouter(prefix="/clientes", tags=["clientes"])


# ✅ Função que mapeia multipart/form-data para ClienteIn
def map_form_to_schema(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...)
) -> ClienteIn:
    return ClienteIn(name=name, email=email, password=password, role=role)


# ✅ Função que mapeia multipart/form-data para ClienteUpdate
def map_form_to_update_schema(
    name: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    password: Optional[str] = Form(None),
    role: Optional[str] = Form(None)
) -> ClienteUpdate:
    return ClienteUpdate(name=name, email=email, password=password, role=role)


# ✅ POST - Criar cliente
@router.post("/", response_model=ClienteOut)
async def criar_cliente(
    cliente: ClienteIn = Depends(map_form_to_schema),
    logo: Optional[UploadFile] = None,
    user_data=Depends(verify_role(["superadmin"]))
):
    return criar_cliente_service(cliente, logo)


# ✅ GET - Listar todos os clientes
@router.get("/", response_model=List[ClienteOut])
async def listar_clientes(
    user_data=Depends(verify_role(["superadmin"]))
):
    return listar_clientes_service()


# ✅ GET - Obter cliente por ID
@router.get("/{cliente_id}", response_model=ClienteOut)
async def obter_cliente(
    cliente_id: str,
    user_data=Depends(verify_role(["superadmin"]))
):
    return obter_cliente_service(cliente_id)


# ✅ PUT - Atualizar cliente
@router.put("/{cliente_id}", response_model=ClienteOut)
async def atualizar_cliente(
    cliente_id: str,
    cliente: ClienteUpdate = Depends(map_form_to_update_schema),
    logo: Optional[UploadFile] = None,
    remover_logo: bool = Form(False),
    user_data=Depends(verify_role(["superadmin"]))
):
    return atualizar_cliente_service(
        cliente_id=cliente_id,
        cliente=cliente,
        logo=logo,
        remover_logo=remover_logo
    )


# ✅ DELETE - Deletar cliente
@router.delete("/{cliente_id}")
async def deletar_cliente(
    cliente_id: str,
    user_data=Depends(verify_role(["superadmin"]))
):
    return deletar_cliente_service(cliente_id)
