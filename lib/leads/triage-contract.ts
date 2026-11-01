/**
 * SRA Solicitor Triage Contract & Intake Qualification Engine
 *
 * Implements deterministic qualification criteria for SRA-regulated employment solicitors:
 * 1. Continuous Service Tenure: Section 108 Employment Rights Act 1996 (2-year threshold)
 * 2. Statutory Legal Fee Contribution: Section 203(3) ERA 1996 (£350 - £750 + VAT benchmark)
 * 3. Limitation Period & Acas Early Conciliation: Section 111(2) ERA 1996 (3 months minus 1 day)
 * 4. Document Readiness & Negotiation Stage Triage
 * 5. Structured CRM Ingestion Payloads (Clio & LEAP schemas)
 */

export type TenureClassification = 'UNDER_2_YEARS' | 'QUALIFIED_2_PLUS_YEARS'

export type LegalFeeStatus =
  | 'STANDARD_COVERED' // Employer contribution >= £500 + VAT
  | 'PARTIAL_COVERED'  // Employer contribution >= £350 and < £500 + VAT
  | 'MISSING_OR_ZERO'  // Employer contribution is £0 or omitted
  | 'UNSPECIFIED'      // Fee term not yet discussed

export type LimitationRisk =
  | 'URGENT_UNDER_30_DAYS' // Event / termination > 60 days ago; immediate Acas notification required
  | 'STANDARD'             // Within normal 3-month statutory window
  | 'OUT_OF_TIME_RISK'     // > 3 months since event; requires "not reasonably practicable" justification
  | 'ACTIVE_EMPLOYMENT'    // Still employed; limitation clock has not commenced

export type DocumentReadiness =
  | 'FORMAL_AGREEMENT_IN_HAND' // Draft settlement agreement received from HR
  | 'PROTECTED_OFFER_EMAIL'    // Verbal or email proposal under ERA 1996 s.111A
  | 'DISPUTE_OR_PIP'           // Ongoing performance plan or grievance, no offer yet
  | 'PRE_RESIGNATION'          // Considering resignation (constructive dismissal risk)
  | 'EXPLORATORY'              // General valuation check

export type MatterTier =
  | 'HIGH_VALUE_EXECUTIVE' // Salary >= £100k or offer >= £50k
  | 'STANDARD_COMPLEX'     // 2+ yrs tenure with discrimination or group redundancy
  | 'STANDARD_STATUTORY'   // Standard redundancy / mutual exit with fee contribution
  | 'TACTICAL_SUB_2_YEAR'  // Under 2 years tenure requiring Day-1 claim analysis

export interface SraLeadTriageInput {
  firstName: string
  email: string
  phone: string
  preferredContactTime?: 'Morning' | 'Afternoon' | 'Evening'
  postcode?: string
  postcodeRegion?: string
  salary?: number | null
  monthsService?: number | null
  offerAmount?: number | null
  verdict?: string | null
  disputeReason?: string | null
  hasDiscrimination?: boolean
  documentReadiness?: DocumentReadiness
  employerLegalFeeOffered?: number | null
  terminationDate?: string | null
  isStillEmployed?: boolean
  assignedVariant?: string | null
  sourceUrl?: string | null
}

export interface SraTriageDossier {
  triageId: string
  timestamp: string
  client: {
    firstName: string
    email: string
    phone: string
    postcode?: string
    postcodeRegion?: string
    preferredContactTime: 'Morning' | 'Afternoon' | 'Evening'
  }
  employment: {
    salary: number
    monthsService: number
    tenureYears: number
    tenureClassification: TenureClassification
    isStillEmployed: boolean
    disputeReason: string
    hasDiscrimination: boolean
  }
  commercialOffer: {
    offerAmount: number
    verdict: string
    legalFeeStatus: LegalFeeStatus
    employerLegalFeeOffered: number
    standardFeeBenchmark: string
  }
  regulatoryLimitation: {
    limitationRisk: LimitationRisk
    acasEarlyConciliationRequired: boolean
    statutoryDeadlineNotice: string
  }
  documentReadiness: DocumentReadiness
  matterTier: MatterTier
  sraComplianceNotes: string[]
  clioMatterPayload: Record<string, any>
  leapMatterPayload: Record<string, any>
}

/**
 * Deterministically evaluates an incoming lead against SRA regulatory standards.
 */
export function evaluateSraLeadTriage(input: SraLeadTriageInput): SraTriageDossier {
  const triageId = `SRA-TRG-${Date.now().toString(36).toUpperCase()}`
  const now = new Date()

  // 1. Employment & Tenure Evaluation
  const monthsService = Math.max(0, input.monthsService ?? 0)
  const salary = Math.max(0, input.salary ?? 0)
  const tenureYears = Math.round((monthsService / 12) * 10) / 10
  const tenureClassification: TenureClassification =
    monthsService >= 24 ? 'QUALIFIED_2_PLUS_YEARS' : 'UNDER_2_YEARS'

  const disputeReason = input.disputeReason || 'redundancy'
  const hasDiscrimination = Boolean(input.hasDiscrimination)
  const isStillEmployed = input.isStillEmployed !== false // default true unless specified

  // 2. Commercial Offer & Legal Fee Evaluation
  const offerAmount = Math.max(0, input.offerAmount ?? 0)
  const verdict = input.verdict || 'unknown'
  const legalFeeOffered = input.employerLegalFeeOffered !== undefined && input.employerLegalFeeOffered !== null
    ? Math.max(0, input.employerLegalFeeOffered)
    : 500 // standard default customary contribution

  let legalFeeStatus: LegalFeeStatus = 'UNSPECIFIED'
  if (legalFeeOffered >= 500) {
    legalFeeStatus = 'STANDARD_COVERED'
  } else if (legalFeeOffered >= 350) {
    legalFeeStatus = 'PARTIAL_COVERED'
  } else if (legalFeeOffered === 0) {
    legalFeeStatus = 'MISSING_OR_ZERO'
  }

  // 3. Limitation Timetable & Acas Conciliation
  let limitationRisk: LimitationRisk = isStillEmployed ? 'ACTIVE_EMPLOYMENT' : 'STANDARD'
  let statutoryDeadlineNotice = 'Employment active: statutory 3-month limitation clock has not yet commenced.'

  if (!isStillEmployed && input.terminationDate) {
    const termDate = new Date(input.terminationDate)
    if (!isNaN(termDate.getTime())) {
      const daysSinceTermination = Math.floor((now.getTime() - termDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceTermination > 90) {
        limitationRisk = 'OUT_OF_TIME_RISK'
        statutoryDeadlineNotice = 'Over 90 days elapsed since termination date. Urgent solicitor review required for limitation grounds.'
      } else if (daysSinceTermination >= 60) {
        limitationRisk = 'URGENT_UNDER_30_DAYS'
        statutoryDeadlineNotice = 'Under 30 days remaining in statutory 3-month limitation window. Immediate Acas Early Conciliation notification recommended.'
      } else {
        limitationRisk = 'STANDARD'
        statutoryDeadlineNotice = `Termination occurred ${daysSinceTermination} days ago. Within standard 3-month limitation window.`
      }
    }
  }

  // 4. Document Readiness & Matter Tier
  const documentReadiness: DocumentReadiness = input.documentReadiness || 'FORMAL_AGREEMENT_IN_HAND'

  let matterTier: MatterTier = 'STANDARD_STATUTORY'
  if (salary >= 100000 || offerAmount >= 50000) {
    matterTier = 'HIGH_VALUE_EXECUTIVE'
  } else if (hasDiscrimination || disputeReason === 'redundancy_collective') {
    matterTier = 'STANDARD_COMPLEX'
  } else if (tenureClassification === 'UNDER_2_YEARS') {
    matterTier = 'TACTICAL_SUB_2_YEAR'
  }

  // 5. SRA Regulatory Compliance Notes
  const sraComplianceNotes: string[] = [
    'Section 203(3) ERA 1996: Independent legal adviser certificate required for statutory claim waiver validity.',
    `Customary employer legal fee contribution: £${legalFeeOffered} + VAT recorded (standard benchmark: £350 to £750 + VAT).`,
    tenureClassification === 'QUALIFIED_2_PLUS_YEARS'
      ? `Full ordinary unfair dismissal protection active under ERA 1996 s.108 (${tenureYears} years service). Statutory cap: £123,543.`
      : `Sub-2-year service (${tenureYears} years). Ordinary unfair dismissal unavailable; tactical negotiation relies on notice, process costs, or Day-1 protected rights.`,
    'HMRC Tax Allocation: ITEPA 2003 s.402D PENP notice pay must be partitioned from the Section 403 £30,000 exemption.',
  ]

  // 6. Clio / LEAP CRM Matter Payloads
  const clioMatterPayload = {
    matter: {
      name: `Settlement Agreement: ${input.firstName}`,
      description: `SRA Triage Record: ${triageId}
--------------------------------------------------
Tenure: ${tenureYears} years (${tenureClassification})
Annual Salary: £${salary.toLocaleString('en-GB')}
Employer Offer: £${offerAmount.toLocaleString('en-GB')}
Legal Fee Status: ${legalFeeStatus} (£${legalFeeOffered} + VAT)
Dispute Context: ${disputeReason}
Limitation Status: ${limitationRisk}
Readiness: ${documentReadiness}
Triage Tier: ${matterTier}`,
      status: 'Open',
      client: {
        first_name: input.firstName,
        email: input.email,
        phone: input.phone,
      },
      custom_fields: {
        settlement_verdict: verdict,
        salary: salary,
        offer_amount: offerAmount,
        months_service: monthsService,
        legal_fee_offered: legalFeeOffered,
        tenure_classification: tenureClassification,
        triage_id: triageId,
      },
    },
  }

  const leapMatterPayload = {
    matterType: 'Employment Law / Settlement Agreement',
    clientDetails: {
      name: input.firstName,
      email: input.email,
      phone: input.phone,
      preferredContact: input.preferredContactTime || 'Morning',
    },
    matterSummary: {
      triageId,
      salary,
      monthsService,
      offerAmount,
      verdict,
      matterTier,
      tenureClassification,
      legalFeeStatus,
      limitationRisk,
    },
  }

  return {
    triageId,
    timestamp: now.toISOString(),
    client: {
      firstName: input.firstName,
      email: input.email,
      phone: input.phone,
      postcode: input.postcode,
      postcodeRegion: input.postcodeRegion,
      preferredContactTime: input.preferredContactTime || 'Morning',
    },
    employment: {
      salary,
      monthsService,
      tenureYears,
      tenureClassification,
      isStillEmployed,
      disputeReason,
      hasDiscrimination,
    },
    commercialOffer: {
      offerAmount,
      verdict,
      legalFeeStatus,
      employerLegalFeeOffered: legalFeeOffered,
      standardFeeBenchmark: '£350 to £750 + VAT',
    },
    regulatoryLimitation: {
      limitationRisk,
      acasEarlyConciliationRequired: !isStillEmployed,
      statutoryDeadlineNotice,
    },
    documentReadiness,
    matterTier,
    sraComplianceNotes,
    clioMatterPayload,
    leapMatterPayload,
  }
}
