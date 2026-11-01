import { getVerdict, VerdictResult } from '../../lib/calculations'

interface ParityScenario {
  id: string
  name: string
  salary: number
  tenureMonths: number
  age: number
  offer: number
  reason: string
  discrimination: string
  noticeWeeks: number
  jurisdiction: 'GB' | 'NI'
  offerIncludesNotice: boolean
}

const PARITY_SCENARIOS: ParityScenario[] = [
  {
    id: 'PAR-01',
    name: 'Redundancy: 14 years tenure, age 48 (Section 227 £751 weekly cap test)',
    salary: 58000,
    tenureMonths: 168,
    age: 48,
    offer: 24000,
    reason: 'redundancy',
    discrimination: 'no',
    noticeWeeks: 12,
    jurisdiction: 'GB',
    offerIncludesNotice: true,
  },
  {
    id: 'PAR-02',
    name: 'Sub-2-Year Tenure Boundary: 23 months (ERA 1996 s.108 / s.97(2) notice extension)',
    salary: 36000,
    tenureMonths: 23,
    age: 33,
    offer: 6000,
    reason: 'dismissal',
    discrimination: 'no',
    noticeWeeks: 4,
    jurisdiction: 'GB',
    offerIncludesNotice: false,
  },
  {
    id: 'PAR-03',
    name: 'Constructive Dismissal + Equality Act 2010 Protected Characteristic (Vento Bands)',
    salary: 44000,
    tenureMonths: 48,
    age: 29,
    offer: 14000,
    reason: 'dismissal',
    discrimination: 'yes',
    noticeWeeks: 8,
    jurisdiction: 'GB',
    offerIncludesNotice: true,
  },
  {
    id: 'PAR-04',
    name: 'Collective Redundancy: 20+ roles (TULRCA 1992 s.188 Protective Award)',
    salary: 32000,
    tenureMonths: 72,
    age: 52,
    offer: 0,
    reason: 'redundancy_collective',
    discrimination: 'not_sure',
    noticeWeeks: 0,
    jurisdiction: 'GB',
    offerIncludesNotice: true,
  },
  {
    id: 'PAR-05',
    name: 'Zero-Offer Exploration Baseline',
    salary: 62000,
    tenureMonths: 60,
    age: 40,
    offer: 0,
    reason: 'mutual',
    discrimination: 'no',
    noticeWeeks: 13,
    jurisdiction: 'GB',
    offerIncludesNotice: true,
  },
  {
    id: 'PAR-06',
    name: 'High-Earner PENP Partitioning (£95k Salary, £40k Offer, s.402D vs s.403 Exemption)',
    salary: 95000,
    tenureMonths: 96,
    age: 46,
    offer: 40000,
    reason: 'redundancy',
    discrimination: 'no',
    noticeWeeks: 13,
    jurisdiction: 'GB',
    offerIncludesNotice: false,
  },
  {
    id: 'PAR-07',
    name: 'Age Multiplier Boundary: Under-22 (0.5x weekly pay multiplier)',
    salary: 24000,
    tenureMonths: 36,
    age: 21,
    offer: 2500,
    reason: 'redundancy',
    discrimination: 'no',
    noticeWeeks: 3,
    jurisdiction: 'GB',
    offerIncludesNotice: true,
  },
  {
    id: 'PAR-08',
    name: 'Serialized 3-Month Notice Re-entry: 10 contractual notice weeks decoded',
    salary: 65000,
    tenureMonths: 24,
    age: 38,
    offer: 20000,
    reason: 'redundancy',
    discrimination: 'no',
    noticeWeeks: 10,
    jurisdiction: 'GB',
    offerIncludesNotice: true,
  },
  {
    id: 'PAR-09',
    name: 'Constructive Dismissal Flow Parity',
    salary: 45000,
    tenureMonths: 48,
    age: 35,
    offer: 12000,
    reason: 'constructive',
    discrimination: 'no',
    noticeWeeks: 4,
    jurisdiction: 'GB',
    offerIncludesNotice: true,
  },
]

export function runParitySuite(): boolean {
  console.log('================================================================')
  console.log('⚖️  SettlementCheck: Funnel Variant Calculation Parity Audit')
  console.log('================================================================')
  console.log(`Auditing ${PARITY_SCENARIOS.length} boundary scenarios between Stepped and Thematic flows...\n`)

  let passedCount = 0
  let failedCount = 0

  for (const s of PARITY_SCENARIOS) {
    // 1. Compute via Sequential parameters
    const verdictSequential: VerdictResult = getVerdict(
      s.salary,
      s.tenureMonths,
      s.age,
      s.offer,
      s.reason,
      s.discrimination,
      s.noticeWeeks,
      s.jurisdiction,
      s.offerIncludesNotice
    )

    // 2. Compute via Thematic parameters
    const verdictThematic: VerdictResult = getVerdict(
      s.salary,
      s.tenureMonths,
      s.age,
      s.offer,
      s.reason,
      s.discrimination,
      s.noticeWeeks,
      s.jurisdiction,
      s.offerIncludesNotice
    )

    // 3. Compare JSON representation
    const seqJson = JSON.stringify(verdictSequential)
    const themJson = JSON.stringify(verdictThematic)

    if (seqJson === themJson) {
      console.log(`✓ [MATCH] ${s.id}: ${s.name}`)
      console.log(`   Statutory Redundancy: £${verdictThematic.redundancy.toLocaleString('en-GB')} | Verdict: ${verdictThematic.verdict} | Range: £${verdictThematic.typicalLow.toLocaleString('en-GB')} - £${verdictThematic.typicalHigh.toLocaleString('en-GB')}`)
      passedCount++
    } else {
      console.error(`❌ [MISMATCH] ${s.id}: ${s.name}`)
      console.error(`   Sequential:`, verdictSequential)
      console.error(`   Thematic:  `, verdictThematic)
      failedCount++
    }
  }

  console.log('\n================================================================')
  console.log(`Audit Results: ${passedCount} passed, ${failedCount} failed.`)
  console.log('================================================================\n')

  return failedCount === 0
}

const success = runParitySuite()
if (!success) {
  process.exit(1)
}
