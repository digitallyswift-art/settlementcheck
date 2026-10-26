/**
 * Deterministic SEO Blast-Radius & Semantic Drift Guard
 * Evaluates deployment risk based on route tier, title overwrite vs additive scope,
 * protected cluster anchor retention, intent shift, and statutory tax phrasing.
 */

import { SeoArchitectAgent } from '../agents/seo-architect-agent';
import {
  SeoActuationScope,
  SeoDeploymentRiskTier,
  SeoTradeOffSummary,
} from '../types';

export interface BlastRadiusEvaluationInput {
  query: string;
  targetCanonicalUrl: string;
  actionType?: string;
  actuationScope?: SeoActuationScope;
  position?: number;
  impressions?: number;
  ctr?: number;
  primaryAnchorQuery?: string;
  targetPageExistingH1?: string;
  calibratedTitle: string;
  calibratedMetaDescription: string;
  faqQuestion?: string;
  faqAnswer?: string;
  contextualLinkSnippet?: string;
}

export interface BlastRadiusEvaluationResult {
  actuationScope: SeoActuationScope;
  deploymentRisk: SeoDeploymentRiskTier;
  tradeOffSummary: SeoTradeOffSummary;
  riskReasons: string[];
}

const CORE_MONEY_ROUTES = new Set(['/', '/calculator/']);
const STOP_WORDS = new Set(['uk', 'in', 'the', 'of', 'for', 'and', 'to', 'a', 'an', 'how', 'my', 'your', 'is', 'on']);

export function normalizeCanonicalPath(urlOrPath: string): string {
  try {
    if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
      const parsed = new URL(urlOrPath);
      let p = parsed.pathname;
      if (!p.endsWith('/')) p = `${p}/`;
      return p;
    }
  } catch {}
  let clean = (urlOrPath || '/').split('?')[0].split('#')[0];
  if (!clean.startsWith('/')) clean = `/${clean}`;
  if (!clean.endsWith('/')) clean = `${clean}/`;
  return clean;
}

/**
 * Determines whether a package should be allowed to overwrite `<title>` & `<h1>`
 * (`FULL_META_AND_FAQ`) or must remain strictly non-destructive (`ADDITIVE_CONTENT_AND_LINKS`).
 */
export function resolveSafeActuationScope(input: {
  query: string;
  targetCanonicalUrl: string;
  actionType?: string;
  explicitScope?: SeoActuationScope;
  position?: number;
  primaryAnchorQuery?: string;
  lockTitleByPolicy?: boolean;
}): SeoActuationScope {
  if (input.lockTitleByPolicy) {
    return 'ADDITIVE_CONTENT_AND_LINKS';
  }
  if (input.explicitScope) {
    return input.explicitScope;
  }

  const normPath = normalizeCanonicalPath(input.targetCanonicalUrl);
  const pos = input.position ?? 15;
  const isCoreRoute = CORE_MONEY_ROUTES.has(normPath);
  const queryLower = (input.query || '').toLowerCase().trim();
  const anchorLower = (input.primaryAnchorQuery || '').toLowerCase().trim();

  // Rule 1: INTERNAL_LINK_BOOST orSCHEMA_FAQ_SNIPPET or Position > 10.0 is strictly additive
  // (Never let a Page 2 query overwrite a live page's <title> and <h1>)
  if (
    input.actionType === 'INTERNAL_LINK_BOOST' ||
    input.actionType === 'SCHEMA_FAQ_SNIPPET' ||
    pos > 10.0
  ) {
    return 'ADDITIVE_CONTENT_AND_LINKS';
  }

  // Rule 2: On core money pages (/ and /calculator/), only the primary cluster anchor can touch <title>
  if (isCoreRoute && anchorLower && queryLower !== anchorLower) {
    return 'ADDITIVE_CONTENT_AND_LINKS';
  }

  return 'FULL_META_AND_FAQ';
}

/**
 * Evaluates the deployment risk and builds a plain-English Before vs. After Trade-Off summary.
 */
export function evaluateSeoBlastRadius(
  input: BlastRadiusEvaluationInput
): BlastRadiusEvaluationResult {
  const normPath = normalizeCanonicalPath(input.targetCanonicalUrl);
  const isCoreRoute = CORE_MONEY_ROUTES.has(normPath);
  const pos = input.position ? Number(input.position) : 14.0;
  const impr = input.impressions ?? 0;
  const baselineH1 =
    input.targetPageExistingH1 ||
    SeoArchitectAgent.CANONICAL_ROUTE_H1_MAP[normPath] ||
    'Settlement Agreement Calculator UK';
  const baselineLiveTitle = baselineH1.includes('SettlementCheck')
    ? baselineH1
    : `${baselineH1} | SettlementCheck`;

  const resolvedScope =
    input.actuationScope ||
    resolveSafeActuationScope({
      query: input.query,
      targetCanonicalUrl: input.targetCanonicalUrl,
      actionType: input.actionType,
      position: pos,
      primaryAnchorQuery: input.primaryAnchorQuery,
    });

  const preservesLiveTitle = resolvedScope === 'ADDITIVE_CONTENT_AND_LINKS';

  // Check dropped tokens from primary anchor
  const anchorSource = input.primaryAnchorQuery || input.query || 'settlement agreement calculator';
  const anchorTokens = anchorSource
    .toLowerCase()
    .split(/\s+/)
    .map(t => t.replace(/[^a-z0-9£]/g, ''))
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));

  const proposedTitleLower = (input.calibratedTitle || '').toLowerCase();
  const droppedAnchorTokens = anchorTokens.filter(tok => !proposedTitleLower.includes(tok));

  const missingBrandSuffix = !/settlementcheck/i.test(input.calibratedTitle || '');
  const isInformationalShiftOnTool =
    (normPath === '/' || normPath.includes('calculator')) &&
    /^how to\b/i.test((input.calibratedTitle || '').trim());

  const combinedText = `${input.calibratedTitle || ''} ${input.calibratedMetaDescription || ''} ${input.faqAnswer || ''}`;
  const hasPromissoryTaxLanguage = /\byou can expect\b|\bguaranteed\b|\bwill receive £30,000\b/i.test(combinedText);

  const riskReasons: string[] = [];
  let deploymentRisk: SeoDeploymentRiskTier = 'LOW_RISK';

  if (!preservesLiveTitle) {
    if (isCoreRoute) {
      deploymentRisk = 'CRITICAL_RISK';
      riskReasons.push(
        `Modifies the main Google headline (<title>) and on-page heading of a Core Money Page (${normPath}).`
      );
    } else if (pos <= 5.0) {
      deploymentRisk = 'HIGH_RISK';
      riskReasons.push(
        `Modifies the headline (<title>) of a page already ranking in the Top 5 on Google (Pos ${pos.toFixed(1)}).`
      );
    } else {
      deploymentRisk = 'MEDIUM_RISK';
      riskReasons.push(
        `Updates the Google search headline (<title>) and summary on ${normPath} to improve Page 1 click-through rate.`
      );
    }

    if (droppedAnchorTokens.length > 0) {
      deploymentRisk = 'CRITICAL_RISK';
      riskReasons.push(
        `Proposed title drops protected keyword token(s): "${droppedAnchorTokens.join(', ')}" from anchor "${anchorSource}".`
      );
    }

    if (missingBrandSuffix) {
      if (deploymentRisk !== 'CRITICAL_RISK') deploymentRisk = 'HIGH_RISK';
      riskReasons.push('Proposed title omits the "| SettlementCheck" brand suffix.');
    }

    if (isInformationalShiftOnTool) {
      deploymentRisk = 'CRITICAL_RISK';
      riskReasons.push(
        'Shifts a transactional calculator page into an informational "How to..." headline, risking commercial conversion loss.'
      );
    }
  } else {
    // Additive scope (preserves live <title>, <meta>, and <h1>)
    deploymentRisk = 'LOW_RISK';
    riskReasons.push(
      `Safe additive update: Keeps your live page headline ("${baselineH1}") untouched and only adds a statutory Q&A block and internal link.`
    );
  }

  if (hasPromissoryTaxLanguage) {
    deploymentRisk = 'CRITICAL_RISK';
    riskReasons.push(
      'Contains promissory tax phrasing ("you can expect") instead of neutral ITEPA 2003 s.403 / s.402D PENP statutory qualification.'
    );
  }

  // Check for self-referential link antipattern
  if (input.contextualLinkSnippet) {
    const linkMatch = input.contextualLinkSnippet.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const linkHref = linkMatch[2];
      const normLinkPath = normalizeCanonicalPath(linkHref);
      if (normLinkPath === normPath) {
        deploymentRisk = 'CRITICAL_RISK';
        riskReasons.push(
          `Self-referential link antipattern detected: Snippet attempts to link to "${normLinkPath}" on the same page "${normPath}". Internal links must route PageRank to a dedicated subpage or calculator tool.`
        );
      }
    }
  }

  // Check for unqualified legal fee claims (SRA & CAP Code 3.1)
  const combinedFeeText = `${input.calibratedMetaDescription || ''} ${input.faqAnswer || ''} ${input.contextualLinkSnippet || ''}`;
  if (/\bemployer covers 100% of\b|\bemployer is legally required to pay all\b/i.test(combinedFeeText)) {
    deploymentRisk = 'HIGH_RISK';
    riskReasons.push(
      'Contains absolute legal fee coverage assertion ("employer covers 100%"). Must cite Section 203(3) ERA 1996 statutory contribution standard.'
    );
  }

  const pageLabel =
    normPath === '/'
      ? 'your Homepage (/)'
      : normPath === '/calculator/'
      ? 'your Main Calculator (/calculator/)'
      : `page ${normPath}`;

  const whyTriggered =
    pos > 10
      ? `People searching Google for "${input.query}" currently find ${pageLabel} on Page 2 (Position ${pos.toFixed(1)}${impr ? `, ${impr} monthly searches` : ''}), where fewer than 1% of searchers click.`
      : `Your ${pageLabel} already ranks on Page 1 (Position ${pos.toFixed(1)}) for "${input.query}", but has a low click-through rate.`;

  const whatChanges = preservesLiveTitle
    ? `PROTECTED HEADLINE: Keeps ${pageLabel} title ("${baselineH1}") 100% unchanged. Adds a dedicated UK statutory Q&A section and internal link targeting "${input.query}".`
    : `HEADLINE OVERWRITE: Replaces the live Google title on ${pageLabel} from "${baselineH1}" → "${input.calibratedTitle}".${
        droppedAnchorTokens.length > 0
          ? ` ⚠️ Warning: Removes keyword(s) "${droppedAnchorTokens.join(', ')}".`
          : ''
      }`;

  const riskExplanation = riskReasons.join(' ');

  return {
    actuationScope: resolvedScope,
    deploymentRisk,
    tradeOffSummary: {
      whyTriggered,
      whatChanges,
      riskExplanation,
      preservesLiveTitle,
      baselineLiveTitle,
      droppedAnchorTokens,
    },
    riskReasons,
  };
}
