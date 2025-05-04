from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api.routes import auth, clientes, roles
from api.routes.crm import (
    tags, crms, 
    crm_leads, crm_comments, crm_contacts, crm_tasks,
    crm_sources, crm_statuses
)
from api.routes.crm.scripts import router as scripts_router

app = FastAPI()
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*" #apenas para desenvolvimento
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Incluindo as rotas definidas no arquivo auth.py
app.include_router(auth.router)
app.include_router(clientes.router)
app.include_router(roles.router)
# app.include_router(leads.router)
# app.include_router(contacts.router)
# app.include_router(tasks.router)
# app.include_router(comment.router)
app.include_router(tags.router)
app.include_router(crms.router)
app.include_router(crm_leads.router)
app.include_router(crm_comments.router)
app.include_router(crm_contacts.router)
app.include_router(crm_tasks.router)
app.include_router(crm_sources.router)
app.include_router(crm_statuses.router)
app.include_router(scripts_router)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def root():
    return {"message": "Hello from FastAPI"}
