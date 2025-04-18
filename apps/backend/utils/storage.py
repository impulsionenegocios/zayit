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

    with open(caminho, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return f"/static/logos/{uid}/{filename}"

def apagar_arquivo_logo(caminho_relativo: str) -> None:
    # Remove um arquivo de logo do sistema de arquivos.

    # Exemplo de caminho_relativo: "/static/logos/<uid>/nome.png"

    caminho_absoluto = os.path.join("apps/backend", caminho_relativo.lstrip("/"))

    if os.path.exists(caminho_absoluto):
        os.remove(caminho_absoluto)