import { NextRequest, NextResponse } from 'next/server';
import { SlaWatchdogWorker } from '@/lib/agentic-engine/workers/sla-watchdog-worker';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return handleWatchdog(req);
}

export async function POST(req: NextRequest) {
  return handleWatchdog(req);
}

async function handleWatchdog(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Validate cron authorization if secret is configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid cron authentication token' },
        { status: 401 }
      );
    }

    const report = await SlaWatchdogWorker.execute();

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('SLA Watchdog cron execution failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'SLA Watchdog execution failed' },
      { status: 500 }
    );
  }
}
