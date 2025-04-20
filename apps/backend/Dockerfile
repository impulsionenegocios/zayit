FROM python:3.11-slim

WORKDIR /app

COPY apps/backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

WORKDIR /app/apps/backend

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
