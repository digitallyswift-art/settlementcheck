/**
 * Google Indexing API Client & Instant Re-crawl Sentinel
 * Pings Google's Indexing API directly using Google Cloud Service Account OAuth2 JWT.
 * Allows SettlementCheck to request immediate Googlebot re-indexing within 24-48 hours
 * whenever metadata, statutory rates, or content packages are updated.
 */

import crypto from 'crypto';

export interface IndexingNotificationResult {
  success: boolean;
  url: string;
  type: 'URL_UPDATED' | 'URL_DELETED';
  notifyTime?: string;
  error?: string;
  httpStatus?: number;
  rawResponse?: any;
}

export interface IndexingMetadataResult {
  success: boolean;
  url: string;
  latestUpdate?: {
    type: string;
    notifyTime: string;
  };
  latestRemove?: {
    type: string;
    notifyTime: string;
  };
  error?: string;
}

export class GoogleIndexingClient {
  private static readonly INDEXING_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
  private static readonly METADATA_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications/metadata';
  private static readonly INDEXING_SCOPE = 'https://www.googleapis.com/auth/indexing';

  /**
   * Checks if required Google Service Account credentials are configured
   */
  public static isConfigured(): boolean {
    const email = process.env.GSC_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
    const key = process.env.GSC_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;
    return Boolean(email && key);
  }

  /**
   * Generates a signed OAuth2 JWT assertion with the Google Indexing scope
   */
  public static async getAccessToken(): Promise<string> {
    const clientEmail = process.env.GSC_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GSC_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      throw new Error('Google credentials missing: GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY not set.');
    }

    // Handle escaped newlines
    privateKey = privateKey.replace(/\\n/g, '\n');

    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const claimSet = {
      iss: clientEmail,
      scope: this.INDEXING_SCOPE,
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

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`Google OAuth token request failed (${tokenRes.status}): ${errText}`);
    }

    const tokenData = await tokenRes.json();
    return tokenData.access_token;
  }

  /**
   * Pings Google to request an immediate crawl for an updated or newly published URL
   */
  public static async notifyUrlUpdated(url: string): Promise<IndexingNotificationResult> {
    return this.publishNotification(url, 'URL_UPDATED');
  }

  /**
   * Pings Google that a URL has been deleted / 404 removed
   */
  public static async notifyUrlDeleted(url: string): Promise<IndexingNotificationResult> {
    return this.publishNotification(url, 'URL_DELETED');
  }

  /**
   * Publishes an indexing notification to the Google Indexing API
   */
  private static async publishNotification(
    url: string,
    type: 'URL_UPDATED' | 'URL_DELETED'
  ): Promise<IndexingNotificationResult> {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(this.INDEXING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url,
          type,
        }),
      });

      const responseText = await response.text();
      let responseJson: any = {};
      try {
        responseJson = JSON.parse(responseText);
      } catch {
        responseJson = { raw: responseText };
      }

      if (!response.ok) {
        return {
          success: false,
          url,
          type,
          httpStatus: response.status,
          error: responseJson.error?.message || responseText,
          rawResponse: responseJson,
        };
      }

      return {
        success: true,
        url,
        type,
        httpStatus: response.status,
        notifyTime: responseJson.urlNotificationMetadata?.latestUpdate?.notifyTime || new Date().toISOString(),
        rawResponse: responseJson,
      };
    } catch (err: any) {
      return {
        success: false,
        url,
        type,
        error: err.message || 'Unknown network error',
      };
    }
  }

  /**
   * Checks the latest notification metadata for a specific URL recorded by Google
   */
  public static async getNotificationMetadata(url: string): Promise<IndexingMetadataResult> {
    try {
      const token = await this.getAccessToken();
      const metadataUrl = `${this.METADATA_ENDPOINT}?url=${encodeURIComponent(url)}`;

      const response = await fetch(metadataUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        return {
          success: false,
          url,
          error: `HTTP ${response.status}: ${errText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        url,
        latestUpdate: data.latestUpdate,
        latestRemove: data.latestRemove,
      };
    } catch (err: any) {
      return {
        success: false,
        url,
        error: err.message || 'Failed to fetch metadata',
      };
    }
  }

  /**
   * Pings Google via the public Sitemap Ping endpoint as a secondary fallback
   */
  public static async pingSitemap(sitemapUrl = 'https://settlementcheck.co.uk/sitemap.xml'): Promise<{ success: boolean; status: number }> {
    try {
      const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const res = await fetch(pingUrl, { method: 'GET' });
      return { success: res.ok, status: res.status };
    } catch {
      return { success: false, status: 0 };
    }
  }

  /**
   * Submits a batch of URLs with rate-limit dampening
   */
  public static async notifyBatch(urls: string[]): Promise<IndexingNotificationResult[]> {
    const results: IndexingNotificationResult[] = [];
    const uniqueUrls = Array.from(new Set(urls));

    for (const url of uniqueUrls) {
      const res = await this.notifyUrlUpdated(url);
      results.push(res);
      // Brief 250ms dampener to respect Google Indexing API quotas
      await new Promise(r => setTimeout(r, 250));
    }

    return results;
  }
}
