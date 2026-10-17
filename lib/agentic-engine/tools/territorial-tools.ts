/**
 * Tool 5: Territorial Matchmaker & SRA Panel Exclusivity Lock
 * Geocodes UK postcodes, matches designated regional SRA partner firms,
 * and enforces the 15-minute territorial exclusivity lock.
 */

import { AIToolDefinition } from '@/lib/ai/types';
import { lookupPostcode, normalisePostcode, isPlausibleUkPostcode } from '@/lib/postcodes';
import { supabase } from '@/lib/supabase';
import { TerritorialRoutingReport } from '../types';

/**
 * Deterministic Haversine distance in statute miles
 */
export function calculateDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Extracts outward postal code (e.g. "BS8", "SW1A", "M1")
 */
export function extractOutwardCode(normalizedPostcode: string): string {
  const parts = normalizedPostcode.trim().split(/\s+/);
  return parts[0] || normalizedPostcode;
}

export const matchAndLockTerritoryTool: AIToolDefinition = {
  name: 'match_and_lock_territory',
  description: 'Geocodes employee postcode, matches designated regional SRA partner firm, and enforces territorial exclusivity lock with a 15-minute SLA timer.',
  parameters: {
    type: 'object',
    properties: {
      postcode: { type: 'string', description: 'UK employee postcode (e.g. M1 1AE, SW1A 1AA, BS8 1TH)' },
      partnerId: { type: 'string', description: 'Explicit partner ID if routed from B2B widget' },
      dossierId: { type: 'string', description: 'Unique identifier for the compiled pre-flight dossier' },
    },
    required: ['postcode'],
  },
  execute: async (args) => {
    const rawPostcode = String(args.postcode || '').trim();
    const explicitPartnerId = args.partnerId ? String(args.partnerId) : undefined;
    const dossierId = args.dossierId ? String(args.dossierId) : `dossier_${Date.now()}`;

    let normalized = rawPostcode.toUpperCase();
    let adminDistrict = 'United Kingdom';
    let region: string | null = null;
    let employeeLat: number | undefined = undefined;
    let employeeLng: number | undefined = undefined;

    if (isPlausibleUkPostcode(rawPostcode)) {
      normalized = normalisePostcode(rawPostcode);
      const geo = await lookupPostcode(rawPostcode);
      if (geo) {
        adminDistrict = geo.admin_district || geo.country || 'United Kingdom';
        region = geo.region;
        employeeLat = geo.latitude;
        employeeLng = geo.longitude;
      }
    }

    const outwardCode = extractOutwardCode(normalized);

    let matchedFirmId = explicitPartnerId;
    let matchedFirmName = 'SettlementCheck Panel Solicitor';
    let matchedFirmEmail: string | undefined = undefined;
    let matchedDistanceMiles: number | undefined = undefined;

    // 1. Query solicitor_panel with Haversine radius and outward code mapping
    try {
      if (explicitPartnerId) {
        const { data: explicitPanel } = await supabase
          .from('solicitor_panel')
          .select('id, firm_name, email, office_lat, office_lng')
          .eq('id', explicitPartnerId)
          .single();

        if (explicitPanel) {
          matchedFirmName = explicitPanel.firm_name;
          matchedFirmEmail = explicitPanel.email;
          if (employeeLat && employeeLng && explicitPanel.office_lat && explicitPanel.office_lng) {
            matchedDistanceMiles = calculateDistanceMiles(
              employeeLat,
              employeeLng,
              Number(explicitPanel.office_lat),
              Number(explicitPanel.office_lng)
            );
          }
        }
      } else {
        // Query active panel firms
        const { data: panelFirms, error: panelError } = await supabase
          .from('solicitor_panel')
          .select('id, firm_name, email, office_lat, office_lng, coverage_radius_miles, exclusive_outward_codes')
          .eq('status', 'active');

        if (!panelError && panelFirms && panelFirms.length > 0) {
          // Priority A: Exclusive Outward Code Match
          const exclusiveMatch = panelFirms.find(firm =>
            Array.isArray(firm.exclusive_outward_codes) &&
            firm.exclusive_outward_codes.some((code: string) => code.toUpperCase() === outwardCode)
          );

          if (exclusiveMatch) {
            matchedFirmId = exclusiveMatch.id;
            matchedFirmName = exclusiveMatch.firm_name;
            matchedFirmEmail = exclusiveMatch.email;
            if (employeeLat && employeeLng && exclusiveMatch.office_lat && exclusiveMatch.office_lng) {
              matchedDistanceMiles = calculateDistanceMiles(
                employeeLat,
                employeeLng,
                Number(exclusiveMatch.office_lat),
                Number(exclusiveMatch.office_lng)
              );
            }
          } else if (employeeLat && employeeLng) {
            // Priority B: Closest firm within coverage radius
            let closestFirm: any = null;
            let minDistance = Infinity;

            for (const firm of panelFirms) {
              if (firm.office_lat && firm.office_lng) {
                const dist = calculateDistanceMiles(
                  employeeLat,
                  employeeLng,
                  Number(firm.office_lat),
                  Number(firm.office_lng)
                );
                const maxRadius = Number(firm.coverage_radius_miles || 25);
                if (dist <= maxRadius && dist < minDistance) {
                  minDistance = dist;
                  closestFirm = firm;
                }
              }
            }

            if (closestFirm) {
              matchedFirmId = closestFirm.id;
              matchedFirmName = closestFirm.firm_name;
              matchedFirmEmail = closestFirm.email;
              matchedDistanceMiles = minDistance;
            }
          }

          // Fallback to first active firm if no geographic match yet
          if (!matchedFirmId && panelFirms.length > 0) {
            matchedFirmId = panelFirms[0].id;
            matchedFirmName = panelFirms[0].firm_name;
            matchedFirmEmail = panelFirms[0].email;
          }
        }
      }
    } catch (panelErr) {
      console.warn('Panel lookup error (falling back to applications):', panelErr);
    }

    // Fallback to legacy solicitor_applications table if panel firm wasn't found
    if (!matchedFirmEmail) {
      try {
        const { data: legacyData } = await supabase
          .from('solicitor_applications')
          .select('id, firm_name, email')
          .eq('status', 'approved')
          .limit(1);

        if (legacyData && legacyData.length > 0) {
          matchedFirmId = matchedFirmId || legacyData[0].id;
          matchedFirmName = matchedFirmName === 'SettlementCheck Panel Solicitor' ? legacyData[0].firm_name : matchedFirmName;
          matchedFirmEmail = legacyData[0].email;
        }
      } catch {
        // Safe non-blocking fallback
      }
    }

    // 2. Generate 15-Minute Exclusivity Lock & Claim Token
    const claimToken = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `claim_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const lockExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const claimUrl = `https://settlementcheck.co.uk/dossier/review/${dossierId}/?token=${claimToken}`;

    // Register lock in lead_claims table (non-blocking)
    if (matchedFirmId) {
      try {
        await supabase.from('lead_claims').insert({
          dossier_id: dossierId,
          panel_firm_id: matchedFirmId,
          status: 'locked',
          claim_token: claimToken,
          locked_at: new Date().toISOString(),
          expires_at: lockExpiresAt,
        });
      } catch (claimErr) {
        console.warn('Territorial lead claim insert non-fatal error:', claimErr);
      }
    }

    const report: TerritorialRoutingReport = {
      postcode: rawPostcode,
      normalizedPostcode: normalized,
      adminDistrict,
      region,
      matchedFirmId,
      matchedFirmName,
      matchedFirmEmail,
      isTerritoryLocked: true,
      slaWatchdogMinutes: 15,
      claimToken,
      claimUrl,
      lockExpiresAt,
      distanceMiles: matchedDistanceMiles,
    };

    return report as unknown as Record<string, unknown>;
  },
};
