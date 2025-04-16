// src/utils/authToken.ts
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { ref } from 'vue'

const currentToken = ref<string | null>(null)

export function watchAuthToken() {
  const auth = getAuth()

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentToken.value = await user.getIdToken()
    } else {
      currentToken.value = null
    }
  })
}

export function getStoredToken() {
  return currentToken.value
}

export function useTokenRef() {
  return currentToken
}
