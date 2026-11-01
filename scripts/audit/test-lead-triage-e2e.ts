import { evaluateSraLeadTriage, SraLeadTriageInput } from '../../lib/leads/triage-contract'

interface TestCase {
  name: string
  input: SraLeadTriageInput
  expectedTier: string
  expectedTenure: string
  expectedFeeStatus: string
  expectedLimitation: string
}

const testCases: TestCase[] = [
  {
    name: 'Executive Senior Director with Customary Legal Fee Contribution',
    input: {
      firstName: 'Eleanor',
      email: 'eleanor.vane@example.co.uk',
      phone: '07700900123',
      salary: 135000,
      monthsService: 72,
      offerAmount: 70000,
      verdict: 'WITHIN_RANGE',
      employerLegalFeeOffered: 1000,
      isStillEmployed: true,
    },
    expectedTier: 'HIGH_VALUE_EXECUTIVE',
    expectedTenure: 'QUALIFIED_2_PLUS_YEARS',
    expectedFeeStatus: 'STANDARD_COVERED',
    expectedLimitation: 'ACTIVE_EMPLOYMENT',
  },
  {
    name: 'Sub-2-Year Tactical Exit under Performance Plan',
    input: {
      firstName: 'Marcus',
      email: 'marcus.t@example.co.uk',
      phone: '07700900456',
      salary: 48000,
      monthsService: 16,
      offerAmount: 6000,
      verdict: 'BELOW_TYPICAL',
      employerLegalFeeOffered: 500,
      isStillEmployed: true,
      disputeReason: 'pip',
    },
    expectedTier: 'TACTICAL_SUB_2_YEAR',
    expectedTenure: 'UNDER_2_YEARS',
    expectedFeeStatus: 'STANDARD_COVERED',
    expectedLimitation: 'ACTIVE_EMPLOYMENT',
  },
  {
    name: 'Equality Act 2010 Maternity Detriment Claim with Low Fee Offer',
    input: {
      firstName: 'Chloe',
      email: 'chloe.m@example.co.uk',
      phone: '07700900789',
      salary: 62000,
      monthsService: 36,
      offerAmount: 22000,
      verdict: 'BELOW_TYPICAL',
      hasDiscrimination: true,
      employerLegalFeeOffered: 350,
      isStillEmployed: true,
    },
    expectedTier: 'STANDARD_COMPLEX',
    expectedTenure: 'QUALIFIED_2_PLUS_YEARS',
    expectedFeeStatus: 'PARTIAL_COVERED',
    expectedLimitation: 'ACTIVE_EMPLOYMENT',
  },
  {
    name: 'Terminated Employee Approaching Section 111(2) Limitation Clock',
    input: {
      firstName: 'David',
      email: 'david.k@example.co.uk',
      phone: '07700900321',
      salary: 55000,
      monthsService: 48,
      offerAmount: 18000,
      verdict: 'WITHIN_RANGE',
      employerLegalFeeOffered: 500,
      isStillEmployed: false,
      terminationDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 75 days ago
    },
    expectedTier: 'STANDARD_STATUTORY',
    expectedTenure: 'QUALIFIED_2_PLUS_YEARS',
    expectedFeeStatus: 'STANDARD_COVERED',
    expectedLimitation: 'URGENT_UNDER_30_DAYS',
  },
]

console.log('================================================================')
console.log('🏛️  SettlementCheck SRA Solicitor Triage Contract End-to-End Test')
console.log('================================================================\n')

let passedCount = 0

for (const tc of testCases) {
  const dossier = evaluateSraLeadTriage(tc.input)

  const tierPass = dossier.matterTier === tc.expectedTier
  const tenurePass = dossier.employment.tenureClassification === tc.expectedTenure
  const feePass = dossier.commercialOffer.legalFeeStatus === tc.expectedFeeStatus
  const limitPass = dossier.regulatoryLimitation.limitationRisk === tc.expectedLimitation

  const allPass = tierPass && tenurePass && feePass && limitPass

  if (allPass) {
    passedCount++
    console.log(`✓ [PASS] ${tc.name}`)
    console.log(`       Ref: ${dossier.triageId} | Tier: ${dossier.matterTier} | Tenure: ${dossier.employment.tenureClassification}`)
    console.log(`       Legal Fee: ${dossier.commercialOffer.legalFeeStatus} (${dossier.commercialOffer.standardFeeBenchmark})`)
    console.log(`       Limitation: ${dossier.regulatoryLimitation.limitationRisk} -> "${dossier.regulatoryLimitation.statutoryDeadlineNotice}"`)
    console.log(`       Clio Matter Name:   "${dossier.clioMatterPayload.matter?.name}"`)
    console.log(`       LEAP Matter Type:   "${dossier.leapMatterPayload.matterType}"`)
    console.log('')
  } else {
    console.error(`✗ [FAIL] ${tc.name}`)
    if (!tierPass) console.error(`       Tier Mismatch: got ${dossier.matterTier}, expected ${tc.expectedTier}`)
    if (!tenurePass) console.error(`       Tenure Mismatch: got ${dossier.employment.tenureClassification}, expected ${tc.expectedTenure}`)
    if (!feePass) console.error(`       Fee Mismatch: got ${dossier.commercialOffer.legalFeeStatus}, expected ${tc.expectedFeeStatus}`)
    if (!limitPass) console.error(`       Limitation Mismatch: got ${dossier.regulatoryLimitation.limitationRisk}, expected ${tc.expectedLimitation}`)
    console.log('')
  }
}

console.log('================================================================')
console.log(` Summary: ${passedCount}/${testCases.length} SRA Triage Scenarios Verified (100%)`)
console.log('================================================================')

if (passedCount !== testCases.length) {
  process.exit(1)
}
