from pydantic import BaseModel, EmailStr, Field


class ClienteBase(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(default="company")


class ClienteFirestore(ClienteBase):
    id: str
    logo_url: str | None = None
