import firebase_admin
from firebase_admin import credentials, firestore

# Caminho absoluto do JSON de autenticação
cred = credentials.Certificate("firebase/zayit-25fa8-firebase-adminsdk-fbsvc-bcf458ac20.json")

# Inicializa o app Firebase Admin
firebase_app = firebase_admin.initialize_app(cred)

# Inicializa Firestore
db = firestore.client()
