from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any

from auth.permissions import verify_role
from auth.auth import verify_token
from schemas.tag import TagCreate, TagUpdate, Tag
from services.tag_service import (
    create_tag_service,
    get_tags_service,
    get_tag_by_id_service,
    update_tag_service,
    delete_tag_service
)

router = APIRouter(prefix="/crms/{crm_id}/tags", tags=["tags"])


@router.post("/", response_model=Dict[str, Any])
async def create_tag(
    crm_id: str,
    tag: TagCreate,
    user_data=Depends(verify_token)
):
    """Create a new tag for a CRM."""
    return create_tag_service(crm_id, tag, user_data)


@router.get("/", response_model=List[Tag])
async def get_tags(
    crm_id: str,
    user_data=Depends(verify_token)
):
    """Get all tags for a CRM."""
    return get_tags_service(crm_id, user_data)


@router.get("/{tag_id}", response_model=Tag)
async def get_tag(
    crm_id: str,
    tag_id: str,
    user_data=Depends(verify_token)
):
    """Get a tag by ID for a CRM."""
    tag = get_tag_by_id_service(crm_id, tag_id, user_data)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag


@router.put("/{tag_id}", response_model=Dict[str, Any])
async def update_tag(
    crm_id: str,
    tag_id: str,
    tag: TagUpdate,
    user_data=Depends(verify_token)
):
    """Update a tag for a CRM."""
    return update_tag_service(crm_id, tag_id, tag, user_data)


@router.delete("/{tag_id}", response_model=Dict[str, Any])
async def delete_tag(
    crm_id: str,
    tag_id: str,
    user_data=Depends(verify_token)
):
    """Delete a tag for a CRM."""
    return delete_tag_service(crm_id, tag_id, user_data)