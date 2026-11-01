import { NextRequest, NextResponse } from 'next/server'
import { getExperimentConfig, getExperimentStats, promoteExperimentWinner } from '@/lib/experiments/experiment-service'
import { resend } from '@/lib/resend'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  return handleEvaluation(req)
}

export async function POST(req: NextRequest) {
  return handleEvaluation(req)
}

async function handleEvaluation(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    const adminToken = process.env.EXPERIMENT_ADMIN_TOKEN || 'secure_sc_experiment_admin_token_2026'
    const tokenParam = req.nextUrl.searchParams.get('token')

    const isCronAuthed = cronSecret && authHeader === `Bearer ${cronSecret}`
    const isAdminAuthed = authHeader === `Bearer ${adminToken}` || tokenParam === adminToken
    const isVercelCron = req.headers.get('x-vercel-cron') === '1'

    if (!isCronAuthed && !isAdminAuthed && !isVercelCron && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid cron authentication token' },
        { status: 401 }
      )
    }

    const experimentId = 'calc_ux_v2'
    const baseUrl = 'https://settlementcheck.co.uk'

    // 1. Check current configuration state
    const config = await getExperimentConfig(experimentId)
    if (config.mode === 'winner_selected' && config.winner) {
      return NextResponse.json({
        success: true,
        status: 'already_promoted',
        message: `Experiment ${experimentId} is already operating in winner mode with '${config.winner}' receiving 100% of production traffic.`,
        winner: config.winner,
        updatedAt: config.updated_at,
      })
    }

    // 2. Compute live experiment statistics
    const stats = await getExperimentStats(experimentId)

    // 3. Autonomous Promotion Invariants
    const TARGET_SESSIONS = 1520 // 760 per variant at MDE=5%, 80% power, alpha=0.05
    const TARGET_DAYS = 14       // Minimum 14-day seasonality cycle
    const TARGET_P_VALUE = 0.01  // Strict 99% confidence threshold (p < 0.01)

    const isSeasonalityMet = stats.daysElapsed >= TARGET_DAYS
    const isSampleSizeMet = stats.totalSessions >= TARGET_SESSIONS
    const isSignificanceMet = stats.pValue < TARGET_P_VALUE

    const crSeq = stats.sequential.completionRate
    const crThem = stats.thematic.completionRate

    let winningVariant: 'thematic' | 'sequential' | null = null
    if (crThem > crSeq) {
      winningVariant = 'thematic'
    } else if (crSeq > crThem) {
      winningVariant = 'sequential'
    }

    const shouldAutoPromote =
      isSeasonalityMet &&
      isSampleSizeMet &&
      isSignificanceMet &&
      winningVariant !== null

    // 4. Execution: Promotion
    if (shouldAutoPromote && winningVariant) {
      const updateOk = await promoteExperimentWinner(experimentId, winningVariant)
      if (!updateOk) {
        throw new Error('Failed to persist winner selection in database and local cache.')
      }

      // Dispatch Autonomous Promotion Email Alert via Resend
      let recipients = ['support@digitallyswift.com', 'digitallyswift@gmail.com']
      if (process.env.SEO_ALERT_EMAILS) {
        recipients = process.env.SEO_ALERT_EMAILS.split(',').map(e => e.trim()).filter(Boolean)
      }

      const resetSplitUrl = `${baseUrl}/api/experiments/promote/?id=${experimentId}&winner=split&token=${adminToken}`

      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 620px; margin: 0 auto; color: #0B1F3A; padding: 20px;">
          <div style="padding: 12px 16px; background: #0B1F3A; border-radius: 8px 8px 0 0; color: #ffffff;">
            <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #D9603B; letter-spacing: 0.1em; font-weight: bold;">
              Autonomous Experiment Autopilot
            </span>
            <h2 style="margin: 4px 0 0; color: #ffffff; font-size: 20px;">
              Winner Promoted: ${winningVariant.toUpperCase()} (100% Traffic)
            </h2>
          </div>

          <div style="border: 1px solid #E2DCCE; border-top: none; padding: 20px; border-radius: 0 0 8px 8px; background: #ffffff;">
            <p style="font-size: 14px; line-height: 1.5; color: #0B1F3A;">
              The autonomous evaluation worker has determined that variant <strong>${winningVariant.toUpperCase()}</strong> has satisfied all statistical invariants. Production traffic has been updated automatically to 100% for this variant.
            </p>

            <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #5B6577; margin-top: 20px; margin-bottom: 8px;">
              Statistical Evidence Invariants (99% Confidence)
            </h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
              <tbody>
                <tr style="border-bottom: 1px solid #E2DCCE;">
                  <td style="padding: 8px 0; color: #5B6577;">Statistical Significance:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0B1F3A;">p = ${stats.pValue} (&lt; 0.01 Target Met)</td>
                </tr>
                <tr style="border-bottom: 1px solid #E2DCCE;">
                  <td style="padding: 8px 0; color: #5B6577;">Z-Score (Two-Tailed):</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0B1F3A;">z = ${stats.zScore}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E2DCCE;">
                  <td style="padding: 8px 0; color: #5B6577;">Sample Size Accumulated:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0B1F3A;">${stats.totalSessions.toLocaleString()} / ${TARGET_SESSIONS.toLocaleString()} sessions</td>
                </tr>
                <tr style="border-bottom: 1px solid #E2DCCE;">
                  <td style="padding: 8px 0; color: #5B6577;">Seasonality Period:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0B1F3A;">${stats.daysElapsed} days (≥ 14-day cycle)</td>
                </tr>
                <tr style="border-bottom: 1px solid #E2DCCE;">
                  <td style="padding: 8px 0; color: #5B6577;">Completion Lift:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #D9603B;">${stats.relativeLiftPct > 0 ? '+' : ''}${stats.relativeLiftPct}%</td>
                </tr>
              </tbody>
            </table>

            <div style="background: #F7F4EE; padding: 14px; border-radius: 8px; border: 1px solid #E2DCCE; margin-bottom: 20px;">
              <span style="font-size: 12px; color: #5B6577; display: block; margin-bottom: 8px;">
                Instant Revert Action (Rollback to 50/50 Split):
              </span>
              <a href="https://settlementcheck.co.uk/api/experiments/promote/?id=${experimentId}&winner=split&token=${adminToken}" style="display: inline-block; padding: 8px 14px; background: #0B1F3A; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold;">
                Undo &amp; Reset to 50/50 Split →
              </a>
            </div>

            <p style="font-size: 11px; color: #8A93A3; margin: 0; text-align: center;">
              SettlementCheck Autonomous A/B Autopilot • Executed at ${new Date().toISOString()}
            </p>
          </div>
        </div>
      `

      if (resend) {
        try {
          await resend.emails.send({
            from: 'SettlementCheck Autopilot <updates@settlementcheck.co.uk>',
            to: recipients,
            subject: `🚀 [Autonomous Promotion] Calculator Winner Promoted: ${winningVariant.toUpperCase()}`,
            html: emailHtml,
          })
        } catch (emailErr) {
          console.warn('Could not dispatch promotion alert email:', emailErr)
        }
      }

      return NextResponse.json({
        success: true,
        status: 'promoted',
        winner: winningVariant,
        promotedAt: new Date().toISOString(),
        evidence: {
          pValue: stats.pValue,
          zScore: stats.zScore,
          totalSessions: stats.totalSessions,
          daysElapsed: stats.daysElapsed,
          relativeLiftPct: stats.relativeLiftPct,
        },
        stats,
      })
    }

    // 5. In-Progress Response
    return NextResponse.json({
      success: true,
      status: 'in_progress',
      message: 'Experiment remains in 50/50 observation mode; statistical promotion thresholds have not yet been satisfied.',
      criteria: {
        seasonality: {
          passed: isSeasonalityMet,
          daysElapsed: stats.daysElapsed,
          targetDays: TARGET_DAYS,
        },
        sampleSize: {
          passed: isSampleSizeMet,
          totalSessions: stats.totalSessions,
          targetSessions: TARGET_SESSIONS,
          progressPct: stats.sampleProgressPct,
        },
        statisticalSignificance: {
          passed: isSignificanceMet,
          pValue: stats.pValue,
          targetPValue: TARGET_P_VALUE,
          zScore: stats.zScore,
        },
        directionalLeader: winningVariant,
      },
      stats,
    })
  } catch (error: any) {
    console.error('Error evaluating experiment winner:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to evaluate experiment' },
      { status: 500 }
    )
  }
}
