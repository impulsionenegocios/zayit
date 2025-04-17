import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTokenIsValid } from '@/utils/authToken'

export function useAuthStatus() {
  const authStore = useAuthStore()
  const tokenIsValid = useTokenIsValid()
  
  const isAuthenticated = computed(() => {
    return !!authStore.user && tokenIsValid.value
  })
  
  const isAuthLoading = computed(() => {
    return authStore.loading
  })
  
  return {
    isAuthenticated,
    isAuthLoading,
    user: computed(() => authStore.user),
    perfil: computed(() => authStore.perfil)
  }
}
