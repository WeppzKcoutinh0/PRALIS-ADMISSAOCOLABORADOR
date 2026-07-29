import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const store = useAuthStore()
  const { userId, profile, isAuthenticated, role, isLoading, error, isInitialized } = storeToRefs(store)

  return {
    userId,
    profile,
    isAuthenticated,
    role,
    isLoading,
    error,
    isInitialized,
    init: store.init,
    signIn: store.signIn,
    signOut: store.signOut
  }
}
