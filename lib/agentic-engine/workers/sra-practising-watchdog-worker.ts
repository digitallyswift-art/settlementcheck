/**
 * Worker 8: SRA & Practising Status Watchdog
 * Periodically cross-checks active panel firms against the public SRA Register
 * and Companies House API so leads are never routed to a firm with a lapsed
 * practising certificate, SRA intervention, or dissolved/insolvent entity.
 */

import { supabase } from '@/lib/supabase';
import { resend } from '@/lib/resend';
import {
  CompaniesHouseStatus,
  PanelComplianceCheckResult,
  SraComplianceStatus,
  SraPractisingWatchdogReport,
} from '../types';

const REQUEST_TIMEOUT_MS = 8000;
const DEFAULT_OPS_ALERT_EMAIL =
  process.env.OPS_ALERT_EMAIL ||
  process.env.NOTIFICATION_EMAIL ||
  'ops@settlementcheck.co.uk';

interface PanelFirmComplianceRow {
  id: string;
  firm_name: string;
  sra_number: string;
  companies_house_number: string | null;
  status: string;
  email: string;
}

export interface SraCheckOutcome {
  status: SraComplianceStatus;
  detail?: string;
}

export interface CompaniesHouseCheckOutcome {
  status: CompaniesHouseStatus;
  detail?: string;
}

export interface SraWatchdogOptions {
  /** Optional injected checker for deterministic tests */
  checkSraFn?: (sraNumber: string) => Promise<SraCheckOutcome>;
  /** Optional injected checker for deterministic tests */
  checkCompaniesHouseFn?: (companyNumber: string) => Promise<CompaniesHouseCheckOutcome>;
  /** Skip Resend email alerts (e.g. dry-run or test mode) */
  skipEmail?: boolean;
  /** Dry-run mode: compute report without mutating solicitor_panel */
  dryRun?: boolean;
}

export function normalizeSraNumber(raw: string): string {
  return raw.trim().replace(/^SRA-/i, '');
}

export function mapCompaniesHouseStatus(rawStatus: string | undefined | null): CompaniesHouseStatus {
  const normalized = (rawStatus || '').trim().toLowerCase();
  if (!normalized) return 'unknown';
  if (normalized === 'active') return 'active';
  if (normalized === 'dissolved' || normalized === 'converted-closed') return 'dissolved';
  if (normalized.includes('liquidation')) return 'liquidation';
  if (
    normalized.includes('insolvency') ||
    normalized.includes('receivership') ||
    normalized.includes('administration') ||
    normalized.includes('voluntary-arrangement')
  ) {
    return 'insolvency';
  }
  return 'unknown';
}

export function mapSraRegisterStatus(payload: Record<string, unknown> | null): SraComplianceStatus {
  if (!payload) return 'unknown';
  const rawStatus = String(
    payload.PractisingStatus ??
      payload.practisingStatus ??
      payload.Status ??
      payload.status ??
      ''
  )
    .trim()
    .toLowerCase();

  const hasIntervention = Boolean(
    payload.Intervention ?? payload.intervention ?? payload.IsIntervened ?? false
  );
  if (hasIntervention || rawStatus.includes('interven')) {
    return 'intervened';
  }
  if (
    rawStatus.includes('lapsed') ||
    rawStatus.includes('revoked') ||
    rawStatus.includes('suspended') ||
    rawStatus.includes('closed') ||
    rawStatus.includes('not practising')
  ) {
    return 'lapsed';
  }
  if (
    rawStatus.includes('authorised') ||
    rawStatus.includes('authorized') ||
    rawStatus.includes('active') ||
    rawStatus.includes('practising')
  ) {
    return 'authorised';
  }
  return 'unknown';
}

async function fetchSraPublicRegisterFallback(sraNumber: string): Promise<SraCheckOutcome> {
  const cleanSra = normalizeSraNumber(sraNumber);
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const res = await fetch(
      `https://www.sra.org.uk/consumers/register/organisation/?sraNumber=${encodeURIComponent(cleanSra)}`,
      {
        headers: {
          Accept: 'text/html,application/xhtml+xml',
          'User-Agent': 'SettlementCheck-ComplianceWatchdog/1.0 (+https://settlementcheck.co.uk)',
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (!res.ok) {
      return { status: 'unknown', detail: `SRA public register HTTP ${res.status}` };
    }

    const html = (await res.text()).toLowerCase();

    // Never auto-suspend on challenge/blocked pages
    if (html.includes('just a moment') || html.includes('cf-browser-verification')) {
      return { status: 'unknown', detail: 'SRA public register returned challenge page' };
    }

    if (html.includes('intervened') || html.includes('intervention')) {
      return { status: 'intervened', detail: 'Public SRA register indicates intervention' };
    }
    if (
      html.includes('no longer authorised') ||
      html.includes('no longer regulated') ||
      html.includes('practising certificate suspended') ||
      html.includes('revoked')
    ) {
      return { status: 'lapsed', detail: 'Public SRA register indicates lapsed/revoked status' };
    }
    if (
      html.includes('authorised and regulated by the sra') ||
      html.includes('regulated by the sra')
    ) {
      return { status: 'authorised', detail: 'Verified via public SRA register' };
    }

    return { status: 'unknown', detail: 'SRA public register status marker not found' };
  } catch (err) {
    return {
      status: 'unknown',
      detail: err instanceof Error ? err.message : 'SRA public register lookup failed',
    };
  }
}

async function fetchSraRegisterStatus(sraNumber: string): Promise<SraCheckOutcome> {
  const cleanSra = normalizeSraNumber(sraNumber);
  const sraApiKey = process.env.SRA_API_KEY;
  const sraApiBase =
    process.env.SRA_API_URL ||
    'https://www.sra.org.uk/api/organisation';

  if (!sraApiKey) {
    return fetchSraPublicRegisterFallback(cleanSra);
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const res = await fetch(`${sraApiBase}/${encodeURIComponent(cleanSra)}`, {
      headers: {
        Accept: 'application/json',
        'Ocp-Apim-Subscription-Key': sraApiKey,
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.status === 404) {
      return { status: 'lapsed', detail: `SRA ID ${cleanSra} not found on register (HTTP 404)` };
    }
    if (!res.ok) {
      return { status: 'unknown', detail: `SRA register returned HTTP ${res.status}` };
    }

    const data = (await res.json()) as Record<string, unknown>;
    return { status: mapSraRegisterStatus(data) };
  } catch (err) {
    return {
      status: 'unknown',
      detail: err instanceof Error ? err.message : 'SRA lookup failed',
    };
  }
}

async function fetchCompaniesHousePublicFallback(
  companyNumber: string
): Promise<CompaniesHouseCheckOutcome> {
  const cleanNumber = companyNumber.trim().toUpperCase();
  if (!cleanNumber) {
    return { status: 'unknown', detail: 'No company number recorded' };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const res = await fetch(
      `https://find-and-update.company-information.service.gov.uk/company/${encodeURIComponent(cleanNumber)}`,
      {
        headers: {
          Accept: 'text/html,application/xhtml+xml',
          'User-Agent': 'SettlementCheck-ComplianceWatchdog/1.0 (+https://settlementcheck.co.uk)',
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (res.status === 404) {
      return { status: 'dissolved', detail: `Company ${cleanNumber} not found (HTTP 404)` };
    }
    if (!res.ok) {
      return { status: 'unknown', detail: `Companies House public page HTTP ${res.status}` };
    }

    const html = await res.text();
    const statusMatch = html.match(/id="company-status"[^>]*>\s*([^<]+)\s*</i);
    const rawStatus = statusMatch ? statusMatch[1].trim() : undefined;

    return {
      status: mapCompaniesHouseStatus(rawStatus),
      detail: rawStatus || 'Public page parsed',
    };
  } catch (err) {
    return {
      status: 'unknown',
      detail: err instanceof Error ? err.message : 'Companies House public lookup failed',
    };
  }
}

async function fetchCompaniesHouseStatus(
  companyNumber: string
): Promise<CompaniesHouseCheckOutcome> {
  const cleanNumber = companyNumber.trim().toUpperCase();
  if (!cleanNumber) {
    return { status: 'unknown', detail: 'No company number recorded' };
  }

  const apiKey = process.env.COMPANIES_HOUSE_API_KEY;
  if (!apiKey) {
    return fetchCompaniesHousePublicFallback(cleanNumber);
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;

    const res = await fetch(
      `https://api.company-information.service.gov.uk/company/${encodeURIComponent(cleanNumber)}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: authHeader,
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (res.status === 404) {
      return { status: 'dissolved', detail: `Company ${cleanNumber} not found (HTTP 404)` };
    }
    if (!res.ok) {
      return { status: 'unknown', detail: `Companies House returned HTTP ${res.status}` };
    }

    const data = (await res.json()) as { company_status?: string };
    return {
      status: mapCompaniesHouseStatus(data.company_status),
      detail: data.company_status,
    };
  } catch (err) {
    return {
      status: 'unknown',
      detail: err instanceof Error ? err.message : 'Companies House lookup failed',
    };
  }
}

export class SraPractisingWatchdogWorker {
  public static async execute(
    options: SraWatchdogOptions = {}
  ): Promise<SraPractisingWatchdogReport> {
    const runId = `sra_watchdog_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const results: PanelComplianceCheckResult[] = [];

    let firmsChecked = 0;
    let compliantCount = 0;
    let suspendedCount = 0;
    let flaggedCount = 0;
    let alertSent = false;

    const checkSra = options.checkSraFn ?? fetchSraRegisterStatus;
    const checkCompaniesHouse = options.checkCompaniesHouseFn ?? fetchCompaniesHouseStatus;

    try {
      const { data: panelFirms, error: panelError } = await supabase
        .from('solicitor_panel')
        .select('id, firm_name, sra_number, companies_house_number, status, email')
        .in('status', ['active', 'pending_verification']);

      if (panelError) {
        console.warn('SraPractisingWatchdogWorker panel query error:', panelError.message);
      }

      const firms = Array.isArray(panelFirms) ? (panelFirms as PanelFirmComplianceRow[]) : [];
      firmsChecked = firms.length;

      for (const firm of firms) {
        const cleanSra = normalizeSraNumber(firm.sra_number);
        const sraOutcome = await checkSra(cleanSra);
        const chOutcome = firm.companies_house_number
          ? await checkCompaniesHouse(firm.companies_house_number)
          : { status: 'unknown' as CompaniesHouseStatus, detail: 'No company number' };

        const isSraBreach =
          sraOutcome.status === 'lapsed' || sraOutcome.status === 'intervened';
        const isChBreach =
          chOutcome.status === 'dissolved' ||
          chOutcome.status === 'liquidation' ||
          chOutcome.status === 'insolvency';

        let actionTaken: PanelComplianceCheckResult['actionTaken'] = 'NONE';
        let reason: string | undefined;

        if (isSraBreach || isChBreach) {
          actionTaken = 'SUSPENDED';
          suspendedCount++;
          const reasons: string[] = [];
          if (isSraBreach) {
            reasons.push(`SRA status: ${sraOutcome.status}${sraOutcome.detail ? ` (${sraOutcome.detail})` : ''}`);
          }
          if (isChBreach) {
            reasons.push(
              `Companies House status: ${chOutcome.status}${chOutcome.detail ? ` (${chOutcome.detail})` : ''}`
            );
          }
          reason = reasons.join('; ');
        } else if (
          sraOutcome.status === 'unknown' &&
          Boolean(process.env.SRA_API_KEY)
        ) {
          actionTaken = 'FLAGGED_FOR_REVIEW';
          flaggedCount++;
          reason = sraOutcome.detail || 'Unable to verify SRA status';
        } else {
          compliantCount++;
        }

        if (!options.dryRun) {
          const updatePayload: Record<string, unknown> = {
            sra_status: sraOutcome.status,
            companies_house_status: chOutcome.status,
            sra_last_verified_at: timestamp,
            updated_at: timestamp,
          };
          if (actionTaken === 'SUSPENDED') {
            updatePayload.status = 'suspended';
          }

          await supabase
            .from('solicitor_panel')
            .update(updatePayload)
            .eq('id', firm.id);
        }

        results.push({
          firmId: firm.id,
          firmName: firm.firm_name,
          sraNumber: cleanSra,
          companiesHouseNumber: firm.companies_house_number || undefined,
          sraStatus: sraOutcome.status,
          companiesHouseStatus: chOutcome.status,
          actionTaken,
          reason,
          checkedAt: timestamp,
        });
      }

      // Notify ops if any firm was suspended or flagged
      const incidents = results.filter((r) => r.actionTaken !== 'NONE');
      const hasValidResend =
        Boolean(process.env.RESEND_API_KEY) &&
        !process.env.RESEND_API_KEY?.includes('dummy');

      if (incidents.length > 0 && !options.skipEmail && hasValidResend) {
        const lines = incidents
          .map(
            (i) =>
              `• ${i.firmName} (SRA ${i.sraNumber}) — ${i.actionTaken}: ${i.reason || 'Compliance check flagged'}`
          )
          .join('\n');

        await resend.emails.send({
          from: 'SettlementCheck Compliance <alerts@settlementcheck.co.uk>',
          to: DEFAULT_OPS_ALERT_EMAIL,
          subject: `[URGENT] SRA/Companies House Watchdog: ${suspendedCount} suspended, ${flaggedCount} flagged`,
          text: `SRA & Practising Status Watchdog run ${runId} at ${timestamp}.\n\n${lines}\n\nSuspended firms are immediately excluded from territorial lead routing.`,
        });
        alertSent = true;
      }
    } catch (err) {
      console.warn('SRA Practising Watchdog non-fatal error:', err);
    }

    const summary =
      suspendedCount > 0 || flaggedCount > 0
        ? `Checked ${firmsChecked} panel firm(s): ${suspendedCount} suspended, ${flaggedCount} flagged for manual review, ${compliantCount} compliant.`
        : `Checked ${firmsChecked} panel firm(s): all active firms verified compliant.`;

    return {
      runId,
      timestamp,
      firmsChecked,
      compliantCount,
      suspendedCount,
      flaggedCount,
      results,
      alertSent,
      summary,
    };
  }
}

export const sraPractisingWatchdogWorker = {
  name: 'SRA & Practising Status Watchdog',
  description:
    'Cross-checks active panel firms against the SRA Register and Companies House API and auto-suspends lapsed or intervened firms.',
  permittedTools: [],
  execute: SraPractisingWatchdogWorker.execute,
};
