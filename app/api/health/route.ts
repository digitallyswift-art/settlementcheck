import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const cleanEnv = (val?: string) => (val || '').replace(/['"]/g, '').trim();

function constantTimeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function isAuthorized(token: string): boolean {
  if (!token) return false;
  const secrets = [
    cleanEnv(process.env.CRON_SECRET),
    cleanEnv(process.env.INTERNAL_WORKER_KEY),
    cleanEnv(process.env.HEALTH_CHECK_SECRET),
    cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY),
  ].filter(Boolean);

  if (secrets.length === 0) return false;

  return secrets.some(secret => constantTimeEqual(token, secret));
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  // 1. Public unauthenticated request: return minimal sanitized heartbeat
  if (!authHeader) {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }

  // 2. Validate Bearer token scheme
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid health check authorization token' },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7).trim();
  if (!token || !isAuthorized(token)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid health check authorization token' },
      { status: 401 }
    );
  }

  // 3. Authorized request: execute internal diagnostics
  const timestamp = new Date().toISOString();
  const checks: Record<string, boolean | string> = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    NOTIFICATION_EMAIL: !!process.env.NOTIFICATION_EMAIL,
  };

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      checks['supabase_connect'] = true;

      const tables = ['otp_codes', 'solicitor_applications', 'employee_waitlist'];
      for (const table of tables) {
        const { error } = await sb.from(table).select('id').limit(1);
        checks[`table_${table}`] = error ? `ERROR: ${error.message}` : true;
      }
    } catch (e: any) {
      checks['supabase_connect'] = `ERROR: ${e?.message ?? String(e)}`;
    }
  } else {
    checks['supabase_connect'] = 'skipped (missing creds)';
  }

  const allOk = Object.values(checks).every((v) => v === true);
  return NextResponse.json(
    {
      ok: allOk,
      status: allOk ? 'healthy' : 'degraded',
      timestamp,
      checks,
    },
    { status: allOk ? 200 : 500 }
  );
}
