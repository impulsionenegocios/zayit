import mimetypes
import os
import shutil
from uuid import uuid4

from fastapi import UploadFile


def salvar_logo_local(file: UploadFile, uid: str) -> str:
    pasta = f"static/logos/{uid}"
    os.makedirs(pasta, exist_ok=True)

    # Tenta detectar a extensão via content-type
    content_type = file.content_type or ""
    extension = mimetypes.guess_extension(content_type)

    # Força .png se não detectou ou veio genérico
    if not extension or extension == '.jpe':  # jpe é fallback estranho que às vezes aparece
        extension = ".png"

    filename = f"{uuid4().hex}{extension}"
    caminho = os.path.join(pasta, filename)

    print("🖼️ Salvando imagem em:", os.path.abspath(caminho))
    print("📎 Content-Type:", content_type)
    print("📎 Extensão usada:", extension)

    with open(caminho, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return f"/static/logos/{uid}/{filename}"
