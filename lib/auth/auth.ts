import { supabase } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

export interface SignUpData {
  email: string
  password: string
  name?: string
}

export interface SignInData {
  email: string
  password: string
}

export const authService = {
  /**
   * Sign up a new user
   */
  signUp: async (data: SignUpData) => {
    const { email, password, name } = data

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0], // Use email prefix as default name
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return {
      user: authData.user,
      session: authData.session,
    }
  },

  /**
   * Sign in an existing user
   */
  signIn: async (data: SignInData) => {
    const { email, password } = data

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return {
      user: authData.user,
      session: authData.session,
    }
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(error.message)
    }
  },

  /**
   * Get the current session
   */
  getSession: async (): Promise<Session | null> => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      throw new Error(error.message)
    }

    return session
  },

  /**
   * Get the current user
   */
  getCurrentUser: async (): Promise<User | null> => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      throw new Error(error.message)
    }

    return user
  },

  /**
   * Reset password (send reset email)
   */
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      throw new Error(error.message)
    }
  },

  /**
   * Update password
   */
  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      throw new Error(error.message)
    }
  },

  /**
   * Update user metadata
   */
  updateUser: async (updates: { name?: string; [key: string]: any }) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data.user
  },
}

