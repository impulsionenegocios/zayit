# schemas/cliente.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ✅ Base genérica para todos os modelos, com segurança extra
class BaseSchema(BaseModel):
    class Config:
        extra = "forbid"  # Não permite campos não declarados


# ✅ Base comum com campos compartilhados
class ClienteBase(BaseSchema):
    name: str = Field(..., min_length=2)
    email: EmailStr
    role: str = Field(default="company")


# ✅ Modelo para criação (recebe senha)
class ClienteIn(ClienteBase):
    password: str = Field(..., min_length=6)


# ✅ Modelo para atualização (todos opcionais)
class ClienteUpdate(BaseSchema):
    name: Optional[str] = Field(None, min_length=2)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6)
    role: Optional[str] = None


# ✅ Modelo de resposta (sem senha)
class ClienteOut(ClienteBase):
    id: str
    logo_url: Optional[str] = None
    created_at: Optional[datetime] = None  # ← isso aqui resolve


class ClienteFirestore(ClienteBase):
    id: str
    logo_url: str | None = None
