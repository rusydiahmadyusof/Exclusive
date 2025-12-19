import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

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

    const profile = {
      firstName: user.user_metadata?.first_name || user.user_metadata?.name?.split(' ')[0] || '',
      lastName: user.user_metadata?.last_name || user.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
      email: user.email || '',
      address: user.user_metadata?.address || '',
    }

    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
    const { firstName, lastName, email, address } = body

    const { data, error } = await supabase.auth.updateUser({
      email: email !== user.email ? email : undefined,
      data: {
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`,
        address,
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      profile: {
        firstName: data.user.user_metadata?.first_name,
        lastName: data.user.user_metadata?.last_name,
        email: data.user.email,
        address: data.user.user_metadata?.address,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

