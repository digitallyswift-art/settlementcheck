import { NextRequest, NextResponse } from 'next/server';
import { SraPractisingWatchdogWorker } from '@/lib/agentic-engine/workers/sra-practising-watchdog-worker';
import { constantTimeEqual } from '@/lib/security/otp-tokens';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handleSraWatchdog(req);
}

export async function POST(req: NextRequest) {
  return handleSraWatchdog(req);
}

async function handleSraWatchdog(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || !authHeader || !constantTimeEqual(authHeader, `Bearer ${cronSecret}`)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Valid cron authorization required.' },
        { status: 401 }
      );
    }

    const dryRun = req.nextUrl.searchParams.get('dryRun') === 'true';
    const report = await SraPractisingWatchdogWorker.execute({ dryRun });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('SRA Practising Watchdog cron execution failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'SRA Practising Watchdog execution failed' },
      { status: 500 }
    );
  }
}
