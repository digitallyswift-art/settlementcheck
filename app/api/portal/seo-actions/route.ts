import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(50, Number(searchParams.get('limit') || 20));

    let liveActions: any[] = [];
    let liveLogs: any[] = [];

    // Try Supabase first if available
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { data: actions, error: actErr } = await supabase
          .from('seo_autonomous_actions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        const { data: logs, error: logErr } = await supabase
          .from('seo_run_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (!actErr && actions) liveActions = actions;
        if (!logErr && logs) liveLogs = logs;
      } catch {
        // Fallback to disk
      }
    }

    // Disk fallback if Supabase table is empty or offline
    let diskPackages: any[] = [];
    const stagedJsonPath = path.resolve('data/serp-actions/staging/latest-staged-actions.json');
    if (fs.existsSync(stagedJsonPath)) {
      try {
        diskPackages = JSON.parse(fs.readFileSync(stagedJsonPath, 'utf-8'));
      } catch {}
    }

    let changeLogPreview = '';
    const changeLogPath = path.resolve('data/serp-actions/CHANGE_LOG.md');
    if (fs.existsSync(changeLogPath)) {
      try {
        const content = fs.readFileSync(changeLogPath, 'utf-8');
        changeLogPreview = content.slice(0, 4000); // Latest preview
      } catch {}
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      source: liveActions.length > 0 ? 'SUPABASE_CLOUD' : 'LOCAL_AUDIT_DISK',
      summary: {
        totalLoggedActions: liveActions.length > 0 ? liveActions.length : diskPackages.length,
        latestRunCount: liveLogs.length,
      },
      actions: liveActions.length > 0 ? liveActions : diskPackages,
      recentRuns: liveLogs,
      changeLogPreview,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch SEO actions' },
      { status: 500 }
    );
  }
}
