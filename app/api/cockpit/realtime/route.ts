import { NextRequest, NextResponse } from 'next/server';
import { GoogleAnalytics4Client } from '@/lib/agentic-engine/services/ga4-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const check = await GoogleAnalytics4Client.checkConnection();

    if (check.status !== 'CONNECTED') {
      return NextResponse.json({
        success: false,
        configured: false,
        check,
        timestamp: new Date().toISOString(),
      });
    }

    // Connected: Fetch live telemetry and today's cumulative metrics in parallel
    const [realtime, today] = await Promise.all([
      GoogleAnalytics4Client.getRealtimeTelemetry().catch((err) => {
        console.error('Failed to query GA4 realtime telemetry:', err);
        return null;
      }),
      GoogleAnalytics4Client.getTodayMetrics().catch(() => null),
    ]);

    if (!realtime) {
      return NextResponse.json({
        success: false,
        configured: true,
        check,
        error: 'Failed to fetch realtime data from GA4',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      configured: true,
      check,
      realtime,
      today,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Unhandled error in /api/cockpit/realtime:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
