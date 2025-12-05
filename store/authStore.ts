import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@supabase/supabase-js'

interface AuthStore {
  user: User | null
  session: any | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  // Actions
  setUser: (user: User | null) => void
  setSession: (session: any | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        })
      },

      setSession: (session) => {
        set({
          session,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
        })
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      setError: (error) => {
        set({ error })
      },

      logout: () => {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          error: null,
        })
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user and session, not loading/error states
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

