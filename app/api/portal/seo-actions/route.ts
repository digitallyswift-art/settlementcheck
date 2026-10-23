import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import path from 'path';
import { supabase } from '@/lib/supabase';
import { SeoActuatorService } from '@/lib/agentic-engine/services/seo-actuator-service';
import { SeoPolicyRegistry } from '@/lib/agentic-engine/services/seo-policy-registry';
import { GoogleIndexingClient } from '@/lib/agentic-engine/services/google-indexing-client';
import { SafeFs } from '@/lib/agentic-engine/services/safe-fs';

export const dynamic = 'force-dynamic';

function revalidateSeoRouteAndTag(urlOrPath: string) {
  const pathName = SeoActuatorService.normalizePath(urlOrPath);
  const tag = SeoActuatorService.getCacheTagForPath(pathName);
  try {
    revalidateTag(tag);
    revalidateTag('seo-metadata-all');
  } catch {}
  try {
    revalidatePath(pathName, 'page');
    revalidatePath('/sitemap.xml');
    revalidatePath('/', 'layout');
  } catch {}
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(50, Number(searchParams.get('limit') || 20));

    const allPackages = await SeoActuatorService.getAllPackages();
    const policies = SeoPolicyRegistry.getAllPolicies();

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
    const changeLogContent = SafeFs.readFileSyncSafe(changeLogPath, 'utf-8');
    if (changeLogContent) {
      changeLogPreview = changeLogContent.slice(0, 4000);
    }

    const appliedCount = allPackages.filter(
      p => p.status === 'APPLIED' || p.status === 'CANARY' || p.status === 'PERMANENT'
    ).length;
    const canaryCount = allPackages.filter(p => p.status === 'CANARY').length;
    const validatedCount = allPackages.filter(p => p.status === 'VALIDATED').length;
    const stagedCount = allPackages.filter(p => p.status === 'STAGED').length;
    const regressionCount = allPackages.filter(p => Boolean(p.regressionAlert)).length;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalPackages: allPackages.length,
        appliedCount,
        canaryCount,
        validatedCount,
        stagedCount,
        regressionCount,
        latestRunCount: liveLogs.length,
        activePoliciesCount: policies.length,
      },
      packages: allPackages.slice(0, limit),
      policies,
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
      case 'ADVERSARIAL_REVIEW': {
        if (!packageId) {
          return NextResponse.json(
            { success: false, error: 'packageId is required for ADVERSARIAL_REVIEW' },
            { status: 400 }
          );
        }
        const result = await SeoActuatorService.runAdversarialReview(
          packageId,
          body.packageSnapshot
        );
        return NextResponse.json(result, { status: result.success ? 200 : 400 });
      }

      case 'PROMOTE_POLICY': {
        if (!body.rule || !body.rule.ruleTitle || !body.rule.constraintDescription) {
          return NextResponse.json(
            { success: false, error: 'Valid rule object is required for PROMOTE_POLICY' },
            { status: 400 }
          );
        }
        const promoted = SeoPolicyRegistry.promotePolicyRule(body.rule);
        return NextResponse.json({
          success: true,
          promotedRule: promoted,
          policies: SeoPolicyRegistry.getAllPolicies(),
        });
      }

      case 'APPLY':
      case 'APPLY_CANARY': {
        if (!packageId) {
          return NextResponse.json(
            { success: false, error: 'packageId is required for APPLY' },
            { status: 400 }
          );
        }
        const result = await SeoActuatorService.applyPackage(packageId, {
          triggerIndexing: true,
          expectedVersion: body.expectedVersion,
          actorId: body.actorId || 'COCKPIT_ADMIN',
          deployAsCanary: action === 'APPLY_CANARY' || Boolean(body.deployAsCanary),
          fallbackPackage: body.packageSnapshot,
          revalidate: async (urlOrPath) => {
            revalidateSeoRouteAndTag(urlOrPath);
          },
        });
        const status = result.success ? 200 : result.error?.includes('OCC Conflict') ? 409 : 400;
        return NextResponse.json(result, { status });
      }

      case 'ROLLBACK': {
        if (!packageId) {
          return NextResponse.json(
            { success: false, error: 'packageId is required for ROLLBACK' },
            { status: 400 }
          );
        }
        const result = await SeoActuatorService.rollbackPackage(packageId, {
          fallbackPackage: body.packageSnapshot,
          revalidate: async (urlOrPath) => {
            revalidateSeoRouteAndTag(urlOrPath);
          },
        });
        return NextResponse.json(result);
      }

      case 'APPLY_ALL':
      case 'APPLY_LOW_RISK': {
        const result = await SeoActuatorService.applyAllValidated({
          onlyLowRisk: action === 'APPLY_LOW_RISK',
          revalidate: async (urlOrPath) => {
            revalidateSeoRouteAndTag(urlOrPath);
          },
        });
        return NextResponse.json(result);
      }

      case 'REJECT': {
        if (!packageId) {
          return NextResponse.json(
            { success: false, error: 'packageId is required for REJECT' },
            { status: 400 }
          );
        }
        const result = await SeoActuatorService.rejectPackage(
          packageId,
          body.reason,
          body.packageSnapshot,
          body.policyRuleToPromote
        );
        try {
          revalidateTag('seo-metadata-all');
        } catch {}
        return NextResponse.json(result);
      }

      case 'EDIT_AND_APPLY': {
        if (!packageId || !body.updates) {
          return NextResponse.json(
            { success: false, error: 'packageId and updates are required for EDIT_AND_APPLY' },
            { status: 400 }
          );
        }
        const result = await SeoActuatorService.editAndApplyPackage(packageId, body.updates, {
          expectedVersion: body.expectedVersion,
          actorId: body.actorId || 'COCKPIT_ADMIN',
          fallbackPackage: body.packageSnapshot,
          revalidate: async (urlOrPath) => {
            revalidateSeoRouteAndTag(urlOrPath);
          },
        });
        const status = result.success ? 200 : result.error?.includes('OCC Conflict') ? 409 : 400;
        return NextResponse.json(result, { status });
      }

      case 'TRIGGER_RUN': {
        try {
          const { GoogleSearchConsoleClient } = await import('@/lib/agentic-engine/services/gsc-client');
          const { AutonomousSeoActionService } = await import('@/lib/agentic-engine/services/autonomous-seo-actions');
          const gscData = await GoogleSearchConsoleClient.pullLatestSearchData();
          const digest = await AutonomousSeoActionService.executeActionPipeline(gscData, {
            batchLimit: 8,
            sendEmail: false,
          });
          return NextResponse.json({
            success: true,
            runId: digest.runId,
            actionsGenerated: digest.actionsTaken.length,
            packagesStaged: digest.dualAgentPackages?.length ?? 0,
            metrics: digest.metrics,
          });
        } catch (err: any) {
          return NextResponse.json(
            { success: false, error: `Fleet scan execution failed: ${err.message}` },
            { status: 500 }
          );
        }
      }

      case 'RUN_DEGRADATION_WATCHDOG': {
        try {
          const { seoDegradationWatchdogWorker } = await import(
            '@/lib/agentic-engine/workers/seo-degradation-watchdog-worker'
          );
          const report = await seoDegradationWatchdogWorker.execute({
            autoRollbackEnabled: body.autoRollbackEnabled !== false,
          });
          return NextResponse.json({
            success: true,
            report,
          });
        } catch (err: any) {
          return NextResponse.json(
            { success: false, error: `Degradation watchdog failed: ${err.message}` },
            { status: 500 }
          );
        }
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
