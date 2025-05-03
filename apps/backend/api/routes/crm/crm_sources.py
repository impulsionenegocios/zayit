from fastapi import APIRouter, Depends, HTTPException
from typing import List

from auth.permissions import verify_role
from auth.auth import verify_token
from schemas.source import Source, SourceCreate, SourceUpdate
from services.source_service import (
    get_crm_sources_service,
    get_source_by_id_service,
    create_source_service,
    update_source_service,
    delete_source_service
)

router = APIRouter(prefix="/crms", tags=["crm-sources"])

@router.get("/{crm_id}/sources", response_model=List[Source])
async def get_crm_sources(
    crm_id: str,
    user_data = Depends(verify_token)
):
    """
    Get all sources associated with a CRM.
    """
    return get_crm_sources_service(crm_id, user_data)

@router.get("/{crm_id}/sources/{source_id}", response_model=Source)
async def get_crm_source_by_id(
    crm_id: str,
    source_id: str,
    user_data = Depends(verify_token)
):
    """
    Get a specific source by ID.
    """
    source = get_source_by_id_service(crm_id, source_id, user_data)
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    return source

@router.post("/{crm_id}/sources", response_model=Source)
async def create_crm_source(
    crm_id: str,
    source: SourceCreate,
    user_data = Depends(verify_token)
):
    """
    Create a new source for a CRM.
    """
    return create_source_service(crm_id, source, user_data)

@router.put("/{crm_id}/sources/{source_id}", response_model=Source)
async def update_crm_source(
    crm_id: str,
    source_id: str,
    source: SourceUpdate,
    user_data = Depends(verify_token)
):
    """
    Update a specific source.
    """
    updated_source = update_source_service(crm_id, source_id, source, user_data)
    if not updated_source:
        raise HTTPException(status_code=404, detail="Source not found")
    return updated_source

@router.delete("/{crm_id}/sources/{source_id}")
async def delete_crm_source(
    crm_id: str,
    source_id: str,
    user_data = Depends(verify_token)
):
    """
    Delete a source from a CRM.
    """
    success = delete_source_service(crm_id, source_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Source not found")
    return {"message": "Source deleted successfully"}
