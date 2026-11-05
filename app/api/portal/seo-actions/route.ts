import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import path from 'path';
import { supabase } from '@/lib/supabase';
import { SeoActuatorService } from '@/lib/agentic-engine/services/seo-actuator-service';
import { SeoArchitectAgent } from '@/lib/agentic-engine/agents/seo-architect-agent';
import { SeoPolicyRegistry } from '@/lib/agentic-engine/services/seo-policy-registry';
import { GoogleIndexingClient } from '@/lib/agentic-engine/services/google-indexing-client';
import { SeoOutcomesLedger } from '@/lib/agentic-engine/services/seo-outcomes-ledger';
import { SeoStrategyLearner } from '@/lib/agentic-engine/services/seo-strategy-learner';
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

    // Support direct outcomes ledger query
    if (searchParams.get('action') === 'GET_OUTCOMES_LEDGER') {
      const ledger = await SeoOutcomesLedger.getLedger();
      const summary = await SeoOutcomesLedger.getLedgerSummary();
      const learnedProfile = await SeoStrategyLearner.getLearnedProfile();
      return NextResponse.json({
        success: true,
        ledger,
        summary,
        learnedProfile,
      });
    }

    const allPackages = await SeoActuatorService.getAllPackages();
    const policies = SeoPolicyRegistry.getAllPolicies();
    const outcomesSummary = await SeoOutcomesLedger.getLedgerSummary();
    const learnedProfile = await SeoStrategyLearner.getLearnedProfile();
    const outcomesLedger = await SeoOutcomesLedger.getLedger();

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
        outcomes: outcomesSummary,
      },
      packages: allPackages.slice(0, limit).map(pkg => {
        const risk = SeoArchitectAgent.detectCannibalizationRisk(pkg.query, pkg.targetCanonicalUrl || '');
        return {
          ...pkg,
          cannibalizationWarning: risk.hasRisk ? risk : undefined,
        };
      }),
      policies,
      outcomesSummary,
      outcomesLedger,
      learnedWeights: learnedProfile.strategyWeights,
      learnedProfile,
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

        // Record immutable Day 0 baseline snapshot in outcomes ledger
        if (result.success && result.package) {
          try {
            await SeoOutcomesLedger.recordActionApplied(result.package);
          } catch (ledgerErr) {
            console.warn('[SeoOutcomesLedger] Failed to record application:', ledgerErr);
          }
        }

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

        if (result.success && (result as any).appliedPackages) {
          for (const applied of (result as any).appliedPackages) {
            try {
              await SeoOutcomesLedger.recordActionApplied(applied);
            } catch {}
          }
        }

        return NextResponse.json(result);
      }

      case 'DISMISS_ALERT': {
        if (!packageId) {
          return NextResponse.json(
            { success: false, error: 'packageId is required for DISMISS_ALERT' },
            { status: 400 }
          );
        }
        const result = await SeoActuatorService.dismissRegressionAlert(packageId);
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

        if (result.success && result.package) {
          try {
            await SeoOutcomesLedger.recordActionApplied(result.package);
          } catch {}
        }

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

      case 'GET_OUTCOMES_LEDGER': {
        const ledger = await SeoOutcomesLedger.getLedger();
        const summary = await SeoOutcomesLedger.getLedgerSummary();
        const learnedProfile = await SeoStrategyLearner.getLearnedProfile();
        return NextResponse.json({
          success: true,
          ledger,
          summary,
          learnedProfile,
        });
      }

      case 'AUDIT_OUTCOMES': {
        try {
          let latestRows: any[] | undefined;
          try {
            const { GoogleSearchConsoleClient } = await import(
              '@/lib/agentic-engine/services/gsc-client'
            );
            const gscData = await GoogleSearchConsoleClient.pullLatestSearchData();
            if (gscData && gscData.rows) latestRows = gscData.rows;
          } catch {}

          const auditResult = await SeoOutcomesLedger.auditOutcomes(latestRows);
          const updatedLearnedProfile = SeoStrategyLearner.computeStrategyWeights(auditResult.ledger);

          const { seoDegradationWatchdogWorker } = await import(
            '@/lib/agentic-engine/workers/seo-degradation-watchdog-worker'
          );
          let watchdogReport = null;
          try {
            watchdogReport = await seoDegradationWatchdogWorker.execute({
              autoRollbackEnabled: body.autoRollbackEnabled !== false,
            });
          } catch {}

          const allPackages = await SeoActuatorService.getAllPackages();

          return NextResponse.json({
            success: true,
            message: 'Live GSC outcomes audited successfully',
            timestamp: new Date().toISOString(),
            auditedCount: auditResult.auditedCount,
            uplifts: auditResult.uplifts,
            regressions: auditResult.regressions,
            steady: auditResult.steady,
            ledger: auditResult.ledger,
            summary: auditResult.summary,
            learnedProfile: updatedLearnedProfile,
            report: watchdogReport,
            packages: allPackages,
          });
        } catch (err: any) {
          return NextResponse.json(
            { success: false, error: `Audit outcomes failed: ${err.message}` },
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
