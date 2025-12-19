import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { sanitizeSearchQuery } from '@/lib/utils/validation'
import { withRateLimit, rateLimitPresets } from '@/lib/middleware/rateLimit'

export async function GET(request: Request) {
  const rateLimitedHandler = withRateLimit(
    rateLimitPresets.search,
    async (req: Request) => {
      return await handleSearch(req)
    }
  )
  return rateLimitedHandler(request)
}

async function handleSearch(request: Request) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const rawQuery = searchParams.get('q')

    if (!rawQuery || rawQuery.trim() === '') {
      return NextResponse.json({ products: [] })
    }

    const query = sanitizeSearchQuery(rawQuery)
    
    if (!query) {
      return NextResponse.json({ products: [] })
    }

    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20)

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

