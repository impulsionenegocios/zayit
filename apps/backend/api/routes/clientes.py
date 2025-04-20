from fastapi import APIRouter, Depends, Form, HTTPException, Query, UploadFile
from auth.permissions import verify_role
from schemas.cliente import ClienteBase
from services.cliente_service import (
    criar_cliente_service,
    listar_clientes_service,
    obter_cliente_service,
    atualizar_cliente_service,
    deletar_cliente_service,
)
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
    user_data=Depends(verify_role(["superadmin"]))
):
    # delega toda a lógica para o service
    return criar_cliente_service(cliente, logo)

@router.get("/")
async def listar_clientes(
    user_data=Depends(verify_role(["superadmin"]))
):
    return listar_clientes_service()


@router.get("/{cliente_id}")
async def obter_cliente(
    cliente_id: str,
    user_data=Depends(verify_role(["superadmin"]))
):
    return obter_cliente_service(cliente_id)

@router.put("/{cliente_id}")
async def atualizar_cliente(
    cliente_id: str,
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(None),
    role: str = Form(...),
    logo: UploadFile = None,
    remover_logo: bool = Form(False),  
    user_data=Depends(verify_role(["superadmin"]))
):
    return atualizar_cliente_service(
        cliente_id=cliente_id,
        name=name,
        email=email,
        password=password,
        role=role,
        logo=logo,
        remover_logo=remover_logo 
    )


@router.delete("/{cliente_id}")
async def deletar_cliente(
    cliente_id: str,
    user_data=Depends(verify_role(["superadmin"]))
):
    return deletar_cliente_service(cliente_id)
