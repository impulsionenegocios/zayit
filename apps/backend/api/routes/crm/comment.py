from fastapi import APIRouter, Depends, HTTPException
from typing import List
from auth.permissions import verify_role
from schemas.comment import Comment, CommentCreate
from services.comment_service import (
    get_lead_comments_service,
    add_lead_comment_service,
    delete_lead_comment_service,
    update_lead_comment_service,
)

router = APIRouter(tags=["comments"], deprecated=True)

@router.get("/leads/{lead_id}/comments", response_model=List[Comment])
async def get_lead_comments(
    lead_id: str,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Get all comments for a lead"""
    return get_lead_comments_service(lead_id, user_data)


@router.post("/leads/{lead_id}/comments", response_model=Comment)
async def add_lead_comment(
    lead_id: str,
    comment: CommentCreate,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Add a new comment to a lead"""
    return add_lead_comment_service(lead_id, comment, user_data)


@router.delete("/leads/{lead_id}/comments/{comment_id}")
async def delete_lead_comment(
    lead_id: str,
    comment_id: str,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Delete a comment from a lead"""
    success = delete_lead_comment_service(lead_id, comment_id, user_data)
    if not success:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"message": "Comment deleted successfully"}


@router.put("/leads/{lead_id}/comments/{comment_id}", response_model=Comment)
async def update_lead_comment(
    lead_id: str,
    comment_id: str,
    comment: CommentCreate,
    user_data=Depends(verify_role(["superadmin", "company"]))
):
    """Update a comment"""
    return update_lead_comment_service(lead_id, comment_id, comment, user_data)
