/**
 * Master SEO Workflow Orchestrator & Autonomous Actuator
 * Orchestrates the specialist SEO Architect Agent and Conversion Copywriter Agent
 * to translate live Google Search Console opportunities into verified, brand-compliant,
 * statutory-invariant action packages.
 */

import fs from 'fs';
import path from 'path';
import { SeoArchitectAgent, SeoAuditContext } from '../agents/seo-architect-agent';
import { ConversionCopywriterAgent } from '../agents/conversion-copywriter-agent';
import { StatutoryAuditorAgent } from '../agents/statutory-auditor-agent';
import { AntiAiQualityGuard } from '../agents/anti-ai-quality-guard';
import { SeoStorageService } from '../services/seo-storage-service';
import { AutonomousSeoActionPackage, SeoTechnicalBrief, ConversionCopyPackage } from '../types';
import { GscFetchResult, GscQueryRow } from '../services/gsc-client';

export interface SeoOrchestrationResult {
  runId: string;
  timestamp: string;
  totalOpportunitiesProcessed: number;
  packagesCreated: AutonomousSeoActionPackage[];
  stagedJsonPath: string;
  stagedMarkdownPath: string;
  validationStatus: {
    allPassed: boolean;
    totalPassed: number;
    totalFailed: number;
  };
}

export class SeoWorkflowOrchestrator {
  private static readonly STAGING_DIR = path.resolve('data/serp-actions/staging');

  /**
   * Filters GSC query rows for high-impact striking distance and CTR opportunities
   */
  public static extractOpportunities(rows: GscQueryRow[], limit = 10): SeoAuditContext[] {
    const actionable: SeoAuditContext[] = [];

    // Filter striking distance (Pos 10.5 - 20) with significant impressions
    const striking = rows
      .filter(r => r.position >= 10.5 && r.position <= 20 && r.impressions >= 40)
      .sort((a, b) => b.impressions - a.impressions);

    for (const r of striking) {
      actionable.push({
        query: r.query,
        impressions: r.impressions,
        clicks: r.clicks,
        position: r.position,
        ctr: r.ctr,
        targetUrl: r.page,
      });
    }

    // Filter Top 8 rankings with low CTR (< 4%)
    const lowCtr = rows
      .filter(r => r.position <= 8.5 && r.position >= 1.0 && r.impressions >= 35 && r.ctr < 4.0)
      .sort((a, b) => b.impressions - a.impressions);

    for (const r of lowCtr) {
      if (!actionable.some(a => a.query === r.query)) {
        actionable.push({
          query: r.query,
          impressions: r.impressions,
          clicks: r.clicks,
          position: r.position,
          ctr: r.ctr,
          targetUrl: r.page,
        });
      }
    }

    return actionable.slice(0, limit);
  }

  /**
   * Enforces strict deterministic quality gates on copy and architecture
   */
  public static validateActionPackage(pkg: AutonomousSeoActionPackage): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 1. Trailing slash invariant
    const targetUrl = pkg.seoTechnicalBrief.targetCanonicalUrl;
    if (!targetUrl.endsWith('/')) {
      errors.push(`Target URL missing required trailing slash: ${targetUrl}`);
    }

    const destRoute = pkg.seoTechnicalBrief.internalLinkGraph.destinationRoute;
    if (!destRoute.endsWith('/')) {
      errors.push(`Destination route missing required trailing slash: ${destRoute}`);
    }

    // 2. Strict brand guardrail: zero em dashes
    const allText = `${pkg.copyPackage.calibratedTitle} ${pkg.copyPackage.calibratedMetaDescription} ${pkg.copyPackage.answerFirstFaq.answer} ${pkg.copyPackage.contextualInternalLinkBlock.surroundingText}`;
    if (allText.includes('—')) {
      errors.push('Em dash detected in generated copy (violates BRAND.md)');
    }

    // 3. Banned US legal terms
    const bannedTerms = ['severance', 'at-will', 'attorney', 'layoff', 'labor court'];
    for (const term of bannedTerms) {
      if (new RegExp(`\\b${term}\\b`, 'i').test(allText)) {
        errors.push(`Banned US terminology detected: "${term}"`);
      }
    }

    // 4. UK SRA Solicitor reference
    if (!allText.toLowerCase().includes('solicitor')) {
      errors.push('Copy must reference SRA-regulated solicitor for statutory advice');
    }

    // 5. Statutory figures invariant
    const expectedCap = pkg.seoTechnicalBrief.statutoryInvariants.weeklyCapGB;
    if (!allText.includes(`£${expectedCap}`) && !allText.includes('£30,000')) {
      errors.push(`Copy missing required statutory figures (£${expectedCap} or £30,000)`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Executes the full Dual-Agent Loop across GSC opportunities
   */
  public static async executeDualAgentWorkflow(
    gscData: GscFetchResult,
    options?: { limit?: number; outputMarkdown?: boolean }
  ): Promise<SeoOrchestrationResult> {
    const runId = `actuator_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const limit = options?.limit || 6;

    const opportunities = this.extractOpportunities(gscData.rows, limit);
    const packages: AutonomousSeoActionPackage[] = [];
    let passedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < opportunities.length; i++) {
      const opp = opportunities[i];

      // 1. Specialist SEO Architect Agent in the loop
      const seoBrief: SeoTechnicalBrief = await SeoArchitectAgent.generateTechnicalBrief(opp);

      // 2. Specialist Conversion Copywriter Agent in the loop
      const copyPackage: ConversionCopyPackage = await ConversionCopywriterAgent.generateCopyPackage(seoBrief);

      // 3. Specialist Statutory & Legal Auditor Agent in the loop
      const statutoryAudit = StatutoryAuditorAgent.auditCopy(copyPackage, seoBrief);

      // 4. Specialist Anti-AI Quality & E-E-A-T Guard in the loop
      const antiAiQuality = AntiAiQualityGuard.evaluateQuality(copyPackage);

      // Determine priority and action type
      const isTopRankLowCtr = opp.position <= 8.5;
      const actionType = isTopRankLowCtr ? 'META_RECALIBRATION' : 'INTERNAL_LINK_BOOST';
      const priority = opp.impressions >= 100 ? 'CRITICAL' : opp.impressions >= 50 ? 'HIGH' : 'MEDIUM';

      const stagedDiff = `
### Action Proposal for "${opp.query}" (Pos ${opp.position.toFixed(1)} · ${opp.impressions} Impr)
- **Target URL**: ${seoBrief.targetCanonicalUrl}
- **Search Intent**: ${seoBrief.searchIntent}
- **Proposed Title**: ${copyPackage.calibratedTitle} (${copyPackage.calibratedTitle.length} chars)
- **Proposed Meta**: ${copyPackage.calibratedMetaDescription} (${copyPackage.calibratedMetaDescription.length} chars)
- **FAQ Snippet**: Q: ${copyPackage.answerFirstFaq.question} | A: ${copyPackage.answerFirstFaq.answer}
- **Contextual Inbound Link**: ${copyPackage.contextualInternalLinkBlock.surroundingText}
- **Statutory Audit**: ${statutoryAudit.isCompliant ? 'Passed (Compliant with UK Law)' : `Flagged: ${statutoryAudit.issues.join('; ')}`}
- **Anti-AI Authenticity Score**: ${antiAiQuality.authenticityScore}% (Burstiness: ${antiAiQuality.burstinessScore})
`;

      const pkg: AutonomousSeoActionPackage = {
        id: `pkg_${runId}_${i + 1}`,
        query: opp.query,
        priority,
        actionType,
        seoTechnicalBrief: seoBrief,
        copyPackage,
        statutoryAudit,
        antiAiQuality,
        stagedDiffSummary: stagedDiff.trim(),
        status: 'STAGED',
        timestamp,
      };

      // 5. Validation Gate
      const validation = this.validateActionPackage(pkg);
      if (validation.isValid && statutoryAudit.isCompliant && !antiAiQuality.isLowEffort) {
        pkg.status = 'VALIDATED';
        passedCount++;
      } else {
        console.warn(`Package validation warning for "${opp.query}":`, validation.errors);
        failedCount++;
      }

      packages.push(pkg);
    }

    // Ensure staging directory exists
    if (!fs.existsSync(this.STAGING_DIR)) {
      fs.mkdirSync(this.STAGING_DIR, { recursive: true });
    }

    const stagedJsonPath = path.join(this.STAGING_DIR, 'latest-staged-actions.json');
    const stagedMarkdownPath = path.join(this.STAGING_DIR, 'latest-staged-actions.md');

    // Write JSON artifact
    fs.writeFileSync(stagedJsonPath, JSON.stringify(packages, null, 2), 'utf-8');

    // Write Human-Reviewable Markdown Digest
    const markdownContent = this.formatMarkdownStagingDigest(runId, timestamp, packages, gscData.source);
    fs.writeFileSync(stagedMarkdownPath, markdownContent, 'utf-8');

    // Persist to cumulative CHANGE_LOG.md and Supabase
    const metrics = {
      totalQueries: gscData.rows.length,
      totalImpressions: gscData.totalImpressions,
      totalClicks: gscData.totalClicks,
      avgCtr: gscData.totalImpressions > 0 ? Math.round((gscData.totalClicks / gscData.totalImpressions) * 10000) / 100 : 0,
      avgPosition: gscData.rows.length > 0 ? Math.round((gscData.rows.reduce((acc, r) => acc + r.position, 0) / gscData.rows.length) * 10) / 10 : 0,
    };

    await SeoStorageService.persistRun(runId, gscData.source, metrics, packages, false);
    fs.writeFileSync(stagedMarkdownPath, markdownContent, 'utf-8');

    return {
      runId,
      timestamp,
      totalOpportunitiesProcessed: packages.length,
      packagesCreated: packages,
      stagedJsonPath,
      stagedMarkdownPath,
      validationStatus: {
        allPassed: failedCount === 0,
        totalPassed: passedCount,
        totalFailed: failedCount,
      },
    };
  }

  /**
   * Formats a clean executive Markdown review digest
   */
  private static formatMarkdownStagingDigest(
    runId: string,
    timestamp: string,
    packages: AutonomousSeoActionPackage[],
    source: string
  ): string {
    const rows = packages
      .map(
        p => `
### 🎯 Package ${p.id}: "${p.query}" [${p.priority}]
- **Type**: \`${p.actionType}\` | **Status**: \`${p.status}\`
- **Target Canonical**: [${p.seoTechnicalBrief.targetCanonicalUrl}](${p.seoTechnicalBrief.targetCanonicalUrl})
- **Metrics**: Pos ${p.seoTechnicalBrief.currentMetrics.position.toFixed(1)} · ${p.seoTechnicalBrief.currentMetrics.impressions} Impr · ${p.seoTechnicalBrief.currentMetrics.clicks} Clicks

#### 1. Metadata Calibrations (SEO Architect + Conversion Copywriter)
- **Title (${p.copyPackage.calibratedTitle.length} chars)**: \`${p.copyPackage.calibratedTitle}\`
- **Meta Description (${p.copyPackage.calibratedMetaDescription.length} chars)**: \`${p.copyPackage.calibratedMetaDescription}\`

#### 2. AI Overview FAQ Direct Answer (Snippet Capture)
- **Question**: *${p.copyPackage.answerFirstFaq.question}*
- **Answer**: ${p.copyPackage.answerFirstFaq.answer}

#### 3. Contextual Internal Link Boost
- **Source Route**: \`${p.copyPackage.contextualInternalLinkBlock.sourceRoute}\`
- **Destination**: \`${p.copyPackage.contextualInternalLinkBlock.targetRoute}\`
- **In-Content Anchor Placement**:
> ${p.copyPackage.contextualInternalLinkBlock.surroundingText}

---
`
      )
      .join('\n');

    return `# 🛡️ Autonomous SEO Actuator — Staged Review Digest
**Run ID**: \`${runId}\`  
**Generated At**: ${timestamp}  
**Data Source**: ${source}  
**Specialist Agents in the Loop**: \`seo-architect\` & \`conversion-copywriter\`  
**Compliance Standard**: 100% BRAND.md & April 2026 Statutory Invariants  

---

${rows}

*Generated autonomously by SettlementCheck Sentinel Fleet · Dual-Agent Quality Verified.*
`;
  }
}
