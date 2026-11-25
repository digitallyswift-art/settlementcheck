import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import {
  evaluateSraLeadTriage,
  SraLeadTriageInput,
  SraTriageDossier,
  DocumentReadiness,
} from '@/lib/leads/triage-contract'
import { AgenticOrchestrator } from '@/lib/agentic-engine'
import { escapeHtml, isSafeIdentifier } from '@/lib/security/html-sanitizer'

export interface UnifiedLeadInput {
  firstName?: string
  first_name?: string
  lastName?: string
  last_name?: string
  email: string
  phone?: string | null
  contactTime?: string
  contact_time?: string
  verdict?: string | null
  offerAmount?: number | string | null
  offer_amount?: number | string | null
  salary?: number | string | null
  monthsService?: number | string | null
  months_service?: number | string | null
  consent?: boolean
  gdprConsent?: boolean
  gdpr_consent?: boolean
  postcode?: string | null
  postcodeRegion?: string | null
  postcode_region?: string | null
  postcodeLat?: number | null
  postcode_lat?: number | null
  postcodeLng?: number | null
  postcode_lng?: number | null
  partnerId?: string | null
  partner_id?: string | null
  sourceUrl?: string | null
  source_url?: string | null
  benchmarkData?: any
  benchmark_data?: any
  disputeReason?: string | null
  hasDiscrimination?: boolean
  documentReadiness?: DocumentReadiness
  emailVerified?: boolean
  email_verified?: boolean
  signingUrgency?: string | null
  intakeStage?: string | null
  leadId?: string | null
}

export interface UnifiedLeadResult {
  success: boolean
  triageId: string
  leadId?: string
  phoneProvided: boolean
  triage: SraTriageDossier
  clioPayload?: any
  leapPayload?: any
  partnerVerified?: boolean
  partnerFirmName?: string
}

export interface PartnerVerificationResult {
  verified: boolean
  firmName?: string
  targetEmail?: string
}

/**
 * Validates partner_id against the SRA solicitor panel and applications.
 * Gracefully falls back to unverified queue so NO lead is ever dropped.
 */
export async function verifyPartnerId(partnerId: string | null | undefined): Promise<PartnerVerificationResult> {
  if (!partnerId || typeof partnerId !== 'string' || !isSafeIdentifier(partnerId)) {
    return { verified: false }
  }

  const cleanPartnerId = partnerId.trim()

  try {
    // 1. Check active solicitor_panel
    const { data: panelData } = await supabase
      .from('solicitor_panel')
      .select('id, firm_name, email, status')
      .or(`id.eq.${cleanPartnerId},sra_number.eq.${cleanPartnerId}`)
      .limit(1)
      .maybeSingle()

    if (panelData && panelData.status !== 'suspended') {
      return {
        verified: true,
        firmName: panelData.firm_name,
        targetEmail: panelData.email,
      }
    }

    // 2. Fallback check in solicitor_applications
    const { data: appData } = await supabase
      .from('solicitor_applications')
      .select('id, firm_name, email')
      .eq('id', cleanPartnerId)
      .limit(1)
      .maybeSingle()

    if (appData && appData.email) {
      return {
        verified: true,
        firmName: appData.firm_name,
        targetEmail: appData.email,
      }
    }
  } catch (err) {
    console.warn('Partner lookup error (falling back to unverified):', err)
  }

  // Graceful fallback: lead will still be accepted into unverified intake queue
  return { verified: false }
}

interface EmailGuideLink {
  title: string
  summary: string
  path: string
}

function selectRecommendedGuides(params: {
  disputeReason?: string | null
  verdict?: string | null
  hasDiscrimination?: boolean | null
  salaryNum?: number | null
}): EmailGuideLink[] {
  const { disputeReason, verdict, hasDiscrimination, salaryNum } = params
  const guides: EmailGuideLink[] = []

  // 1. Situation-specific guide
  if (hasDiscrimination) {
    guides.push({
      title: 'Discrimination settlement agreements',
      summary: 'How injury to feelings (Vento bands) and discrimination claims affect payout leverage.',
      path: '/guides/discrimination-settlement-agreements/',
    })
  } else if (disputeReason === 'redundancy_collective') {
    guides.push({
      title: 'Protective awards & collective redundancy',
      summary: 'What happens if your employer skips the 30- or 45-day collective consultation.',
      path: '/guides/protective-award/',
    })
  } else if (disputeReason === 'redundancy') {
    guides.push({
      title: 'Redundancy vs settlement agreement',
      summary: 'Why statutory redundancy is only the floor and what extras you can ask for.',
      path: '/guides/redundancy-vs-settlement-agreement/',
    })
  } else if (disputeReason === 'constructive') {
    guides.push({
      title: 'Constructive dismissal settlement agreements',
      summary: 'Key evidence, grievance timing, and how resignation risk affects your terms.',
      path: '/guides/constructive-dismissal-settlement-agreements/',
    })
  } else if (disputeReason === 'dismissal') {
    guides.push({
      title: 'Unfair dismissal settlement agreements',
      summary: 'How tribunal compensation caps and notice pay shape a fair exit package.',
      path: '/guides/unfair-dismissal-settlement-agreements/',
    })
  } else if (disputeReason === 'resignation' || disputeReason === 'mutual') {
    guides.push({
      title: 'Protected conversations & without prejudice',
      summary: 'What your employer can and cannot say when proposing a mutual exit.',
      path: '/guides/protected-conversations-without-prejudice/',
    })
  } else {
    guides.push({
      title: 'What is a fair settlement agreement?',
      summary: 'The core financial and non-financial terms every UK agreement should cover.',
      path: '/guides/what-is-a-fair-settlement-agreement/',
    })
  }

  // 2. Offer / salary-calibrated guide
  if (verdict === 'BELOW_MINIMUM' || verdict === 'BELOW_TYPICAL') {
    guides.push({
      title: 'How to negotiate a settlement agreement',
      summary: 'Practical counter-offer steps when your initial offer sits below benchmark.',
      path: '/guides/how-to-negotiate-a-settlement-agreement/',
    })
  } else if (salaryNum != null && salaryNum >= 100000) {
    guides.push({
      title: 'Executive settlement agreements',
      summary: 'Bonus, LTIP, garden leave, and restrictive covenant points for senior exits.',
      path: '/guides/executive-settlement-agreements/',
    })
  } else {
    guides.push({
      title: 'Is my settlement offer fair?',
      summary: 'How to weigh tax-free lump sums, notice pay, and reference terms.',
      path: '/guides/is-my-settlement-offer-fair/',
    })
  }

  // 3. Universal call-prep guide (tax split)
  const taxGuide: EmailGuideLink = {
    title: 'The £30,000 tax-free settlement rule',
    summary: 'How termination payments are separated from taxable notice pay (PILON).',
    path: '/guides/tax-free-settlement-30000/',
  }
  if (!guides.some((g) => g.path === taxGuide.path)) {
    guides.push(taxGuide)
  }

  return guides.slice(0, 3)
}

/**
 * Unified Lead Ingestion Service:
 * Handles validation, SRA triage evaluation, Supabase storage with schema fallbacks,
 * and dual email notifications (solicitor dossier + employee confirmation).
 */
export async function ingestLead(input: UnifiedLeadInput): Promise<UnifiedLeadResult> {
  // ── 1. Normalize Names and Contacts ───────────────────────────────────────
  const rawFirstName = input.firstName || input.first_name || ''
  const trimmedName = rawFirstName.trim()
  const nameParts = trimmedName.split(/\s+/)
  const firstName = nameParts[0] || ''
  const lastName = input.lastName || input.last_name || nameParts.slice(1).join(' ') || 'Client'

  const rawEmail = input.email || ''
  const normalizedEmail = rawEmail.trim().toLowerCase()
  const rawPhone = (input.phone || '').trim()
  const phoneProvided = rawPhone.length > 0

  if (!firstName || !normalizedEmail) {
    throw new Error('Missing required contact fields: firstName and email are mandatory.')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(normalizedEmail)) {
    throw new Error('Invalid email address format.')
  }

  const consent = Boolean(input.consent ?? true)
  if (!consent) {
    throw new Error('Affirmative consent is required to process lead.')
  }

  // ── 2. Normalize Parameters ───────────────────────────────────────────────
  const rawContactTime = input.contactTime || input.contact_time || 'Morning'
  const validContactTimes = ['Morning', 'Afternoon', 'Evening']
  const safeContactTime: 'Morning' | 'Afternoon' | 'Evening' =
    validContactTimes.includes(rawContactTime)
      ? (rawContactTime as 'Morning' | 'Afternoon' | 'Evening')
      : 'Morning'

  const salaryNum = input.salary != null && input.salary !== '' ? Number(input.salary) : null
  const offerNum = input.offerAmount != null && input.offerAmount !== ''
    ? Number(input.offerAmount)
    : input.offer_amount != null && input.offer_amount !== ''
    ? Number(input.offer_amount)
    : null
  const monthsNum = input.monthsService != null && input.monthsService !== ''
    ? Number(input.monthsService)
    : input.months_service != null && input.months_service !== ''
    ? Number(input.months_service)
    : null

  const postcode = input.postcode?.trim() || null
  const postcodeRegion = input.postcodeRegion?.trim() || input.postcode_region?.trim() || null
  const postcodeLat = input.postcodeLat ?? input.postcode_lat ?? null
  const postcodeLng = input.postcodeLng ?? input.postcode_lng ?? null

  const partnerId = input.partnerId?.trim() || input.partner_id?.trim() || null
  const sourceUrl = input.sourceUrl?.trim() || input.source_url?.trim() || null
  const rawBenchmarkData = input.benchmarkData || input.benchmark_data || null
  const benchmarkData =
    rawBenchmarkData || input.signingUrgency || input.intakeStage
      ? {
          ...(typeof rawBenchmarkData === 'object' && rawBenchmarkData !== null ? rawBenchmarkData : {}),
          phone_provided: phoneProvided,
          ...(input.signingUrgency ? { signing_urgency: input.signingUrgency } : {}),
          ...(input.intakeStage ? { intake_stage: input.intakeStage } : {}),
        }
      : { phone_provided: phoneProvided }
  const verdict = input.verdict || 'unknown'

  // ── 3. Partner Verification ───────────────────────────────────────────────
  const partnerCheck = await verifyPartnerId(partnerId)

  // ── 4. Deterministic SRA Solicitor Triage Evaluation ───────────────────────
  const triageInput: SraLeadTriageInput = {
    firstName,
    email: normalizedEmail,
    phone: rawPhone,
    preferredContactTime: safeContactTime,
    postcode: postcode || undefined,
    postcodeRegion: postcodeRegion || undefined,
    salary: salaryNum,
    monthsService: monthsNum,
    offerAmount: offerNum,
    verdict,
    disputeReason: input.disputeReason || null,
    hasDiscrimination: input.hasDiscrimination || false,
    documentReadiness: input.documentReadiness || 'EXPLORATORY',
    sourceUrl: sourceUrl || undefined,
  }

  const triage: SraTriageDossier = evaluateSraLeadTriage(triageInput)

  // ── 5. Agentic Engine Case Dossier Pre-flight (Non-blocking) ───────────────
  let preFlightDossier = null
  try {
    preFlightDossier = await AgenticOrchestrator.executeCaseDossier({
      firstName,
      lastName,
      email: normalizedEmail,
      phone: rawPhone,
      salary: salaryNum || 45000,
      yearsOfService: monthsNum ? Math.floor(monthsNum / 12) : 3,
      age: 38,
      employerOffer: offerNum || 0,
      disputeReason: (input.disputeReason as any) || 'redundancy',
      partnerId: partnerId || undefined,
      sourceUrl: sourceUrl || undefined,
      consentVerified: true,
    })
  } catch (dErr) {
    console.warn('Agentic dossier generation non-fatal fallback:', dErr)
  }

  // ── 6. Persist to Supabase with Schema Resilience ─────────────────────────
  const insertPayload: any = {
    first_name: firstName,
    email: normalizedEmail,
    phone: rawPhone,
    contact_time: safeContactTime,
    verdict: triage.commercialOffer.verdict || verdict,
    offer_amount: offerNum,
    salary: salaryNum,
    months_service: monthsNum,
    consent: true,
    status: 'new',
    email_verified: Boolean(input.emailVerified ?? input.email_verified ?? true),
    postcode,
    postcode_region: postcodeRegion,
    postcode_lat: postcodeLat,
    postcode_lng: postcodeLng,
    partner_id: partnerId,
    source_url: sourceUrl,
    benchmark_data: benchmarkData,
  }

  let leadId: string | undefined = input.leadId?.trim() || undefined
  let insertedRow: { id: string } | null = null
  let insertError: any = null

  if (leadId && !leadId.startsWith('lead_offline_')) {
    const updateRes = await supabase
      .from('leads')
      .update({
        phone: rawPhone,
        contact_time: safeContactTime,
        benchmark_data: benchmarkData,
      })
      .eq('id', leadId)
      .select('id')
      .maybeSingle()

    if (!updateRes.error && updateRes.data?.id) {
      insertedRow = updateRes.data
    } else {
      const fallbackUpdate = await supabase
        .from('leads')
        .update({
          phone: rawPhone,
          contact_time: safeContactTime,
        })
        .eq('id', leadId)
        .select('id')
        .maybeSingle()
      if (!fallbackUpdate.error && fallbackUpdate.data?.id) {
        insertedRow = fallbackUpdate.data
      }
    }
  }

  if (!insertedRow) {
    const res = await supabase
      .from('leads')
      .insert(insertPayload)
      .select('id')
      .maybeSingle()
    insertedRow = res.data
    insertError = res.error
  }

  if (insertError) {
    console.warn('Initial lead insert failed, attempting fallback without optional columns:', insertError)
    // Strip extended columns that might not exist in an earlier migration
    const {
      email_verified: _,
      partner_id: __,
      source_url: ___,
      benchmark_data: ____,
      postcode_lat: _____,
      postcode_lng: ______,
      ...minimalPayload
    } = insertPayload

    const fallbackResult = await supabase
      .from('leads')
      .insert(minimalPayload)
      .select('id')
      .maybeSingle()

    if (fallbackResult.error) {
      console.error('Lead insertion database warning (proceeding to notification dispatch so lead is never lost):', fallbackResult.error)
      leadId = 'lead_offline_' + Date.now()
    } else {
      insertedRow = fallbackResult.data
      leadId = insertedRow?.id
    }
  } else {
    leadId = insertedRow?.id
  }

  // ── 7. Notification Dispatch ──────────────────────────────────────────────
  const targetEmail = partnerCheck.verified && partnerCheck.targetEmail
    ? partnerCheck.targetEmail
    : process.env.NOTIFICATION_EMAIL

  if (targetEmail && resend) {
    const verdictLabel: Record<string, string> = {
      BELOW_MINIMUM: 'Below notice + redundancy figures',
      BELOW_TYPICAL: 'Below typical range',
      WITHIN_RANGE: 'Within typical range',
      ABOVE_TYPICAL: 'Above typical range',
    }
    const offerFormatted = offerNum != null ? `£${Number(offerNum).toLocaleString('en-GB')}` : 'Not provided'
    const salaryFormatted = salaryNum != null ? `£${Number(salaryNum).toLocaleString('en-GB')}` : 'Not provided'
    const serviceYears = monthsNum != null ? `${Math.floor(monthsNum / 12)}y ${monthsNum % 12}m` : 'Not provided'

    const recipients = targetEmail.includes(',')
      ? targetEmail.split(',').map(e => e.trim()).filter(Boolean)
      : [targetEmail]

    const firmLabel = partnerCheck.verified && partnerCheck.firmName
      ? ` [Partner: ${partnerCheck.firmName}]`
      : ''

    const phoneDisplay = rawPhone || 'Not provided (Email preferred)'

    try {
      await resend.emails.send({
        from: 'SettlementCheck <team@settlementcheck.co.uk>',
        to: recipients,
        subject: `[${triage.matterTier}]${firmLabel} ${firstName} • SRA Triage (${triage.triageId})`,
        replyTo: normalizedEmail,
        text: `SRA QUALIFIED SOLICITOR INTAKE DOSSIER\nReference: ${triage.triageId}\nMatter Tier: ${triage.matterTier}\nPartner Routing: ${partnerCheck.verified ? (partnerCheck.firmName || 'Verified Partner') : 'SettlementCheck Primary Pool'}\n\nCLIENT CONTACT:\nName: ${firstName} ${lastName}\nEmail: ${normalizedEmail}\nPhone: ${phoneDisplay}\nPreferred Time: ${safeContactTime}\nPostcode: ${postcode || 'Not provided'}${postcodeRegion ? ` (${postcodeRegion})` : ''}\n\nSTATUTORY QUALIFICATION:\nSalary: ${salaryFormatted}\nService: ${serviceYears} (${triage.employment.tenureYears} yrs)\nTenure Status: ${triage.employment.tenureClassification === 'QUALIFIED_2_PLUS_YEARS' ? 'Qualified (2+ yrs) - Full ERA 1996 s.94/98 rights' : 'Tactical (Under 2 yrs) - Section 108 threshold applies'}\nLimitation: ${triage.regulatoryLimitation.statutoryDeadlineNotice}\n\nCOMMERCIAL & FEES:\nOffer: ${offerFormatted}\nVerdict: ${verdictLabel[triage.commercialOffer.verdict] ?? triage.commercialOffer.verdict}\nS.203(3) Fee Contribution: ${triage.commercialOffer.standardFeeBenchmark}\n\nSRA COMPLIANCE NOTES:\n${triage.sraComplianceNotes.map(n => `- ${n}`).join('\n')}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px 16px; color: #0B1F3A;">
            <div style="background: #0B1F3A; padding: 16px 20px; border-radius: 8px 8px 0 0; color: #ffffff;">
              <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #D9603B; letter-spacing: 0.1em; font-weight: 700;">
                SRA Qualified Solicitor Intake &bull; ${triage.triageId}${firmLabel}
              </span>
              <h1 style="font-size: 20px; font-weight: 700; color: #ffffff; margin: 6px 0 0; letter-spacing: -0.015em;">
                ${escapeHtml(triage.matterTier)}: ${escapeHtml(firstName)} ${escapeHtml(lastName)}
              </h1>
            </div>

            <div style="border: 1px solid #E2DCCE; border-top: none; padding: 20px; border-radius: 0 0 8px 8px; background: #ffffff;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1; width: 150px;">Client Name</td>
                  <td style="padding: 9px 0; color: #0B1F3A; font-weight: 600; border-bottom: 1px solid #F0ECE1;">${escapeHtml(firstName)} ${escapeHtml(lastName)}</td>
                </tr>
                <tr>
                  <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Email</td>
                  <td style="padding: 9px 0; font-weight: 500; border-bottom: 1px solid #F0ECE1;"><a href="mailto:${escapeHtml(normalizedEmail)}" style="color: #D9603B;">${escapeHtml(normalizedEmail)}</a></td>
                </tr>
                <tr>
                  <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Phone</td>
                  <td style="padding: 9px 0; font-weight: 500; border-bottom: 1px solid #F0ECE1;">${rawPhone ? `<a href="tel:${escapeHtml(rawPhone)}" style="color: #D9603B;">${escapeHtml(rawPhone)}</a>` : '<span style="color: #5B6577;">Not provided (Email preferred)</span>'}</td>
                </tr>
                ${postcode ? `<tr>
                  <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Postcode</td>
                  <td style="padding: 9px 0; color: #0B1F3A; font-weight: 500; border-bottom: 1px solid #F0ECE1;">${escapeHtml(postcode)}${postcodeRegion ? ` (${escapeHtml(postcodeRegion)})` : ''}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Preferred Contact</td>
                  <td style="padding: 9px 0; color: #0B1F3A; font-weight: 600; border-bottom: 1px solid #F0ECE1;">${escapeHtml(safeContactTime)}</td>
                </tr>
                <tr>
                  <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Tenure (ERA s.108)</td>
                  <td style="padding: 9px 0; font-weight: 600; border-bottom: 1px solid #F0ECE1; color: ${triage.employment.tenureClassification === 'QUALIFIED_2_PLUS_YEARS' ? '#1e7e34' : '#856404'};">
                    ${serviceYears} (${triage.employment.tenureYears} yrs) &bull; ${triage.employment.tenureClassification}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Annual Salary</td>
                  <td style="padding: 9px 0; color: #0B1F3A; font-weight: 500; border-bottom: 1px solid #F0ECE1;">${salaryFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Current Offer</td>
                  <td style="padding: 9px 0; color: #0B1F3A; font-weight: 500; border-bottom: 1px solid #F0ECE1;">${offerFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Verdict</td>
                  <td style="padding: 9px 0; font-weight: 600; border-bottom: 1px solid #F0ECE1;">${verdictLabel[triage.commercialOffer.verdict] ?? triage.commercialOffer.verdict}</td>
                </tr>
                <tr>
                  <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Fee Contribution (s.203)</td>
                  <td style="padding: 9px 0; color: #0B1F3A; font-weight: 500; border-bottom: 1px solid #F0ECE1;">${triage.commercialOffer.standardFeeBenchmark}</td>
                </tr>
                <tr>
                  <td style="padding: 9px 0; color: #5B6577;">Limitation Status</td>
                  <td style="padding: 9px 0; color: #0B1F3A; font-size: 12px;">${triage.regulatoryLimitation.statutoryDeadlineNotice}</td>
                </tr>
              </table>

              <div style="background: #F7F4EE; border-radius: 6px; padding: 12px 16px; margin-bottom: 16px;">
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #5B6577; letter-spacing: 0.05em; margin-bottom: 6px;">
                  SRA Triage Advisory Notes
                </div>
                <ul style="margin: 0; padding-left: 18px; color: #374151; font-size: 12px; line-height: 1.5;">
                  ${triage.sraComplianceNotes.map(n => `<li>${n}</li>`).join('')}
                </ul>
              </div>

              <div style="padding: 12px; background: #f9fafb; border-radius: 6px; font-size: 12px; color: #6b7280;">
                Reply directly to this email to contact the lead during their preferred time: <strong>${safeContactTime}</strong>.
              </div>
            </div>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Owner notification email failed (non-fatal):', emailErr)
    }
  }

  // ── Confirmation to employee (Non-fatal) ──────────────────────────────────
  if (resend) {
    try {
      const baseAppUrl = 'https://settlementcheck.co.uk'
      const hasCalcParams = Boolean(
        (sourceUrl && sourceUrl.includes('/results/?')) ||
        (salaryNum != null && salaryNum > 0 && offerNum != null && offerNum > 0)
      )

      const calculationUrl = (() => {
        if (sourceUrl && sourceUrl.includes('/results/?')) {
          if (sourceUrl.startsWith('https://settlementcheck.co.uk')) return sourceUrl
          if (sourceUrl.startsWith('/')) return `${baseAppUrl}${sourceUrl}`
        }
        if (salaryNum != null && salaryNum > 0 && offerNum != null && offerNum > 0) {
          const params = new URLSearchParams()
          params.set('salary', String(salaryNum))
          if (monthsNum != null && monthsNum >= 0) {
            params.set('yearsNum', String(Math.floor(monthsNum / 12)))
            params.set('monthsNum', String(monthsNum % 12))
          }
          params.set('offer', String(offerNum))
          if (input.disputeReason) params.set('reason', String(input.disputeReason))
          return `${baseAppUrl}/results/?${params.toString()}`
        }
        return `${baseAppUrl}/calculator/`
      })()

      const ctaLabel = hasCalcParams
        ? 'Revisit your calculation'
        : 'Run a settlement calculation'

      const safeFirstName = escapeHtml(firstName)
      const safeContactDisplay = escapeHtml(safeContactTime)
      const safeContactLabel = escapeHtml(safeContactTime.toLowerCase())
      const safeCalcUrl = escapeHtml(calculationUrl)

      const recommendedGuides = selectRecommendedGuides({
        disputeReason: input.disputeReason,
        verdict,
        hasDiscrimination: input.hasDiscrimination,
        salaryNum,
      })
      const utmQuery = 'utm_source=email&utm_medium=lead_confirmation&utm_campaign=call_prep'

      const guidesTextBlock = recommendedGuides
        .map((g) => `- ${g.title}: ${baseAppUrl}${g.path}?${utmQuery}`)
        .join('\n')

      const guidesHtmlRows = recommendedGuides
        .map((g, idx) => {
          const borderTop = idx === 0 ? '' : 'border-top: 1px solid #E2DCCE;'
          const guideUrl = escapeHtml(`${baseAppUrl}${g.path}?${utmQuery}`)
          return `
                      <tr>
                        <td style="padding: 12px 0; ${borderTop}">
                          <a href="${guideUrl}" style="display: block; text-decoration: none; color: #0B1F3A;">
                            <span style="display: block; font-size: 14px; font-weight: 600; color: #0B1F3A; line-height: 1.4; margin-bottom: 3px;">${escapeHtml(g.title)} <span style="color: #D9603B;">&rarr;</span></span>
                            <span style="display: block; font-size: 13px; color: #5B6577; line-height: 1.5;">${escapeHtml(g.summary)}</span>
                          </a>
                        </td>
                      </tr>`
        })
        .join('')

      const employeeText = [
        `Hi ${firstName},`,
        '',
        'Your details are with us.',
        `We have received your request and are matching you with a vetted employment solicitor. You should expect a call within 24 hours during your preferred time (${safeContactTime.toLowerCase()}).`,
        '',
        `${ctaLabel}: ${calculationUrl}`,
        '',
        'Prepare for your call:',
        guidesTextBlock,
        '',
        'How legal fees work (Section 203(3) ERA 1996): Independent advice is required for your agreement to be binding. Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion. If you choose not to sign or instructions exceed the cap, fees remain subject to your solicitor\'s terms.',
        '',
        '---',
        'SettlementCheck • United Kingdom • team@settlementcheck.co.uk',
        'SettlementCheck is an introduction service, not a law firm. We connect you with SRA-regulated solicitors. We do not provide legal advice.',
      ].join('\n')

      await resend.emails.send({
        from: 'SettlementCheck <team@settlementcheck.co.uk>',
        replyTo: 'team@settlementcheck.co.uk',
        to: normalizedEmail,
        subject: 'We have received your details - SettlementCheck',
        text: employeeText,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; -webkit-text-size-adjust: 100%;">
  <!-- Preheader -->
  <div style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    We are matching you with an SRA-regulated employment solicitor. Expect a call within 24 hours (${safeContactLabel}).
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 32px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <!-- Header Lockup -->
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #E2DCCE;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 10px;">
                    <img src="https://settlementcheck.co.uk/email-logo.png" width="28" height="28" alt="" style="display: block; width: 28px; height: 28px; border-radius: 6px; border: 0;" />
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 17px; font-weight: 700; color: #0B1F3A; letter-spacing: -0.015em;">SettlementCheck</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding-top: 32px;">
              <h1 style="font-size: 24px; font-weight: 700; color: #0B1F3A; margin: 0 0 16px; letter-spacing: -0.02em; line-height: 1.25;">Your details are with us</h1>
              <p style="color: #1A2F4E; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">Hi ${safeFirstName}, we have received your request and are matching you with a vetted employment solicitor.</p>

              <!-- Scannable Callback Summary -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F7F4EE; border: 1px solid #E2DCCE; border-radius: 10px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; line-height: 1.5;">
                      <tr>
                        <td style="padding: 4px 0; color: #5B6577; width: 48%;">Expected call</td>
                        <td style="padding: 4px 0; color: #0B1F3A; font-weight: 600; text-align: right;">Within 24 hours</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0 4px; color: #5B6577; border-top: 1px solid #E2DCCE;">Preferred time</td>
                        <td style="padding: 8px 0 4px; color: #0B1F3A; font-weight: 600; text-align: right; border-top: 1px solid #E2DCCE;">${safeContactDisplay}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Centered Primary CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="background-color: #D9603B; border-radius: 8px;">
                          <a href="${safeCalcUrl}"
                             style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 700; color: #ffffff !important; text-decoration: none; letter-spacing: -0.01em; border-radius: 8px;">
                            <span style="color: #ffffff;">${ctaLabel} &rarr;</span>
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #5B6577; font-size: 13px; line-height: 1.5; margin: 12px 0 0; text-align: center;">Review or adjust your figures any time before your call.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contextual Reading Recommendations -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #E2DCCE;">
              <p style="color: #5B6577; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 4px;">Prepare for your call</p>
              <p style="color: #1A2F4E; font-size: 14px; line-height: 1.5; margin: 0 0 8px;">Short guides matched to your situation:</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                ${guidesHtmlRows}
              </table>
            </td>
          </tr>

          <!-- Statutory Fee Note -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #E2DCCE;">
              <p style="color: #0B1F3A; font-size: 13px; font-weight: 600; line-height: 1.4; margin: 0 0 8px;">How legal fees work (Section 203(3) ERA 1996)</p>
              <p style="color: #5B6577; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">Independent advice is required for your agreement to be binding. Employers standardly provide a capped contribution (typically &pound;350 to &pound;500+ plus VAT) directly to your solicitor upon completion. If you choose not to sign or instructions exceed the cap, fees remain subject to your solicitor&apos;s terms.</p>
            </td>
          </tr>

          <!-- Regulatory Footer -->
          <tr>
            <td style="padding-top: 16px; border-top: 1px solid #E2DCCE;">
              <p style="color: #8A93A3; font-size: 12px; line-height: 1.6; margin: 0 0 8px;">SettlementCheck is an introduction service, not a law firm. We connect you with SRA-regulated solicitors. We do not provide legal advice.</p>
              <p style="color: #8A93A3; font-size: 11px; line-height: 1.5; margin: 0;">SettlementCheck &bull; United Kingdom &bull; team@settlementcheck.co.uk</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      })
    } catch (emailErr) {
      console.error('Employee confirmation email failed (non-fatal):', emailErr)
    }
  }

  const clioPayload = preFlightDossier?.crmPayload?.clioMatterPayload || triage.clioMatterPayload
  const leapPayload = (preFlightDossier?.crmPayload as any)?.leapMatterPayload || triage.leapMatterPayload

  return {
    success: true,
    triageId: triage.triageId,
    leadId,
    phoneProvided,
    triage,
    clioPayload,
    leapPayload,
    partnerVerified: partnerCheck.verified,
    partnerFirmName: partnerCheck.firmName,
  }
}
