/**
 * Autonomous SEO Actuator Service (Edge-Cached & Canary-Enabled)
 * Bridges staged optimization packages directly into live production:
 * 1. Resolves active optimizations for any route via Next.js `unstable_cache` with tagged revalidation.
 * 2. Eliminates ephemeral `/tmp/applied-actions.json` writes in favor of cloud persistence + repo staging read fallback.
 * 3. Supports 14-day Canary provisional observation mode (`CANARY` -> `PERMANENT`), non-destructive additive scope,
 *    Blast-Radius Risk Scoring, and on-demand Adversarial Head of SEO critiques.
 */

import path from 'path';
import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { GoogleIndexingClient } from './google-indexing-client';
import { SeoArchitectAgent } from '../agents/seo-architect-agent';
import { AdversarialSeoHeadAgent } from '../agents/adversarial-seo-head-agent';
import { evaluateSeoBlastRadius } from '../guardrails/seo-blast-radius-guard';
import { SeoPolicyRegistry } from './seo-policy-registry';
import {
  AdversarialSeoReviewResult,
  SeoActionLifecycleStatus,
  SeoActuationScope,
  SeoDeploymentRiskTier,
  SeoGuardrailPolicyRule,
  SeoTradeOffSummary,
} from '../types';
import { SafeFs } from './safe-fs';

export interface AppliedSeoRecord {
  id: string;
  query: string;
  targetCanonicalUrl: string;
  calibratedTitle: string;
  calibratedMetaDescription: string;
  faqQuestion: string;
  faqAnswer: string;
  contextualLinkSnippet?: string;
  status: SeoActionLifecycleStatus;
  priority?: string;
  actionType?: string;
  actuationScope?: SeoActuationScope;
  deploymentRisk?: SeoDeploymentRiskTier;
  tradeOffSummary?: SeoTradeOffSummary;
  adversarialReview?: AdversarialSeoReviewResult;
  impressions?: number;
  clicks?: number;
  position?: number;
  ctr?: number;
  currentPosition?: number;
  currentCtr?: number;
  currentImpressions?: number;
  regressionAlert?: string | null;
  canaryExpiresAt?: string | null;
  targetPageExistingH1?: string;
  primaryAnchorQuery?: string;
  ctaText?: string;
  appliedAt?: string;
  googleIndexedAt?: string;
  indexingStatus?: string;
  version?: number;
  lockState?: 'IDLE' | 'REVIEW_LOCKED' | 'APPLYING';
  lockedBy?: string | null;
  lockedUntil?: string | null;
  lastModifiedBy?: string;
}

export class SeoActuatorService {
  private static readonly APPLIED_DISK_PATH = path.resolve('data/serp-actions/applied-actions.json');
  private static readonly STAGED_DISK_PATH = path.resolve('data/serp-actions/staging/latest-staged-actions.json');
  public static readonly CANARY_DURATION_DAYS = 14;

  // In-memory runtime overlay when Supabase env vars are absent in local dev
  private static memoryStore = new Map<string, AppliedSeoRecord>();

  /**
   * Normalizes a pathname or URL to match target canonical URLs (with trailing slash)
   */
  public static normalizePath(urlOrPath: string): string {
    try {
      if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
        const parsed = new URL(urlOrPath);
        let p = parsed.pathname;
        if (!p.endsWith('/')) p = `${p}/`;
        return p;
      }
    } catch {}
    let clean = urlOrPath.split('?')[0].split('#')[0];
    if (!clean.startsWith('/')) clean = `/${clean}`;
    if (!clean.endsWith('/')) clean = `${clean}/`;
    return clean;
  }

  /**
   * Generates the deterministic Next.js cache tag for a canonical path
   */
  public static getCacheTagForPath(urlOrPath: string): string {
    const norm = this.normalizePath(urlOrPath);
    return `seo-metadata-${norm}`;
  }

  /**
   * Enriches any record with deterministic Blast-Radius Risk Tier, Actuation Scope, and Plain-English Trade-Off Summary
   */
  public static enrichRecordWithBlastRadius(rec: AppliedSeoRecord): AppliedSeoRecord {
    const norm = this.normalizePath(rec.targetCanonicalUrl || '/calculator/');
    const existingH1 =
      rec.targetPageExistingH1 ||
      SeoArchitectAgent.CANONICAL_ROUTE_H1_MAP[norm] ||
      'Settlement Agreement Calculator & Free Solicitor Check UK';
    const primaryAnchor =
      rec.primaryAnchorQuery ||
      (norm === '/' || norm === '/calculator/' ? 'settlement agreement calculator' : rec.query);

    // Legacy deployed/canary records without explicit actuationScope were deployed as FULL_META_AND_FAQ
    const isAlreadyLiveLegacy =
      (rec.status === 'APPLIED' || rec.status === 'CANARY' || rec.status === 'PERMANENT') &&
      !rec.actuationScope;

    const effectiveScope: SeoActuationScope | undefined = isAlreadyLiveLegacy
      ? 'FULL_META_AND_FAQ'
      : rec.actuationScope;

    const blast = evaluateSeoBlastRadius({
      query: rec.query,
      targetCanonicalUrl: rec.targetCanonicalUrl,
      actionType: rec.actionType,
      actuationScope: effectiveScope,
      position: rec.position,
      impressions: rec.impressions,
      ctr: rec.ctr,
      primaryAnchorQuery: primaryAnchor,
      targetPageExistingH1: existingH1,
      calibratedTitle: rec.calibratedTitle,
      calibratedMetaDescription: rec.calibratedMetaDescription,
      faqQuestion: rec.faqQuestion,
      faqAnswer: rec.faqAnswer,
      contextualLinkSnippet: rec.contextualLinkSnippet,
    });

    return {
      ...rec,
      targetPageExistingH1: existingH1,
      primaryAnchorQuery: primaryAnchor,
      actuationScope: blast.actuationScope,
      deploymentRisk: blast.deploymentRisk,
      tradeOffSummary: blast.tradeOffSummary,
    };
  }

  /**
   * Uncached internal lookup for active optimization on a route
   */
  private static async fetchActiveOptimizationUncached(pathname: string): Promise<AppliedSeoRecord | null> {
    const norm = this.normalizePath(pathname);
    const fullCanonical = `https://settlementcheck.co.uk${norm}`;

    // 1. Query Supabase (Single source of cloud ACID truth)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { data, error } = await supabase
          .from('seo_autonomous_actions')
          .select('*')
          .in('status', ['APPLIED', 'CANARY', 'PERMANENT'])
          .eq('target_canonical_url', fullCanonical)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return this.mapSupabaseRowToRecord(data);
        }
      } catch {
        // Fallback to memory / repo snapshot
      }
    }

    // 2. Check in-memory store (for immediate local/offline consistency)
    for (const rec of Array.from(this.memoryStore.values())) {
      if (
        (rec.status === 'APPLIED' || rec.status === 'CANARY' || rec.status === 'PERMANENT') &&
        (rec.targetCanonicalUrl === fullCanonical ||
          this.normalizePath(rec.targetCanonicalUrl.replace('https://settlementcheck.co.uk', '')) === norm)
      ) {
        return this.enrichRecordWithBlastRadius(rec);
      }
    }

    // 3. Committed disk or /tmp snapshot fallback
    const appliedContent = SafeFs.readFileSyncSafe(this.APPLIED_DISK_PATH, 'utf-8');
    if (appliedContent) {
      try {
        const appliedList: AppliedSeoRecord[] = JSON.parse(appliedContent);
        const match = appliedList.find(
          a =>
            (a.status === 'APPLIED' || a.status === 'CANARY' || a.status === 'PERMANENT') &&
            (a.targetCanonicalUrl === fullCanonical ||
              this.normalizePath(a.targetCanonicalUrl.replace('https://settlementcheck.co.uk', '')) === norm)
        );
        if (match) {
          return this.enrichRecordWithBlastRadius(match);
        }
      } catch {
        // Ignore read error
      }
    }

    return null;
  }

  /**
   * Retrieves the currently active optimization for a given route using Next.js Edge-Compatible `unstable_cache`
   * tagged with `seo-metadata-${canonicalPath}` and `seo-metadata-all`.
   */
  public static async getActiveOptimization(pathname: string): Promise<AppliedSeoRecord | null> {
    const norm = this.normalizePath(pathname);
    const routeTag = this.getCacheTagForPath(norm);

    try {
      const cachedFn = unstable_cache(
        async () => this.fetchActiveOptimizationUncached(norm),
        [`seo-active-opt-${norm}`],
        {
          tags: [routeTag, 'seo-metadata-all'],
          revalidate: 3600,
        }
      );
      return await cachedFn();
    } catch {
      // Fallback when executed outside Next.js request context (e.g., CLI scripts / evals)
      return this.fetchActiveOptimizationUncached(norm);
    }
  }

  private static mapSupabaseRowToRecord(d: any): AppliedSeoRecord {
    const norm = this.normalizePath(d.target_canonical_url || '/calculator/');
    const appliedAt = d.created_at;
    let canaryExpiresAt: string | null = null;
    if (appliedAt) {
      const exp = new Date(new Date(appliedAt).getTime() + this.CANARY_DURATION_DAYS * 24 * 60 * 60 * 1000);
      canaryExpiresAt = exp.toISOString();
    }

    const resolvedId = d.seo_brief?.packageId || d.id;
    const resolvedStatus: SeoActionLifecycleStatus = d.seo_brief?.lifecycleStatus || d.status;

    const base: AppliedSeoRecord = {
      id: resolvedId,
      query: d.query,
      priority: d.priority || 'CRITICAL',
      actionType: d.action_type || 'INTERNAL_LINK_BOOST',
      actuationScope: d.seo_brief?.actuationScope,
      adversarialReview: d.seo_brief?.adversarialReview,
      impressions: d.impressions ?? d.seo_brief?.currentMetrics?.impressions ?? 0,
      clicks: d.clicks ?? d.seo_brief?.currentMetrics?.clicks ?? 0,
      position: d.position ?? d.seo_brief?.currentMetrics?.position ?? 0,
      ctr: d.ctr ?? d.seo_brief?.currentMetrics?.ctr ?? 0,
      currentPosition: d.seo_brief?.postMetrics?.position ?? d.position ?? d.seo_brief?.currentMetrics?.position ?? 0,
      currentCtr: d.seo_brief?.postMetrics?.ctr ?? d.ctr ?? d.seo_brief?.currentMetrics?.ctr ?? 0,
      currentImpressions: d.seo_brief?.postMetrics?.impressions ?? d.impressions ?? d.seo_brief?.currentMetrics?.impressions ?? 0,
      regressionAlert: d.seo_brief?.regressionAlert || null,
      canaryExpiresAt,
      targetPageExistingH1:
        d.seo_brief?.targetPageExistingH1 ||
        SeoArchitectAgent.CANONICAL_ROUTE_H1_MAP[norm] ||
        undefined,
      primaryAnchorQuery:
        d.seo_brief?.queryClusterProfile?.primaryAnchorQuery ||
        (norm === '/' || norm === '/calculator/' ? 'settlement agreement calculator' : d.query),
      targetCanonicalUrl: d.target_canonical_url,
      calibratedTitle: d.calibrated_title,
      calibratedMetaDescription: d.calibrated_meta_description,
      faqQuestion: d.faq_question,
      faqAnswer: d.faq_answer,
      contextualLinkSnippet:
        d.contextual_link_snippet ||
        d.copy_package?.contextualInternalLinkBlock?.surroundingText ||
        undefined,
      status: resolvedStatus,
      appliedAt,
      version: d.version ?? d.seo_brief?.version ?? 1,
      lockState: d.lock_state || 'IDLE',
      lockedBy: d.locked_by || null,
      lockedUntil: d.locked_until || null,
      lastModifiedBy: d.last_modified_by,
    };

    return this.enrichRecordWithBlastRadius(base);
  }

  /**
   * Registers newly staged packages into the runtime memory store for immediate visibility
   */
  public static stageRuntimePackages(packages: any[]): void {
    for (const pkg of packages) {
      if (!pkg?.id) continue;
      const norm = this.normalizePath(pkg.seoTechnicalBrief?.targetCanonicalUrl || '/calculator/');
      const base: AppliedSeoRecord = {
        id: pkg.id,
        query: pkg.query,
        priority: pkg.priority || 'CRITICAL',
        actionType: pkg.actionType || 'INTERNAL_LINK_BOOST',
        actuationScope: pkg.actuationScope,
        adversarialReview: pkg.adversarialReview,
        impressions: pkg.seoTechnicalBrief?.currentMetrics?.impressions ?? 0,
        clicks: pkg.seoTechnicalBrief?.currentMetrics?.clicks ?? 0,
        position: pkg.seoTechnicalBrief?.currentMetrics?.position ?? 0,
        ctr: pkg.seoTechnicalBrief?.currentMetrics?.ctr ?? 0,
        targetPageExistingH1:
          pkg.seoTechnicalBrief?.targetPageExistingH1 ||
          SeoArchitectAgent.CANONICAL_ROUTE_H1_MAP[norm],
        primaryAnchorQuery:
          pkg.seoTechnicalBrief?.queryClusterProfile?.primaryAnchorQuery ||
          (norm === '/' || norm === '/calculator/' ? 'settlement agreement calculator' : pkg.query),
        targetCanonicalUrl: pkg.seoTechnicalBrief?.targetCanonicalUrl,
        calibratedTitle: pkg.copyPackage?.calibratedTitle,
        calibratedMetaDescription: pkg.copyPackage?.calibratedMetaDescription,
        faqQuestion: pkg.copyPackage?.answerFirstFaq?.question,
        faqAnswer: pkg.copyPackage?.answerFirstFaq?.answer,
        contextualLinkSnippet: pkg.copyPackage?.contextualInternalLinkBlock?.surroundingText,
        ctaText: pkg.copyPackage?.ctaText,
        status: pkg.status || 'VALIDATED',
        version: 1,
      };
      this.memoryStore.set(pkg.id, this.enrichRecordWithBlastRadius(base));
    }
  }

  /**
   * Reads all current packages across Supabase, in-memory state, and repo/tmp staging artifacts
   */
  public static async getAllPackages(): Promise<AppliedSeoRecord[]> {
    const list: AppliedSeoRecord[] = [];
    const seenIds = new Set<string>();

    // 1. In-memory runtime overlay first (reflects immediate local/Challenge/Edit updates)
    for (const item of Array.from(this.memoryStore.values())) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        list.push(this.enrichRecordWithBlastRadius(item));
      }
    }

    // 2. Supabase
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { data, error } = await supabase
          .from('seo_autonomous_actions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data) {
          for (const d of data) {
            const mapped = this.mapSupabaseRowToRecord(d);
            if (!seenIds.has(mapped.id) && (!d.id || !seenIds.has(d.id))) {
              seenIds.add(mapped.id);
              if (d.id) seenIds.add(d.id);
              list.push(mapped);
            }
          }
        }
      } catch {}
    }

    // 3. Committed disk or /tmp applied actions
    const appliedRawContent = SafeFs.readFileSyncSafe(this.APPLIED_DISK_PATH, 'utf-8');
    if (appliedRawContent) {
      try {
        const diskApplied: AppliedSeoRecord[] = JSON.parse(appliedRawContent);
        for (const item of diskApplied) {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            list.push(this.enrichRecordWithBlastRadius(item));
          }
        }
      } catch {}
    }

    // 4. Staged actions fallback (checks both repo staging dir and serverless /tmp fallback)
    const stagedRawContent = SafeFs.readFileSyncSafe(this.STAGED_DISK_PATH, 'utf-8');
    if (stagedRawContent) {
      try {
        const stagedRaw = JSON.parse(stagedRawContent);
        for (const pkg of stagedRaw) {
          if (!seenIds.has(pkg.id)) {
            seenIds.add(pkg.id);
            const norm = this.normalizePath(pkg.seoTechnicalBrief?.targetCanonicalUrl || '/calculator/');
            const base: AppliedSeoRecord = {
              id: pkg.id,
              query: pkg.query,
              priority: pkg.priority || 'CRITICAL',
              actionType: pkg.actionType || 'INTERNAL_LINK_BOOST',
              actuationScope: pkg.actuationScope,
              adversarialReview: pkg.adversarialReview,
              impressions: pkg.seoTechnicalBrief?.currentMetrics?.impressions ?? 0,
              clicks: pkg.seoTechnicalBrief?.currentMetrics?.clicks ?? 0,
              position: pkg.seoTechnicalBrief?.currentMetrics?.position ?? 0,
              ctr: pkg.seoTechnicalBrief?.currentMetrics?.ctr ?? 0,
              targetPageExistingH1:
                pkg.seoTechnicalBrief?.targetPageExistingH1 ||
                SeoArchitectAgent.CANONICAL_ROUTE_H1_MAP[norm],
              primaryAnchorQuery:
                pkg.seoTechnicalBrief?.queryClusterProfile?.primaryAnchorQuery ||
                (norm === '/' || norm === '/calculator/' ? 'settlement agreement calculator' : pkg.query),
              targetCanonicalUrl: pkg.seoTechnicalBrief?.targetCanonicalUrl,
              calibratedTitle: pkg.copyPackage?.calibratedTitle,
              calibratedMetaDescription: pkg.copyPackage?.calibratedMetaDescription,
              faqQuestion: pkg.copyPackage?.answerFirstFaq?.question,
              faqAnswer: pkg.copyPackage?.answerFirstFaq?.answer,
              contextualLinkSnippet: pkg.copyPackage?.contextualInternalLinkBlock?.surroundingText,
              ctaText: pkg.copyPackage?.ctaText,
              status: pkg.status || 'VALIDATED',
            };
            list.push(this.enrichRecordWithBlastRadius(base));
          }
        }
      } catch {}
    }

    return list;
  }

  /**
   * Resolves a package from active storage or hydrates it from a client-supplied snapshot
   * when a serverless cold start or worker hop cleared in-memory state.
   */
  private static resolveOrHydratePackage(
    packages: AppliedSeoRecord[],
    packageId: string,
    fallback?: Partial<AppliedSeoRecord>
  ): AppliedSeoRecord | undefined {
    const existing = packages.find(p => p.id === packageId);
    if (existing) return existing;

    if (fallback && (fallback.query || fallback.calibratedTitle) && fallback.targetCanonicalUrl) {
      const norm = this.normalizePath(fallback.targetCanonicalUrl);
      const hydrated = this.enrichRecordWithBlastRadius({
        id: packageId,
        query: fallback.query || 'settlement agreement calculator',
        targetCanonicalUrl: fallback.targetCanonicalUrl,
        calibratedTitle: fallback.calibratedTitle || '',
        calibratedMetaDescription: fallback.calibratedMetaDescription || '',
        faqQuestion: fallback.faqQuestion || '',
        faqAnswer: fallback.faqAnswer || '',
        contextualLinkSnippet: fallback.contextualLinkSnippet,
        status: fallback.status || 'VALIDATED',
        priority: fallback.priority || 'CRITICAL',
        actionType: fallback.actionType || 'INTERNAL_LINK_BOOST',
        actuationScope: fallback.actuationScope,
        adversarialReview: fallback.adversarialReview,
        impressions: fallback.impressions ?? 0,
        clicks: fallback.clicks ?? 0,
        position: fallback.position ?? 0,
        ctr: fallback.ctr ?? 0,
        targetPageExistingH1:
          fallback.targetPageExistingH1 || SeoArchitectAgent.CANONICAL_ROUTE_H1_MAP[norm],
        primaryAnchorQuery:
          fallback.primaryAnchorQuery ||
          (norm === '/' || norm === '/calculator/' ? 'settlement agreement calculator' : fallback.query),
        version: fallback.version ?? 1,
      });
      this.memoryStore.set(packageId, hydrated);
      return hydrated;
    }

    return undefined;
  }

  /**
   * Persists a package state transition to Supabase with schema fallback resilience
   */
  private static async persistRecordToSupabase(target: AppliedSeoRecord): Promise<void> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;

    const seoBriefPayload = {
      packageId: target.id,
      lifecycleStatus: target.status,
      actuationScope: target.actuationScope,
      deploymentRisk: target.deploymentRisk,
      adversarialReview: target.adversarialReview,
      version: target.version || 1,
      targetPageExistingH1: target.targetPageExistingH1,
      regressionAlert: target.regressionAlert || null,
      queryClusterProfile: target.primaryAnchorQuery
        ? { primaryAnchorQuery: target.primaryAnchorQuery }
        : undefined,
      currentMetrics: {
        impressions: target.impressions ?? 0,
        clicks: target.clicks ?? 0,
        position: target.position ?? 0,
        ctr: target.ctr ?? 0,
      },
    };

    try {
      const { error } = await supabase
        .from('seo_autonomous_actions')
        .upsert(
          {
            id: target.id,
            run_id: 'cockpit_actuation',
            query: target.query,
            action_type: target.actionType || 'INTERNAL_LINK_BOOST',
            priority: target.priority || 'CRITICAL',
            target_canonical_url: target.targetCanonicalUrl,
            calibrated_title: target.calibratedTitle,
            calibrated_meta_description: target.calibratedMetaDescription,
            faq_question: target.faqQuestion || '',
            faq_answer: target.faqAnswer || '',
            contextual_link_snippet: target.contextualLinkSnippet || '',
            seo_brief: seoBriefPayload,
            status: target.status,
            version: target.version || 1,
            lock_state: 'IDLE',
            locked_by: null,
            locked_until: null,
            last_modified_by: target.lastModifiedBy || 'ADMIN_USER',
            created_at: target.appliedAt || new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      // Fallback if remote DB has not yet applied 20261023_fix_seo_autonomous_actions_schema.sql
      if (error) {
        const legacyCompatStatus =
          target.status === 'CANARY' || target.status === 'PERMANENT'
            ? 'APPLIED'
            : target.status === 'ROLLED_BACK'
            ? 'VALIDATED'
            : target.status;

        const { data: existingRows } = await supabase
          .from('seo_autonomous_actions')
          .select('id')
          .eq('query', target.query)
          .eq('target_canonical_url', target.targetCanonicalUrl)
          .order('created_at', { ascending: false })
          .limit(1);

        if (existingRows && existingRows.length > 0) {
          await supabase
            .from('seo_autonomous_actions')
            .update({
              calibrated_title: target.calibratedTitle,
              calibrated_meta_description: target.calibratedMetaDescription,
              faq_question: target.faqQuestion || '',
              faq_answer: target.faqAnswer || '',
              contextual_link_snippet: target.contextualLinkSnippet || '',
              status: legacyCompatStatus,
              seo_brief: seoBriefPayload,
            })
            .eq('id', existingRows[0].id);
        } else {
          await supabase.from('seo_autonomous_actions').insert({
            run_id: 'cockpit_actuation',
            query: target.query,
            action_type: target.actionType || 'INTERNAL_LINK_BOOST',
            priority: target.priority || 'CRITICAL',
            status: legacyCompatStatus,
            target_canonical_url: target.targetCanonicalUrl,
            calibrated_title: target.calibratedTitle,
            calibrated_meta_description: target.calibratedMetaDescription,
            faq_question: target.faqQuestion || '',
            faq_answer: target.faqAnswer || '',
            contextual_link_snippet: target.contextualLinkSnippet || '',
            seo_brief: seoBriefPayload,
          });
        }
      }
    } catch (err) {
      console.error('Supabase persistence warning:', err);
    }
  }

  /**
   * Executes an On-Demand Adversarial Head of SEO Critique on a package and caches the result
   */
  public static async runAdversarialReview(
    packageId: string,
    fallbackPackage?: Partial<AppliedSeoRecord>
  ): Promise<{ success: boolean; review?: AdversarialSeoReviewResult; package?: AppliedSeoRecord; error?: string }> {
    const packages = await this.getAllPackages();
    const target = this.resolveOrHydratePackage(packages, packageId, fallbackPackage);

    if (!target) {
      return { success: false, error: `Package not found: ${packageId}` };
    }

    const review = await AdversarialSeoHeadAgent.evaluatePackage({
      id: target.id,
      query: target.query,
      targetCanonicalUrl: target.targetCanonicalUrl,
      actionType: target.actionType,
      actuationScope: target.actuationScope,
      position: target.position,
      impressions: target.impressions,
      ctr: target.ctr,
      primaryAnchorQuery: target.primaryAnchorQuery,
      targetPageExistingH1: target.targetPageExistingH1,
      calibratedTitle: target.calibratedTitle,
      calibratedMetaDescription: target.calibratedMetaDescription,
      faqQuestion: target.faqQuestion,
      faqAnswer: target.faqAnswer,
      contextualLinkSnippet: target.contextualLinkSnippet,
    });

    target.adversarialReview = review;
    const enriched = this.enrichRecordWithBlastRadius(target);
    this.memoryStore.set(target.id, enriched);
    await this.persistRecordToSupabase(enriched);

    return {
      success: true,
      review,
      package: enriched,
    };
  }

  /**
   * Applies an optimization package (supports CANARY 14-day observation or direct APPLIED)
   */
  public static async applyPackage(
    packageId: string,
    options?: {
      triggerIndexing?: boolean;
      expectedVersion?: number;
      actorId?: string;
      deployAsCanary?: boolean;
      fallbackPackage?: Partial<AppliedSeoRecord>;
      revalidate?: (urlOrPath: string) => Promise<void> | void;
    }
  ): Promise<{ success: boolean; package?: AppliedSeoRecord; indexingResult?: any; error?: string }> {
    const packages = await this.getAllPackages();
    const target = this.resolveOrHydratePackage(packages, packageId, options?.fallbackPackage);

    if (!target) {
      return { success: false, error: `Package not found: ${packageId}` };
    }

    // 1. Optimistic Concurrency Control Check
    if (
      options?.expectedVersion !== undefined &&
      target.version !== undefined &&
      target.version !== options.expectedVersion
    ) {
      return {
        success: false,
        error: `OCC Conflict: Package has been modified by another process (current version: v${target.version}, expected: v${options.expectedVersion}). Please refresh.`,
      };
    }

    const nowIso = new Date().toISOString();
    const canaryExpiryIso = new Date(
      Date.now() + this.CANARY_DURATION_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();

    target.version = (target.version || 1) + 1;
    target.status = options?.deployAsCanary ? 'CANARY' : 'APPLIED';
    target.appliedAt = nowIso;
    target.canaryExpiresAt = canaryExpiryIso;
    target.lockState = 'IDLE';
    target.lockedBy = null;
    target.lockedUntil = null;
    target.lastModifiedBy = options?.actorId || 'ADMIN_USER';

    const enriched = this.enrichRecordWithBlastRadius(target);

    // 2. Persist to Supabase FIRST (single source of ACID truth)
    await this.persistRecordToSupabase(enriched);

    // 3. Persist to in-memory runtime overlay & local/tmp snapshot
    this.memoryStore.set(enriched.id, enriched);
    this.saveAppliedToLocalRepoIfWritable(enriched);

    // 4. Invalidate / Purge Next.js tagged cache BEFORE notifying Googlebot
    if (options?.revalidate) {
      try {
        await options.revalidate(enriched.targetCanonicalUrl);
      } catch (revErr: any) {
        console.warn('Cache revalidation warning:', revErr?.message);
      }
    }

    // 5. Safe Sitemap <lastmod> & Ping sync
    let indexingResult: any = null;
    if (options?.triggerIndexing !== false) {
      try {
        indexingResult = await GoogleIndexingClient.notifyUrlUpdated(enriched.targetCanonicalUrl);
        if (indexingResult.success) {
          enriched.googleIndexedAt = indexingResult.notifyTime || new Date().toISOString();
          enriched.indexingStatus = 'SITEMAP_LASTMOD_SYNCED';
        }
      } catch (idxErr: any) {
        indexingResult = { success: false, error: idxErr.message };
      }
    }

    return {
      success: true,
      package: enriched,
      indexingResult,
    };
  }

  /**
   * Rolls back an applied or canary optimization back to VALIDATED (or ROLLED_BACK if triggered by watchdog)
   */
  public static async rollbackPackage(
    packageId: string,
    options?: {
      reason?: string;
      markAsRolledBack?: boolean;
      fallbackPackage?: Partial<AppliedSeoRecord>;
      revalidate?: (urlOrPath: string) => Promise<void> | void;
    }
  ): Promise<{ success: boolean; error?: string }> {
    const packages = await this.getAllPackages();
    const target = this.resolveOrHydratePackage(packages, packageId, options?.fallbackPackage);

    if (!target) {
      return { success: false, error: `Package not found: ${packageId}` };
    }

    const nextStatus: SeoActionLifecycleStatus = options?.markAsRolledBack ? 'ROLLED_BACK' : 'VALIDATED';
    target.status = nextStatus;
    target.appliedAt = undefined;
    if (options?.reason) {
      target.regressionAlert = options.reason;
    }

    this.memoryStore.set(target.id, target);

    const appliedContent = SafeFs.readFileSyncSafe(this.APPLIED_DISK_PATH, 'utf-8');
    if (appliedContent) {
      try {
        const diskApplied: AppliedSeoRecord[] = JSON.parse(appliedContent);
        const filtered = diskApplied.filter(p => p.id !== packageId);
        SafeFs.writeFileSyncSafe(this.APPLIED_DISK_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
      } catch {}
    }

    await this.persistRecordToSupabase(target);

    if (options?.revalidate) {
      try {
        await options.revalidate(target.targetCanonicalUrl);
      } catch {}
    }

    return { success: true };
  }

  /**
   * Rejects an optimization package: marks status as REJECTED and optionally promotes a guardrail policy rule
   */
  public static async rejectPackage(
    packageId: string,
    reason?: string,
    fallbackPackage?: Partial<AppliedSeoRecord>,
    policyRuleToPromote?: Partial<SeoGuardrailPolicyRule>
  ): Promise<{ success: boolean; promotedRule?: SeoGuardrailPolicyRule; error?: string }> {
    const packages = await this.getAllPackages();
    const target = this.resolveOrHydratePackage(packages, packageId, fallbackPackage);

    if (!target) {
      return { success: false, error: `Package not found: ${packageId}` };
    }

    target.status = 'REJECTED';
    target.appliedAt = undefined;
    this.memoryStore.set(target.id, target);

    let promotedRule: SeoGuardrailPolicyRule | undefined;
    if (policyRuleToPromote && policyRuleToPromote.ruleTitle && policyRuleToPromote.constraintDescription) {
      promotedRule = SeoPolicyRegistry.promotePolicyRule({
        scopeType: policyRuleToPromote.scopeType || 'ROUTE',
        scopeValue: policyRuleToPromote.scopeValue || this.normalizePath(target.targetCanonicalUrl),
        ruleTitle: policyRuleToPromote.ruleTitle,
        constraintDescription: policyRuleToPromote.constraintDescription,
        lockTitleOverwrite: policyRuleToPromote.lockTitleOverwrite,
        requiredTokens: policyRuleToPromote.requiredTokens,
        prohibitedPhrases: policyRuleToPromote.prohibitedPhrases,
        source: 'HUMAN_ADMIN_PROMOTED',
      });
    }

    const appliedContent = SafeFs.readFileSyncSafe(this.APPLIED_DISK_PATH, 'utf-8');
    if (appliedContent) {
      try {
        const diskApplied: AppliedSeoRecord[] = JSON.parse(appliedContent);
        const filtered = diskApplied.filter(p => p.id !== packageId);
        SafeFs.writeFileSyncSafe(this.APPLIED_DISK_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
      } catch {}
    }

    const stagedContent = SafeFs.readFileSyncSafe(this.STAGED_DISK_PATH, 'utf-8');
    if (stagedContent) {
      try {
        const stagedRaw = JSON.parse(stagedContent);
        const idx = stagedRaw.findIndex((p: any) => p.id === packageId);
        if (idx >= 0) {
          stagedRaw[idx].status = 'REJECTED';
          stagedRaw[idx].rejectionReason = reason || 'Rejected by administrator';
          SafeFs.writeFileSyncSafe(this.STAGED_DISK_PATH, JSON.stringify(stagedRaw, null, 2), 'utf-8');
        }
      } catch {}
    }

    await this.persistRecordToSupabase(target);

    return { success: true, promotedRule };
  }

  /**
   * Edits and applies an optimization package with custom administrator or Adversarial Counter-Plan modifications
   */
  public static async editAndApplyPackage(
    packageId: string,
    updates: {
      calibratedTitle?: string;
      calibratedMetaDescription?: string;
      faqQuestion?: string;
      faqAnswer?: string;
      contextualLinkSnippet?: string;
      actuationScope?: SeoActuationScope;
      deployAsCanary?: boolean;
      promotePolicyRule?: Partial<SeoGuardrailPolicyRule>;
    },
    options?: {
      expectedVersion?: number;
      actorId?: string;
      fallbackPackage?: Partial<AppliedSeoRecord>;
      revalidate?: (urlOrPath: string) => Promise<void> | void;
    }
  ): Promise<{
    success: boolean;
    package?: AppliedSeoRecord;
    promotedRule?: SeoGuardrailPolicyRule;
    indexingResult?: any;
    error?: string;
  }> {
    const packages = await this.getAllPackages();
    const target = this.resolveOrHydratePackage(packages, packageId, options?.fallbackPackage);

    if (!target) {
      return { success: false, error: `Package not found: ${packageId}` };
    }

    if (
      options?.expectedVersion !== undefined &&
      target.version !== undefined &&
      target.version !== options.expectedVersion
    ) {
      return {
        success: false,
        error: `OCC Conflict: Package has been modified by another process (current version: v${target.version}, expected: v${options.expectedVersion}). Please refresh.`,
      };
    }

    if (updates.calibratedTitle) target.calibratedTitle = updates.calibratedTitle;
    if (updates.calibratedMetaDescription) target.calibratedMetaDescription = updates.calibratedMetaDescription;
    if (updates.faqQuestion) target.faqQuestion = updates.faqQuestion;
    if (updates.faqAnswer) target.faqAnswer = updates.faqAnswer;
    if (updates.contextualLinkSnippet !== undefined) target.contextualLinkSnippet = updates.contextualLinkSnippet;
    if (updates.actuationScope) target.actuationScope = updates.actuationScope;

    let promotedRule: SeoGuardrailPolicyRule | undefined;
    if (updates.promotePolicyRule && updates.promotePolicyRule.ruleTitle && updates.promotePolicyRule.constraintDescription) {
      promotedRule = SeoPolicyRegistry.promotePolicyRule({
        id: updates.promotePolicyRule.id,
        scopeType: updates.promotePolicyRule.scopeType || 'ROUTE',
        scopeValue: updates.promotePolicyRule.scopeValue || this.normalizePath(target.targetCanonicalUrl),
        ruleTitle: updates.promotePolicyRule.ruleTitle,
        constraintDescription: updates.promotePolicyRule.constraintDescription,
        lockTitleOverwrite: updates.promotePolicyRule.lockTitleOverwrite,
        requiredTokens: updates.promotePolicyRule.requiredTokens,
        prohibitedPhrases: updates.promotePolicyRule.prohibitedPhrases,
        source: updates.promotePolicyRule.source || 'ADVERSARIAL_HEAD_PROMOTED',
      });
    }

    target.version = (target.version || 1) + 1;
    target.status = updates.deployAsCanary ? 'CANARY' : 'APPLIED';
    target.appliedAt = new Date().toISOString();
    target.canaryExpiresAt = new Date(
      Date.now() + this.CANARY_DURATION_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();
    target.lockState = 'IDLE';
    target.lockedBy = null;
    target.lockedUntil = null;
    target.lastModifiedBy = options?.actorId || 'ADMIN_USER';

    const enriched = this.enrichRecordWithBlastRadius(target);

    await this.persistRecordToSupabase(enriched);

    this.memoryStore.set(enriched.id, enriched);
    this.saveAppliedToLocalRepoIfWritable(enriched);

    if (options?.revalidate) {
      try {
        await options.revalidate(enriched.targetCanonicalUrl);
      } catch (revErr: any) {
        console.warn('Cache revalidation warning:', revErr?.message);
      }
    }

    let indexingResult: any = null;
    try {
      indexingResult = await GoogleIndexingClient.notifyUrlUpdated(enriched.targetCanonicalUrl);
      if (indexingResult.success) {
        enriched.googleIndexedAt = indexingResult.notifyTime || new Date().toISOString();
        enriched.indexingStatus = 'SITEMAP_LASTMOD_SYNCED';
      }
    } catch (idxErr: any) {
      indexingResult = { success: false, error: idxErr.message };
    }

    return {
      success: true,
      package: enriched,
      promotedRule,
      indexingResult,
    };
  }

  /**
   * Applies all validated packages (or only LOW_RISK validated packages if specified)
   */
  public static async applyAllValidated(options?: {
    onlyLowRisk?: boolean;
    revalidate?: (urlOrPath: string) => Promise<void> | void;
  }): Promise<{ success: boolean; appliedCount: number; indexingResults: any[] }> {
    const packages = await this.getAllPackages();
    const toApply = packages.filter(p => {
      const isPending = p.status === 'VALIDATED' || p.status === 'STAGED';
      if (!isPending) return false;
      if (options?.onlyLowRisk) {
        return p.deploymentRisk === 'LOW_RISK';
      }
      return true;
    });

    const indexingResults: any[] = [];
    for (const pkg of toApply) {
      const res = await this.applyPackage(pkg.id, {
        triggerIndexing: true,
        revalidate: options?.revalidate,
      });
      if (res.indexingResult) indexingResults.push(res.indexingResult);
    }

    return {
      success: true,
      appliedCount: toApply.length,
      indexingResults,
    };
  }

  /**
   * Writes to local repo applied-actions.json (or /tmp fallback via SafeFs)
   */
  private static saveAppliedToLocalRepoIfWritable(record: AppliedSeoRecord) {
    try {
      let appliedList: AppliedSeoRecord[] = [];
      const existingContent = SafeFs.readFileSyncSafe(this.APPLIED_DISK_PATH, 'utf-8');
      if (existingContent) {
        try {
          appliedList = JSON.parse(existingContent);
        } catch {}
      }

      const idx = appliedList.findIndex(a => a.id === record.id);
      if (idx >= 0) {
        appliedList[idx] = record;
      } else {
        appliedList.push(record);
      }

      SafeFs.writeFileSyncSafe(this.APPLIED_DISK_PATH, JSON.stringify(appliedList, null, 2), 'utf-8');
    } catch {
      // State is safely persisted in Supabase + tagged cache
    }
  }

  /**
   * Synchronizes all active cloud SEO optimizations (CANARY, APPLIED, PERMANENT)
   * from Supabase back into the repository's version-controlled `data/serp-actions/applied-actions.json`.
   */
  public static async syncCloudActionsToRepoSnapshot(options?: {
    onlyPermanent?: boolean;
  }): Promise<{
    success: boolean;
    syncedCount: number;
    records: AppliedSeoRecord[];
    outputPath: string;
  }> {
    const allPackages = await this.getAllPackages();
    const activeStatuses: Set<SeoActionLifecycleStatus> = options?.onlyPermanent
      ? new Set(['PERMANENT'])
      : new Set(['CANARY', 'APPLIED', 'PERMANENT']);

    // Keep the most recent active record per canonical route
    const byRoute = new Map<string, AppliedSeoRecord>();
    for (const pkg of allPackages) {
      if (!activeStatuses.has(pkg.status)) continue;
      const normRoute = this.normalizePath(pkg.targetCanonicalUrl);
      if (!byRoute.has(normRoute)) {
        byRoute.set(normRoute, pkg);
      }
    }

    const syncedRecords = Array.from(byRoute.values());
    SafeFs.writeFileSyncSafe(
      this.APPLIED_DISK_PATH,
      `${JSON.stringify(syncedRecords, null, 2)}\n`,
      'utf-8'
    );

    return {
      success: true,
      syncedCount: syncedRecords.length,
      records: syncedRecords,
      outputPath: this.APPLIED_DISK_PATH,
    };
  }
}
