import { NextResponse } from 'next/server'

export async function GET() {
  const checks: Record<string, boolean | string> = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    NOTIFICATION_EMAIL: !!process.env.NOTIFICATION_EMAIL,
  }

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      })

      checks['supabase_connect'] = true

      const tables = ['otp_codes', 'solicitor_applications', 'employee_waitlist']
      for (const table of tables) {
        const { error } = await sb.from(table).select('id').limit(1)
        checks[`table_${table}`] = error ? `ERROR: ${error.message}` : true
      }
    } catch (e: any) {
      checks['supabase_connect'] = `ERROR: ${e?.message ?? String(e)}`
    }
  } else {
    checks['supabase_connect'] = 'skipped (missing creds)'
  }

  const allOk = Object.values(checks).every((v) => v === true)
  return NextResponse.json({ ok: allOk, checks }, { status: allOk ? 200 : 500 })
}
