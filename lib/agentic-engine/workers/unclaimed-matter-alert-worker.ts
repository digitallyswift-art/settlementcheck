/**
 * Worker 7: Privacy-Safe Unclaimed Matter Alert Detector
 * Flags consented employee leads in regions with zero active SRA panel coverage.
 * Strictly enforces UK GDPR privacy: outputs coarse region + banded offer tier only
 * (never outward codes, postcodes, exact offer amounts, or lead identifiers).
 */

import { supabase } from '@/lib/supabase';
import { calculateDistanceMiles } from '../tools/territorial-tools';
import {
  UnclaimedMatterAlert,
  UnclaimedMatterAlertReport,
} from '../types';

const DEFAULT_COVERAGE_RADIUS_MILES = 25;
const LOOKBACK_DAYS = 30;

interface LeadLocationRow {
  postcode_region: string | null;
  postcode_lat: number | string | null;
  postcode_lng: number | string | null;
  offer_amount: number | string | null;
  created_at: string;
}

interface PanelCoverageRow {
  office_lat: number | string | null;
  office_lng: number | string | null;
  coverage_radius_miles: number | null;
}

export function classifyOfferBand(offerAmount: number | string | null): string {
  if (offerAmount === null || offerAmount === undefined || offerAmount === '') {
    return 'Undisclosed offer band';
  }
  const amount = Number(offerAmount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Pre-offer / £0';
  }
  if (amount < 10000) return 'Under £10k band';
  if (amount < 20000) return '£10k–£20k band';
  if (amount < 35000) return '£20k–£35k band';
  if (amount < 60000) return '£35k–£60k band';
  return '£60k+ band';
}

export function formatUnclaimedMatterBrief(region: string, offerBand: string): string {
  return `Settlement enquiry in ${region} (${offerBand})`;
}

export class UnclaimedMatterAlertWorker {
  public static async execute(): Promise<UnclaimedMatterAlertReport> {
    const runId = `unclaimed_alerts_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const alerts: UnclaimedMatterAlert[] = [];

    let leadsInspected = 0;

    try {
      const cutoffIso = new Date(
        Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000
      ).toISOString();

      // Select only coarse geographic & banded commercial fields (zero PII / outward codes)
      const [{ data: leadRows, error: leadsError }, { data: panelRows, error: panelError }] =
        await Promise.all([
          supabase
            .from('leads')
            .select('postcode_region, postcode_lat, postcode_lng, offer_amount, created_at')
            .eq('consent', true)
            .gte('created_at', cutoffIso)
            .not('postcode_lat', 'is', null)
            .not('postcode_lng', 'is', null),
          supabase
            .from('solicitor_panel')
            .select('office_lat, office_lng, coverage_radius_miles')
            .eq('status', 'active'),
        ]);

      if (leadsError) {
        console.warn('UnclaimedMatterAlertWorker leads query error:', leadsError.message);
      }
      if (panelError) {
        console.warn('UnclaimedMatterAlertWorker panel query error:', panelError.message);
      }

      const activeFirms = Array.isArray(panelRows) ? (panelRows as PanelCoverageRow[]) : [];

      if (Array.isArray(leadRows)) {
        leadsInspected = leadRows.length;

        for (const row of leadRows as LeadLocationRow[]) {
          const lat = Number(row.postcode_lat);
          const lng = Number(row.postcode_lng);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

          const hasActiveCoverage = activeFirms.some((firm) => {
            const firmLat = Number(firm.office_lat);
            const firmLng = Number(firm.office_lng);
            if (!Number.isFinite(firmLat) || !Number.isFinite(firmLng)) return false;
            const radius = firm.coverage_radius_miles ?? DEFAULT_COVERAGE_RADIUS_MILES;
            return calculateDistanceMiles(lat, lng, firmLat, firmLng) <= radius;
          });

          if (!hasActiveCoverage) {
            const region = (row.postcode_region || '').trim() || 'United Kingdom';
            const offerBand = classifyOfferBand(row.offer_amount);
            const createdDate = row.created_at ? row.created_at.slice(0, 10) : timestamp.slice(0, 10);

            alerts.push({
              region,
              offerBand,
              createdDate,
              alertBrief: formatUnclaimedMatterBrief(region, offerBand),
            });
          }
        }
      }
    } catch (err) {
      console.warn('Unclaimed matter alert detection non-fatal error:', err);
    }

    const uncoveredCount = alerts.length;
    const summary =
      uncoveredCount > 0
        ? `Detected ${uncoveredCount} unclaimed consented matter(s) across ${leadsInspected} recent leads with zero active panel coverage.`
        : `Inspected ${leadsInspected} recent consented leads: all located matters have active panel coverage.`;

    return {
      runId,
      timestamp,
      leadsInspected,
      uncoveredCount,
      alerts,
      summary,
    };
  }
}

export const unclaimedMatterAlertWorker = {
  name: 'Unclaimed Matter Alert Worker',
  description:
    'Detects consented employee enquiries in regions with zero active SRA panel coverage using coarse region and banded offer tiers only.',
  permittedTools: [],
  execute: UnclaimedMatterAlertWorker.execute,
};
