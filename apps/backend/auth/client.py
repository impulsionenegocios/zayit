import firebase_admin
from firebase_admin import credentials, firestore
import os

# Caminho absoluto do JSON de autenticação
firebase_json_path = os.getenv("FIREBASE_ADMIN_CREDENTIALS_PATH")

cred = credentials.Certificate(firebase_json_path)

# Inicializa o app Firebase Admin
firebase_app = firebase_admin.initialize_app(cred)

# Inicializa Firestore
db = firestore.client()
