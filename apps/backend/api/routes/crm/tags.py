from fastapi import APIRouter, Depends, HTTPException
from typing import List

from auth.permissions import verify_role
from schemas.lead import Tag, TagCreate
from services.tag_service import get_tags_service, create_tag_service

router = APIRouter(prefix="/crm/tags", tags=["crm"])

@router.get("/", response_model=List[Tag])
async def get_tags(user_data=Depends(verify_role(["superadmin"]))):
    return get_tags_service(user_data)

@router.post("/", response_model=Tag)
async def create_tag(
    tag: TagCreate,
    user_data=Depends(verify_role(["superadmin"]))
):
    return create_tag_service(tag, user_data)