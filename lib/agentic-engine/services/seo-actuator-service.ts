/**
 * Autonomous SEO Actuator Service (Edge-Cached & Canary-Enabled)
 * Bridges staged optimization packages directly into live production:
 * 1. Resolves active optimizations for any route via Next.js `unstable_cache` with tagged revalidation.
 * 2. Eliminates ephemeral `/tmp/applied-actions.json` writes in favor of cloud persistence + repo staging read fallback.
 * 3. Supports 14-day Canary provisional observation mode (`CANARY` -> `PERMANENT`) and automated regression rollbacks.
 */

import fs from 'fs';
import path from 'path';
import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { GoogleIndexingClient } from './google-indexing-client';
import { SeoArchitectAgent } from '../agents/seo-architect-agent';
import { SeoActionLifecycleStatus } from '../types';

export interface AppliedSeoRecord {
  id: string;
  query: string;
  targetCanonicalUrl: string;
  calibratedTitle: string;
  calibratedMetaDescription: string;
  faqQuestion: string;
  faqAnswer: string;
  status: SeoActionLifecycleStatus;
  priority?: string;
  actionType?: string;
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
        return rec;
      }
    }

    // 3. Read-only committed disk snapshot fallback (no /tmp ephemeral writes)
    if (fs.existsSync(this.APPLIED_DISK_PATH)) {
      try {
        const content = fs.readFileSync(this.APPLIED_DISK_PATH, 'utf-8');
        const appliedList: AppliedSeoRecord[] = JSON.parse(content);
        const match = appliedList.find(
          a =>
            (a.status === 'APPLIED' || a.status === 'CANARY' || a.status === 'PERMANENT') &&
            (a.targetCanonicalUrl === fullCanonical ||
              this.normalizePath(a.targetCanonicalUrl.replace('https://settlementcheck.co.uk', '')) === norm)
        );
        if (match) {
          return match;
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

    return {
      id: d.id,
      query: d.query,
      priority: d.priority || 'CRITICAL',
      actionType: d.action_type || 'INTERNAL_LINK_BOOST',
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
      primaryAnchorQuery: d.seo_brief?.queryClusterProfile?.primaryAnchorQuery || d.query,
      targetCanonicalUrl: d.target_canonical_url,
      calibratedTitle: d.calibrated_title,
      calibratedMetaDescription: d.calibrated_meta_description,
      faqQuestion: d.faq_question,
      faqAnswer: d.faq_answer,
      status: d.status,
      appliedAt,
      version: d.version || 1,
      lockState: d.lock_state || 'IDLE',
      lockedBy: d.locked_by || null,
      lockedUntil: d.locked_until || null,
      lastModifiedBy: d.last_modified_by,
    };
  }

  /**
   * Registers newly staged packages into the runtime memory store for immediate visibility
   */
  public static stageRuntimePackages(packages: any[]): void {
    for (const pkg of packages) {
      if (!pkg?.id) continue;
      const norm = this.normalizePath(pkg.seoTechnicalBrief?.targetCanonicalUrl || '/calculator/');
      this.memoryStore.set(pkg.id, {
        id: pkg.id,
        query: pkg.query,
        priority: pkg.priority || 'CRITICAL',
        actionType: pkg.actionType || 'INTERNAL_LINK_BOOST',
        impressions: pkg.seoTechnicalBrief?.currentMetrics?.impressions ?? 0,
        clicks: pkg.seoTechnicalBrief?.currentMetrics?.clicks ?? 0,
        position: pkg.seoTechnicalBrief?.currentMetrics?.position ?? 0,
        ctr: pkg.seoTechnicalBrief?.currentMetrics?.ctr ?? 0,
        targetPageExistingH1:
          pkg.seoTechnicalBrief?.targetPageExistingH1 ||
          SeoArchitectAgent.CANONICAL_ROUTE_H1_MAP[norm],
        primaryAnchorQuery:
          pkg.seoTechnicalBrief?.queryClusterProfile?.primaryAnchorQuery || pkg.query,
        targetCanonicalUrl: pkg.seoTechnicalBrief?.targetCanonicalUrl,
        calibratedTitle: pkg.copyPackage?.calibratedTitle,
        calibratedMetaDescription: pkg.copyPackage?.calibratedMetaDescription,
        faqQuestion: pkg.copyPackage?.answerFirstFaq?.question,
        faqAnswer: pkg.copyPackage?.answerFirstFaq?.answer,
        ctaText: pkg.copyPackage?.ctaText,
        status: pkg.status || 'VALIDATED',
        version: 1,
      });
    }
  }

  /**
   * Reads all current packages across Supabase, in-memory state, and repo staging artifacts
   */
  public static async getAllPackages(): Promise<AppliedSeoRecord[]> {
    const list: AppliedSeoRecord[] = [];
    const seenIds = new Set<string>();

    // 1. Supabase
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { data, error } = await supabase
          .from('seo_autonomous_actions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data) {
          for (const d of data) {
            seenIds.add(d.id);
            list.push(this.mapSupabaseRowToRecord(d));
          }
        }
      } catch {}
    }

    // 2. In-memory runtime overlay
    for (const item of Array.from(this.memoryStore.values())) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        list.push(item);
      }
    }

    // 3. Committed disk applied actions
    if (fs.existsSync(this.APPLIED_DISK_PATH)) {
      try {
        const diskApplied: AppliedSeoRecord[] = JSON.parse(fs.readFileSync(this.APPLIED_DISK_PATH, 'utf-8'));
        for (const item of diskApplied) {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            list.push(item);
          }
        }
      } catch {}
    }

    // 4. Staged actions fallback
    if (fs.existsSync(this.STAGED_DISK_PATH)) {
      try {
        const stagedRaw = JSON.parse(fs.readFileSync(this.STAGED_DISK_PATH, 'utf-8'));
        for (const pkg of stagedRaw) {
          if (!seenIds.has(pkg.id)) {
            seenIds.add(pkg.id);
            const norm = this.normalizePath(pkg.seoTechnicalBrief?.targetCanonicalUrl || '/calculator/');
            list.push({
              id: pkg.id,
              query: pkg.query,
              priority: pkg.priority || 'CRITICAL',
              actionType: pkg.actionType || 'INTERNAL_LINK_BOOST',
              impressions: pkg.seoTechnicalBrief?.currentMetrics?.impressions ?? 0,
              clicks: pkg.seoTechnicalBrief?.currentMetrics?.clicks ?? 0,
              position: pkg.seoTechnicalBrief?.currentMetrics?.position ?? 0,
              ctr: pkg.seoTechnicalBrief?.currentMetrics?.ctr ?? 0,
              targetPageExistingH1:
                pkg.seoTechnicalBrief?.targetPageExistingH1 ||
                SeoArchitectAgent.CANONICAL_ROUTE_H1_MAP[norm],
              primaryAnchorQuery:
                pkg.seoTechnicalBrief?.queryClusterProfile?.primaryAnchorQuery || pkg.query,
              targetCanonicalUrl: pkg.seoTechnicalBrief?.targetCanonicalUrl,
              calibratedTitle: pkg.copyPackage?.calibratedTitle,
              calibratedMetaDescription: pkg.copyPackage?.calibratedMetaDescription,
              faqQuestion: pkg.copyPackage?.answerFirstFaq?.question,
              faqAnswer: pkg.copyPackage?.answerFirstFaq?.answer,
              ctaText: pkg.copyPackage?.ctaText,
              status: pkg.status || 'VALIDATED',
            });
          }
        }
      } catch {}
    }

    return list;
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
      revalidate?: (urlOrPath: string) => Promise<void> | void;
    }
  ): Promise<{ success: boolean; package?: AppliedSeoRecord; indexingResult?: any; error?: string }> {
    const packages = await this.getAllPackages();
    const target = packages.find(p => p.id === packageId);

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

    // 2. Persist to Supabase FIRST (single source of ACID truth)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await supabase
          .from('seo_autonomous_actions')
          .upsert(
            {
              id: target.id,
              query: target.query,
              target_canonical_url: target.targetCanonicalUrl,
              calibrated_title: target.calibratedTitle,
              calibrated_meta_description: target.calibratedMetaDescription,
              faq_question: target.faqQuestion,
              faq_answer: target.faqAnswer,
              status: target.status,
              version: target.version,
              lock_state: 'IDLE',
              locked_by: null,
              locked_until: null,
              last_modified_by: target.lastModifiedBy,
              created_at: target.appliedAt,
            },
            { onConflict: 'id' }
          );
      } catch (err) {
        console.error('Supabase upsert failed:', err);
      }
    }

    // 3. Persist to in-memory runtime overlay & non-/tmp local dev snapshot
    this.memoryStore.set(target.id, target);
    this.saveAppliedToLocalRepoIfWritable(target);

    // 4. Invalidate / Purge Next.js tagged cache BEFORE notifying Googlebot
    if (options?.revalidate) {
      try {
        await options.revalidate(target.targetCanonicalUrl);
      } catch (revErr: any) {
        console.warn('Cache revalidation warning:', revErr?.message);
      }
    }

    // 5. Safe Sitemap <lastmod> & Ping sync
    let indexingResult: any = null;
    if (options?.triggerIndexing !== false) {
      try {
        indexingResult = await GoogleIndexingClient.notifyUrlUpdated(target.targetCanonicalUrl);
        if (indexingResult.success) {
          target.googleIndexedAt = indexingResult.notifyTime || new Date().toISOString();
          target.indexingStatus = 'SITEMAP_LASTMOD_SYNCED';
        }
      } catch (idxErr: any) {
        indexingResult = { success: false, error: idxErr.message };
      }
    }

    return {
      success: true,
      package: target,
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
      revalidate?: (urlOrPath: string) => Promise<void> | void;
    }
  ): Promise<{ success: boolean; error?: string }> {
    const packages = await this.getAllPackages();
    const target = packages.find(p => p.id === packageId);

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

    if (fs.existsSync(this.APPLIED_DISK_PATH)) {
      try {
        const diskApplied: AppliedSeoRecord[] = JSON.parse(fs.readFileSync(this.APPLIED_DISK_PATH, 'utf-8'));
        const filtered = diskApplied.filter(p => p.id !== packageId);
        fs.writeFileSync(this.APPLIED_DISK_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
      } catch {}
    }

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await supabase
          .from('seo_autonomous_actions')
          .update({ status: nextStatus })
          .eq('id', target.id);
      } catch {}
    }

    if (options?.revalidate) {
      try {
        await options.revalidate(target.targetCanonicalUrl);
      } catch {}
    }

    return { success: true };
  }

  /**
   * Rejects an optimization package: marks status as REJECTED
   */
  public static async rejectPackage(
    packageId: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    const packages = await this.getAllPackages();
    const target = packages.find(p => p.id === packageId);

    if (!target) {
      return { success: false, error: `Package not found: ${packageId}` };
    }

    target.status = 'REJECTED';
    target.appliedAt = undefined;
    this.memoryStore.set(target.id, target);

    if (fs.existsSync(this.APPLIED_DISK_PATH)) {
      try {
        const diskApplied: AppliedSeoRecord[] = JSON.parse(fs.readFileSync(this.APPLIED_DISK_PATH, 'utf-8'));
        const filtered = diskApplied.filter(p => p.id !== packageId);
        fs.writeFileSync(this.APPLIED_DISK_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
      } catch {}
    }

    if (fs.existsSync(this.STAGED_DISK_PATH)) {
      try {
        const stagedRaw = JSON.parse(fs.readFileSync(this.STAGED_DISK_PATH, 'utf-8'));
        const idx = stagedRaw.findIndex((p: any) => p.id === packageId);
        if (idx >= 0) {
          stagedRaw[idx].status = 'REJECTED';
          stagedRaw[idx].rejectionReason = reason || 'Rejected by administrator';
          fs.writeFileSync(this.STAGED_DISK_PATH, JSON.stringify(stagedRaw, null, 2), 'utf-8');
        }
      } catch {}
    }

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await supabase
          .from('seo_autonomous_actions')
          .update({ status: 'REJECTED' })
          .eq('id', target.id);
      } catch {}
    }

    return { success: true };
  }

  /**
   * Edits and applies an optimization package with custom administrator modifications
   */
  public static async editAndApplyPackage(
    packageId: string,
    updates: {
      calibratedTitle?: string;
      calibratedMetaDescription?: string;
      faqQuestion?: string;
      faqAnswer?: string;
    },
    options?: {
      expectedVersion?: number;
      actorId?: string;
      revalidate?: (urlOrPath: string) => Promise<void> | void;
    }
  ): Promise<{ success: boolean; package?: AppliedSeoRecord; indexingResult?: any; error?: string }> {
    const packages = await this.getAllPackages();
    const target = packages.find(p => p.id === packageId);

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

    target.version = (target.version || 1) + 1;
    target.status = 'APPLIED';
    target.appliedAt = new Date().toISOString();
    target.canaryExpiresAt = new Date(
      Date.now() + this.CANARY_DURATION_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();
    target.lockState = 'IDLE';
    target.lockedBy = null;
    target.lockedUntil = null;
    target.lastModifiedBy = options?.actorId || 'ADMIN_USER';

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await supabase
          .from('seo_autonomous_actions')
          .upsert(
            {
              id: target.id,
              query: target.query,
              target_canonical_url: target.targetCanonicalUrl,
              calibrated_title: target.calibratedTitle,
              calibrated_meta_description: target.calibratedMetaDescription,
              faq_question: target.faqQuestion,
              faq_answer: target.faqAnswer,
              status: 'APPLIED',
              version: target.version,
              lock_state: 'IDLE',
              locked_by: null,
              locked_until: null,
              last_modified_by: target.lastModifiedBy,
              created_at: target.appliedAt,
            },
            { onConflict: 'id' }
          );
      } catch (err) {
        console.error('Supabase upsert failed:', err);
      }
    }

    this.memoryStore.set(target.id, target);
    this.saveAppliedToLocalRepoIfWritable(target);

    if (options?.revalidate) {
      try {
        await options.revalidate(target.targetCanonicalUrl);
      } catch (revErr: any) {
        console.warn('Cache revalidation warning:', revErr?.message);
      }
    }

    let indexingResult: any = null;
    try {
      indexingResult = await GoogleIndexingClient.notifyUrlUpdated(target.targetCanonicalUrl);
      if (indexingResult.success) {
        target.googleIndexedAt = indexingResult.notifyTime || new Date().toISOString();
        target.indexingStatus = 'SITEMAP_LASTMOD_SYNCED';
      }
    } catch (idxErr: any) {
      indexingResult = { success: false, error: idxErr.message };
    }

    return {
      success: true,
      package: target,
      indexingResult,
    };
  }

  /**
   * Applies all validated packages in a single click
   */
  public static async applyAllValidated(options?: {
    revalidate?: (urlOrPath: string) => Promise<void> | void;
  }): Promise<{ success: boolean; appliedCount: number; indexingResults: any[] }> {
    const packages = await this.getAllPackages();
    const toApply = packages.filter(p => p.status === 'VALIDATED' || p.status === 'STAGED');

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
   * Writes to local repo applied-actions.json only in writable local dev environments (never /tmp)
   */
  private static saveAppliedToLocalRepoIfWritable(record: AppliedSeoRecord) {
    try {
      let appliedList: AppliedSeoRecord[] = [];
      if (fs.existsSync(this.APPLIED_DISK_PATH)) {
        try {
          appliedList = JSON.parse(fs.readFileSync(this.APPLIED_DISK_PATH, 'utf-8'));
        } catch {}
      }

      const idx = appliedList.findIndex(a => a.id === record.id);
      if (idx >= 0) {
        appliedList[idx] = record;
      } else {
        appliedList.push(record);
      }

      const dir = path.dirname(this.APPLIED_DISK_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.APPLIED_DISK_PATH, JSON.stringify(appliedList, null, 2), 'utf-8');
    } catch {
      // Read-only serverless filesystem (Vercel/Edge): state is safely persisted in Supabase + tagged cache
    }
  }
}
