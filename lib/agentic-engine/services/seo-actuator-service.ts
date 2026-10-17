/**
 * Autonomous SEO Actuator Service
 * Bridges staged optimization packages directly into live production:
 * 1. Resolves active optimizations for any route (Supabase + local disk fallback).
 * 2. 1-Click Apply: Switches status to 'APPLIED' and pings Google Indexing API.
 * 3. Rollback: Restores previous baseline metadata.
 * 4. Batch Actuation: Applies all validated packages and triggers batch Google Indexing.
 */

import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';
import { GoogleIndexingClient } from './google-indexing-client';

export interface AppliedSeoRecord {
  id: string;
  query: string;
  targetCanonicalUrl: string;
  calibratedTitle: string;
  calibratedMetaDescription: string;
  faqQuestion: string;
  faqAnswer: string;
  status: 'STAGED' | 'VALIDATED' | 'APPLIED' | 'REJECTED';
  priority?: string;
  actionType?: string;
  impressions?: number;
  clicks?: number;
  position?: number;
  ctr?: number;
  ctaText?: string;
  appliedAt?: string;
  googleIndexedAt?: string;
  indexingStatus?: string;
}

export class SeoActuatorService {
  private static readonly APPLIED_DISK_PATH = path.resolve('data/serp-actions/applied-actions.json');
  private static readonly TMP_APPLIED_PATH = '/tmp/applied-actions.json';
  private static readonly STAGED_DISK_PATH = path.resolve('data/serp-actions/staging/latest-staged-actions.json');

  /**
   * Normalizes a pathname to match target canonical URLs (with trailing slash)
   */
  public static normalizePath(pathname: string): string {
    let p = pathname.trim();
    if (!p.startsWith('/')) p = `/${p}`;
    if (!p.endsWith('/')) p = `${p}/`;
    return p;
  }

  /**
   * Retrieves the currently active optimization for a given route (if any)
   */
  public static async getActiveOptimization(pathname: string): Promise<AppliedSeoRecord | null> {
    const norm = this.normalizePath(pathname);
    const fullCanonical = `https://settlementcheck.co.uk${norm}`;

    // 1. Try Supabase cloud if configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { data, error } = await supabase
          .from('seo_autonomous_actions')
          .select('*')
          .eq('status', 'APPLIED')
          .eq('target_canonical_url', fullCanonical)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return {
            id: data.id,
            query: data.query,
            targetCanonicalUrl: data.target_canonical_url,
            calibratedTitle: data.calibrated_title,
            calibratedMetaDescription: data.calibrated_meta_description,
            faqQuestion: data.faq_question,
            faqAnswer: data.faq_answer,
            status: data.status,
            appliedAt: data.created_at,
          };
        }
      } catch (err) {
        // Fall back to disk
      }
    }

    // 2. Check local disk applied actions
    const checkPaths = [this.APPLIED_DISK_PATH, this.TMP_APPLIED_PATH];
    for (const diskPath of checkPaths) {
      if (fs.existsSync(diskPath)) {
        try {
          const content = fs.readFileSync(diskPath, 'utf-8');
          const appliedList: AppliedSeoRecord[] = JSON.parse(content);
          const match = appliedList.find(
            a => a.targetCanonicalUrl === fullCanonical || this.normalizePath(a.targetCanonicalUrl.replace('https://settlementcheck.co.uk', '')) === norm
          );
          if (match && match.status === 'APPLIED') {
            return match;
          }
        } catch {
          // Ignore read error
        }
      }
    }

    return null;
  }

  /**
   * Reads all current packages across disk, /tmp, and Supabase
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
            list.push({
              id: d.id,
              query: d.query,
              priority: d.priority || 'CRITICAL',
              actionType: d.action_type || 'INTERNAL_LINK_BOOST',
              impressions: d.impressions ?? 0,
              clicks: d.clicks ?? 0,
              position: d.position ?? 0,
              ctr: d.ctr ?? 0,
              targetCanonicalUrl: d.target_canonical_url,
              calibratedTitle: d.calibrated_title,
              calibratedMetaDescription: d.calibrated_meta_description,
              faqQuestion: d.faq_question,
              faqAnswer: d.faq_answer,
              status: d.status,
              appliedAt: d.created_at,
            });
          }
        }
      } catch {}
    }

    // 2. Local disk and /tmp applied actions
    const diskSources = [this.APPLIED_DISK_PATH, this.TMP_APPLIED_PATH];
    for (const diskPath of diskSources) {
      if (fs.existsSync(diskPath)) {
        try {
          const diskApplied: AppliedSeoRecord[] = JSON.parse(fs.readFileSync(diskPath, 'utf-8'));
          for (const item of diskApplied) {
            if (!seenIds.has(item.id)) {
              seenIds.add(item.id);
              list.push(item);
            }
          }
        } catch {}
      }
    }

    // 3. Staged actions fallback
    if (fs.existsSync(this.STAGED_DISK_PATH)) {
      try {
        const stagedRaw = JSON.parse(fs.readFileSync(this.STAGED_DISK_PATH, 'utf-8'));
        for (const pkg of stagedRaw) {
          if (!seenIds.has(pkg.id)) {
            seenIds.add(pkg.id);
            list.push({
              id: pkg.id,
              query: pkg.query,
              priority: pkg.priority || 'CRITICAL',
              actionType: pkg.actionType || 'INTERNAL_LINK_BOOST',
              impressions: pkg.seoTechnicalBrief?.currentMetrics?.impressions ?? 0,
              clicks: pkg.seoTechnicalBrief?.currentMetrics?.clicks ?? 0,
              position: pkg.seoTechnicalBrief?.currentMetrics?.position ?? 0,
              ctr: pkg.seoTechnicalBrief?.currentMetrics?.ctr ?? 0,
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
   * Applies an optimization package: marks active and notifies Google Indexing API
   */
  public static async applyPackage(
    packageId: string,
    options?: { triggerIndexing?: boolean }
  ): Promise<{ success: boolean; package?: AppliedSeoRecord; indexingResult?: any; error?: string }> {
    const packages = await this.getAllPackages();
    const target = packages.find(p => p.id === packageId);

    if (!target) {
      return { success: false, error: `Package not found: ${packageId}` };
    }

    target.status = 'APPLIED';
    target.appliedAt = new Date().toISOString();

    // 1. Google Indexing API notification
    let indexingResult: any = null;
    if (options?.triggerIndexing !== false && GoogleIndexingClient.isConfigured()) {
      try {
        indexingResult = await GoogleIndexingClient.notifyUrlUpdated(target.targetCanonicalUrl);
        if (indexingResult.success) {
          target.googleIndexedAt = indexingResult.notifyTime || new Date().toISOString();
          target.indexingStatus = 'INDEXING_REQUESTED_HTTP_200';
        } else {
          target.indexingStatus = `INDEXING_ERROR_${indexingResult.httpStatus || 'FAIL'}`;
        }
      } catch (idxErr: any) {
        indexingResult = { success: false, error: idxErr.message };
      }
    }

    // 2. Persist to disk / /tmp safely
    this.saveAppliedToDisk(target);

    // 3. Persist to Supabase if available (upsert so it is stored even if read from staging file)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await supabase
          .from('seo_autonomous_actions')
          .upsert({
            id: target.id,
            query: target.query,
            target_canonical_url: target.targetCanonicalUrl,
            calibrated_title: target.calibratedTitle,
            calibrated_meta_description: target.calibratedMetaDescription,
            faq_question: target.faqQuestion,
            faq_answer: target.faqAnswer,
            status: 'APPLIED',
            created_at: target.appliedAt || new Date().toISOString(),
          }, { onConflict: 'id' });
      } catch (err) {
        console.error('Supabase upsert failed:', err);
      }
    }

    return {
      success: true,
      package: target,
      indexingResult,
    };
  }

  /**
   * Rolls back an applied optimization back to VALIDATED
   */
  public static async rollbackPackage(packageId: string): Promise<{ success: boolean; error?: string }> {
    const packages = await this.getAllPackages();
    const target = packages.find(p => p.id === packageId);

    if (!target) {
      return { success: false, error: `Package not found: ${packageId}` };
    }

    target.status = 'VALIDATED';
    target.appliedAt = undefined;

    // Update disk & /tmp
    const diskTargets = [this.APPLIED_DISK_PATH, this.TMP_APPLIED_PATH];
    for (const dPath of diskTargets) {
      if (fs.existsSync(dPath)) {
        try {
          const diskApplied: AppliedSeoRecord[] = JSON.parse(fs.readFileSync(dPath, 'utf-8'));
          const filtered = diskApplied.filter(p => p.id !== packageId);
          fs.writeFileSync(dPath, JSON.stringify(filtered, null, 2), 'utf-8');
        } catch {}
      }
    }

    // Update Supabase
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await supabase
          .from('seo_autonomous_actions')
          .update({ status: 'VALIDATED' })
          .eq('id', target.id);
      } catch {}
    }

    return { success: true };
  }

  /**
   * Applies all validated packages in a single click and sends batch indexing requests
   */
  public static async applyAllValidated(): Promise<{ success: boolean; appliedCount: number; indexingResults: any[] }> {
    const packages = await this.getAllPackages();
    const toApply = packages.filter(p => p.status === 'VALIDATED' || p.status === 'STAGED');

    const indexingResults: any[] = [];
    for (const pkg of toApply) {
      const res = await this.applyPackage(pkg.id, { triggerIndexing: true });
      if (res.indexingResult) indexingResults.push(res.indexingResult);
    }

    return {
      success: true,
      appliedCount: toApply.length,
      indexingResults,
    };
  }

  /**
   * Saves applied action records locally with safe /tmp fallback for serverless
   */
  private static saveAppliedToDisk(record: AppliedSeoRecord) {
    const tryPaths = [this.APPLIED_DISK_PATH, this.TMP_APPLIED_PATH];
    for (const targetPath of tryPaths) {
      try {
        let appliedList: AppliedSeoRecord[] = [];
        if (fs.existsSync(targetPath)) {
          try {
            appliedList = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
          } catch {}
        }

        const idx = appliedList.findIndex(a => a.id === record.id);
        if (idx >= 0) {
          appliedList[idx] = record;
        } else {
          appliedList.push(record);
        }

        const dir = path.dirname(targetPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(targetPath, JSON.stringify(appliedList, null, 2), 'utf-8');
      } catch (err) {
        // Continue to /tmp if APPLIED_DISK_PATH fails with EROFS in serverless
      }
    }
  }
}
