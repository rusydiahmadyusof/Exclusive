import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { withRateLimit, rateLimitPresets } from '@/lib/middleware/rateLimit'

export async function PUT(request: NextRequest) {
  // Apply strict rate limiting for password changes
  const rateLimitedHandler = withRateLimit(
    { ...rateLimitPresets.strict, useUserId: true },
    async (req: Request) => {
      return await handlePasswordUpdate(req)
    }
  )
  return rateLimitedHandler(request)
}

async function handlePasswordUpdate(request: Request) {
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
    const { currentPassword, newPassword } = body

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    })

    if (signInError) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    )
  }
}

