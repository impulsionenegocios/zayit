from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any

from auth.permissions import verify_role
from auth.auth import verify_token
from schemas.script import ScriptCreate, ScriptUpdate, Script
from services.script_service import (
    create_script_service,
    get_scripts_service,
    get_script_by_id_service,
    update_script_service,
    delete_script_service
)

router = APIRouter(prefix="/crms/{crm_id}/scripts", tags=["scripts"])


@router.post("/", response_model=Dict[str, Any])
async def create_script(
    crm_id: str,
    script: ScriptCreate,
    user_data=Depends(verify_token)
):
    """Create a new script for a CRM."""
    return create_script_service(crm_id, script, user_data)


@router.get("/", response_model=List[Script])
async def get_scripts(
    crm_id: str,
    user_data=Depends(verify_token)
):
    """Get all scripts for a CRM."""
    return get_scripts_service(crm_id, user_data)


@router.get("/{script_id}", response_model=Script)
async def get_script(
    crm_id: str,
    script_id: str,
    user_data=Depends(verify_token)
):
    """Get a script by ID for a CRM."""
    script = get_script_by_id_service(crm_id, script_id, user_data)
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
    return script


@router.put("/{script_id}", response_model=Dict[str, Any])
async def update_script(
    crm_id: str,
    script_id: str,
    script: ScriptUpdate,
    user_data=Depends(verify_token)
):
    """Update a script for a CRM."""
    return update_script_service(crm_id, script_id, script, user_data)


@router.delete("/{script_id}", response_model=Dict[str, Any])
async def delete_script(
    crm_id: str,
    script_id: str,
    user_data=Depends(verify_token)
):
    """Delete a script for a CRM."""
    return delete_script_service(crm_id, script_id, user_data)
