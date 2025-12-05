/**
 * Rate limiting utility for API routes
 * Uses in-memory storage (for production, consider Redis)
 */

interface RateLimitStore {
  count: number
  resetTime: number
}

// In-memory store (in production, use Redis or similar)
const rateLimitStore = new Map<string, RateLimitStore>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string // Custom error message
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  message?: string
}

/**
 * Check rate limit for a given identifier (IP, user ID, etc.)
 */
export const checkRateLimit = (
  identifier: string,
  options: RateLimitOptions
): RateLimitResult => {
  const now = Date.now()
  const key = `${identifier}:${options.windowMs}`

  const record = rateLimitStore.get(key)

  if (!record || record.resetTime < now) {
    // Create new record
    const resetTime = now + options.windowMs
    rateLimitStore.set(key, {
      count: 1,
      resetTime,
    })

    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetTime,
    }
  }

  // Increment count
  record.count++

  if (record.count > options.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
      message: options.message || 'Too many requests, please try again later',
    }
  }

  return {
    success: true,
    remaining: options.maxRequests - record.count,
    resetTime: record.resetTime,
  }
}

/**
 * Get client identifier from request (IP address or user ID)
 */
export const getClientIdentifier = (request: Request, userId?: string): string => {
  // Prefer user ID if available (more accurate for authenticated users)
  if (userId) {
    return `user:${userId}`
  }

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'

  return `ip:${ip}`
}

/**
 * Rate limit presets for common use cases
 */
export const rateLimitPresets = {
  // Strict: 5 requests per 15 minutes (for sensitive operations)
  strict: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    message: 'Too many requests. Please wait 15 minutes before trying again.',
  },
  // Standard: 10 requests per minute (for general API endpoints)
  standard: {
    windowMs: 60 * 1000,
    maxRequests: 10,
    message: 'Too many requests. Please try again in a minute.',
  },
  // Auth: 5 requests per 15 minutes (for login/signup)
  auth: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    message: 'Too many authentication attempts. Please wait 15 minutes.',
  },
  // Order: 3 requests per minute (for order creation)
  order: {
    windowMs: 60 * 1000,
    maxRequests: 3,
    message: 'Too many order attempts. Please try again in a minute.',
  },
  // Search: 20 requests per minute (for search endpoints)
  search: {
    windowMs: 60 * 1000,
    maxRequests: 20,
    message: 'Too many search requests. Please try again in a minute.',
  },
}

