import mimetypes
import os
import shutil
from uuid import uuid4
from os.path import basename
import mimetypes
from fastapi import UploadFile,HTTPException


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

def apagar_arquivo_logo(caminho_relativo: str, cliente_id: str) -> None:

    # Corrigir caminho base para o path DENTRO DO CONTAINER
    caminho_absoluto = os.path.join("/app/apps/backend/static/logos", cliente_id, os.path.basename(caminho_relativo))

    if os.path.exists(caminho_absoluto):
        os.remove(caminho_absoluto)


def save_file_to_storage(file: UploadFile, path: str) -> str:
    """
    Saves a file to the local storage and returns the URL.
    
    Args:
        file: The uploaded file
        path: The path where to save the file (relative to the static directory)
        
    Returns:
        The URL of the saved file
    """
    try:
        folder = os.path.dirname(f"/app/apps/backend/static/{path}")
        os.makedirs(folder, exist_ok=True)
        
        destination = f"/app/apps/backend/static/{path}"
        
        with open(destination, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        # Return the URL as seen from outside
        return f"/static/{path}"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

def delete_file_from_storage(path: str) -> bool:
    """
    Deletes a file from the local storage.
    
    Args:
        path: The path of the file to delete (relative to the static directory)
        
    Returns:
        True if the file was deleted, False otherwise
    """
    try:
        if not path:
            return False
        
        file_path = f"/app/apps/backend/static/{path}"
        
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        
        return False
    except Exception as e:
        print(f"Error deleting file: {str(e)}")
        return False