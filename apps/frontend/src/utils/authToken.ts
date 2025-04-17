// src/utils/authToken.ts
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { ref, computed } from 'vue'

const currentToken = ref<string | null>(null)
const isTokenRefreshing = ref<boolean>(false)
const tokenError = ref<Error | null>(null)

const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000

const tokenExpiryTime = ref<number | null>(null)

let tokenReadyPromise: Promise<string | null> | null = null
let resolveTokenPromise: ((token: string | null) => void) | null = null

const initTokenPromise = () => {
  tokenReadyPromise = new Promise((resolve) => {
    resolveTokenPromise = resolve
    if (currentToken.value) {
      resolve(currentToken.value)
    }
  })
}

initTokenPromise()

export function watchAuthToken() {
  const auth = getAuth()

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        isTokenRefreshing.value = true
        tokenError.value = null
        
        const token = await user.getIdToken(true)
        currentToken.value = token
        
        const tokenData = parseJwt(token)
        if (tokenData && tokenData.exp) {
          tokenExpiryTime.value = tokenData.exp * 1000 // Convert to milliseconds
        }
        
        setupTokenRefresh(user)
        
        if (resolveTokenPromise) {
          resolveTokenPromise(token)
        }
      } catch (error) {
        console.error('Error refreshing token:', error)
        tokenError.value = error instanceof Error ? error : new Error('Unknown error')
      } finally {
        isTokenRefreshing.value = false
      }
    } else {
      currentToken.value = null
      tokenExpiryTime.value = null
      
      if (resolveTokenPromise) {
        resolveTokenPromise(null)
      }
      
      initTokenPromise()
    }
  })
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    console.error('Error parsing JWT token:', e)
    return null
  }
}

async function setupTokenRefresh(user: any) {
  if (!tokenExpiryTime.value) return
  
  const timeUntilRefresh = tokenExpiryTime.value - Date.now() - TOKEN_EXPIRY_BUFFER_MS
  
  if (timeUntilRefresh <= 0) {
    refreshToken(user)
    return
  }
  
  setTimeout(() => refreshToken(user), timeUntilRefresh)
}

async function refreshToken(user: any) {
  try {
    isTokenRefreshing.value = true
    const newToken = await user.getIdToken(true)
    currentToken.value = newToken
    
    const tokenData = parseJwt(newToken)
    if (tokenData && tokenData.exp) {
      tokenExpiryTime.value = tokenData.exp * 1000
      
      setupTokenRefresh(user)
    }
  } catch (error) {
    console.error('Failed to refresh token:', error)
    tokenError.value = error instanceof Error ? error : new Error('Unknown error')
  } finally {
    isTokenRefreshing.value = false
  }
}

export async function getTokenAsync(): Promise<string | null> {
  if (isTokenRefreshing.value && tokenReadyPromise) {
    return tokenReadyPromise
  }
  
  if (currentToken.value && tokenExpiryTime.value && tokenExpiryTime.value > Date.now()) {
    return currentToken.value
  }
  
  if (currentToken.value && tokenExpiryTime.value && tokenExpiryTime.value <= Date.now()) {
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
      refreshToken(user)
      return tokenReadyPromise || currentToken.value
    }
  }
  
  return currentToken.value
}

export function getStoredToken(): string | null {
  return currentToken.value
}

export function useTokenRef() {
  return currentToken
}

export function useTokenIsValid() {
  return computed(() => {
    return !!(
      currentToken.value && 
      tokenExpiryTime.value && 
      tokenExpiryTime.value > Date.now()
    )
  })
}
