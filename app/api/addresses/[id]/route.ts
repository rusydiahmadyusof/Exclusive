import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isValidUUID } from '@/lib/utils/validation'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate UUID format
    if (!isValidUUID(params.id)) {
      return NextResponse.json({ error: 'Invalid address ID' }, { status: 400 })
    }

    const body = await request.json()
    const { firstName, lastName, companyName, streetAddress, apartment, city, state, postcode, phoneNumber, emailAddress, isDefault } = body

    // If this is set as default, unset other defaults
    if (isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .neq('id', params.id)
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .update({
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
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    return NextResponse.json({ address })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Address deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}

