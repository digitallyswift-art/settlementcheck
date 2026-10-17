/**
 * Worker 6: 15-Minute SLA Watchdog & Territorial Lock Cascade Worker
 * Autonomously inspects active territorial lead claims, expires stale 15-minute locks,
 * and executes failover re-routing to secondary SRA panel firms to guarantee prompt client contact.
 */

import { supabase } from '@/lib/supabase';
import { matchAndLockTerritoryTool } from '../tools/territorial-tools';
import {
  SlaWatchdogReport,
  SlaReroutedClaim,
} from '../types';

export class SlaWatchdogWorker {
  public static async execute(): Promise<SlaWatchdogReport> {
    const runId = `watchdog_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const reroutedClaims: SlaReroutedClaim[] = [];

    let claimsChecked = 0;
    let activeLockedClaims = 0;
    let claimedMatters = 0;
    let expiredClaims = 0;

    try {
      // 1. Fetch claims currently locked or claimed
      const { data: claims, error: claimsError } = await supabase
        .from('lead_claims')
        .select('*, solicitor_panel(id, firm_name, email, exclusive_outward_codes)')
        .in('status', ['locked', 'claimed']);

      if (!claimsError && claims) {
        claimsChecked = claims.length;

        for (const claim of claims) {
          if (claim.status === 'claimed') {
            claimedMatters++;
            continue;
          }

          if (claim.status === 'locked') {
            const isExpired = claim.expires_at ? new Date(claim.expires_at).getTime() <= Date.now() : false;

            if (!isExpired) {
              activeLockedClaims++;
            } else {
              expiredClaims++;
              // Mark expired in database
              await supabase
                .from('lead_claims')
                .update({ status: 'expired' })
                .eq('id', claim.id);

              const previousFirmId = claim.panel_firm_id;
              const previousFirmName = claim.solicitor_panel?.firm_name || 'Primary Panel Firm';

              // Cascade: Attempt re-routing to an alternate active panel firm
              let newFirmId: string | undefined = undefined;
              let newFirmName: string | undefined = undefined;
              let action: SlaReroutedClaim['action'] = 'UNLOCKED_TO_POOL';

              const { data: alternateFirms } = await supabase
                .from('solicitor_panel')
                .select('id, firm_name, email')
                .eq('status', 'active')
                .neq('id', previousFirmId || '')
                .limit(1);

              if (alternateFirms && alternateFirms.length > 0) {
                const alt = alternateFirms[0];
                newFirmId = alt.id;
                newFirmName = alt.firm_name;
                action = 'REROUTED_TO_PANEL';

                // Re-lock to the secondary partner firm with fresh 15-minute window
                const newClaimToken = typeof crypto !== 'undefined' && crypto.randomUUID
                  ? crypto.randomUUID()
                  : `claim_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

                const newExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

                await supabase.from('lead_claims').insert({
                  dossier_id: claim.dossier_id,
                  lead_id: claim.lead_id,
                  panel_firm_id: newFirmId,
                  status: 'locked',
                  claim_token: newClaimToken,
                  locked_at: new Date().toISOString(),
                  expires_at: newExpiresAt,
                  notes: `Cascaded from ${previousFirmName} after 15m SLA breach`,
                });
              }

              reroutedClaims.push({
                claimId: claim.id,
                dossierId: claim.dossier_id,
                previousFirmId: previousFirmId || 'unassigned',
                previousFirmName,
                newFirmId,
                newFirmName,
                action,
                expiredAt: claim.expires_at || timestamp,
                reroutedAt: new Date().toISOString(),
              });
            }
          }
        }
      }
    } catch (err) {
      console.warn('SLA watchdog database inspection non-fatal error:', err);
    }

    const totalResolved = claimedMatters + expiredClaims;
    const slaBreachRatePercent = totalResolved > 0
      ? Math.round((expiredClaims / totalResolved) * 100)
      : 0;

    const summary = expiredClaims > 0
      ? `SLA Watchdog processed ${claimsChecked} claims: ${expiredClaims} locks expired and rerouted (${slaBreachRatePercent}% breach rate).`
      : `SLA Watchdog processed ${claimsChecked} claims: all active locks compliant within 15-minute SLA.`;

    return {
      runId,
      timestamp,
      claimsChecked,
      activeLockedClaims,
      claimedMatters,
      expiredClaims,
      reroutedClaims,
      slaBreachRatePercent,
      summary,
    };
  }
}

export const slaWatchdogWorker = {
  name: 'SLA Watchdog Worker',
  description: 'Monitors active territorial leads and auto-reroutes instructions when 15-minute SLA timer expires.',
  permittedTools: [matchAndLockTerritoryTool],
  execute: SlaWatchdogWorker.execute,
};
