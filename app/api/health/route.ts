import { NextResponse } from 'next/server'

export async function GET() {
  const checks: Record<string, boolean | string> = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    NOTIFICATION_EMAIL: !!process.env.NOTIFICATION_EMAIL,
  }

  // Try to reach Supabase if creds are present
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
      // Check if otp_codes table exists by selecting 0 rows
      const { error } = await sb.from('otp_codes').select('id').limit(1)
      checks['supabase_connect'] = true
      checks['otp_codes_table'] = error ? `ERROR: ${error.message}` : true
    } catch (e: any) {
      checks['supabase_connect'] = `ERROR: ${e?.message ?? String(e)}`
    }
  } else {
    checks['supabase_connect'] = 'skipped (missing creds)'
    checks['otp_codes_table'] = 'skipped'
  }

  const allOk = Object.values(checks).every((v) => v === true)
  return NextResponse.json({ ok: allOk, checks }, { status: allOk ? 200 : 500 })
}
