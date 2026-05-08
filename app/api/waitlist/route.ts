import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Upsert to avoid duplicate errors — if already on list, update verified_at
    const { error } = await supabase.from('employee_waitlist').upsert(
      {
        email,
        verified_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    )

    if (error) {
      console.error('Waitlist insert error:', error)
      return NextResponse.json({ error: 'Failed to add to waitlist' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
