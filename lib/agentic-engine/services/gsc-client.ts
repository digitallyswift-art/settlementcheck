/**
 * Google Search Console (GSC) API Direct Client
 * Autonomously connects to Google Search Console API v3 using a Google Cloud Service Account.
 * No manual CSV downloads or human interaction required.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { SafeFs } from './safe-fs';

export interface GscQueryRow {
  query: string;
  page?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscFetchResult {
  source: 'GSC_LIVE_API' | 'LOCAL_ARCHIVE_FALLBACK';
  siteUrl: string;
  startDate: string;
  endDate: string;
  rows: GscQueryRow[];
  totalClicks: number;
  totalImpressions: number;
}

export class GoogleSearchConsoleClient {
  private static get siteUrl(): string {
    return process.env.GSC_SITE_URL || 'sc-domain:settlementcheck.co.uk';
  }

  /**
   * Checks if GSC Service Account credentials exist in the environment
   */
  public static isConfigured(): boolean {
    const email = process.env.GSC_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
    const key = process.env.GSC_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;
    return Boolean(email && key);
  }

  /**
   * Generates a signed OAuth2 JWT assertion for Google APIs
   */
  private static async getAccessToken(): Promise<string> {
    const clientEmail = process.env.GSC_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GSC_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      throw new Error('GSC credentials missing: GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY not set.');
    }

    // Replace escaped newlines if passed via single-line env var
    privateKey = privateKey.replace(/\\n/g, '\n');

    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const claimSet = {
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const base64UrlHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const base64UrlClaim = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
    const signingInput = `${base64UrlHeader}.${base64UrlClaim}`;

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signingInput);
    const signature = signer.sign(privateKey, 'base64url');
    const jwt = `${signingInput}.${signature}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google OAuth token exchange failed (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.access_token;
  }

  /**
   * Queries Google Search Console Search Analytics API
   */
  public static async querySearchAnalytics(options: {
    startDate: string;
    endDate: string;
    dimensions?: ('query' | 'page' | 'device' | 'country')[];
    rowLimit?: number;
  }): Promise<GscQueryRow[]> {
    const token = await this.getAccessToken();
    const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      this.siteUrl
    )}/searchAnalytics/query`;

    const bodyPayload = {
      startDate: options.startDate,
      endDate: options.endDate,
      dimensions: options.dimensions || ['query'],
      rowLimit: options.rowLimit || 1000,
      dataState: 'all',
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`GSC API request failed (${res.status}): ${err}`);
    }

    const json = await res.json();
    if (!json.rows || !Array.isArray(json.rows)) {
      return [];
    }

    return json.rows.map((r: any) => ({
      query: r.keys ? r.keys[0] : '',
      page: r.keys && r.keys.length > 1 ? r.keys[1] : undefined,
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: r.ctr ? Math.round(r.ctr * 10000) / 100 : 0,
      position: r.position ? Math.round(r.position * 10) / 10 : 0,
    }));
  }

  /**
   * High-level puller: Tries direct GSC API first; if unconfigured or error,
   * falls back to the most recent historical CSV snapshot.
   */
  public static async pullLatestSearchData(): Promise<GscFetchResult> {
    const today = new Date();
    const prior28Days = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
    const startDate = prior28Days.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    if (this.isConfigured()) {
      try {
        const rows = await this.querySearchAnalytics({
          startDate,
          endDate,
          dimensions: ['query', 'page'],
          rowLimit: 2500,
        });

        // Automatically archive the pulled API snapshot to disk or /tmp
        const archiveDir = path.resolve('data/gsc-history/api-snapshots');
        const snapshotFile = path.join(archiveDir, `gsc-pull-${endDate}.json`);
        SafeFs.writeFileSyncSafe(snapshotFile, JSON.stringify({ pulledAt: new Date().toISOString(), startDate, endDate, rows }, null, 2));

        const totalClicks = rows.reduce((acc, r) => acc + r.clicks, 0);
        const totalImpressions = rows.reduce((acc, r) => acc + r.impressions, 0);

        return {
          source: 'GSC_LIVE_API',
          siteUrl: this.siteUrl,
          startDate,
          endDate,
          rows,
          totalClicks,
          totalImpressions,
        };
      } catch (apiErr) {
        console.warn('GSC Live API pull failed, using local historical archive fallback:', apiErr);
      }
    }

    // Fallback 1: Read empirical live GSC [query, page] pairs from data/audit/live-gsc-performance.json
    const liveAuditGscPath = path.resolve('data/audit/live-gsc-performance.json');
    if (fs.existsSync(liveAuditGscPath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(liveAuditGscPath, 'utf-8'));
        if (parsed && Array.isArray(parsed.rawPairs) && parsed.rawPairs.length > 0) {
          const rows: GscQueryRow[] = parsed.rawPairs.map((r: any) => ({
            query: Array.isArray(r.keys) ? r.keys[0] || '' : '',
            page: Array.isArray(r.keys) && r.keys.length > 1 ? r.keys[1] : undefined,
            clicks: r.clicks || 0,
            impressions: r.impressions || 0,
            ctr: typeof r.ctr === 'number' ? Math.round(r.ctr * 10000) / 100 : 0,
            position: typeof r.position === 'number' ? Math.round(r.position * 10) / 10 : 0,
          }));
          const totalClicks = parsed.totals?.totalClicks ?? rows.reduce((acc, r) => acc + r.clicks, 0);
          const totalImpressions = parsed.totals?.totalImpressions ?? rows.reduce((acc, r) => acc + r.impressions, 0);

          return {
            source: 'LOCAL_ARCHIVE_FALLBACK',
            siteUrl: parsed.siteUrl || this.siteUrl,
            startDate: parsed.dateRange?.startDate || '2026-07-20',
            endDate: parsed.dateRange?.endDate || '2026-10-18',
            rows,
            totalClicks,
            totalImpressions,
          };
        }
      } catch {
        // Proceed to CSV archive fallback
      }
    }

    // Fallback 2: Read latest local GSC CSV snapshot
    const gscDir = path.resolve('data/gsc-history');
    let latestFolder = 'settlementcheck.co.uk-Performance-on-Search-2026-10-09';
    if (!fs.existsSync(path.join(gscDir, latestFolder))) {
      latestFolder = '2026-06-30_to_2026-09-29';
    }

    const csvPath = path.join(gscDir, latestFolder, 'Queries.csv');
    const rows: GscQueryRow[] = [];
    let totalClicks = 0;
    let totalImpressions = 0;

    if (fs.existsSync(csvPath)) {
      const content = fs.readFileSync(csvPath, 'utf-8').trim();
      const lines = content.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      lines.slice(1).forEach(l => {
        const vals = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[h] = vals[i] ?? '';
        });
        const clicks = parseInt(obj['Clicks'], 10) || 0;
        const impressions = parseInt(obj['Impressions'], 10) || 0;
        totalClicks += clicks;
        totalImpressions += impressions;
        rows.push({
          query: obj['Top queries'] || obj['Query'] || '',
          clicks,
          impressions,
          ctr: parseFloat(obj['CTR']) || 0,
          position: parseFloat(obj['Position']) || 0,
        });
      });
    }

    return {
      source: 'LOCAL_ARCHIVE_FALLBACK',
      siteUrl: this.siteUrl,
      startDate: '2026-07-01',
      endDate: '2026-10-09',
      rows,
      totalClicks,
      totalImpressions,
    };
  }
}
