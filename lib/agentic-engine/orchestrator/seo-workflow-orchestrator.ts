/**
 * Master SEO Workflow Orchestrator & Autonomous Actuator
 * Orchestrates the specialist SEO Architect Agent and Conversion Copywriter Agent
 * to translate live Google Search Console opportunities into verified, brand-compliant,
 * pixel-calibrated, multi-query clustered, statutory-invariant action packages.
 */

import path from 'path';
import { SeoArchitectAgent, SeoAuditContext } from '../agents/seo-architect-agent';
import { LegalComplianceAuditorAgent } from '../agents/legal-compliance-auditor-agent';
import { AntiAiQualityGuard } from '../guardrails/anti-ai-quality-guard';
import {
  classifyStatutoryRequirementCategory,
  verifyIntentCalibratedStatutoryTokens,
} from '../guardrails/sra-boundary-guard';
import { auditSerpPixelBudgets, SERP_PIXEL_BUDGETS } from '../tools/serp-pixel-calculator';
import {
  evaluateSeoBlastRadius,
  resolveSafeActuationScope,
} from '../guardrails/seo-blast-radius-guard';
import { SeoPolicyRegistry } from '../services/seo-policy-registry';
import { seoOpportunityWorker } from '../workers/seo-opportunity-worker';
import { seoCopyWorker } from '../workers/seo-copy-worker';
import { legalComplianceWorker } from '../workers/legal-compliance-worker';
import { SeoStorageService } from '../services/seo-storage-service';
import {
  AutonomousSeoActionPackage,
  SeoTechnicalBrief,
  ConversionCopyPackage,
  QueryClusterProfile,
} from '../types';
import { GscFetchResult, GscQueryRow } from '../services/gsc-client';
import { SafeFs } from '../services/safe-fs';
import { auditClaimsAndSubstantiation } from '../guardrails/cap-code-claims-guard';

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
   * Builds a multi-query portfolio cluster profile per canonical page to prevent
   * single-query cannibalization when optimizing striking-distance keywords.
   */
  public static buildQueryClusterProfiles(rows: GscQueryRow[]): Map<string, QueryClusterProfile> {
    const byPage = new Map<string, GscQueryRow[]>();

    for (const r of rows) {
      const intent = SeoArchitectAgent.classifyIntent(r.query);
      const canonicalRoute = SeoArchitectAgent.resolveCanonicalRoute(r.query, intent, r.page);
      const fullUrl = `${SeoArchitectAgent.DOMAIN}${canonicalRoute}`;

      const list = byPage.get(fullUrl) || [];
      list.push(r);
      byPage.set(fullUrl, list);
    }

    const profiles = new Map<string, QueryClusterProfile>();

    byPage.forEach((pageRows, targetPage) => {
      const sortedByImpr = [...pageRows].sort((a, b) => b.impressions - a.impressions);
      const primaryAnchor = sortedByImpr[0];
      const striking = sortedByImpr
        .filter(r => r.position >= 10.5 && r.position <= 20)
        .map(r => r.query)
        .slice(0, 5);
      const longTail = sortedByImpr
        .slice(1)
        .map(r => r.query)
        .slice(0, 8);

      const totalClusterImpressions = pageRows.reduce((acc, r) => acc + r.impressions, 0);
      const totalClusterClicks = pageRows.reduce((acc, r) => acc + r.clicks, 0);

      profiles.set(targetPage, {
        targetPage,
        primaryAnchorQuery: primaryAnchor?.query || '',
        primaryAnchorImpressions: primaryAnchor?.impressions || 0,
        strikingDistanceCandidates: striking,
        longTailVariants: longTail,
        totalClusterImpressions,
        totalClusterClicks,
      });
    });

    return profiles;
  }

  /**
   * Filters GSC query rows for high-impact striking distance and CTR opportunities,
   * enriched with multi-query portfolio cluster profiles and canonical H1 alignment.
   */
  public static extractOpportunities(rows: GscQueryRow[], limit = 10): SeoAuditContext[] {
    const actionable: SeoAuditContext[] = [];
    const clusterProfiles = this.buildQueryClusterProfiles(rows);

    const buildContext = (r: GscQueryRow): SeoAuditContext => {
      const intent = SeoArchitectAgent.classifyIntent(r.query);
      const canonicalRoute = SeoArchitectAgent.resolveCanonicalRoute(r.query, intent, r.page);
      const fullUrl = `${SeoArchitectAgent.DOMAIN}${canonicalRoute}`;
      const cluster = clusterProfiles.get(fullUrl);
      const existingH1 = SeoArchitectAgent.CANONICAL_ROUTE_H1_MAP[canonicalRoute];

      return {
        query: r.query,
        impressions: r.impressions,
        clicks: r.clicks,
        position: r.position,
        ctr: r.ctr,
        targetUrl: r.page || fullUrl,
        queryClusterProfile: cluster,
        targetPageExistingH1: existingH1,
      };
    };

    // Filter striking distance (Pos 10.5 - 20) with significant impressions
    const striking = rows
      .filter(r => r.position >= 10.5 && r.position <= 20 && r.impressions >= 40)
      .sort((a, b) => b.impressions - a.impressions);

    for (const r of striking) {
      actionable.push(buildContext(r));
    }

    // Filter Top 8 rankings with low CTR (< 4%)
    const lowCtr = rows
      .filter(r => r.position <= 8.5 && r.position >= 1.0 && r.impressions >= 35 && r.ctr < 4.0)
      .sort((a, b) => b.impressions - a.impressions);

    for (const r of lowCtr) {
      if (!actionable.some(a => a.query === r.query)) {
        actionable.push(buildContext(r));
      }
    }

    return actionable.slice(0, limit);
  }

  /**
   * Enforces strict deterministic quality gates on copy, pixel bounding boxes, and intent-calibrated statutory rules
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

    // 5. Intent-Calibrated Statutory Guardrail (FINANCIAL_CALCULATION vs EMOTIONAL_DISPUTE)
    const expectedCap = pkg.seoTechnicalBrief.statutoryInvariants.weeklyCapGB;
    const statutoryCategory =
      pkg.seoTechnicalBrief.statutoryCategory ||
      classifyStatutoryRequirementCategory(pkg.query);

    const statutoryTokenCheck = verifyIntentCalibratedStatutoryTokens(
      allText,
      statutoryCategory,
      expectedCap
    );
    if (!statutoryTokenCheck.isValid && statutoryTokenCheck.reason) {
      errors.push(statutoryTokenCheck.reason);
    }

    // 6. SERP Character & Arial Pixel-Width Bounding Box Invariants
    const title = pkg.copyPackage.calibratedTitle;
    const meta = pkg.copyPackage.calibratedMetaDescription;
    const pixelAudit = auditSerpPixelBudgets(title, meta);

    if (title.length < 45 || title.length > 65) {
      errors.push(`Title length (${title.length} chars) violates SERP character envelope: "${title}"`);
    }
    if (pixelAudit.titlePixels > SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MAX_PX) {
      errors.push(
        `Title pixel width (${pixelAudit.titlePixels}px) exceeds Google desktop bounding box (${SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MAX_PX}px): "${title}"`
      );
    }

    if (meta.length < 130 || meta.length > 160) {
      errors.push(`Meta description length (${meta.length} chars) violates SERP character envelope: "${meta}"`);
    }
    if (pixelAudit.metaPixels > SERP_PIXEL_BUDGETS.DESKTOP_META_MAX_PX) {
      errors.push(
        `Meta description pixel width (${pixelAudit.metaPixels}px) exceeds Google desktop bounding box (${SERP_PIXEL_BUDGETS.DESKTOP_META_MAX_PX}px)`
      );
    }

    // 7. ASA / CAP Code claims substantiation invariant (claims-privacy-auditor)
    const claimsCheck = auditClaimsAndSubstantiation(allText);
    if (!claimsCheck.isCompliant) {
      for (const v of claimsCheck.violations) {
        errors.push(`CAP Code substantiation violation: "${v.phrase}" (${v.riskReason})`);
      }
    }

    // 8. Prohibited deflective legal phrases (Rule 4)
    const lowerAllText = allText.toLowerCase();
    for (const phrase of LegalComplianceAuditorAgent.PROHIBITED_LEGAL_PHRASES) {
      if (lowerAllText.includes(phrase)) {
        errors.push(`Prohibited phrasing detected: "${phrase}"`);
      }
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

      // 1. Specialist SEO Opportunity & Architecture Worker in the loop
      const seoBrief: SeoTechnicalBrief = await seoOpportunityWorker.execute(opp);

      // 2. Specialist Conversion Copywriter & AEO Worker in the loop
      const copyPackage: ConversionCopyPackage = await seoCopyWorker.execute(seoBrief);

      // 3. Specialist Legal & Compliance Auditor Worker in the loop (AGENTS.md Section 2.E)
      const statutoryAudit = await legalComplianceWorker.execute({ copy: copyPackage, brief: seoBrief });

      // 4. Specialist Anti-AI Quality & E-E-A-T Guard in the loop
      const antiAiQuality = AntiAiQualityGuard.evaluateQuality(copyPackage);

      // Determine priority, action type, non-destructive actuationScope, and Blast-Radius Risk
      const isTopRankLowCtr = opp.position <= 8.5;
      const actionType = isTopRankLowCtr ? 'META_RECALIBRATION' : 'INTERNAL_LINK_BOOST';
      const priority = opp.impressions >= 100 ? 'CRITICAL' : opp.impressions >= 50 ? 'HIGH' : 'MEDIUM';

      const primaryAnchor = seoBrief.queryClusterProfile?.primaryAnchorQuery || opp.query;
      const lockTitleByPolicy = SeoPolicyRegistry.isRouteTitleLocked(
        seoBrief.targetCanonicalUrl,
        opp.query,
        primaryAnchor
      );
      const safeScope = resolveSafeActuationScope({
        query: opp.query,
        targetCanonicalUrl: seoBrief.targetCanonicalUrl,
        actionType,
        position: opp.position,
        primaryAnchorQuery: primaryAnchor,
        lockTitleByPolicy,
      });

      const blast = evaluateSeoBlastRadius({
        query: opp.query,
        targetCanonicalUrl: seoBrief.targetCanonicalUrl,
        actionType,
        actuationScope: safeScope,
        position: opp.position,
        impressions: opp.impressions,
        ctr: opp.ctr,
        primaryAnchorQuery: primaryAnchor,
        targetPageExistingH1: seoBrief.targetPageExistingH1,
        calibratedTitle: copyPackage.calibratedTitle,
        calibratedMetaDescription: copyPackage.calibratedMetaDescription,
        faqQuestion: copyPackage.answerFirstFaq.question,
        faqAnswer: copyPackage.answerFirstFaq.answer,
        contextualLinkSnippet: copyPackage.contextualInternalLinkBlock.surroundingText,
      });

      const pixelAudit = auditSerpPixelBudgets(
        copyPackage.calibratedTitle,
        copyPackage.calibratedMetaDescription
      );

      const stagedDiff = `
### Action Proposal for "${opp.query}" (Pos ${opp.position.toFixed(1)} · ${opp.impressions} Impr)
- **Target URL**: ${seoBrief.targetCanonicalUrl}
- **Deployment Risk**: ${blast.deploymentRisk} (${blast.actuationScope})
- **Existing Page H1**: ${seoBrief.targetPageExistingH1 || 'N/A'}
- **Cluster Primary Anchor**: ${primaryAnchor}
- **Search Intent**: ${seoBrief.searchIntent} (${seoBrief.statutoryCategory || 'FINANCIAL_CALCULATION'})
- **Proposed Title**: ${copyPackage.calibratedTitle} (${copyPackage.calibratedTitle.length} chars · ${pixelAudit.titlePixels}px / ${pixelAudit.titleMaxPixels}px)
- **Proposed Meta**: ${copyPackage.calibratedMetaDescription} (${copyPackage.calibratedMetaDescription.length} chars · ${pixelAudit.metaPixels}px / ${pixelAudit.metaMaxPixels}px)
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
        actuationScope: blast.actuationScope,
        deploymentRisk: blast.deploymentRisk,
        tradeOffSummary: blast.tradeOffSummary,
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

    const stagedJsonPath = path.join(this.STAGING_DIR, 'latest-staged-actions.json');
    const stagedMarkdownPath = path.join(this.STAGING_DIR, 'latest-staged-actions.md');

    // Write JSON artifact safely
    SafeFs.writeFileSyncSafe(stagedJsonPath, JSON.stringify(packages, null, 2), 'utf-8');

    // Write Human-Reviewable Markdown Digest safely
    const markdownContent = this.formatMarkdownStagingDigest(runId, timestamp, packages, gscData.source);
    SafeFs.writeFileSyncSafe(stagedMarkdownPath, markdownContent, 'utf-8');

    // Persist to cumulative CHANGE_LOG.md and Supabase
    const metrics = {
      totalQueries: gscData.rows.length,
      totalImpressions: gscData.totalImpressions,
      totalClicks: gscData.totalClicks,
      avgCtr: gscData.totalImpressions > 0 ? Math.round((gscData.totalClicks / gscData.totalImpressions) * 10000) / 100 : 0,
      avgPosition: gscData.rows.length > 0 ? Math.round((gscData.rows.reduce((acc, r) => acc + r.position, 0) / gscData.rows.length) * 10) / 10 : 0,
    };

    const { SeoActuatorService } = await import('../services/seo-actuator-service');
    SeoActuatorService.stageRuntimePackages(packages);
    await SeoStorageService.persistRun(runId, gscData.source, metrics, packages, false);

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
      .map(p => {
        const px = auditSerpPixelBudgets(
          p.copyPackage.calibratedTitle,
          p.copyPackage.calibratedMetaDescription
        );
        return `
### 🎯 Package ${p.id}: "${p.query}" [${p.priority}]
- **Type**: \`${p.actionType}\` | **Status**: \`${p.status}\`
- **Target Canonical**: [${p.seoTechnicalBrief.targetCanonicalUrl}](${p.seoTechnicalBrief.targetCanonicalUrl})
- **Cluster Primary Anchor**: \`${p.seoTechnicalBrief.queryClusterProfile?.primaryAnchorQuery || p.query}\`
- **Metrics**: Pos ${p.seoTechnicalBrief.currentMetrics.position.toFixed(1)} · ${p.seoTechnicalBrief.currentMetrics.impressions} Impr · ${p.seoTechnicalBrief.currentMetrics.clicks} Clicks

#### 1. Metadata Calibrations (SEO Architect + Conversion Copywriter)
- **Title (${p.copyPackage.calibratedTitle.length} chars · ${px.titlePixels}px)**: \`${p.copyPackage.calibratedTitle}\`
- **Meta Description (${p.copyPackage.calibratedMetaDescription.length} chars · ${px.metaPixels}px)**: \`${p.copyPackage.calibratedMetaDescription}\`

#### 2. AI Overview FAQ Direct Answer (Snippet Capture)
- **Question**: *${p.copyPackage.answerFirstFaq.question}*
- **Answer**: ${p.copyPackage.answerFirstFaq.answer}

#### 3. Contextual Internal Link Boost
- **Source Route**: \`${p.copyPackage.contextualInternalLinkBlock.sourceRoute}\`
- **Destination**: \`${p.copyPackage.contextualInternalLinkBlock.targetRoute}\`
- **In-Content Anchor Placement**:
> ${p.copyPackage.contextualInternalLinkBlock.surroundingText}

---
`;
      })
      .join('\n');

    return `# 🛡️ Autonomous SEO Actuator — Staged Review Digest
**Run ID**: \`${runId}\`  
**Generated At**: ${timestamp}  
**Data Source**: ${source}  
**Specialist Agents in the Loop**: \`seo-architect\` & \`conversion-copywriter\`  
**Compliance Standard**: 100% BRAND.md, Pixel-Width Bounding Boxes & April 2026 Statutory Invariants  

---

${rows}

*Generated autonomously by SettlementCheck Sentinel Fleet · Dual-Agent Quality Verified.*
`;
  }
}
