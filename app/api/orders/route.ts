import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isValidUUID, validateQuantity, validateNumber } from '@/lib/utils/validation'
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

    // Get orders with items
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*)), shipping_address:addresses(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ orders: data || [] })
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
    { ...rateLimitPresets.order, useUserId: true },
    async (req: Request) => {
      return await handleOrderCreation(req)
    }
  )
  return rateLimitedHandler(request)
}

async function handleOrderCreation(request: Request) {
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
    const {
      items,
      shipping_address_id,
      payment_method,
      coupon_code,
      shipping = 0,
      discount = 0,
    } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Order items are required' }, { status: 400 })
    }

    // Validate shipping address if provided
    if (shipping_address_id && !isValidUUID(shipping_address_id)) {
      return NextResponse.json({ error: 'Invalid shipping address ID' }, { status: 400 })
    }

    // Validate payment method
    const validPaymentMethods = ['bank', 'cash', 'card']
    const validatedPaymentMethod = validPaymentMethods.includes(payment_method) ? payment_method : 'cash'

    // Fetch product prices from database to prevent manipulation
    const productIds = items.map((item: any) => item.product_id).filter((id: any) => isValidUUID(id))
    
    if (productIds.length !== items.length) {
      return NextResponse.json({ error: 'Invalid product IDs' }, { status: 400 })
    }

    // Fetch actual product data from database
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, image_url')
      .in('id', productIds)

    if (productsError || !products || products.length !== items.length) {
      return NextResponse.json({ error: 'Invalid products or products not found' }, { status: 400 })
    }

    // Create a map of product data
    const productMap = new Map(products.map((p: any) => [p.id, p]))

    // Validate quantities and calculate prices from database
    let calculatedSubtotal = 0
    const orderItems = items.map((item: any) => {
      const product = productMap.get(item.product_id)
      if (!product) {
        throw new Error('Product not found')
      }

      const quantity = validateQuantity(item.quantity)
      if (!quantity) {
        throw new Error('Invalid quantity')
      }

      // Use database price to prevent manipulation
      const itemPrice = Number(product.price)
      const itemTotal = itemPrice * quantity
      calculatedSubtotal += itemTotal

      return {
        product_id: item.product_id,
        product_name: product.name,
        product_image_url: product.image_url,
        quantity,
        price: itemPrice, // Use database price
      }
    })

    // Validate shipping and discount amounts
    const validatedShipping = validateNumber(shipping, 0, 10000) || 0
    const validatedDiscount = validateNumber(discount, 0, calculatedSubtotal) || 0
    const calculatedTotal = calculatedSubtotal + validatedShipping - validatedDiscount

    // Generate order number (using substring instead of deprecated substr)
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`

    // Create order with calculated values
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        subtotal: calculatedSubtotal,
        shipping: validatedShipping,
        discount: validatedDiscount,
        total: calculatedTotal,
        payment_method: validatedPaymentMethod,
        shipping_address_id: shipping_address_id || null,
        coupon_code: coupon_code || null,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Create order items with database prices
    const orderItemsToInsert = orderItems.map((item: any) => ({
      order_id: order.id,
      ...item,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsToInsert)

    if (itemsError) {
      // Rollback order creation
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    // Clear cart after successful order
    await supabase.from('cart_items').delete().eq('user_id', user.id)

    // Get full order with items
    const { data: fullOrder } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*)), shipping_address:addresses(*)')
      .eq('id', order.id)
      .single()

    return NextResponse.json({ order: fullOrder }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

