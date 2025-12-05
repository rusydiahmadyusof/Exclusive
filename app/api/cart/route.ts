import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isValidUUID, validateQuantity } from '@/lib/utils/validation'
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

    // Get cart items with product details
    const { data, error } = await supabase
      .from('cart_items')
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
      return await handleAddToCart(req)
    }
  )
  return rateLimitedHandler(request)
}

async function handleAddToCart(request: Request) {
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
    const { product_id, quantity = 1 } = body

    if (!product_id || !isValidUUID(product_id)) {
      return NextResponse.json({ error: 'Valid product ID is required' }, { status: 400 })
    }

    const validatedQuantity = validateQuantity(quantity)
    if (!validatedQuantity) {
      return NextResponse.json({ error: 'Quantity must be between 1 and 999' }, { status: 400 })
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product_id)
      .single()

    if (existingItem) {
      // Update quantity with validation
      const newQuantity = Math.min(existingItem.quantity + validatedQuantity, 999)
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select('*, products(*)')
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ item: data })
    } else {
      // Create new cart item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id,
          quantity: validatedQuantity,
        })
        .select('*, products(*)')
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ item: data }, { status: 201 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

