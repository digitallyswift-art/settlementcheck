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

const resendKey = process.env.RESEND_API_KEY
if (!resendKey) {
  console.warn('⚠️ RESEND_API_KEY is not configured in .env.local; skipping email dispatch.')
}

const resend = resendKey ? new Resend(resendKey) : null

// Recipients list
let recipients = ['support@digitallyswift.com', 'digitallyswift@gmail.com']
if (process.env.SEO_ALERT_EMAILS) {
  recipients = process.env.SEO_ALERT_EMAILS.split(',').map(e => e.trim()).filter(Boolean)
} else if (process.env.SEO_ALERT_EMAIL) {
  recipients = Array.from(new Set([...recipients, ...process.env.SEO_ALERT_EMAIL.split(',').map(e => e.trim()).filter(Boolean)]))
}

const toArg = process.argv.find(a => a.startsWith('--to='))
if (toArg) {
  recipients = toArg.split('=')[1].split(',').map(e => e.trim()).filter(Boolean)
}

// ── 2. Query Experiment Telemetry ───────────────────────────────────────────
async function generateExperimentDigest() {
  const experimentId = 'calc_ux_v2'
  const adminToken = process.env.EXPERIMENT_ADMIN_TOKEN || 'secure_sc_experiment_admin_token_2026'
  const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://settlementcheck.co.uk'

  let events = []

  // Check Supabase if configured
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

  // Fallback to local backup events store if Supabase returned 0 or failed
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

  const seq = { enrolled: 0, completed: 0, leads: 0 }
  const them = { enrolled: 0, completed: 0, leads: 0 }

  let earliestTimestamp = Date.now()

  for (const e of events) {
    const time = new Date(e.created_at || Date.now()).getTime()
    if (time < earliestTimestamp) earliestTimestamp = time

    const target = e.variant === 'thematic' ? them : seq
    if (e.event_type === 'enrolled') target.enrolled++
    if (e.event_type === 'completed') target.completed++
    if (e.event_type === 'lead_submitted') target.leads++
  }

  const crSeq = seq.enrolled > 0 ? (seq.completed / seq.enrolled) * 100 : 0
  const crThem = them.enrolled > 0 ? (them.completed / them.enrolled) * 100 : 0

  const totalSessions = seq.enrolled + them.enrolled
  const targetSessions = 1520 // 760 per variant at MDE=5%, 80% power, alpha=0.05
  const sampleProgressPct = Math.min(100, Math.round((totalSessions / targetSessions) * 100))

  const daysElapsed = Math.max(1, Math.round((Date.now() - earliestTimestamp) / (1000 * 60 * 60 * 24)))
  const seasonalityComplete = daysElapsed >= 14

  // Two-proportion Z-test
  const pooledP = totalSessions > 0 ? (seq.completed + them.completed) / (totalSessions || 1) : 0
  const standardError =
    totalSessions > 0 && pooledP > 0 && pooledP < 1 && seq.enrolled > 0 && them.enrolled > 0
      ? Math.sqrt(pooledP * (1 - pooledP) * (1 / seq.enrolled + 1 / them.enrolled))
      : 0

  const diff = (crThem - crSeq) / 100
  const zScore = standardError > 0 ? diff / standardError : 0
  
  // Standard normal CDF approximation
  const normalCdf = (x) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x))
    const d = 0.3989423 * Math.exp((-x * x) / 2)
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    return x > 0 ? 1 - prob : prob
  }
  const pValue = standardError > 0 ? 2 * (1 - normalCdf(Math.abs(zScore))) : 1

  const marginOfError = 1.96 * standardError
  const ciLower = ((diff - marginOfError) * 100).toFixed(1)
  const ciUpper = ((diff + marginOfError) * 100).toFixed(1)

  const isStatisticallySignificant = totalSessions >= targetSessions && seasonalityComplete && pValue < 0.05 && parseFloat(ciLower) > 0
  const relativeLiftPct = crSeq > 0 ? (((crThem - crSeq) / crSeq) * 100).toFixed(1) : '0.0'

  const promoteThematicUrl = `${domain}/api/experiments/promote/?id=${experimentId}&winner=thematic&token=${adminToken}`
  const promoteSequentialUrl = `${domain}/api/experiments/promote/?id=${experimentId}&winner=sequential&token=${adminToken}`
  const resetSplitUrl = `${domain}/api/experiments/promote/?id=${experimentId}&winner=split&token=${adminToken}`

  console.log(`\n======================================================`)
  console.log(`📊 SettlementCheck Daily Calculator A/B Test Digest`)
  console.log(`======================================================`)
  console.log(`• Experiment ID:        ${experimentId}`)
  console.log(`• Total Enrolled:       ${totalSessions} / ${targetSessions} target sessions (${sampleProgressPct}%)`)
  console.log(`• Duration:             ${daysElapsed} of 14 minimum days (Seasonality: ${seasonalityComplete ? 'COMPLETE' : 'IN PROGRESS'})`)
  console.log(`• Sequential (8-Step):  ${seq.enrolled} starts | ${seq.completed} completed | CR: ${crSeq.toFixed(1)}%`)
  console.log(`• Thematic (4-Stage):   ${them.enrolled} starts | ${them.completed} completed | CR: ${crThem.toFixed(1)}%`)
  console.log(`• Relative Lift:        ${relativeLiftPct}%`)
  console.log(`• Z-Score:              ${zScore.toFixed(2)} (p = ${pValue.toFixed(4)})`)
  console.log(`• 95% Confidence Int:   [${ciLower}% to ${ciUpper}%]`)
  console.log(`• Significance Status:  ${isStatisticallySignificant ? 'CONFIRMED STATISTICALLY SIGNIFICANT' : 'SAMPLE GATHERING (OBSERVATION MODE)'}`)
  console.log(`======================================================\n`)

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Daily Calculator A/B Test Report</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F4EE; color: #0B1F3A; padding: 24px; margin: 0;">
        <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #E2DCCE; border-radius: 14px; padding: 28px 24px; box-shadow: 0 4px 20px rgba(11,31,58,0.06);">
          
          <div style="border-bottom: 2px solid #D9603B; padding-bottom: 12px; margin-bottom: 20px;">
            <span style="font-size: 11px; font-weight: 700; color: #D9603B; text-transform: uppercase; letter-spacing: 0.08em;">
              Automated CRO Telemetry Digest
            </span>
            <h1 style="font-size: 22px; color: #0B1F3A; margin: 6px 0 0;">
              Calculator A/B Experiment: 8-Step vs. 4-Stage
            </h1>
            <p style="font-size: 13px; color: #8A93A3; margin: 4px 0 0;">
              Experiment ID: <strong>${experimentId}</strong> &bull; Evaluation Date: ${new Date().toLocaleDateString('en-GB')}
            </p>
          </div>

          <!-- Status Banner -->
          <div style="padding: 14px 16px; border-radius: 8px; margin-bottom: 24px; ${isStatisticallySignificant ? 'background: rgba(39, 174, 96, 0.1); border: 1px solid rgba(39, 174, 96, 0.3);' : 'background: rgba(217, 96, 59, 0.08); border: 1px solid rgba(217, 96, 59, 0.25);'}">
            <span style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 4px; ${isStatisticallySignificant ? 'color: #27AE60;' : 'color: #D9603B;'}">
              ${isStatisticallySignificant ? '✓ STATISTICALLY SIGNIFICANT WINNER IDENTIFIED' : '⏳ OBSERVATION MODE: SAMPLE ACCUMULATION IN PROGRESS'}
            </span>
            <span style="font-size: 12.5px; color: #5B6577; line-height: 1.5; display: block;">
              ${isStatisticallySignificant 
                ? 'The 4-stage thematic model demonstrates statistically significant conversion lift with 95% confidence. Action links are authorized for production deployment.'
                : `Continuous testing active. Enrolled: ${totalSessions}/${targetSessions} target sessions (${sampleProgressPct}%). Seasonality cycle: ${daysElapsed}/14 days.`}
            </span>
          </div>

          <!-- Comparative Performance Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13.5px;">
            <thead>
              <tr style="background: #F7F4EE; text-align: left;">
                <th style="padding: 10px 12px; border: 1px solid #E2DCCE;">Funnel Model</th>
                <th style="padding: 10px 12px; border: 1px solid #E2DCCE;">Starts</th>
                <th style="padding: 10px 12px; border: 1px solid #E2DCCE;">Completed</th>
                <th style="padding: 10px 12px; border: 1px solid #E2DCCE;">Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px 12px; border: 1px solid #E2DCCE;">
                  <strong>Control (8-Step Sequential)</strong>
                </td>
                <td style="padding: 10px 12px; border: 1px solid #E2DCCE;">${seq.enrolled}</td>
                <td style="padding: 10px 12px; border: 1px solid #E2DCCE;">${seq.completed}</td>
                <td style="padding: 10px 12px; border: 1px solid #E2DCCE;">
                  <strong>${crSeq.toFixed(1)}%</strong>
                </td>
              </tr>
              <tr style="background: #FFF8F5;">
                <td style="padding: 10px 12px; border: 1px solid #E2DCCE;">
                  <strong>Variant (4-Stage Thematic)</strong>
                </td>
                <td style="padding: 10px 12px; border: 1px solid #E2DCCE;">${them.enrolled}</td>
                <td style="padding: 10px 12px; border: 1px solid #E2DCCE;">${them.completed}</td>
                <td style="padding: 10px 12px; border: 1px solid #E2DCCE; color: #D9603B;">
                  <strong>${crThem.toFixed(1)}%</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Statistical Metrics Grid -->
          <div style="background: #F7F4EE; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px; font-size: 12.5px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #5B6577;">Relative Conversion Lift:</span>
              <strong style="color: ${parseFloat(relativeLiftPct) >= 0 ? '#27AE60' : '#C0392B'};">${parseFloat(relativeLiftPct) >= 0 ? '+' : ''}${relativeLiftPct}%</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #5B6577;">Two-Tailed Z-Score (p-value):</span>
              <strong>${zScore.toFixed(2)} (p = ${pValue.toFixed(4)})</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #5B6577;">95% Confidence Interval:</span>
              <strong>[${ciLower}% to ${ciUpper}%]</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #5B6577;">Full Business Cycle Seasonality:</span>
              <strong>${seasonalityComplete ? 'Verified (14+ Days)' : `Active (${daysElapsed}/14 Days)`}</strong>
            </div>
          </div>

          <!-- Action Gate Section -->
          <h3 style="font-size: 15px; color: #0B1F3A; margin: 0 0 10px;">
            Production Traffic Allocation Actions
          </h3>
          <p style="font-size: 12.5px; color: #5B6577; line-height: 1.5; margin: 0 0 16px;">
            Clicking an action below opens the secure confirmation gate. A deliberate confirmation step is required to route live production traffic, preventing unintended activation by automated email link crawlers.
          </p>

          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
            <a href="${promoteThematicUrl}" 
               style="background: #D9603B; color: #ffffff; text-decoration: none; padding: 12px 16px; border-radius: 8px; font-size: 13.5px; font-weight: 600; text-align: center; display: block;">
              Review & Promote 4-Stage Thematic to 100% Traffic &rarr;
            </a>
            <a href="${promoteSequentialUrl}" 
               style="background: #0B1F3A; color: #ffffff; text-decoration: none; padding: 12px 16px; border-radius: 8px; font-size: 13.5px; font-weight: 600; text-align: center; display: block;">
              Review & Revert to 8-Step Sequential (100% Traffic) &rarr;
            </a>
          </div>

          <div style="text-align: center;">
            <a href="${resetSplitUrl}" style="color: #8A93A3; font-size: 12px; text-decoration: underline;">
              Reset Experiment to 50/50 Split Mode
            </a>
          </div>

        </div>
      </body>
    </html>
  `

  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'SettlementCheck Experiments <system@settlementcheck.co.uk>',
        to: recipients,
        subject: `Daily Calculator A/B Digest [${isStatisticallySignificant ? 'WINNER CONFIRMED' : 'OBSERVING'}]: Thematic vs Sequential`,
        html,
      })

      if (error) {
        console.error('❌ Resend API Error:', error)
      } else {
        console.log(`✓ Email digest sent successfully to ${recipients.join(', ')} (ID: ${data?.id})`)
      }
    } catch (err) {
      console.error('❌ Failed to dispatch email via Resend:', err.message)
    }
  } else {
    console.log(`ℹ️ Email dispatch skipped (no RESEND_API_KEY). Digest generated in terminal and data layer.`)
  }
}

generateExperimentDigest()
