import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { email, code, form_type } = await req.json()

    if (!email || !code || !form_type) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    // Find the most recent unused, unexpired code for this email+form_type
    const { data, error } = await supabase
      .from('otp_codes')
      .select('id, code, expires_at, used')
      .eq('email', email)
      .eq('form_type', form_type)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ success: false, message: 'Code not found or already used' }, { status: 200 })
    }

    // Check expiry
    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ success: false, message: 'Code has expired. Please request a new one.' }, { status: 200 })
    }

    // Check code matches
    if (data.code !== code.trim()) {
      return NextResponse.json({ success: false, message: 'Incorrect code. Please try again.' }, { status: 200 })
    }

    // Mark as used
    await supabase.from('otp_codes').update({ used: true }).eq('id', data.id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('OTP verify error:', err)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
