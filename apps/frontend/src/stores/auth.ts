// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getAuth,
  type User,
} from 'firebase/auth'
import axios from '@/lib/axios' // <- seu axios com interceptor se tiver

import { auth } from '@/firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const perfil = ref<any>(null)
  const loading = ref(true)

  const login = async (email: string, password: string) => {
    const res = await signInWithEmailAndPassword(auth, email, password)
    user.value = res.user

    // Obter o idToken e buscar dados do perfil no backend
    const token = await res.user.getIdToken()

    const response = await axios.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    perfil.value = response.data.perfil
  }

  const logout = async () => {
    await signOut(auth)
    user.value = null
    perfil.value = null
  }

  const initAuth = () => {
    const authInstance = getAuth()

    onAuthStateChanged(authInstance, async (firebaseUser) => {
      if (firebaseUser) {
        user.value = firebaseUser

        try {
          const token = await firebaseUser.getIdToken()
          const response = await axios.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          perfil.value = response.data.perfil
        } catch (error) {
          console.error('Erro ao recuperar perfil no initAuth', error)
          await logout()
        }
      }

      loading.value = false
    })
  }

  return {
    user,
    perfil,
    loading,
    login,
    logout,
    initAuth,
  }
}, {
  persist: true,
})
