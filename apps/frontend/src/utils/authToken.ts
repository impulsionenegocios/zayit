// src/utils/authToken.ts
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';

const currentToken = ref<string | null>(null);
const isTokenRefreshing = ref<boolean>(false);
const tokenError = ref<Error | null>(null);
const isInitialized = ref<boolean>(false);

const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000;

const tokenExpiryTime = ref<number | null>(null);

let tokenReadyPromise: Promise<string | null> | null = null;
let resolveTokenPromise: ((token: string | null) => void) | null = null;

const initTokenPromise = () => {
  tokenReadyPromise = new Promise((resolve) => {
    resolveTokenPromise = resolve;
    if (currentToken.value) {
      resolve(currentToken.value);
    }
  });
};

initTokenPromise();

const restoreTokenFromStorage = () => {
  try {
    const storedToken = localStorage.getItem('firebase-token');
    if (storedToken) {
      currentToken.value = storedToken;
      const tokenData = parseJwt(storedToken);
      if (tokenData && tokenData.exp) {
        tokenExpiryTime.value = tokenData.exp * 1000;

        if (tokenExpiryTime.value > Date.now()) {
          if (resolveTokenPromise) {
            resolveTokenPromise(storedToken);
          }
          return true;
        }
      }
    }
  } catch (error) {
    console.error('Error restoring token from storage:', error);
  }
  return false;
};

restoreTokenFromStorage();

export function watchAuthToken() {
  const auth = getAuth();
  const authStore = useAuthStore();

  watch(
    () => authStore.user,
    async (user) => {
      if (user && !currentToken.value) {
        try {
          const firebaseUser = auth.currentUser;
          if (firebaseUser) {
            await refreshToken(firebaseUser);
          }
        } catch (error) {
          console.error('Error getting token from auth store user:', error);
        }
      }
    },
    { immediate: true },
  );

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        isTokenRefreshing.value = true;
        tokenError.value = null;

        const token = await user.getIdToken(true);
        currentToken.value = token;

        localStorage.setItem('firebase-token', token);

        const tokenData = parseJwt(token);
        if (tokenData && tokenData.exp) {
          tokenExpiryTime.value = tokenData.exp * 1000; // Convert to milliseconds
        }

        setupTokenRefresh(user);

        if (resolveTokenPromise) {
          resolveTokenPromise(token);
        }

        isInitialized.value = true;
      } catch (error) {
        console.error('Error refreshing token:', error);
        tokenError.value = error instanceof Error ? error : new Error('Unknown error');
      } finally {
        isTokenRefreshing.value = false;
      }
    } else {
      currentToken.value = null;
      tokenExpiryTime.value = null;
      localStorage.removeItem('firebase-token');

      if (resolveTokenPromise) {
        resolveTokenPromise(null);
      }

      initTokenPromise();
      isInitialized.value = true;
    }
  });
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT token:', e);
    return null;
  }
}

async function setupTokenRefresh(user: any) {
  if (!tokenExpiryTime.value) return;

  const timeUntilRefresh = tokenExpiryTime.value - Date.now() - TOKEN_EXPIRY_BUFFER_MS;

  if (timeUntilRefresh <= 0) {
    refreshToken(user);
    return;
  }

  setTimeout(() => refreshToken(user), timeUntilRefresh);
}

async function refreshToken(user: any) {
  try {
    isTokenRefreshing.value = true;
    const newToken = await user.getIdToken(true);
    currentToken.value = newToken;

    localStorage.setItem('firebase-token', newToken);

    const tokenData = parseJwt(newToken);
    if (tokenData && tokenData.exp) {
      tokenExpiryTime.value = tokenData.exp * 1000;

      setupTokenRefresh(user);
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
    tokenError.value = error instanceof Error ? error : new Error('Unknown error');
  } finally {
    isTokenRefreshing.value = false;
  }
}

export async function getTokenAsync(): Promise<string | null> {
  if (!isInitialized.value) {
    const hasRestoredToken = restoreTokenFromStorage();
    if (hasRestoredToken && currentToken.value) {
      return currentToken.value;
    }
  }

  if (isTokenRefreshing.value && tokenReadyPromise) {
    return tokenReadyPromise;
  }

  if (currentToken.value && tokenExpiryTime.value && tokenExpiryTime.value > Date.now()) {
    return currentToken.value;
  }

  if (currentToken.value && tokenExpiryTime.value && tokenExpiryTime.value <= Date.now()) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      refreshToken(user);
      return tokenReadyPromise || currentToken.value;
    }
  }

  if (currentToken.value) {
    return currentToken.value;
  }

  if (tokenReadyPromise) {
    return tokenReadyPromise;
  }

  return null;
}

export function getStoredToken(): string | null {
  if (!currentToken.value) {
    restoreTokenFromStorage();
  }
  return currentToken.value;
}

export function useTokenRef() {
  return currentToken;
}

export function useTokenIsValid() {
  return computed(() => {
    return !!(currentToken.value && tokenExpiryTime.value && tokenExpiryTime.value > Date.now());
  });
}

export function useTokenInitialized() {
  return computed(() => isInitialized.value);
}
