import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isValidUUID, validateQuantity } from '@/lib/utils/validation'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()

    // Validate UUID format
    if (!isValidUUID(params.id)) {
      return NextResponse.json({ error: 'Invalid cart item ID' }, { status: 400 })
    }

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const quantity = validateQuantity(body.quantity)

    if (!quantity) {
      return NextResponse.json({ error: 'Quantity must be between 1 and 999' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select('*, products(*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ item: data })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

