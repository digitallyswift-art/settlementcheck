/**
 * Autonomous SEO Action & Dispatch Service
 * Translates raw GSC search signals into concrete autonomous strategic actions:
 * 1. Content Depth Upgrades (Interactive Calculators & Statutory Comparison Tables)
 * 2. Digital PR Pitches (MoJ Tribunal Backlog Tracker, Statutory Rates Archive, UK Settlement Index)
 * 3. Schema FAQ Snippet Deployment for AI Overviews
 * 4. Executive Stakeholder Email Briefing via Resend
 * 5. Strict canonical route enforcement (completely decoupling / from /calculator/)
 */

import fs from 'fs';
import path from 'path';
import { GscFetchResult, GscQueryRow } from './gsc-client';
import { resend } from '@/lib/resend';
import { GoogleIndexingClient } from './google-indexing-client';
import { SeoWorkflowOrchestrator } from '../orchestrator/seo-workflow-orchestrator';
import {
  AutonomousSeoActionPackage,
  SeoActionType,
  DigitalPrPitchBrief,
  ContentDepthUpgradeBrief,
} from '../types';
import { SafeFs } from './safe-fs';
import { SeoArchitectAgent } from '../agents/seo-architect-agent';
import { SeoPolicyRegistry } from './seo-policy-registry';
import { SeoActuatorService } from './seo-actuator-service';
import { ConversionCopywriterAgent } from '../agents/conversion-copywriter-agent';

export interface AutonomousSeoAction {
  id: string;
  type: SeoActionType;
  targetQuery: string;
  targetUrl: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  rationale: string;
  proposedChanges: Record<string, any>;
  status: 'PENDING_APPROVAL' | 'AUTO_APPLIED' | 'DISPATCHED';
  digitalPrPitch?: DigitalPrPitchBrief;
  contentDepthUpgrade?: ContentDepthUpgradeBrief;
}

export interface AutonomousRunDigest {
  runId: string;
  executedAt: string;
  dataSource: string;
  period: { start: string; end: string };
  metrics: {
    totalQueries: number;
    totalImpressions: number;
    totalClicks: number;
    avgCtr: number;
    avgPosition: number;
  };
  topClimbers: { query: string; position: number; impressions: number; clicks: number }[];
  strikingDistanceQueries: { query: string; position: number; impressions: number; opportunity: string }[];
  actionsTaken: AutonomousSeoAction[];
  dualAgentPackages?: AutonomousSeoActionPackage[];
  stagedMarkdownPath?: string;
  emailNotificationSent: boolean;
}

export class AutonomousSeoActionService {
  /**
   * Resolves target canonical URL ensuring commercial calculator queries strictly map to
   * /calculator/ (or dedicated calculator routes) and never cannibalize the root homepage (/).
   */
  public static resolveSafeTargetUrl(query: string, rawPage?: string): string {
    const q = query.toLowerCase().trim();

    // Commercial calculator queries strictly map to /calculator/ and NEVER /
    const isCommercialCalc =
      q === 'settlement agreement calculator' ||
      q === 'calculate settlement agreement' ||
      q === 'settlement calculator' ||
      q === 'settlement agreement calculator uk' ||
      q === 'settlement agreement calculators' ||
      q === 'calculate my settlement agreement' ||
      (q.includes('settlement') && (q.includes('calculator') || q.includes('calculate')));

    if (
      isCommercialCalc &&
      !q.includes('tax') &&
      !q.includes('redundancy') &&
      !q.includes('compromise') &&
      !q.includes('pip') &&
      !q.includes('unfair') &&
      !q.includes('protective')
    ) {
      return 'https://settlementcheck.co.uk/calculator/';
    }

    if (q.includes('tax') && (q.includes('calculator') || q.includes('calc'))) {
      return 'https://settlementcheck.co.uk/settlement-agreement-tax-calculator/';
    }
    if (q.includes('redundancy') && (q.includes('calculator') || q.includes('calc') || q.includes('redundancy pay'))) {
      return 'https://settlementcheck.co.uk/redundancy-calculator/';
    }
    if (q.includes('compromise') && (q.includes('calculator') || q.includes('calc'))) {
      return 'https://settlementcheck.co.uk/guides/compromise-agreement-calculator-uk/';
    }
    if (q.includes('pip') && (q.includes('calculator') || q.includes('calc'))) {
      return 'https://settlementcheck.co.uk/pip-settlement-calculator/';
    }
    if (q.includes('unfair dismissal') && (q.includes('calculator') || q.includes('calc'))) {
      return 'https://settlementcheck.co.uk/unfair-dismissal-calculator/';
    }
    if (q.includes('protective award')) {
      return 'https://settlementcheck.co.uk/protective-award-calculator/';
    }

    // Check if rawPage provided in GSC is root '/' or missing, prevent root cannibalization
    if (rawPage && rawPage.startsWith('http')) {
      try {
        const parsed = new URL(rawPage);
        let p = parsed.pathname;
        if (!p.endsWith('/')) p = `${p}/`;
        if (p !== '/' && p !== '') {
          return `https://settlementcheck.co.uk${p}`;
        }
      } catch {}
    }

    // Fall back to canonical route classification
    const intent = SeoArchitectAgent.classifyIntent(query);
    const route = SeoArchitectAgent.resolveCanonicalRoute(query, intent, rawPage);
    if (route === '/') {
      return 'https://settlementcheck.co.uk/calculator/';
    }
    return `https://settlementcheck.co.uk${route}`;
  }

  /**
   * Checks whether a page has its <title> calibrated or locked by policy,
   * in order to filter out repetitive, cosmetic title tweaks.
   */
  public static isTitleCalibrated(url: string, query: string): boolean {
    const norm = SeoActuatorService.normalizePath(url);
    if (SeoPolicyRegistry.isRouteTitleLocked(url, query, query)) {
      return true;
    }
    const calibratedRoutes = new Set([
      '/',
      '/calculator/',
      '/settlement-agreement-tax-calculator/',
      '/redundancy-calculator/',
      '/protective-award-calculator/',
      '/pip-settlement-calculator/',
      '/unfair-dismissal-calculator/',
      '/constructive-dismissal-calculator/',
      '/guides/how-to-negotiate-a-settlement-agreement/',
      '/guides/tax-free-settlement-30000/',
      '/guides/settlement-agreement-how-much/',
      '/guides/average-settlement-agreement-payout-uk/',
      '/guides/redundancy-pay-cap-2026/',
      '/guides/compromise-agreement-calculator-uk/',
      '/tribunal-backlog-tracker/',
      '/statutory-rates-history/',
      '/reports/uk-settlement-index-2026/',
    ]);
    return calibratedRoutes.has(norm);
  }

  /**
   * Evaluates GSC rows and generates concrete macro strategic actions:
   * - CONTENT_DEPTH_UPGRADE (interactive tools & comparison tables)
   * - DIGITAL_PR_PITCH (data assets pitched to legal/HR journalists)
   * - Filters out cosmetic title rewrites on calibrated pages
   */
  public static async executeActionPipeline(
    gscData: GscFetchResult,
    options?: { sendEmail?: boolean; recipientEmail?: string; batchLimit?: number }
  ): Promise<AutonomousRunDigest> {
    const runId = `digest_${Date.now()}`;
    const executedAt = new Date().toISOString();
    const rows = gscData.rows;

    const actions: AutonomousSeoAction[] = [];
    const strikingDistance: { query: string; position: number; impressions: number; opportunity: string }[] = [];
    const topClimbers: { query: string; position: number; impressions: number; clicks: number }[] = [];

    for (const row of rows) {
      const q = row.query;
      const pos = row.position;
      const impr = row.impressions;
      const clicks = row.clicks;
      const ctr = row.ctr;
      const targetUrl = this.resolveSafeTargetUrl(q, row.page);
      const isCalibrated = this.isTitleCalibrated(targetUrl, q);

      // Top climbers / converters
      if (clicks >= 2 && pos <= 20) {
        topClimbers.push({ query: q, position: pos, impressions: impr, clicks });
      }

      // Track striking distance queries (Pos 9.5 to 20 with significant search demand)
      if (pos >= 9.5 && pos <= 20 && impr >= 35) {
        strikingDistance.push({
          query: q,
          position: pos,
          impressions: impr,
          opportunity: 'Page 2 -> Page 1 move could multiply click volume 3x',
        });

        const lowerQ = q.toLowerCase();
        const isDisputeOrPr =
          lowerQ.includes('tribunal') ||
          lowerQ.includes('backlog') ||
          lowerQ.includes('rights') ||
          lowerQ.includes('unfair') ||
          lowerQ.includes('discrimination') ||
          lowerQ.includes('average') ||
          lowerQ.includes('delay') ||
          actions.length % 2 === 1;

        if (isDisputeOrPr) {
          // Macro Action: DIGITAL_PR_PITCH
          const asset =
            lowerQ.includes('rate') || lowerQ.includes('history')
              ? '/statutory-rates-history/'
              : lowerQ.includes('index') || lowerQ.includes('average') || lowerQ.includes('payout')
              ? '/reports/uk-settlement-index-2026/'
              : '/tribunal-backlog-tracker/';

          const prBrief: DigitalPrPitchBrief = {
            pitchAngle:
              'MoJ Employment Tribunal backlog delays (averaging 48+ weeks) making pre-tribunal settlement agreements the commercial standard in 2026',
            targetJournalists:
              'Legal & HR Correspondents at Personnel Today, People Management, Law Society Gazette, Employment Law Journal',
            hookHeadline:
              'UK Employment Tribunal Backlog Reaches 500+ Day Delays as April 2026 Statutory Rates Rise to £751/wk',
            keyStatSummary:
              'MoJ data reveals multi-year delays across regional tribunals; statutory weekly redundancy cap reaches £751 and compensatory cap £123,543 from 6 April 2026.',
            sourceDataAsset: asset,
            recommendedOutreachCopy:
              'Pitch exclusive data from SettlementCheck tracking MoJ backlog delays to legal journalists, demonstrating why employers and employees are actively settling prior to tribunal claims.',
          };

          actions.push({
            id: `act_pr_${actions.length + 1}`,
            type: 'DIGITAL_PR_PITCH',
            targetQuery: q,
            targetUrl,
            priority: impr >= 100 ? 'CRITICAL' : 'HIGH',
            rationale: `Striking distance query at Pos ${pos.toFixed(1)} with ${impr} monthly impressions. Securing editorial press citations to our authoritative data asset (${asset}) will pass high-trust topical PageRank and move this term onto Page 1.`,
            proposedChanges: {
              ...prBrief,
              targetDataAsset: asset,
            },
            digitalPrPitch: prBrief,
            status: 'PENDING_APPROVAL',
          });
        } else {
          // Macro Action: CONTENT_DEPTH_UPGRADE
          const toolToEmbed =
            lowerQ.includes('tax') || lowerQ.includes('30000')
              ? '/settlement-agreement-tax-calculator/'
              : lowerQ.includes('redundancy')
              ? '/redundancy-calculator/'
              : '/calculator/';

          const upgradeBrief: ContentDepthUpgradeBrief = {
            recommendedModule:
              lowerQ.includes('tax') || lowerQ.includes('how much')
                ? 'STATUTORY_WORKED_TABLE'
                : 'INTERACTIVE_CALCULATOR_CARD',
            targetSectionH2: 'Calculate Your Statutory Baseline Under April 2026 Rates',
            interactiveToolToEmbed: toolToEmbed,
            proposedTableSummary:
              'Official 3-tier comparison matrix: Tier 1 Statutory Redundancy (ERA 1996 s.162, £751/wk cap) vs Tier 2 Notice Pay PILON (taxable under s.402D) vs Tier 3 Genuine Compensation (tax-free up to £30k under s.403 ITEPA 2003)',
            expectedUserValueBenefit:
              'Delivers immediate self-service mathematical clarity to stressed employees, drastically reducing bounce rate and proving experiential depth to search engines.',
          };

          actions.push({
            id: `act_depth_${actions.length + 1}`,
            type: 'CONTENT_DEPTH_UPGRADE',
            targetQuery: q,
            targetUrl,
            priority: impr >= 80 ? 'CRITICAL' : 'HIGH',
            rationale: `Striking distance query at Pos ${pos.toFixed(1)} with ${impr} monthly impressions. Google SERP rewards high-information-gain experiential tools over passive text. Embedding an interactive calculator card and statutory comparison table will capture Page 1 rankings.`,
            proposedChanges: {
              ...upgradeBrief,
            },
            contentDepthUpgrade: upgradeBrief,
            status: 'PENDING_APPROVAL',
          });
        }
      }

      // Action C: AI Overview & Featured Snippet Capture
      if ((q.includes('tax free') || q.includes('how much') || q.includes('acas') || q.includes('statutory')) && pos > 7 && impr >= 30) {
        actions.push({
          id: `act_schema_${actions.length + 1}`,
          type: 'SCHEMA_FAQ_SNIPPET',
          targetQuery: q,
          targetUrl,
          priority: 'MEDIUM',
          rationale: `High probability AI Overview search term. Adding an Answer-First FAQ accordion captures Google AI Overview citations and featured snippets.`,
          proposedChanges: {
            faqQuestion: `How does ${q} work in the UK?`,
            faqAnswer: `Under UK employment law (Employment Rights Act 1996 and ITEPA 2003 s.403), statutory redundancy is capped at £751 per week from April 2026, while genuine ex-gratia compensation up to £30,000 can be paid tax-free. Contractual notice pay (PILON) remains subject to tax and National Insurance under Section 402D.`,
          },
          status: 'AUTO_APPLIED',
        });
      }

      // Trivial cosmetic title rewrites are explicitly filtered out for calibrated pages
      if (pos <= 8 && pos >= 1 && impr >= 40 && ctr < 4.0 && !isCalibrated) {
        const calibratedTitle = ConversionCopywriterAgent.craftCalibratedTitle(q);
        const calibratedMeta = ConversionCopywriterAgent.craftCalibratedMetaDescription(q);
        actions.push({
          id: `act_meta_${actions.length + 1}`,
          type: 'META_RECALIBRATION',
          targetQuery: q,
          targetUrl,
          priority: 'HIGH',
          rationale: `Ranking in top 8 (Pos ${pos.toFixed(1)}) with ${impr} impressions, but CTR is only ${ctr}%. Route title is uncalibrated. Recalibrating with verified statutory rate envelope.`,
          proposedChanges: {
            recommendedTitle: calibratedTitle,
            recommendedMetaDescription: calibratedMeta,
          },
          status: 'PENDING_APPROVAL',
        });
      }
    }

    // Sort top lists
    topClimbers.sort((a, b) => b.clicks - a.clicks);
    strikingDistance.sort((a, b) => b.impressions - a.impressions);

    // Save actions snapshot safely to disk / /tmp
    const actionsDir = path.resolve('data/serp-actions');
    const actionLogPath = path.join(actionsDir, `actions-${executedAt.replace(/[:.]/g, '-')}.json`);
    SafeFs.writeFileSyncSafe(actionLogPath, JSON.stringify(actions, null, 2));

    // Calculate overall metrics
    const totalImpr = gscData.totalImpressions;
    const totalClicks = gscData.totalClicks;
    const avgCtr = totalImpr > 0 ? Math.round((totalClicks / totalImpr) * 10000) / 100 : 0;
    const avgPosition =
      rows.length > 0 ? Math.round((rows.reduce((acc, r) => acc + r.position, 0) / rows.length) * 10) / 10 : 0;

    // 2. Execute Specialist SEO Architect & Conversion Copywriter Dual-Agent Loop
    let dualAgentPackages: AutonomousSeoActionPackage[] = [];
    let stagedMarkdownPath = '';
    try {
      const dualResult = await SeoWorkflowOrchestrator.executeDualAgentWorkflow(gscData, { limit: options?.batchLimit ?? 8 });
      dualAgentPackages = dualResult.packagesCreated;
      stagedMarkdownPath = dualResult.stagedMarkdownPath;
    } catch (dualErr) {
      console.warn('Dual-agent orchestration error:', dualErr);
    }

    let emailSent = false;
    let recipients: string[] = [
      'support@digitallyswift.com',
      'digitallyswift@gmail.com',
    ];

    if (options?.recipientEmail) {
      recipients = [options.recipientEmail];
    } else if (process.env.SEO_ALERT_EMAILS) {
      recipients = process.env.SEO_ALERT_EMAILS.split(',').map(e => e.trim()).filter(Boolean);
    } else if (process.env.SEO_ALERT_EMAIL) {
      const envEmails = process.env.SEO_ALERT_EMAIL.split(',').map(e => e.trim()).filter(Boolean);
      recipients = Array.from(new Set([...recipients, ...envEmails]));
    }

    // 3. Dispatch Executive Email Report via Resend
    if (options?.sendEmail !== false && process.env.RESEND_API_KEY) {
      try {
        const topClimbersHtml = topClimbers
          .slice(0, 5)
          .map(
            c =>
              `<li><strong>"${c.query}"</strong>: ${c.clicks} clicks, ${c.impressions} impr (Pos ${c.position.toFixed(1)})</li>`
          )
          .join('');

        const strikingHtml = strikingDistance
          .slice(0, 5)
          .map(
            s =>
              `<li><strong>"${s.query}"</strong>: Pos ${s.position.toFixed(1)} (${s.impressions} impressions) - <em>${s.opportunity}</em></li>`
          )
          .join('');

        const dualAgentHtml = dualAgentPackages
          .slice(0, 4)
          .map(
            p =>
              `<li><span style="color:#0B1F3A;font-weight:bold;">[${p.actionType}]</span> <strong>"${p.query}"</strong> (${p.status})<br/>
              <span style="color:#555;font-size:12px;">Title: ${p.copyPackage.calibratedTitle}</span><br/>
              <span style="color:#555;font-size:12px;">Target: ${p.seoTechnicalBrief.targetCanonicalUrl}</span></li>`
          )
          .join('');

        const actionsHtml = actions
          .slice(0, 6)
          .map(
            a =>
              `<li><span style="color:#D9603B;font-weight:bold;">[${a.type}]</span> <strong>${a.targetQuery}</strong>: ${a.rationale}</li>`
          )
          .join('');

        const html = `
          <div style="font-family: sans-serif; color: #0B1F3A; max-width: 600px; line-height: 1.5;">
            <h2 style="color: #0B1F3A; border-bottom: 2px solid #D9603B; padding-bottom: 8px;">
              🛡️ SettlementCheck Autonomous SEO Intelligence Report
            </h2>
            <p style="font-size: 14px; color: #555;">
              <strong>Data Source:</strong> ${gscData.source} | <strong>Reporting Period:</strong> ${gscData.startDate} to ${gscData.endDate}
            </p>

            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
              <tr style="background: #F7F4EE;">
                <th style="padding: 8px; border: 1px solid #ddd;">Total Impressions</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Total Clicks</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Site Average CTR</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Avg Rank</th>
              </tr>
              <tr style="text-align: center;">
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${totalImpr.toLocaleString('en-GB')}</td>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #D9603B;">${totalClicks.toLocaleString('en-GB')}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${avgCtr}%</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${avgPosition}</td>
              </tr>
            </table>

            <h3 style="color: #0B1F3A; margin-top: 24px;">📈 Top Click Drivers</h3>
            <ul style="font-size: 13px;">${topClimbersHtml || '<li>No click data recorded</li>'}</ul>

            <h3 style="color: #0B1F3A; margin-top: 24px;">🎯 Striking Distance Opportunities (Page 2 Macro Actions)</h3>
            <ul style="font-size: 13px;">${strikingHtml || '<li>None currently in range</li>'}</ul>

            <h3 style="color: #0B1F3A; margin-top: 24px;">🤖 Specialist Dual-Agent Staged Actions (SEO Architect + Copywriter)</h3>
            <ul style="font-size: 13px;">${dualAgentHtml || '<li>No dual-agent packages generated</li>'}</ul>

            <h3 style="color: #0B1F3A; margin-top: 24px;">⚡ Macro Strategic Actions Dispatched</h3>
            <ul style="font-size: 13px;">${actionsHtml || '<li>All rankings optimal</li>'}</ul>

            <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 11px; color: #999;">
              Generated autonomously by SettlementCheck Sentinel Fleet · No manual human intervention.
            </p>
          </div>
        `;

        await resend.emails.send({
          from: 'SettlementCheck Sentinel <notifications@settlementcheck.co.uk>',
          to: recipients,
          subject: `🛡️ Autonomous SEO Digest: ${totalClicks} Clicks, ${totalImpr.toLocaleString('en-GB')} Impr (${gscData.source})`,
          html,
        });

        emailSent = true;
      } catch (emailErr) {
        console.warn('Resend email dispatch error:', emailErr);
      }
    }

    // 4. Trigger Google Indexing API Re-crawl Pings for target canonical routes
    if (GoogleIndexingClient.isConfigured() && dualAgentPackages && dualAgentPackages.length > 0) {
      try {
        const targetUrls = dualAgentPackages.map(p => p.seoTechnicalBrief.targetCanonicalUrl);
        GoogleIndexingClient.notifyBatch(targetUrls).catch(err => {
          console.warn('Background Google Indexing batch notification notice:', err?.message || err);
        });
      } catch (indexErr) {
        console.warn('Google Indexing API notice:', indexErr);
      }
    }

    return {
      runId,
      executedAt,
      dataSource: gscData.source,
      period: { start: gscData.startDate, end: gscData.endDate },
      metrics: {
        totalQueries: rows.length,
        totalImpressions: totalImpr,
        totalClicks,
        avgCtr,
        avgPosition,
      },
      topClimbers: topClimbers.slice(0, 10),
      strikingDistanceQueries: strikingDistance.slice(0, 10),
      actionsTaken: actions.slice(0, 15),
      dualAgentPackages,
      stagedMarkdownPath,
      emailNotificationSent: emailSent,
    };
  }
}
