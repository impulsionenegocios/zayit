from fastapi import APIRouter, Depends
from typing import List, Dict, Any

from auth.permissions import verify_role
from schemas.tag import TagCreate, TagUpdate, Tag
from services.tag_service import (
    create_tag_service,
    get_tags_service,
    get_tag_by_id_service,
    update_tag_service,
    delete_tag_service
)

router = APIRouter(prefix="/tags", tags=["tags"])


@router.post("/", response_model=Dict[str, Any])
async def create_tag(
    tag: TagCreate,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Create a new tag."""
    return create_tag_service(tag)


@router.get("/", response_model=List[Tag])
async def get_tags(
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Get all tags."""
    return get_tags_service()


@router.get("/{tag_id}", response_model=Tag)
async def get_tag(
    tag_id: str,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Get a tag by ID."""
    return get_tag_by_id_service(tag_id)


@router.put("/{tag_id}", response_model=Dict[str, Any])
async def update_tag(
    tag_id: str,
    tag: TagUpdate,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Update a tag."""
    return update_tag_service(tag_id, tag)


@router.delete("/{tag_id}", response_model=Dict[str, Any])
async def delete_tag(
    tag_id: str,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Delete a tag."""
    return delete_tag_service(tag_id)