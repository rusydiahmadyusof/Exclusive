import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isValidUUID } from '@/lib/utils/validation'

export async function GET() {
  try {
    const supabase = createServerClient()
    
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ addresses })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, companyName, streetAddress, apartment, city, state, postcode, phoneNumber, emailAddress, isDefault } = body

    if (isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        company_name: companyName || null,
        street_address: streetAddress,
        apartment: apartment || null,
        city: city,
        state: state,
        postcode: postcode,
        phone_number: phoneNumber,
        email_address: emailAddress,
        is_default: isDefault || false,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ address })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    )
  }
}

