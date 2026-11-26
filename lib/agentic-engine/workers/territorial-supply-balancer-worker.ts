/**
 * Worker 9: Territorial Supply-Demand Balancer
 * Correlates consented employee demand and expired/unclaimed lead claims by
 * region and practice area against active panel capacity.
 * When a regional bottleneck develops (e.g., Manchester discrimination leads
 * expiring unclaimed), triggers privacy-safe solicitor onboarding outreach and
 * flags or applies routing weight adjustments.
 */

import { supabase } from '@/lib/supabase';
import { resend } from '@/lib/resend';
import { calculateDistanceMiles, extractOutwardCode } from '../tools/territorial-tools';
import {
  RegionSupplyDemandBottleneck,
  RoutingWeightAdjustmentRecommendation,
  SolicitorOutreachTrigger,
  TerritorialSupplyBalancerReport,
} from '../types';

const LOOKBACK_DAYS = 30;
const K_ANONYMITY_THRESHOLD = 3;
const DEFAULT_COVERAGE_RADIUS_MILES = 25;
const DEFAULT_OPS_ALERT_EMAIL =
  process.env.OPS_ALERT_EMAIL ||
  process.env.NOTIFICATION_EMAIL ||
  'ops@settlementcheck.co.uk';

interface LeadDemandRow {
  id: string;
  postcode: string | null;
  postcode_region: string | null;
  postcode_lat: number | string | null;
  postcode_lng: number | string | null;
  practice_area: string | null;
  created_at: string;
}

interface ExpiredClaimRow {
  id: string;
  lead_id: string | null;
  panel_firm_id: string | null;
  status: string;
}

interface PanelCapacityRow {
  id: string;
  firm_name: string;
  email: string;
  office_region: string | null;
  office_lat: number | string | null;
  office_lng: number | string | null;
  coverage_radius_miles: number | null;
  exclusive_outward_codes: string[] | null;
  practice_areas: string[] | null;
  weekly_capacity: number | null;
  routing_weight: number | null;
  status: string;
}

export interface SupplyBalancerOptions {
  /** Persist recommended routing_weight updates to solicitor_panel (default false: flag only) */
  applyWeightAdjustments?: boolean;
  /** Dispatch privacy-safe onboarding outreach emails via Resend (default false) */
  dispatchOutreach?: boolean;
}

function normalizePracticeArea(raw: string | null | undefined): string {
  const cleaned = (raw || '').trim().toLowerCase();
  return cleaned || 'settlement_agreement';
}

function normalizeRegion(raw: string | null | undefined, postcode: string | null | undefined): string {
  const region = (raw || '').trim();
  if (region) return region;
  if (postcode) return extractOutwardCode(postcode.toUpperCase());
  return 'United Kingdom';
}

function firmCoversLead(firm: PanelCapacityRow, lead: LeadDemandRow): boolean {
  const leadPracticeArea = normalizePracticeArea(lead.practice_area);
  const firmAreas = Array.isArray(firm.practice_areas) && firm.practice_areas.length > 0
    ? firm.practice_areas.map((a) => a.toLowerCase())
    : ['settlement_agreement'];

  if (!firmAreas.includes(leadPracticeArea) && !firmAreas.includes('all')) {
    return false;
  }

  if (lead.postcode && Array.isArray(firm.exclusive_outward_codes)) {
    const outward = extractOutwardCode(lead.postcode.toUpperCase());
    if (firm.exclusive_outward_codes.some((c) => c.toUpperCase() === outward)) {
      return true;
    }
  }

  const leadLat = Number(lead.postcode_lat);
  const leadLng = Number(lead.postcode_lng);
  const firmLat = Number(firm.office_lat);
  const firmLng = Number(firm.office_lng);

  if (
    Number.isFinite(leadLat) &&
    Number.isFinite(leadLng) &&
    Number.isFinite(firmLat) &&
    Number.isFinite(firmLng)
  ) {
    const radius = firm.coverage_radius_miles ?? DEFAULT_COVERAGE_RADIUS_MILES;
    return calculateDistanceMiles(leadLat, leadLng, firmLat, firmLng) <= radius;
  }

  return false;
}

export class TerritorialSupplyBalancerWorker {
  public static async execute(
    options: SupplyBalancerOptions = {}
  ): Promise<TerritorialSupplyBalancerReport> {
    const runId = `supply_balancer_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const bottlenecks: RegionSupplyDemandBottleneck[] = [];
    const weightAdjustments: RoutingWeightAdjustmentRecommendation[] = [];
    const outreachTriggers: SolicitorOutreachTrigger[] = [];

    let leadsAnalyzed = 0;
    let expiredClaimsAnalyzed = 0;
    let activePanelFirms = 0;

    try {
      const cutoffIso = new Date(
        Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000
      ).toISOString();

      const [
        { data: leadRows, error: leadsError },
        { data: claimRows, error: claimsError },
        { data: panelRows, error: panelError },
      ] = await Promise.all([
        supabase
          .from('leads')
          .select('id, postcode, postcode_region, postcode_lat, postcode_lng, practice_area, created_at')
          .eq('consent', true)
          .gte('created_at', cutoffIso),
        supabase
          .from('lead_claims')
          .select('id, lead_id, panel_firm_id, status')
          .in('status', ['expired', 'released'])
          .gte('created_at', cutoffIso),
        supabase
          .from('solicitor_panel')
          .select(
            'id, firm_name, email, office_region, office_lat, office_lng, coverage_radius_miles, exclusive_outward_codes, practice_areas, weekly_capacity, routing_weight, status'
          )
          .eq('status', 'active'),
      ]);

      if (leadsError) console.warn('SupplyBalancer leads error:', leadsError.message);
      if (claimsError) console.warn('SupplyBalancer claims error:', claimsError.message);
      if (panelError) console.warn('SupplyBalancer panel error:', panelError.message);

      const leads = Array.isArray(leadRows) ? (leadRows as LeadDemandRow[]) : [];
      const expiredClaims = Array.isArray(claimRows) ? (claimRows as ExpiredClaimRow[]) : [];
      const panel = Array.isArray(panelRows) ? (panelRows as PanelCapacityRow[]) : [];

      leadsAnalyzed = leads.length;
      expiredClaimsAnalyzed = expiredClaims.length;
      activePanelFirms = panel.length;

      const expiredByLeadId = new Map<string, number>();
      const expiredByFirmId = new Map<string, number>();
      for (const claim of expiredClaims) {
        if (claim.lead_id) {
          expiredByLeadId.set(claim.lead_id, (expiredByLeadId.get(claim.lead_id) || 0) + 1);
        }
        if (claim.panel_firm_id) {
          expiredByFirmId.set(
            claim.panel_firm_id,
            (expiredByFirmId.get(claim.panel_firm_id) || 0) + 1
          );
        }
      }

      // Group demand by (region, practiceArea)
      const buckets = new Map<
        string,
        { region: string; practiceArea: string; leads: LeadDemandRow[]; expiredCount: number }
      >();

      for (const lead of leads) {
        const region = normalizeRegion(lead.postcode_region, lead.postcode);
        const practiceArea = normalizePracticeArea(lead.practice_area);
        const key = `${region}::${practiceArea}`;
        const existing = buckets.get(key) || {
          region,
          practiceArea,
          leads: [],
          expiredCount: 0,
        };
        existing.leads.push(lead);
        existing.expiredCount += expiredByLeadId.get(lead.id) || 0;
        buckets.set(key, existing);
      }

      const hasValidResend =
        Boolean(process.env.RESEND_API_KEY) &&
        !process.env.RESEND_API_KEY?.includes('dummy');

      // Evaluate each (region, practiceArea) bucket against active panel capacity
      for (const bucket of buckets.values()) {
        const coveringFirms = panel.filter((firm) =>
          bucket.leads.some((lead) => firmCoversLead(firm, lead))
        );

        const totalWeeklyCapacity = coveringFirms.reduce(
          (sum, f) => sum + (f.weekly_capacity ?? 10),
          0
        );
        const monthlyCapacity = Math.max(totalWeeklyCapacity * 4, 0);
        const demandToCapacityRatio =
          monthlyCapacity > 0
            ? Math.round((bucket.leads.length / monthlyCapacity) * 100) / 100
            : bucket.leads.length;

        const isBottleneck =
          (coveringFirms.length === 0 && bucket.leads.length >= K_ANONYMITY_THRESHOLD) ||
          bucket.expiredCount >= 2 ||
          (monthlyCapacity > 0 && demandToCapacityRatio >= 1.25 && bucket.leads.length >= K_ANONYMITY_THRESHOLD);

        if (!isBottleneck) continue;

        const severity: RegionSupplyDemandBottleneck['severity'] =
          coveringFirms.length === 0 || bucket.expiredCount >= 4
            ? 'CRITICAL'
            : bucket.expiredCount >= 2 || demandToCapacityRatio >= 1.5
            ? 'HIGH'
            : 'MODERATE';

        const brief = `${bucket.region} (${bucket.practiceArea}): ${bucket.leads.length} consented leads, ${bucket.expiredCount} expired/unclaimed, ${coveringFirms.length} active firm(s).`;

        bottlenecks.push({
          region: bucket.region,
          practiceArea: bucket.practiceArea,
          recentLeadCount: bucket.leads.length,
          expiredClaimsCount: bucket.expiredCount,
          activePanelFirms: coveringFirms.length,
          totalWeeklyCapacity,
          demandToCapacityRatio,
          severity,
          brief,
        });

        // 1. Flag / apply routing weight adjustments for firms in this bottleneck
        for (const firm of coveringFirms) {
          const currentWeight = firm.routing_weight ?? 100;
          const firmExpiredCount = expiredByFirmId.get(firm.id) || 0;

          if (firmExpiredCount >= 2 && currentWeight > 40) {
            const recommendedWeight = Math.max(25, currentWeight - 35);
            let applied = false;
            if (options.applyWeightAdjustments) {
              await supabase
                .from('solicitor_panel')
                .update({ routing_weight: recommendedWeight, updated_at: timestamp })
                .eq('id', firm.id);
              applied = true;
            }
            weightAdjustments.push({
              firmId: firm.id,
              firmName: firm.firm_name,
              region: bucket.region,
              currentWeight,
              recommendedWeight,
              reason: `${firmExpiredCount} SLA-expired claims in 30d; throttle routing weight`,
              applied,
            });
          } else if (firmExpiredCount === 0 && currentWeight < 150 && coveringFirms.length > 1) {
            const recommendedWeight = Math.min(200, currentWeight + 25);
            let applied = false;
            if (options.applyWeightAdjustments) {
              await supabase
                .from('solicitor_panel')
                .update({ routing_weight: recommendedWeight, updated_at: timestamp })
                .eq('id', firm.id);
              applied = true;
            }
            weightAdjustments.push({
              firmId: firm.id,
              firmName: firm.firm_name,
              region: bucket.region,
              currentWeight,
              recommendedWeight,
              reason: `0 expired claims during ${bucket.region} bottleneck; boost priority`,
              applied,
            });
          }
        }

        // 2. Trigger privacy-safe solicitor onboarding outreach (k-anonymity >= 3 enforced)
        if (bucket.leads.length >= K_ANONYMITY_THRESHOLD) {
          const subject = `[Panel Capacity Alert] ${bucket.region} ${bucket.practiceArea.replace(/_/g, ' ')} demand (${bucket.leads.length}+ recent enquiries)`;
          let dispatched = false;

          if (options.dispatchOutreach && hasValidResend) {
            await resend.emails.send({
              from: 'SettlementCheck Panel Growth <panel@settlementcheck.co.uk>',
              to: DEFAULT_OPS_ALERT_EMAIL,
              subject,
              text: [
                `Territorial Supply-Demand Bottleneck Detected (${severity})`,
                `Region: ${bucket.region}`,
                `Practice Area: ${bucket.practiceArea}`,
                `30-Day Consented Demand: ${bucket.leads.length} enquiries`,
                `Expired / Unclaimed Claims: ${bucket.expiredCount}`,
                `Active Panel Firms: ${coveringFirms.length} (Weekly capacity: ${totalWeeklyCapacity})`,
                '',
                'Recommended Action: Onboard additional SRA-regulated employment solicitors covering this region/practice area.',
              ].join('\n'),
            });
            dispatched = true;
          }

          outreachTriggers.push({
            region: bucket.region,
            practiceArea: bucket.practiceArea,
            targetChannel: 'ops_digest',
            recipientCount: 1,
            subject,
            dispatched,
          });
        }
      }
    } catch (err) {
      console.warn('Territorial Supply Balancer non-fatal error:', err);
    }

    const summary =
      bottlenecks.length > 0
        ? `Detected ${bottlenecks.length} regional supply-demand bottleneck(s) across ${leadsAnalyzed} leads; flagged ${weightAdjustments.length} routing weight adjustment(s) and ${outreachTriggers.length} outreach trigger(s).`
        : `Analyzed ${leadsAnalyzed} leads across ${activePanelFirms} active panel firm(s): supply and demand balanced.`;

    return {
      runId,
      timestamp,
      leadsAnalyzed,
      expiredClaimsAnalyzed,
      activePanelFirms,
      bottlenecks,
      weightAdjustments,
      outreachTriggers,
      summary,
    };
  }
}

export const territorialSupplyBalancerWorker = {
  name: 'Territorial Supply-Demand Balancer',
  description:
    'Correlates regional lead demand and expired claims against active panel capacity, triggering onboarding outreach and routing weight adjustments.',
  permittedTools: [],
  execute: TerritorialSupplyBalancerWorker.execute,
};
