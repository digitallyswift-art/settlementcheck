/**
 * Google Analytics 4 (GA4) Data API Direct Client
 * Connects directly to Google Analytics Data API v1beta using Google Cloud Service Account OAuth2 JWT.
 * Provides real-time active user telemetry, page engagement, device breakdown, and historical daily metrics.
 *
 * Zero external client SDK dependencies (uses native Node crypto & fetch).
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface Ga4RealtimeActivePage {
  screenName: string;
  activeUsers: number;
  screenPageViews: number;
}

export interface Ga4RealtimeDevice {
  deviceCategory: string; // 'desktop' | 'mobile' | 'tablet'
  activeUsers: number;
}

export interface Ga4RealtimeLocation {
  city: string;
  country: string;
  activeUsers: number;
}

export interface Ga4MinuteTrend {
  minuteAgo: number; // 0 (current) to 29 (29 mins ago)
  activeUsers: number;
}

export interface Ga4RealtimeData {
  source: 'GA4_REALTIME_API';
  propertyId: string;
  timestamp: string;
  activeUsersLast30Min: number;
  activeUsersPerMinute: Ga4MinuteTrend[];
  topPages: Ga4RealtimeActivePage[];
  devices: Ga4RealtimeDevice[];
  locations: Ga4RealtimeLocation[];
}

export interface Ga4TodayMetrics {
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
  averageSessionDuration: number; // in seconds
  bounceRate: number; // percentage
}

export interface Ga4ConnectionCheck {
  isConfigured: boolean;
  hasCredentials: boolean;
  hasPropertyId: boolean;
  clientEmail?: string;
  propertyId?: string;
  measurementId?: string;
  status: 'CONNECTED' | 'NEEDS_API_ENABLEMENT' | 'NEEDS_PROPERTY_ACCESS' | 'INVALID_PROPERTY_ID' | 'MISSING_CONFIGURATION' | 'ERROR';
  message: string;
  activationUrl?: string;
}

export class GoogleAnalytics4Client {
  private static cachedToken: { token: string; expiresAt: number } | null = null;

  /**
   * Resolves the numeric GA4 Property ID from environment variables
   */
  public static getPropertyId(): string | null {
    const rawId = process.env.GA4_PROPERTY_ID || process.env.GOOGLE_ANALYTICS_PROPERTY_ID || process.env.NEXT_PUBLIC_GA4_PROPERTY_ID;
    if (!rawId) return null;
    // Strip optional "properties/" prefix if provided
    return rawId.replace(/^properties\//, '').trim();
  }

  /**
   * Resolves GA4 Measurement ID for reference
   */
  public static getMeasurementId(): string | null {
    return process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.GA4_MEASUREMENT_ID || null;
  }

  /**
   * Resolves Google Service Account credentials (from env or local JSON key files)
   */
  public static getServiceAccountCredentials(): { clientEmail: string; privateKey: string } | null {
    let clientEmail = process.env.GA4_CLIENT_EMAIL || process.env.GSC_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GA4_PRIVATE_KEY || process.env.GSC_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;

    if (clientEmail && privateKey) {
      return { clientEmail, privateKey: privateKey.replace(/\\n/g, '\n') };
    }

    // Fallback: Check local candidate JSON key files in project root
    const candidateFiles = [
      'gsc-credentials.json',
      'service-account.json',
      'google-credentials.json',
      'gsc-key.json',
    ];

    for (const cand of candidateFiles) {
      const candPath = path.resolve(process.cwd(), cand);
      if (fs.existsSync(candPath)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(candPath, 'utf-8'));
          if (parsed.client_email && parsed.private_key) {
            return {
              clientEmail: parsed.client_email,
              privateKey: parsed.private_key.replace(/\\n/g, '\n'),
            };
          }
        } catch {}
      }
    }

    return null;
  }

  /**
   * Verifies whether GA4 is configured with both credentials and a Property ID
   */
  public static isConfigured(): boolean {
    const creds = this.getServiceAccountCredentials();
    const propId = this.getPropertyId();
    return Boolean(creds && propId);
  }

  /**
   * Generates a signed OAuth2 JWT assertion for Google Analytics scope
   * Scope: https://www.googleapis.com/auth/analytics.readonly
   */
  public static async getAccessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    // Reuse non-expired token (refresh 60s before expiry)
    if (this.cachedToken && this.cachedToken.expiresAt > now + 60) {
      return this.cachedToken.token;
    }

    const creds = this.getServiceAccountCredentials();
    if (!creds) {
      throw new Error('Google service account credentials missing for GA4 (GSC_CLIENT_EMAIL or gsc-credentials.json).');
    }

    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const claimSet = {
      iss: creds.clientEmail,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const base64UrlHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const base64UrlClaim = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
    const signingInput = `${base64UrlHeader}.${base64UrlClaim}`;

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signingInput);
    const signature = signer.sign(creds.privateKey, 'base64url');
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
      throw new Error(`Google OAuth token exchange failed for GA4 (${res.status}): ${errText}`);
    }

    const data = await res.json();
    this.cachedToken = {
      token: data.access_token,
      expiresAt: now + (data.expires_in || 3600),
    };

    return data.access_token;
  }

  /**
   * Diagnostic connection tester
   * Pinpoints exact setup requirements (API disabled, permission denied, missing property ID, etc.)
   */
  public static async checkConnection(): Promise<Ga4ConnectionCheck> {
    const creds = this.getServiceAccountCredentials();
    const propId = this.getPropertyId();
    const measurementId = this.getMeasurementId() || undefined;

    if (!creds) {
      return {
        isConfigured: false,
        hasCredentials: false,
        hasPropertyId: Boolean(propId),
        propertyId: propId || undefined,
        measurementId,
        status: 'MISSING_CONFIGURATION',
        message: 'Google Cloud service account credentials not found. Provide GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY or gsc-credentials.json.',
      };
    }

    if (!propId) {
      return {
        isConfigured: false,
        hasCredentials: true,
        hasPropertyId: false,
        clientEmail: creds.clientEmail,
        measurementId,
        status: 'MISSING_CONFIGURATION',
        message: `Service account ready (${creds.clientEmail}), but GA4_PROPERTY_ID is not set in .env.local. Add GA4_PROPERTY_ID=<numeric_id> from Google Analytics Admin > Property Settings.`,
      };
    }

    try {
      const token = await this.getAccessToken();

      // Test a minimal realtime ping
      const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propId}:runRealtimeReport`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: [{ name: 'activeUsers' }],
          limit: 1,
        }),
      });

      if (res.ok) {
        return {
          isConfigured: true,
          hasCredentials: true,
          hasPropertyId: true,
          clientEmail: creds.clientEmail,
          propertyId: propId,
          measurementId,
          status: 'CONNECTED',
          message: 'Connected to GA4 Data API successfully. Live streaming active.',
        };
      }

      const errJson = await res.json().catch(() => null);
      const errMsg = errJson?.error?.message || (await res.text().catch(() => 'Unknown error'));
      const errReason = errJson?.error?.details?.[0]?.reason;
      const activationUrl = errJson?.error?.details?.[0]?.metadata?.activationUrl;

      if (errReason === 'SERVICE_DISABLED' || errMsg.includes('Google Analytics Data API has not been used')) {
        return {
          isConfigured: false,
          hasCredentials: true,
          hasPropertyId: true,
          clientEmail: creds.clientEmail,
          propertyId: propId,
          measurementId,
          status: 'NEEDS_API_ENABLEMENT',
          message: 'Google Analytics Data API is disabled in your Google Cloud project.',
          activationUrl: activationUrl || 'https://console.developers.google.com/apis/api/analyticsdata.googleapis.com/overview',
        };
      }

      if (res.status === 403 || errMsg.includes('permission') || errMsg.includes('User does not have sufficient permissions')) {
        return {
          isConfigured: false,
          hasCredentials: true,
          hasPropertyId: true,
          clientEmail: creds.clientEmail,
          propertyId: propId,
          measurementId,
          status: 'NEEDS_PROPERTY_ACCESS',
          message: `Service account (${creds.clientEmail}) does not have access to GA4 property ${propId}. Add it as a 'Viewer' in Google Analytics Admin > Property Access Management.`,
        };
      }

      if (res.status === 400 || res.status === 404 || errMsg.includes('not found') || errMsg.includes('invalid')) {
        return {
          isConfigured: false,
          hasCredentials: true,
          hasPropertyId: true,
          clientEmail: creds.clientEmail,
          propertyId: propId,
          measurementId,
          status: 'INVALID_PROPERTY_ID',
          message: `GA4 Property ID '${propId}' was not recognized. Please make sure this is the numeric Property ID from Admin > Property Settings (not the G- Measurement ID).`,
        };
      }

      return {
        isConfigured: false,
        hasCredentials: true,
        hasPropertyId: true,
        clientEmail: creds.clientEmail,
        propertyId: propId,
        measurementId,
        status: 'ERROR',
        message: `GA4 API returned error (${res.status}): ${errMsg}`,
      };
    } catch (err: any) {
      return {
        isConfigured: false,
        hasCredentials: true,
        hasPropertyId: true,
        clientEmail: creds.clientEmail,
        propertyId: propId,
        measurementId,
        status: 'ERROR',
        message: `Connection failed: ${err.message}`,
      };
    }
  }

  /**
   * Queries Realtime Live Telemetry for GA4
   * Uses batchRunRealtimeReports for unified single-request telemetry
   */
  public static async getRealtimeTelemetry(): Promise<Ga4RealtimeData> {
    const propId = this.getPropertyId();
    if (!propId) {
      throw new Error('GA4_PROPERTY_ID is not configured in environment variables.');
    }

    const token = await this.getAccessToken();
    const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${propId}:batchRunRealtimeReports`;

    // 4 queries combined:
    // 1. Total active users & pageviews
    // 2. Active users by minute (last 30 mins)
    // 3. Top active pages
    // 4. Device category breakdown
    // 5. Geographic locations (city & country)
    const payload = {
      requests: [
        // Request 0: Overall active users and screen page views
        {
          metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        },
        // Request 1: Active users by minute (minutesAgo: 0 to 29)
        {
          dimensions: [{ name: 'minutesAgo' }],
          metrics: [{ name: 'activeUsers' }],
          orderBys: [
            {
              dimension: {
                dimensionName: 'minutesAgo',
                orderType: 'NUMERIC',
              },
              desc: false,
            },
          ],
        },
        // Request 2: Top active screens / pages
        {
          dimensions: [{ name: 'unifiedScreenName' }],
          metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
          limit: 10,
        },
        // Request 3: Device breakdown
        {
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'activeUsers' }],
        },
        // Request 4: Location breakdown
        {
          dimensions: [{ name: 'country' }, { name: 'city' }],
          metrics: [{ name: 'activeUsers' }],
          limit: 8,
        },
      ],
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GA4 batchRunRealtimeReports failed (${res.status}): ${errText}`);
    }

    const json = await res.json();
    const reports = json.reports || [];

    // Parse overall active users
    let totalActiveUsers = 0;
    const r0 = reports[0];
    if (r0?.rows?.[0]?.metricValues?.[0]?.value) {
      totalActiveUsers = parseInt(r0.rows[0].metricValues[0].value, 10) || 0;
    }

    // Parse minute trend (fill missing 0-29 minutes with 0)
    const minuteMap = new Map<number, number>();
    for (let m = 0; m < 30; m++) {
      minuteMap.set(m, 0);
    }
    const r1 = reports[1];
    if (r1?.rows) {
      for (const row of r1.rows) {
        const minute = parseInt(row.dimensionValues?.[0]?.value ?? '', 10);
        const users = parseInt(row.metricValues?.[0]?.value ?? '', 10) || 0;
        if (!isNaN(minute)) {
          minuteMap.set(minute, users);
        }
      }
    }
    const minuteTrend: Ga4MinuteTrend[] = Array.from(minuteMap.entries())
      .map(([minuteAgo, activeUsers]) => ({ minuteAgo, activeUsers }))
      .sort((a, b) => a.minuteAgo - b.minuteAgo);

    // Parse top pages / screens
    const topPages: Ga4RealtimeActivePage[] = [];
    const r2 = reports[2];
    if (r2?.rows) {
      for (const row of r2.rows) {
        const screenName = row.dimensionValues?.[0]?.value || 'Home';
        const activeUsers = parseInt(row.metricValues?.[0]?.value ?? '', 10) || 0;
        const screenPageViews = parseInt(row.metricValues?.[1]?.value ?? '', 10) || 0;
        topPages.push({ screenName, activeUsers, screenPageViews });
      }
    }

    // Parse devices
    const devices: Ga4RealtimeDevice[] = [];
    const r3 = reports[3];
    if (r3?.rows) {
      for (const row of r3.rows) {
        const deviceCategory = row.dimensionValues?.[0]?.value || 'desktop';
        const activeUsers = parseInt(row.metricValues?.[0]?.value ?? '', 10) || 0;
        devices.push({ deviceCategory, activeUsers });
      }
    }

    // Parse locations
    const locations: Ga4RealtimeLocation[] = [];
    const r4 = reports[4];
    if (r4?.rows) {
      for (const row of r4.rows) {
        const country = row.dimensionValues?.[0]?.value || 'United Kingdom';
        const city = row.dimensionValues?.[1]?.value || '(not set)';
        const activeUsers = parseInt(row.metricValues?.[0]?.value ?? '', 10) || 0;
        locations.push({ country, city, activeUsers });
      }
    }

    return {
      source: 'GA4_REALTIME_API',
      propertyId: propId,
      timestamp: new Date().toISOString(),
      activeUsersLast30Min: totalActiveUsers,
      activeUsersPerMinute: minuteTrend,
      topPages,
      devices,
      locations,
    };
  }

  /**
   * Fetches Today's Standard GA4 Metrics (cumulative since 00:00 UTC)
   */
  public static async getTodayMetrics(): Promise<Ga4TodayMetrics | null> {
    const propId = this.getPropertyId();
    if (!propId) return null;

    try {
      const token = await this.getAccessToken();
      const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${propId}:runReport`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: 'today', endDate: 'today' }],
          metrics: [
            { name: 'activeUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' },
          ],
        }),
      });

      if (!res.ok) return null;

      const data = await res.json();
      const row = data?.rows?.[0];
      if (!row) return null;

      return {
        activeUsers: parseInt(row.metricValues?.[0]?.value || '0', 10),
        sessions: parseInt(row.metricValues?.[1]?.value || '0', 10),
        screenPageViews: parseInt(row.metricValues?.[2]?.value || '0', 10),
        averageSessionDuration: Math.round(parseFloat(row.metricValues?.[3]?.value || '0')),
        bounceRate: Math.round(parseFloat(row.metricValues?.[4]?.value || '0') * 100),
      };
    } catch {
      return null;
    }
  }
}
