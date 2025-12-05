import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isValidUUID } from '@/lib/utils/validation'
import { withRateLimit, rateLimitPresets } from '@/lib/middleware/rateLimit'

export async function GET() {
  try {
    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get wishlist items with product details
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*, products(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ items: data || [] })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  // Apply rate limiting
  const rateLimitedHandler = withRateLimit(
    { ...rateLimitPresets.standard, useUserId: true },
    async (req: Request) => {
      return await handleAddToWishlist(req)
    }
  )
  return rateLimitedHandler(request)
}

async function handleAddToWishlist(request: Request) {
  try {
    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { product_id } = body

    // Validate UUID format
    if (!product_id || !isValidUUID(product_id)) {
      return NextResponse.json({ error: 'Valid product ID is required' }, { status: 400 })
    }

    // Check if already in wishlist
    const { data: existing } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product_id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Product already in wishlist' }, { status: 400 })
    }

    // Add to wishlist
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: user.id,
        product_id,
      })
      .select('*, products(*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

