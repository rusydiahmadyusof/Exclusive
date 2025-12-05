/**
 * Session management utilities
 */

import type { Session } from '@supabase/supabase-js'

/**
 * Check if session is expired or about to expire
 */
export const isSessionExpired = (session: Session | null): boolean => {
  if (!session?.expires_at) {
    return true
  }

  // Consider session expired if it expires within 5 minutes
  const expiresAt = session.expires_at * 1000 // Convert to milliseconds
  const bufferTime = 5 * 60 * 1000 // 5 minutes
  return Date.now() >= expiresAt - bufferTime
}

/**
 * Get time until session expires (in milliseconds)
 */
export const getTimeUntilExpiry = (session: Session | null): number => {
  if (!session?.expires_at) {
    return 0
  }

  const expiresAt = session.expires_at * 1000
  return Math.max(0, expiresAt - Date.now())
}

/**
 * Check if session needs refresh (within 10 minutes of expiry)
 */
export const needsRefresh = (session: Session | null): boolean => {
  if (!session?.expires_at) {
    return true
  }

  const expiresAt = session.expires_at * 1000
  const refreshThreshold = 10 * 60 * 1000 // 10 minutes
  return Date.now() >= expiresAt - refreshThreshold
}

/**
 * Validate session structure
 */
export const isValidSession = (session: Session | null): boolean => {
  if (!session) {
    return false
  }

  // Check required fields
  if (!session.access_token || !session.user || !session.expires_at) {
    return false
  }

  // Check if expired
  if (isSessionExpired(session)) {
    return false
  }

  return true
}

