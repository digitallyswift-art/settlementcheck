import { NextRequest, NextResponse } from 'next/server'
import { getExperimentStats } from '@/lib/experiments/experiment-service'
import { resend } from '@/lib/resend'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  return handleDigest(req)
}

export async function POST(req: NextRequest) {
  return handleDigest(req)
}

async function handleDigest(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid cron authentication token' },
        { status: 401 }
      )
    }

    const experimentId = 'calc_ux_v2'
    const adminToken = process.env.EXPERIMENT_ADMIN_TOKEN || 'secure_sc_experiment_admin_token_2026'
    const baseUrl = 'https://settlementcheck.co.uk'

    const stats = await getExperimentStats(experimentId)

    const promoteThematicUrl = `${baseUrl}/api/experiments/promote/?id=${experimentId}&winner=thematic&token=${adminToken}`
    const promoteSequentialUrl = `${baseUrl}/api/experiments/promote/?id=${experimentId}&winner=sequential&token=${adminToken}`
    const resetSplitUrl = `${baseUrl}/api/experiments/promote/?id=${experimentId}&winner=split&token=${adminToken}`

    const configuredEmails = [
      ...(process.env.NOTIFICATION_EMAIL?.split(',') || []),
      ...(process.env.SEO_ALERT_EMAILS?.split(',') || []),
      ...(process.env.SEO_ALERT_EMAIL?.split(',') || []),
    ].map(e => e.trim()).filter(Boolean)

    const recipients = Array.from(new Set(['digitallyswift@gmail.com', ...configuredEmails]))

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0B1F3A; padding: 20px;">
        <h2 style="color: #0B1F3A; border-bottom: 2px solid #D9603B; padding-bottom: 8px;">
          Daily Calculator A/B Test Digest
        </h2>
        <p style="font-size: 13px; color: #5B6577;">Experiment: <strong>${experimentId}</strong></p>

        <div style="padding: 12px; background: #F7F4EE; border-radius: 8px; margin-bottom: 20px;">
          <strong>Status:</strong> ${stats.decisionRecommendation}
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <thead>
            <tr style="background: #F7F4EE; text-align: left;">
              <th style="padding: 8px; border: 1px solid #E2DCCE;">Variant</th>
              <th style="padding: 8px; border: 1px solid #E2DCCE;">Enrolled</th>
              <th style="padding: 8px; border: 1px solid #E2DCCE;">Completed</th>
              <th style="padding: 8px; border: 1px solid #E2DCCE;">CR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px; border: 1px solid #E2DCCE;">Sequential (8-Step)</td>
              <td style="padding: 8px; border: 1px solid #E2DCCE;">${stats.sequential.enrolled}</td>
              <td style="padding: 8px; border: 1px solid #E2DCCE;">${stats.sequential.completed}</td>
              <td style="padding: 8px; border: 1px solid #E2DCCE;"><strong>${stats.sequential.completionRate}%</strong></td>
            </tr>
            <tr style="background: #FFF8F5;">
              <td style="padding: 8px; border: 1px solid #E2DCCE;">Thematic (4-Stage)</td>
              <td style="padding: 8px; border: 1px solid #E2DCCE;">${stats.thematic.enrolled}</td>
              <td style="padding: 8px; border: 1px solid #E2DCCE;">${stats.thematic.completed}</td>
              <td style="padding: 8px; border: 1px solid #E2DCCE; color: #D9603B;"><strong>${stats.thematic.completionRate}%</strong></td>
            </tr>
          </tbody>
        </table>

        <p style="font-size: 13px; color: #5B6577;">
          Relative Lift: <strong>${stats.relativeLiftPct > 0 ? '+' : ''}${stats.relativeLiftPct}%</strong> | 
          Sample Progress: <strong>${stats.totalSessions}/${stats.targetSessions} (${stats.sampleProgressPct}%)</strong> | 
          P-Value: <strong>${stats.pValue}</strong>
        </p>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 20px;">
          <a href="https://settlementcheck.co.uk/api/experiments/promote/?id=${experimentId}&winner=thematic&token=${adminToken}" style="background: #D9603B; color: #fff; padding: 10px 16px; text-decoration: none; border-radius: 6px; font-weight: 600; text-align: center;">
            Review & Promote 4-Stage Thematic to 100% &rarr;
          </a>
          <a href="https://settlementcheck.co.uk/api/experiments/promote/?id=${experimentId}&winner=sequential&token=${adminToken}" style="background: #0B1F3A; color: #fff; padding: 10px 16px; text-decoration: none; border-radius: 6px; font-weight: 600; text-align: center;">
            Review & Revert to 8-Step Sequential (100%) &rarr;
          </a>
          <a href="https://settlementcheck.co.uk/api/experiments/promote/?id=${experimentId}&winner=split&token=${adminToken}" style="text-align: center; color: #8A93A3; font-size: 12px; margin-top: 8px;">
            Reset to 50/50 Split Mode
          </a>
        </div>
      </div>
    `

    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('dummy')) {
      await resend.emails.send({
        from: 'SettlementCheck Experiments <system@settlementcheck.co.uk>',
        to: recipients,
        subject: `Daily Calculator A/B Digest [${stats.isStatisticallySignificant ? 'WINNER CONFIRMED' : 'OBSERVING'}]: Thematic vs Sequential`,
        html,
      })
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message },
      { status: 500 }
    )
  }
}
