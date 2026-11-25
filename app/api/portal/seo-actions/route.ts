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

const cleanEnv = (val?: string) => (val || '').replace(/['"]/g, '').trim();

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function getAdminEmailAllowlist(): Set<string> {
  const raw = cleanEnv(process.env.ADMIN_EMAILS) || cleanEnv(process.env.COCKPIT_ADMIN_EMAILS);
  if (!raw) {
    return new Set(['admin@settlementcheck.co.uk']);
  }
  return new Set(
    raw
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

function isAdminClaims(
  email: string | undefined,
  emailVerified: boolean,
  claims: Record<string, any> | null | undefined
): boolean {
  if (claims) {
    if (claims.admin === true || claims.role === 'admin' || claims.role === 'superadmin') {
      return true;
    }
    if (
      claims.app_metadata &&
      (claims.app_metadata.admin === true ||
        claims.app_metadata.role === 'admin' ||
        (Array.isArray(claims.app_metadata.roles) && claims.app_metadata.roles.includes('admin')))
    ) {
      return true;
    }
  }
  if (email && emailVerified) {
    return getAdminEmailAllowlist().has(email.trim().toLowerCase());
  }
  return false;
}

async function verifyAdminRequest(req: NextRequest): Promise<NextResponse | null> {
  let token = '';
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  }
  if (!token) {
    token =
      req.cookies.get('sc_cockpit_auth')?.value?.trim() ||
      req.cookies.get('sb-access-token')?.value?.trim() ||
      req.cookies.get('supabase-auth-token')?.value?.trim() ||
      '';
  }

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Valid authentication token required.' },
      { status: 401 }
    );
  }

  // 1. Worker / Cron / Dev passkey
  const cronSecret = cleanEnv(process.env.CRON_SECRET) || cleanEnv(process.env.INTERNAL_WORKER_KEY);
  if (cronSecret && constantTimeEqual(token, cronSecret)) {
    return null;
  }
  if (process.env.NODE_ENV === 'development') {
    const devPass = cleanEnv(process.env.DEV_PASSKEY);
    if (devPass && constantTimeEqual(token, devPass)) {
      return null;
    }
  }

  let isAuthenticated = false;
  let isAdmin = false;

  // 2. Firebase ID token verification
  const firebaseApiKey = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  if (token.split('.').length === 3 && firebaseApiKey && !firebaseApiKey.includes('placeholder')) {
    try {
      const origin = req.headers.get('origin') || req.nextUrl.origin || 'https://settlementcheck.co.uk';
      const referer = req.headers.get('referer') || `${origin}/cockpit/`;
      const lookupRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseApiKey)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Origin: origin,
            Referer: referer,
          },
          body: JSON.stringify({ idToken: token }),
        }
      );
      if (lookupRes.ok) {
        const data = await lookupRes.json();
        const fbUser = Array.isArray(data?.users) && data.users.length > 0 ? data.users[0] : null;
        if (fbUser?.localId) {
          isAuthenticated = true;
          let customClaims: Record<string, any> | null = null;
          if (typeof fbUser.customAttributes === 'string') {
            try {
              customClaims = JSON.parse(fbUser.customAttributes);
            } catch {
              customClaims = null;
            }
          }
          isAdmin = isAdminClaims(fbUser.email, Boolean(fbUser.emailVerified), customClaims);
        }
      }
    } catch {
      // Fall through
    }
  }

  // 3. Supabase Auth JWT verification
  if (!isAuthenticated && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const userRes = await fetch(`${cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        },
      });
      if (userRes.ok) {
        const sbUser = await userRes.json();
        isAuthenticated = true;
        isAdmin = isAdminClaims(
          sbUser?.email,
          Boolean(sbUser?.email_confirmed_at || sbUser?.confirmed_at),
          sbUser
        );
      }
    } catch {
      // Fall through
    }
  }

  if (!isAuthenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Valid authentication token required.' },
      { status: 401 }
    );
  }
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Administrator privileges required.' },
      { status: 403 }
    );
  }
  return null;
}

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
  const authError = await verifyAdminRequest(req);
  if (authError) return authError;

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
    console.error('[seo-actions GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch SEO actions' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authError = await verifyAdminRequest(req);
  if (authError) return authError;

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
          console.error('[seo-actions TRIGGER_RUN] Error:', err);
          return NextResponse.json(
            { success: false, error: 'Fleet scan execution failed' },
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
          console.error('[seo-actions AUDIT_OUTCOMES] Error:', err);
          return NextResponse.json(
            { success: false, error: 'Audit outcomes failed' },
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
          console.error('[seo-actions RUN_DEGRADATION_WATCHDOG] Error:', err);
          return NextResponse.json(
            { success: false, error: 'Degradation watchdog failed' },
            { status: 500 }
          );
        }
      }

      case 'REINDEX': {
        if (!url || typeof url !== 'string') {
          return NextResponse.json(
            { success: false, error: 'url is required for REINDEX' },
            { status: 400 }
          );
        }
        let parsedUrl: URL;
        try {
          parsedUrl = new URL(url.trim());
        } catch {
          return NextResponse.json(
            { success: false, error: 'Invalid URL format for REINDEX' },
            { status: 400 }
          );
        }
        if (parsedUrl.origin !== 'https://settlementcheck.co.uk') {
          return NextResponse.json(
            { success: false, error: 'Forbidden: URL must belong to https://settlementcheck.co.uk' },
            { status: 400 }
          );
        }
        const indexingResult = await GoogleIndexingClient.notifyUrlUpdated(parsedUrl.toString());
        return NextResponse.json({
          success: indexingResult.success,
          indexingResult,
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('[seo-actions POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Actuation operation failed' },
      { status: 500 }
    );
  }
}
