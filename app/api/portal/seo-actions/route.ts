import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';
import { SeoActuatorService } from '@/lib/agentic-engine/services/seo-actuator-service';
import { GoogleIndexingClient } from '@/lib/agentic-engine/services/google-indexing-client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(50, Number(searchParams.get('limit') || 20));

    const allPackages = await SeoActuatorService.getAllPackages();

    let liveLogs: any[] = [];
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { data: logs, error: logErr } = await supabase
          .from('seo_run_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        if (!logErr && logs) liveLogs = logs;
      } catch {}
    }

    let changeLogPreview = '';
    const changeLogPath = path.resolve('data/serp-actions/CHANGE_LOG.md');
    if (fs.existsSync(changeLogPath)) {
      try {
        const content = fs.readFileSync(changeLogPath, 'utf-8');
        changeLogPreview = content.slice(0, 4000);
      } catch {}
    }

    const appliedCount = allPackages.filter(p => p.status === 'APPLIED').length;
    const validatedCount = allPackages.filter(p => p.status === 'VALIDATED').length;
    const stagedCount = allPackages.filter(p => p.status === 'STAGED').length;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalPackages: allPackages.length,
        appliedCount,
        validatedCount,
        stagedCount,
        latestRunCount: liveLogs.length,
      },
      packages: allPackages.slice(0, limit),
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, packageId, url } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: action' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'APPLY': {
        if (!packageId) {
          return NextResponse.json(
            { success: false, error: 'packageId is required for APPLY' },
            { status: 400 }
          );
        }
        const result = await SeoActuatorService.applyPackage(packageId, { triggerIndexing: true });
        return NextResponse.json(result);
      }

      case 'ROLLBACK': {
        if (!packageId) {
          return NextResponse.json(
            { success: false, error: 'packageId is required for ROLLBACK' },
            { status: 400 }
          );
        }
        const result = await SeoActuatorService.rollbackPackage(packageId);
        return NextResponse.json(result);
      }

      case 'APPLY_ALL': {
        const result = await SeoActuatorService.applyAllValidated();
        return NextResponse.json(result);
      }

      case 'REINDEX': {
        if (!url) {
          return NextResponse.json(
            { success: false, error: 'url is required for REINDEX' },
            { status: 400 }
          );
        }
        const indexingResult = await GoogleIndexingClient.notifyUrlUpdated(url);
        return NextResponse.json({
          success: indexingResult.success,
          indexingResult,
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Actuation operation failed' },
      { status: 500 }
    );
  }
}
