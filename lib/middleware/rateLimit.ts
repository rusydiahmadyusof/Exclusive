/**
 * Rate limiting middleware for Next.js API routes
 */

import { NextResponse } from 'next/server'
import { checkRateLimit, getClientIdentifier, rateLimitPresets, type RateLimitOptions } from '@/lib/utils/rateLimit'

// Re-export rateLimitPresets for convenience
export { rateLimitPresets } from '@/lib/utils/rateLimit'

export interface RateLimitMiddlewareOptions extends RateLimitOptions {
  useUserId?: boolean // Use authenticated user ID instead of IP
}

/**
 * Create rate limiting middleware
 */
export const withRateLimit = (
  options: RateLimitMiddlewareOptions,
  handler: (request: Request, context?: any) => Promise<Response>
) => {
  return async (request: Request, context?: any): Promise<Response> => {
    // Get user ID if available and requested
    let userId: string | undefined
    if (options.useUserId) {
      // Try to get user from Supabase session
      try {
        const { createServerClient } = await import('@/lib/supabase/server')
        const supabase = createServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        userId = user?.id
      } catch {
        // If auth fails, fall back to IP
      }
    }

    const identifier = getClientIdentifier(request, userId)
    const result = checkRateLimit(identifier, options)

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message || 'Too many requests',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': options.maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString(),
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    // Add rate limit headers to response
    const response = await handler(request, context)
    const headers = new Headers(response.headers)
    headers.set('X-RateLimit-Limit', options.maxRequests.toString())
    headers.set('X-RateLimit-Remaining', result.remaining.toString())
    headers.set('X-RateLimit-Reset', result.resetTime.toString())

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }
}

