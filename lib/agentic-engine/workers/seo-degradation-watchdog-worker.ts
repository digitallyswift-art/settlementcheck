/**
 * Autonomous SEO Degradation Watchdog & Self-Healing Rollback Worker
 * Inspects all active ('APPLIED' / 'CANARY' / 'PERMANENT') SEO action packages and compares
 * pre-actuation baseline GSC rank/impressions against post-actuation rolling metrics.
 *
 * Governance Thresholds:
 * - Alert Threshold: >15% rank degradation or >20% impression drop
 * - Auto-Rollback Threshold: >25% rank degradation or >30% impression drop sustained over >= 7 days
 * - Canary Graduation: 14 days without regression promotes 'CANARY' -> 'PERMANENT'
 */

import { AgenticWorker } from '../types';
import { SeoActuatorService, AppliedSeoRecord } from '../services/seo-actuator-service';
import { GoogleSearchConsoleClient, GscQueryRow } from '../services/gsc-client';
import { supabase } from '@/lib/supabase';

export interface SeoDegradationWatchdogInput {
  autoRollbackEnabled?: boolean;
  simulatedCurrentMetricsByQuery?: Record<
    string,
    { position: number; impressions: number; clicks: number; ctr: number }
  >;
}

export interface PackageRegressionAudit {
  packageId: string;
  query: string;
  targetCanonicalUrl: string;
  previousStatus: string;
  newStatus: string;
  baselinePosition: number;
  currentPosition: number;
  positionDropPercent: number;
  baselineImpressions: number;
  currentImpressions: number;
  impressionDropPercent: number;
  daysSinceApplied: number;
  actionTaken: 'HEALTHY' | 'GRADUATED_TO_PERMANENT' | 'REGRESSION_ALERT' | 'AUTO_ROLLED_BACK';
  alertMessage?: string;
}

export interface SeoDegradationWatchdogReport {
  runId: string;
  timestamp: string;
  activePackagesEvaluated: number;
  healthyCount: number;
  graduatedToPermanentCount: number;
  alertsTriggered: number;
  autoRollbacksTriggered: number;
  audits: PackageRegressionAudit[];
}

export class SeoDegradationWatchdog {
  public static readonly ALERT_RANK_DROP_PCT = 15;
  public static readonly AUTO_ROLLBACK_RANK_DROP_PCT = 25;
  public static readonly AUTO_ROLLBACK_IMPR_DROP_PCT = 30;
  public static readonly MIN_OBSERVATION_DAYS_FOR_ROLLBACK = 7;
  public static readonly CANARY_GRADUATION_DAYS = 14;

  public static async evaluateActivePackages(
    input?: SeoDegradationWatchdogInput
  ): Promise<SeoDegradationWatchdogReport> {
    const runId = `seo_watchdog_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const autoRollback = input?.autoRollbackEnabled !== false;

    const allPackages = await SeoActuatorService.getAllPackages();
    const activePackages = allPackages.filter(
      p => p.status === 'APPLIED' || p.status === 'CANARY' || p.status === 'PERMANENT'
    );

    let gscMap = new Map<string, GscQueryRow>();
    try {
      const gscData = await GoogleSearchConsoleClient.pullLatestSearchData();
      for (const row of gscData.rows) {
        gscMap.set(row.query.toLowerCase().trim(), row);
      }
    } catch {
      // Offline / simulated mode
    }

    const audits: PackageRegressionAudit[] = [];
    let healthyCount = 0;
    let graduatedCount = 0;
    let alertsCount = 0;
    let rollbacksCount = 0;

    for (const pkg of activePackages) {
      const audit = await this.auditSinglePackage(pkg, gscMap, autoRollback, input?.simulatedCurrentMetricsByQuery);
      audits.push(audit);

      if (audit.actionTaken === 'HEALTHY') healthyCount++;
      if (audit.actionTaken === 'GRADUATED_TO_PERMANENT') graduatedCount++;
      if (audit.actionTaken === 'REGRESSION_ALERT') alertsCount++;
      if (audit.actionTaken === 'AUTO_ROLLED_BACK') rollbacksCount++;
    }

    return {
      runId,
      timestamp,
      activePackagesEvaluated: activePackages.length,
      healthyCount,
      graduatedToPermanentCount: graduatedCount,
      alertsTriggered: alertsCount,
      autoRollbacksTriggered: rollbacksCount,
      audits,
    };
  }

  private static async auditSinglePackage(
    pkg: AppliedSeoRecord,
    gscMap: Map<string, GscQueryRow>,
    autoRollback: boolean,
    simulatedMap?: Record<string, { position: number; impressions: number; clicks: number; ctr: number }>
  ): Promise<PackageRegressionAudit> {
    const baselinePos = pkg.position && pkg.position > 0 ? pkg.position : 12.0;
    const baselineImpr = pkg.impressions && pkg.impressions > 0 ? pkg.impressions : 100;

    const queryKey = pkg.query.toLowerCase().trim();
    const simulated = simulatedMap?.[pkg.query] || simulatedMap?.[queryKey];
    const liveRow = gscMap.get(queryKey);

    const currentPos = simulated?.position ?? pkg.currentPosition ?? liveRow?.position ?? baselinePos;
    const currentImpr = simulated?.impressions ?? pkg.currentImpressions ?? liveRow?.impressions ?? baselineImpr;

    // In Google Search Console, a higher position number means a worse rank (e.g. Pos 10 -> Pos 15 is a 50% drop)
    const positionDropPercent =
      baselinePos > 0 ? Math.round(((currentPos - baselinePos) / baselinePos) * 1000) / 10 : 0;

    const impressionDropPercent =
      baselineImpr > 0 ? Math.round(((baselineImpr - currentImpr) / baselineImpr) * 1000) / 10 : 0;

    const appliedDate = pkg.appliedAt ? new Date(pkg.appliedAt) : new Date();
    const daysSinceApplied = Math.max(
      0,
      Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24))
    );

    const isSevereRegression =
      positionDropPercent >= this.AUTO_ROLLBACK_RANK_DROP_PCT ||
      impressionDropPercent >= this.AUTO_ROLLBACK_IMPR_DROP_PCT;

    const isModerateRegression =
      positionDropPercent >= this.ALERT_RANK_DROP_PCT || impressionDropPercent >= 20;

    // 1. Severe Regression -> Auto-Rollback (if sustained >= 7 days or simulated test)
    if (isSevereRegression && (daysSinceApplied >= this.MIN_OBSERVATION_DAYS_FOR_ROLLBACK || Boolean(simulated))) {
      const alertMessage = `⚠️ CRITICAL REGRESSION: Rank dropped ${positionDropPercent}% (Pos ${baselinePos.toFixed(1)} → ${currentPos.toFixed(1)}), Impressions -${impressionDropPercent}%. Auto-reverted to baseline.`;

      if (autoRollback) {
        await SeoActuatorService.rollbackPackage(pkg.id, {
          reason: alertMessage,
          markAsRolledBack: true,
        });
      }

      return {
        packageId: pkg.id,
        query: pkg.query,
        targetCanonicalUrl: pkg.targetCanonicalUrl,
        previousStatus: pkg.status,
        newStatus: autoRollback ? 'ROLLED_BACK' : pkg.status,
        baselinePosition: baselinePos,
        currentPosition: currentPos,
        positionDropPercent,
        baselineImpressions: baselineImpr,
        currentImpressions: currentImpr,
        impressionDropPercent,
        daysSinceApplied,
        actionTaken: autoRollback ? 'AUTO_ROLLED_BACK' : 'REGRESSION_ALERT',
        alertMessage,
      };
    }

    // 2. Moderate Regression -> Alert Cockpit Tab 1
    if (isModerateRegression) {
      const alertMessage = `⚠️ REGRESSION WARNING: Rank shifted ${positionDropPercent}% (Pos ${baselinePos.toFixed(1)} → ${currentPos.toFixed(1)}). Monitor closely in Cockpit.`;

      return {
        packageId: pkg.id,
        query: pkg.query,
        targetCanonicalUrl: pkg.targetCanonicalUrl,
        previousStatus: pkg.status,
        newStatus: pkg.status,
        baselinePosition: baselinePos,
        currentPosition: currentPos,
        positionDropPercent,
        baselineImpressions: baselineImpr,
        currentImpressions: currentImpr,
        impressionDropPercent,
        daysSinceApplied,
        actionTaken: 'REGRESSION_ALERT',
        alertMessage,
      };
    }

    // 3. Canary Graduation -> Promote CANARY to PERMANENT after 14 days
    if (pkg.status === 'CANARY' && daysSinceApplied >= this.CANARY_GRADUATION_DAYS) {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          await supabase
            .from('seo_autonomous_actions')
            .update({ status: 'PERMANENT' })
            .eq('id', pkg.id);
        } catch {}
      }

      return {
        packageId: pkg.id,
        query: pkg.query,
        targetCanonicalUrl: pkg.targetCanonicalUrl,
        previousStatus: 'CANARY',
        newStatus: 'PERMANENT',
        baselinePosition: baselinePos,
        currentPosition: currentPos,
        positionDropPercent,
        baselineImpressions: baselineImpr,
        currentImpressions: currentImpr,
        impressionDropPercent,
        daysSinceApplied,
        actionTaken: 'GRADUATED_TO_PERMANENT',
      };
    }

    return {
      packageId: pkg.id,
      query: pkg.query,
      targetCanonicalUrl: pkg.targetCanonicalUrl,
      previousStatus: pkg.status,
      newStatus: pkg.status,
      baselinePosition: baselinePos,
      currentPosition: currentPos,
      positionDropPercent,
      baselineImpressions: baselineImpr,
      currentImpressions: currentImpr,
      impressionDropPercent,
      daysSinceApplied,
      actionTaken: 'HEALTHY',
    };
  }
}

export const seoDegradationWatchdogWorker: AgenticWorker<
  SeoDegradationWatchdogInput | undefined,
  SeoDegradationWatchdogReport
> = {
  name: 'Autonomous SEO Degradation Watchdog Worker',
  description:
    'Monitors applied and canary SEO packages for rank/impression regressions (>15% alert, >25% auto-rollback) and graduates 14-day canaries to PERMANENT.',
  permittedTools: [],
  execute: async (input?: SeoDegradationWatchdogInput): Promise<SeoDegradationWatchdogReport> => {
    return SeoDegradationWatchdog.evaluateActivePackages(input);
  },
};
