import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  const cookieStore = cookies()

  // For server-side, we use a standard client with cookie-based session
  // Authentication is handled via cookies set by client-side auth
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storage: {
        getItem: (key: string) => {
          return cookieStore.get(key)?.value || null
        },
        setItem: (key: string, value: string) => {
          // Server-side can't set cookies directly in middleware
          // Cookies are set by client-side auth
        },
        removeItem: (key: string) => {
          // Server-side can't remove cookies directly
        },
      },
    },
  })
}

