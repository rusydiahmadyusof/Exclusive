import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { sanitizeSearchQuery, validateNumber, isValidUUID } from '@/lib/utils/validation'

export async function GET(request: Request) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category')
    const rawSearch = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'
    const bestSelling = searchParams.get('bestSelling') === 'true'
    const newArrival = searchParams.get('newArrival') === 'true'
    const flashSale = searchParams.get('flashSale') === 'true'
    
    const limit = validateNumber(searchParams.get('limit'), 1, 100) || 100
    const offset = validateNumber(searchParams.get('offset'), 0, 10000) || 0
    
    if (category && !isValidUUID(category)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }
    
    const search = rawSearch ? sanitizeSearchQuery(rawSearch) : null

    let query = supabase
      .from('products')
      .select('*, categories(*)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    if (category) {
      query = query.eq('category_id', category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (featured) {
      query = query.eq('is_featured', true)
    }

    if (bestSelling) {
      query = query.eq('is_best_selling', true)
    }

    if (newArrival) {
      query = query.eq('is_new_arrival', true)
    }

    if (flashSale) {
      query = query.eq('is_flash_sale', true)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ products: data || [] })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

