#!/usr/bin/env node
/**
 * SettlementCheck 15-Minute Territorial SLA Watchdog
 * Autonomous background agent monitoring territorial matter reservations,
 * expiring unresponsive locks, and cascading matters to secondary panel firms.
 *
 * Usage:
 *   node scripts/watchdog/sla-watchdog.mjs
 *   npm run watchdog:sla
 *   node scripts/watchdog/sla-watchdog.mjs --daemon --interval=60
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const isDaemon = process.argv.includes('--daemon');
const intervalArg = process.argv.find(a => a.startsWith('--interval='));
const intervalSeconds = intervalArg ? parseInt(intervalArg.split('=')[1], 10) : 60;

async function checkSlaWatchdog() {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ⏱️  SLA Watchdog Inspection Running...`);

  let claims = [];
  try {
    const { data, error } = await supabase
      .from('lead_claims')
      .select('*, solicitor_panel(id, firm_name, email)')
      .in('status', ['locked', 'claimed']);

    if (error) {
      console.warn(`[WARN] Database query warning (may be offline / local mock): ${error.message}`);
    } else {
      claims = data || [];
    }
  } catch (err) {
    console.warn(`[WARN] Supabase connection error: ${err.message}`);
  }

  const now = Date.now();
  let lockedCount = 0;
  let claimedCount = 0;
  let expiredCount = 0;
  const actions = [];

  for (const claim of claims) {
    if (claim.status === 'claimed') {
      claimedCount++;
      continue;
    }

    if (claim.status === 'locked') {
      const expiresAtMs = claim.expires_at ? new Date(claim.expires_at).getTime() : now + 15 * 60 * 1000;
      const remainingSec = Math.floor((expiresAtMs - now) / 1000);

      if (remainingSec > 0) {
        lockedCount++;
        console.log(`  🔒 Active Lock: Dossier [${claim.dossier_id}] locked to "${claim.solicitor_panel?.firm_name || 'Panel Firm'}" (${Math.floor(remainingSec / 60)}m ${remainingSec % 60}s remaining)`);
      } else {
        // Expired!
        expiredCount++;
        console.log(`  ⚠️ EXPIRED LOCK: Dossier [${claim.dossier_id}] breached 15m SLA!`);

        try {
          // 1. Mark expired
          await supabase
            .from('lead_claims')
            .update({ status: 'expired' })
            .eq('id', claim.id);

          // 2. Query alternate panel firm
          const { data: altFirms } = await supabase
            .from('solicitor_panel')
            .select('id, firm_name, email')
            .eq('status', 'active')
            .neq('id', claim.panel_firm_id || '')
            .limit(1);

          if (altFirms && altFirms.length > 0) {
            const nextFirm = altFirms[0];
            const newClaimToken = `claim_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
            const newExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

            await supabase.from('lead_claims').insert({
              dossier_id: claim.dossier_id,
              lead_id: claim.lead_id,
              panel_firm_id: nextFirm.id,
              status: 'locked',
              claim_token: newClaimToken,
              locked_at: new Date().toISOString(),
              expires_at: newExpiresAt,
              notes: `Auto-cascaded from firm [${claim.panel_firm_id}] following 15m SLA timeout`,
            });

            actions.push(`Cascaded dossier [${claim.dossier_id}] to fallback firm "${nextFirm.firm_name}"`);
            console.log(`  ⚡ [FAILOVER ACTIVE] Re-locked to secondary partner: "${nextFirm.firm_name}" (Fresh 15m SLA clock started).`);
          } else {
            actions.push(`Released dossier [${claim.dossier_id}] to unreserved general panel queue`);
            console.log(`  🔓 [QUEUE UNLOCKED] Matter released to general panel pool.`);
          }
        } catch (cascadeErr) {
          console.error(`  [ERROR] Cascade reroute failed:`, cascadeErr.message);
        }
      }
    }
  }

  console.log(`--- SLA Watchdog Summary ---`);
  console.log(`• Total Claims Monitored: ${claims.length}`);
  console.log(`• Active Enforced Locks:  ${lockedCount}`);
  console.log(`• Claimed & Retained:     ${claimedCount}`);
  console.log(`• Expired & Cascaded:     ${expiredCount}`);
  console.log(`• Status:                 ${expiredCount > 0 ? 'FAILOVER ACTIONS EXECUTED' : 'ALL LOCKS HEALTHY'}\n`);
}

async function main() {
  console.log('======================================================');
  console.log('⏱️  SettlementCheck 15-Minute SLA Territorial Watchdog');
  console.log('======================================================');

  if (isDaemon) {
    console.log(`[DAEMON MODE] Polling every ${intervalSeconds} seconds. Press Ctrl+C to terminate.`);
    await checkSlaWatchdog();
    setInterval(checkSlaWatchdog, intervalSeconds * 1000);
  } else {
    await checkSlaWatchdog();
    console.log('✅ Single-pass inspection finished.');
  }
}

main().catch(err => {
  console.error('Watchdog process encountered fatal error:', err);
  process.exit(1);
});
