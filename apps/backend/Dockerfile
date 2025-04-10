FROM python:3.11-slim

WORKDIR /app

# Copia só o requirements primeiro
COPY apps/backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copia tudo (com acesso ao packages/shared)
COPY . . 

# Entra na pasta correta
WORKDIR /app/apps/backend

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]

