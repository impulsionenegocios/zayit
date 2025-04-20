from pydantic import BaseModel, EmailStr, Field


class RoleBase(BaseModel):
    name: str = Field(..., min_length=2)
