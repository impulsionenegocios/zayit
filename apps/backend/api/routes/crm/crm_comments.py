from fastapi import APIRouter, Depends, HTTPException
from typing import List

from auth.permissions import verify_role
from auth.auth import verify_token
from schemas.comment import Comment, CommentCreate
from services.comment_service import (
    get_lead_comments_service,
    add_lead_comment_service,
    delete_lead_comment_service,
)

router = APIRouter(prefix="/crms", tags=["crm-comments"])


@router.get("/{crm_id}/leads/{lead_id}/comments", response_model=List[Comment])
async def get_crm_lead_comments(
    crm_id: str,
    lead_id: str,
    user_data = Depends(verify_token)
):
    """
    Get all comments associated with a lead in a CRM.
    """
    return get_lead_comments_service(crm_id, lead_id, user_data)


@router.post("/{crm_id}/leads/{lead_id}/comments", response_model=Comment)
async def add_crm_lead_comment(
    crm_id: str,
    lead_id: str,
    comment: CommentCreate,
    user_data = Depends(verify_token)
):
    """
    Add a comment to a lead in a CRM.
    """
    return add_lead_comment_service(crm_id, lead_id, comment, user_data)


@router.delete("/{crm_id}/leads/{lead_id}/comments/{comment_id}")
async def delete_crm_lead_comment(
    crm_id: str,
    lead_id: str,
    comment_id: str,
    user_data = Depends(verify_token)
):
    """
    Delete a comment from a lead in a CRM.
    """
    success = delete_lead_comment_service(crm_id, lead_id, comment_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"message": "Comment deleted successfully"}
