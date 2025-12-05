'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store'
import { authService } from '@/lib/auth/auth'
import type { SignUpData, SignInData } from '@/lib/auth/auth'
import { isSessionExpired, needsRefresh, isValidSession } from '@/lib/utils/session'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  signUp: (data: SignUpData) => Promise<void>
  signIn: (data: SignInData) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter()
  const {
    user: storeUser,
    session: storeSession,
    isAuthenticated: storeIsAuthenticated,
    setUser,
    setSession,
    setLoading,
    logout: storeLogout,
  } = useAuthStore()

  const [isLoading, setIsLoading] = useState(true)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)
        const session = await authService.getSession()
        
        // Validate session
        if (!isValidSession(session)) {
          setUser(null)
          setSession(null)
          return
        }

        const user = session?.user || null
        setSession(session)
        setUser(user)
      } catch (error) {
        // Error handling is done silently to not expose sensitive information
        setUser(null)
        setSession(null)
      } finally {
        setLoading(false)
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Validate session before setting
      if (session && !isValidSession(session)) {
        setUser(null)
        setSession(null)
        return
      }

      const user = session?.user || null
      setSession(session)
      setUser(user)

      if (event === 'SIGNED_OUT') {
        storeLogout()
        // Clear refresh interval
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current)
          refreshIntervalRef.current = null
        }
        router.refresh()
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        router.refresh()
      }
    })

    // Set up automatic session refresh
    const setupSessionRefresh = () => {
      // Clear existing interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }

      // Check session every minute
      refreshIntervalRef.current = setInterval(async () => {
        try {
          const session = await authService.getSession()
          
          if (!session) {
            setUser(null)
            setSession(null)
            return
          }

          // Check if session is expired
          if (isSessionExpired(session)) {
            setUser(null)
            setSession(null)
            storeLogout()
            router.push('/login')
            return
          }

          // Refresh token if needed
          if (needsRefresh(session)) {
            const { data: { session: refreshedSession } } = await supabase.auth.refreshSession()
            if (refreshedSession) {
              setSession(refreshedSession)
              setUser(refreshedSession.user)
            }
          }
        } catch (error) {
          // Error handling is done silently
          setUser(null)
          setSession(null)
        }
      }, 60 * 1000) // Check every minute
    }

    setupSessionRefresh()

    return () => {
      subscription.unsubscribe()
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [router, setUser, setSession, setLoading, storeLogout])

  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true)
      const { user, session } = await authService.signUp(data)
      setUser(user)
      setSession(session)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (data: SignInData) => {
    try {
      setLoading(true)
      const { user, session } = await authService.signIn(data)
      setUser(user)
      setSession(session)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await authService.signOut()
      storeLogout()
      router.push('/')
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email)
    } catch (error) {
      throw error
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      await authService.updatePassword(newPassword)
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    user: storeUser,
    session: storeSession,
    isLoading: isLoading || storeIsAuthenticated === undefined,
    isAuthenticated: storeIsAuthenticated,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

