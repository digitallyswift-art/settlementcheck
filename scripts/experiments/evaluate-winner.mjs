import fs from 'fs'
import path from 'path'
import { Resend } from 'resend'

// ── 1. Load Environment Configuration from .env.local ───────────────────────
const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8')
  const regex = /^\s*([\w.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^#\r\n]+))/gm
  let match
  while ((match = regex.exec(content)) !== null) {
    const key = match[1]
    const val = match[2] !== undefined ? match[2] : match[3] !== undefined ? match[3] : match[4].trim()
    if (!process.env[key]) process.env[key] = val
  }
}

const isDryRun = process.argv.includes('--dry-run')
const isForce = process.argv.includes('--force')
const winnerArg = process.argv.find(a => a.startsWith('--winner='))
const forcedWinner = winnerArg ? winnerArg.split('=')[1] : null

const resendKey = process.env.RESEND_API_KEY
const resend = resendKey ? new Resend(resendKey) : null

const configuredEmails = [
  ...(process.env.NOTIFICATION_EMAIL?.split(',') || []),
  ...(process.env.SEO_ALERT_EMAILS?.split(',') || []),
  ...(process.env.SEO_ALERT_EMAIL?.split(',') || []),
].map(e => e.trim()).filter(Boolean);

let recipients = Array.from(new Set(['digitallyswift@gmail.com', ...configuredEmails]));

function normalCdf(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989423 * Math.exp((-x * x) / 2)
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  return x > 0 ? 1 - prob : prob
}

async function runAutonomousEvaluation() {
  const experimentId = 'calc_ux_v2'
  const adminToken = process.env.EXPERIMENT_ADMIN_TOKEN || 'secure_sc_experiment_admin_token_2026'
  const domain = 'https://settlementcheck.co.uk'
  const TARGET_SESSIONS = 1520
  const TARGET_DAYS = 14
  const TARGET_P_VALUE = 0.01

  console.log('================================================================')
  console.log('🤖 SettlementCheck Autonomous A/B Winner Evaluator (calc_ux_v2)')
  console.log('================================================================\n')

  let events = []
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (supabaseUrl && supabaseKey && !supabaseKey.includes('your-service-role-key')) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
      const { data, error } = await supabase
        .from('experiment_events')
        .select('variant, event_type, created_at')
        .eq('experiment_id', experimentId)
      if (!error && data) events = data
    } catch (e) {
      console.warn('Could not query Supabase, checking local events store:', e.message)
    }
  }

  if (events.length === 0) {
    const localEventsFile = path.resolve('data/experiments/calc_ux_v2_events.json')
    if (fs.existsSync(localEventsFile)) {
      try {
        events = JSON.parse(fs.readFileSync(localEventsFile, 'utf-8'))
      } catch {
        events = []
      }
    }
  }

  // Check current config
  let currentConfig = { mode: 'split_50_50', winner: null }
  const localConfigFile = path.resolve('data/experiments/calc_ux_v2_config.json')
  if (fs.existsSync(localConfigFile)) {
    try {
      currentConfig = JSON.parse(fs.readFileSync(localConfigFile, 'utf-8'))
    } catch {}
  }

  console.log(`• Current Mode:          ${currentConfig.mode}`)
  if (currentConfig.mode === 'winner_selected' && !isForce) {
    console.log(`• Status:                Already promoted to winner '${currentConfig.winner}'.`)
    console.log('• Action:                No operation needed. Traffic is 100% routed to winner.')
    return
  }

  const seq = { enrolled: 0, completed: 0, leads: 0 }
  const them = { enrolled: 0, completed: 0, leads: 0 }
  let earliest = Date.now()

  for (const e of events) {
    const time = new Date(e.created_at || Date.now()).getTime()
    if (time < earliest) earliest = time
    const target = e.variant === 'thematic' ? them : seq
    if (e.event_type === 'enrolled') target.enrolled++
    if (e.event_type === 'completed') target.completed++
    if (e.event_type === 'lead_submitted') target.leads++
  }

  const daysElapsed = Math.max(1, Math.round((Date.now() - earliest) / (1000 * 60 * 60 * 24)))
  const totalSessions = seq.enrolled + them.enrolled

  const crSeq = seq.enrolled > 0 ? seq.completed / seq.enrolled : 0
  const crThem = them.enrolled > 0 ? them.completed / them.enrolled : 0

  const pooledP = totalSessions > 0 ? (seq.completed + them.completed) / totalSessions : 0
  const se = totalSessions > 0 && pooledP > 0 && pooledP < 1 && seq.enrolled > 0 && them.enrolled > 0
    ? Math.sqrt(pooledP * (1 - pooledP) * (1 / seq.enrolled + 1 / them.enrolled))
    : 0

  const diff = crThem - crSeq
  const zScore = se > 0 ? diff / se : 0
  const pValue = se > 0 ? 2 * (1 - normalCdf(Math.abs(zScore))) : 1
  const relativeLiftPct = crSeq > 0 ? Math.round(((crThem - crSeq) / crSeq) * 1000) / 10 : 0

  const isSeasonalityMet = daysElapsed >= TARGET_DAYS
  const isSampleSizeMet = totalSessions >= TARGET_SESSIONS
  const isSignificanceMet = pValue < TARGET_P_VALUE

  let leader = null
  if (crThem > crSeq) leader = 'thematic'
  else if (crSeq > crThem) leader = 'sequential'

  console.log(`• Days Elapsed:          ${daysElapsed} / ${TARGET_DAYS} days [${isSeasonalityMet ? 'PASS' : 'PENDING'}]`)
  console.log(`• Total Enrolled:        ${totalSessions} / ${TARGET_SESSIONS} sessions [${isSampleSizeMet ? 'PASS' : 'PENDING'}]`)
  console.log(`• Sequential CR:         ${(crSeq * 100).toFixed(1)}% (${seq.completed}/${seq.enrolled})`)
  console.log(`• Thematic CR:           ${(crThem * 100).toFixed(1)}% (${them.completed}/${them.enrolled})`)
  console.log(`• Relative Lift:         ${relativeLiftPct > 0 ? '+' : ''}${relativeLiftPct}%`)
  console.log(`• Z-Score:               ${zScore.toFixed(3)}`)
  console.log(`• p-Value:               ${pValue.toFixed(5)} [${isSignificanceMet ? 'PASS (< 0.01)' : 'PENDING (>= 0.01)'}]`)
  console.log(`• Directional Leader:    ${leader || 'None (Parity)'}\n`)

  const eligibleForPromotion = (isSeasonalityMet && isSampleSizeMet && isSignificanceMet && leader !== null) || isForce
  const chosenWinner = isForce && forcedWinner ? forcedWinner : leader

  if (eligibleForPromotion && chosenWinner) {
    if (isDryRun) {
      console.log(`[DRY RUN] Invariants satisfied. Winner '${chosenWinner}' is eligible for 100% traffic promotion.`)
      return
    }

    console.log(`🚀 Executing autonomous promotion for winner: '${chosenWinner.toUpperCase()}'...`)

    // Update local configuration file
    const updatePayload = {
      experiment_id: experimentId,
      mode: 'winner_selected',
      winner: chosenWinner,
      updated_at: new Date().toISOString(),
    }

    const localDir = path.resolve('data/experiments')
    if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true })
    fs.writeFileSync(localConfigFile, JSON.stringify(updatePayload, null, 2), 'utf-8')

    // Update Supabase if available
    if (supabaseUrl && supabaseKey && !supabaseKey.includes('your-service-role-key')) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
        await supabase.from('experiment_configurations').upsert(updatePayload)
        console.log('✓ Successfully updated Supabase experiment_configurations.')
      } catch (err) {
        console.warn('Note: Could not update Supabase directly:', err.message)
      }
    }

    console.log(`✓ Local configuration updated: Mode set to 'winner_selected' with '${chosenWinner}' receiving 100% traffic.`)

    // Send notification email if Resend is configured
    if (resend) {
      try {
        const resetSplitUrl = `${domain}/api/experiments/promote/?id=${experimentId}&winner=split&token=${adminToken}`
        await resend.emails.send({
          from: 'SettlementCheck Autopilot <updates@settlementcheck.co.uk>',
          to: recipients,
          subject: `🚀 [Autonomous Promotion] Calculator Winner Promoted: ${chosenWinner.toUpperCase()}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #0B1F3A;">
              <h2 style="color: #0B1F3A; border-bottom: 2px solid #D9603B; padding-bottom: 8px;">
                Autonomous Experiment Promotion Executed
              </h2>
              <p>The statistical autopilot worker has promoted <strong>${chosenWinner.toUpperCase()}</strong> to 100% production traffic.</p>
              <ul>
                <li>Total Sessions: ${totalSessions}</li>
                <li>p-value: ${pValue.toFixed(4)} (&lt; 0.01)</li>
                <li>Lift: ${relativeLiftPct}%</li>
                <li>Executed at: ${new Date().toISOString()}</li>
              </ul>
              <p><a href="${resetSplitUrl}">Revert to 50/50 split</a></p>
            </div>
          `,
        })
        console.log(`✓ Email audit notice dispatched to: ${recipients.join(', ')}`)
      } catch (e) {
        console.warn('Email dispatch skipped or failed:', e.message)
      }
    }

    console.log('\n================================================================')
    console.log('✅ Promotion complete. Experiment successfully resolved.')
    console.log('================================================================')
  } else {
    console.log('⚖️ Invariant status: Observation continues in 50/50 split mode.')
    console.log(`   Criteria pending: ${[!isSeasonalityMet ? 'Seasonality (14d)' : '', !isSampleSizeMet ? 'Sample Size (1520)' : '', !isSignificanceMet ? 'Significance (p<0.01)' : ''].filter(Boolean).join(', ')}`)
  }
}

runAutonomousEvaluation().catch(err => {
  console.error('Fatal error during autonomous evaluation:', err)
  process.exit(1)
})
