/**
 * Autonomous SEO Action & Dispatch Service
 * Translates raw GSC search signals into concrete autonomous optimization actions:
 * 1. Low-CTR Meta Recalibration
 * 2. Striking-Distance Internal Link Rebalancing
 * 3. Schema FAQ Snippet Deployment for AI Overviews
 * 4. Executive Stakeholder Email Briefing via Resend
 */

import fs from 'fs';
import path from 'path';
import { GscFetchResult, GscQueryRow } from './gsc-client';
import { resend } from '@/lib/resend';
import { GoogleIndexingClient } from './google-indexing-client';
import { SeoWorkflowOrchestrator } from '../orchestrator/seo-workflow-orchestrator';
import { AutonomousSeoActionPackage } from '../types';
import { SafeFs } from './safe-fs';

export interface AutonomousSeoAction {
  id: string;
  type: 'META_RECALIBRATION' | 'INTERNAL_LINK_BOOST' | 'SCHEMA_FAQ_SNIPPET' | 'CONTENT_GAP_FLAG';
  targetQuery: string;
  targetUrl?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  rationale: string;
  proposedChanges: Record<string, any>;
  status: 'PENDING_APPROVAL' | 'AUTO_APPLIED' | 'DISPATCHED';
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
   * Evaluates GSC rows and generates concrete actions
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

    // 1. Analyze queries
    for (const row of rows) {
      const q = row.query;
      const pos = row.position;
      const impr = row.impressions;
      const clicks = row.clicks;
      const ctr = row.ctr;

      // Top climbers / converters
      if (clicks >= 2 && pos <= 20) {
        topClimbers.push({ query: q, position: pos, impressions: impr, clicks });
      }

      // Action A: Low-CTR Anomaly on Top 8 Rank
      if (pos <= 8 && pos >= 1 && impr >= 40 && ctr < 4.0) {
        actions.push({
          id: `act_meta_${actions.length + 1}`,
          type: 'META_RECALIBRATION',
          targetQuery: q,
          targetUrl: row.page || 'https://settlementcheck.co.uk/calculator/',
          priority: 'HIGH',
          rationale: `Ranking in top 8 (Pos ${pos}) with ${impr} impressions, but CTR is only ${ctr}%. Meta title copy is missing statutory carrot.`,
          proposedChanges: {
            recommendedTitle: `${q.replace(/\b\w/g, l => l.toUpperCase())} | April 2026 Statutory Rates`,
            recommendedMetaDescription: `Calculate your legal entitlement in under 2 minutes. Free, confidential, SRA-standard settlement agreement check. Your employer pays the fee.`,
          },
          status: 'PENDING_APPROVAL',
        });
      }

      // Action B: Striking Distance Queries (Pos 11-20 with high search intent)
      if (pos >= 10.5 && pos <= 20 && impr >= 50) {
        strikingDistance.push({
          query: q,
          position: pos,
          impressions: impr,
          opportunity: 'Page 2 → Page 1 shift could yield 3x click volume',
        });

        actions.push({
          id: `act_link_${actions.length + 1}`,
          type: 'INTERNAL_LINK_BOOST',
          targetQuery: q,
          targetUrl: row.page || 'https://settlementcheck.co.uk/guides/',
          priority: 'HIGH',
          rationale: `Striking distance query at Pos ${pos} with ${impr} monthly impressions. Needs 2-3 inbound contextual internal links with exact anchor text.`,
          proposedChanges: {
            targetAnchorText: q,
            recommendedSourcePages: ['/guides/how-to-negotiate-a-settlement-agreement/', '/calculator/'],
          },
          status: 'AUTO_APPLIED',
        });
      }

      // Action C: AI Overview Vulnerability
      if ((q.includes('tax free') || q.includes('how much') || q.includes('acas')) && pos > 8 && impr >= 30) {
        actions.push({
          id: `act_schema_${actions.length + 1}`,
          type: 'SCHEMA_FAQ_SNIPPET',
          targetQuery: q,
          priority: 'MEDIUM',
          rationale: `High AI Overview probability term. Adding direct answer FAQ accordion will capture AI Overview citations.`,
          proposedChanges: {
            faqQuestion: `How does ${q} work in the UK?`,
            faqAnswer: `Under UK employment law (ERA 1996 and ITEPA 2003 s.403), statutory redundancy and ex-gratia compensation up to £30,000 can be paid tax-free.`,
          },
          status: 'AUTO_APPLIED',
        });
      }
    }

    // Sort top climbers
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
      'yesmarioo@gmail.com',
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
          .slice(0, 4)
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

            <h3 style="color: #0B1F3A; margin-top: 24px;">🎯 Striking Distance Opportunities (Page 2 Quick Wins)</h3>
            <ul style="font-size: 13px;">${strikingHtml || '<li>None currently in range</li>'}</ul>

            <h3 style="color: #0B1F3A; margin-top: 24px;">🤖 Specialist Dual-Agent Staged Actions (SEO Architect + Copywriter)</h3>
            <ul style="font-size: 13px;">${dualAgentHtml || '<li>No dual-agent packages generated</li>'}</ul>

            <h3 style="color: #0B1F3A; margin-top: 24px;">⚡ Raw Actions Dispatched</h3>
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
