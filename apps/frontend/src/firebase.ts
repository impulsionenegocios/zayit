// src/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAJJWd8Vi6zFVgTc31YIbDqYnABMuP3CYE',
  authDomain: 'zayit-25fa8.firebaseapp.com',
  projectId: 'zayit-25fa8',
  storageBucket: 'zayit-25fa8.firebasestorage.app',
  messagingSenderId: '401961055288',
  appId: '1:401961055288:web:0254cb85962c76ffb7a2cd',
}

const app = initializeApp(firebaseConfig)

// 🔥 Aqui você exporta o serviço de autenticação do Firebase
export const auth = getAuth(app)
