import { NextRequest, NextResponse } from 'next/server';
import { runSerpSentinelAnalysis } from '@/lib/agentic-engine/tools/serp-tools';
import { GoogleSearchConsoleClient } from '@/lib/agentic-engine/services/gsc-client';
import { AutonomousSeoActionService } from '@/lib/agentic-engine/services/autonomous-seo-actions';
import { SeoAnomalySentinel } from '@/lib/agentic-engine/services/seo-anomaly-sentinel';
import { constantTimeEqual } from '@/lib/security/otp-tokens';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  return handleSentinel(req);
}

export async function POST(req: NextRequest) {
  return handleSentinel(req);
}

async function handleSentinel(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Fail-closed constant-time cron authorization
    if (!cronSecret || !authHeader || !constantTimeEqual(authHeader, `Bearer ${cronSecret}`)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Valid cron authorization required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const minImpressions = searchParams.get('minImpressions') ? Number(searchParams.get('minImpressions')) : 5;

    // 1. Run Autonomous Macro Anomaly Sentinel (detects surges/drops, diagnoses root causes, alerts user)
    let anomalyReport = null;
    try {
      anomalyReport = await SeoAnomalySentinel.executeDailySentinel();
    } catch (anomErr) {
      console.warn('Macro Anomaly Sentinel error in cron:', anomErr);
    }

    if (GoogleSearchConsoleClient.isConfigured()) {
      const gscData = await GoogleSearchConsoleClient.pullLatestSearchData();
      const digest = await AutonomousSeoActionService.executeActionPipeline(gscData, {
        sendEmail: true,
        batchLimit: 2,
      });
      return NextResponse.json({
        success: true,
        source: 'GSC_LIVE_API',
        anomalyReport,
        digest,
      });
    }

    const report = runSerpSentinelAnalysis({
      focusCategory: category,
      minImpressions,
    });

    return NextResponse.json({
      success: true,
      source: 'LOCAL_FALLBACK_ARCHIVE',
      anomalyReport,
      report,
    });
  } catch (error: any) {
    console.error('SERP Sentinel cron execution failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'SERP Sentinel execution failed' },
      { status: 500 }
    );
  }
}

