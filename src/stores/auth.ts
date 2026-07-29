import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase/client'
import type { Profile } from '@/types/auth'

interface AuthState {
  userId: string | null
  profile: Profile | null
  isInitialized: boolean
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    userId: null,
    profile: null,
    isInitialized: false,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.userId && state.profile?.isActive),
    role: (state) => state.profile?.role ?? null
  },

  actions: {
    async init() {
      if (this.isInitialized) return
      this.isLoading = true
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        this.userId = data.session.user.id
        await this.loadProfile()
      }
      supabase.auth.onAuthStateChange((_event, session) => {
        this.userId = session?.user.id ?? null
        if (this.userId) {
          void this.loadProfile()
        } else {
          this.profile = null
        }
      })
      this.isInitialized = true
      this.isLoading = false
    },

    async loadProfile() {
      if (!this.userId) return
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.userId)
        .maybeSingle()
      if (error) {
        this.error = error.message
        return
      }
      if (data) {
        this.profile = {
          id: data.id,
          fullName: data.full_name,
          email: data.email,
          role: data.role,
          isActive: data.is_active
        }
      }
    },

    async signIn(email: string, password: string) {
      this.isLoading = true
      this.error = null
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        this.userId = data.user?.id ?? null
        await this.loadProfile()
        if (!this.profile?.isActive) {
          await this.signOut()
          throw new Error('Este usuário não está ativo. Fale com um administrador.')
        }
        return true
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Não foi possível entrar. Verifique suas credenciais.'
        return false
      } finally {
        this.isLoading = false
      }
    },

    async signOut() {
      await supabase.auth.signOut()
      this.userId = null
      this.profile = null
    }
  }
})
