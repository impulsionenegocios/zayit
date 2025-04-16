# utils/storage.py

import os
from uuid import uuid4
from fastapi import UploadFile

def salvar_logo_local(file: UploadFile, uid: str) -> str:
    pasta = f"static/logos/{uid}"
    os.makedirs(pasta, exist_ok=True)

    filename = f"{uuid4().hex}_{file.filename}"
    caminho = os.path.join(pasta, filename)

    with open(caminho, "wb") as f:
        f.write(file.file.read())

    # Retorna a URL acessível publicamente
    return f"/static/logos/{uid}/{filename}"
