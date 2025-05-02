from fastapi import Header, HTTPException, Depends
from firebase_admin import auth
from typing import Optional
import logging
from auth.client import db

def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token ausente ou inválido")
    
    token = authorization.split(" ")[1]
    
    try:
        # Verifica o token com Firebase Admin SDK
        decoded_token = auth.verify_id_token(token)
        
        # Verifica se o token não está muito antigo (opcional, Firebase já verifica expiração)
        # import time
        # token_age = time.time() - decoded_token['auth_time']
        # if token_age > 3600:  # 1 hora
        #     raise HTTPException(status_code=401, detail="Token muito antigo. Faça login novamente")
        
        return decoded_token
        
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")
    except auth.RevokedIdTokenError:
        raise HTTPException(status_code=401, detail="Token revogado")
    except Exception as e:
        logging.error(f"Erro ao verificar token: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")