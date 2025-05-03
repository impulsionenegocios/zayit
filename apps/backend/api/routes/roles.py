from fastapi import APIRouter, Depends, Form, HTTPException, Query, UploadFile
from auth.permissions import verify_role, require_superadmin

from schemas.role import RoleBase
from services.role_service import (
    criar_role_service,
    listar_roles_service
)
router = APIRouter(prefix="/roles", tags=["roles"])

@router.post('/')
def create_role(
    role: RoleBase,
    user_data=Depends(verify_role(require_superadmin))
):
    return criar_role_service(role)

@router.get('/')
def list_roles(
    user_data=Depends(verify_role(require_superadmin))
):
    return listar_roles_service()