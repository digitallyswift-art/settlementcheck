/**
 * Deterministic IEEE Boundary Value Analysis (BVA) Calculator Test Runner
 * Evaluates lib/calculations.ts and lib/statutory-rates.ts against statutory invariants
 * 
 * Usage:
 *   npx tsx scripts/audit/run-calculator-bva.ts
 */

import fs from 'fs';
import path from 'path';
import { 
  calcRedundancy, 
  calcBasicAward, 
  statutoryNoticeWeeks, 
  calcNotice, 
  getVerdict,
  calculateTotalIncomeTax,
  WEEKLY_CAP_GB,
  WEEKLY_CAP_NI
} from '../../lib/calculations';
import { STATUTORY_RATES_2026_27 } from '../../lib/statutory-rates';

interface TestCase {
  id: string;
  name: string;
  calculator: string;
  inputs: {
    salary: number;
    totalMonths: number;
    age: number;
    offer?: number;
    reason?: string;
    discrimination?: string;
    contractualNoticeWeeks?: number;
    jurisdiction?: 'GB' | 'NI';
    offerIncludesNotice?: boolean;
  };
  expected: {
    redundancy?: number;
    noticeWeeks?: number;
    noticePay?: number;
    taxRate?: number;
    estimatedTax?: number;
    estimatedNet?: number;
    effectiveOffer?: number;
  };
  rule: string;
  boundaryTested: string;
}

const TEST_CASES: TestCase[] = [
  // 1. Statutory Redundancy Pay (SRP) Boundaries
  {
    id: 'SC-T-001',
    name: 'SRP Service < 24 months (0 months)',
    calculator: 'Redundancy',
    inputs: { salary: 30000, totalMonths: 0, age: 30 },
    expected: { redundancy: 0 },
    rule: 'ERA 1996 s.155 (2 years qualifying service required)',
    boundaryTested: 'Zero service boundary',
  },
  {
    id: 'SC-T-002',
    name: 'SRP Service < 24 months (23 months)',
    calculator: 'Redundancy',
    inputs: { salary: 30000, totalMonths: 23, age: 30 },
    expected: { redundancy: 0 },
    rule: 'ERA 1996 s.155 (2 years qualifying service required)',
    boundaryTested: 'Just below 2-year threshold (23m)',
  },
  {
    id: 'SC-T-003',
    name: 'SRP Service exactly 24 months (Age 21)',
    calculator: 'Redundancy',
    inputs: { salary: 26000, totalMonths: 24, age: 21 }, // weekly = £500
    expected: { redundancy: 500 }, // 2 yrs * 0.5 = 1.0 wk * £500 = £500
    rule: 'ERA 1996 s.162 (0.5x multiplier under age 22)',
    boundaryTested: 'First qualifying threshold, age 21 (<22 band)',
  },
  {
    id: 'SC-T-004',
    name: 'SRP Age transition 21 to 22 (Age 22, 2 years service)',
    calculator: 'Redundancy',
    inputs: { salary: 26000, totalMonths: 24, age: 22 }, // weekly = £500
    expected: { redundancy: 750 }, // 1 yr at 22 (1.0x) + 1 yr at 21 (0.5x) = 1.5 wks * £500 = £750
    rule: 'ERA 1996 s.162 (Age 21 to 22 transition)',
    boundaryTested: 'Age 21/22 transition boundary',
  },
  {
    id: 'SC-T-005',
    name: 'SRP Standard 22-40 age band (Age 35, 5 years service)',
    calculator: 'Redundancy',
    inputs: { salary: 31200, totalMonths: 60, age: 35 }, // weekly = £600
    expected: { redundancy: 3000 }, // 5 yrs * 1.0x * £600 = £3000
    rule: 'ERA 1996 s.162 (1.0x multiplier for ages 22-40)',
    boundaryTested: 'Middle band (22-40)',
  },
  {
    id: 'SC-T-006',
    name: 'SRP Age transition 40 to 41 (Age 41, 3 years service)',
    calculator: 'Redundancy',
    inputs: { salary: 31200, totalMonths: 36, age: 41 }, // weekly = £600
    expected: { redundancy: 2100 }, // 1 yr at 41 (1.5x) + 2 yrs at 40,39 (2.0x) = 3.5 wks * £600 = £2100
    rule: 'ERA 1996 s.162 (Age 40 to 41 transition)',
    boundaryTested: 'Age 40/41 transition boundary',
  },
  {
    id: 'SC-T-007',
    name: 'SRP Upper age band (Age 50, 10 years service)',
    calculator: 'Redundancy',
    inputs: { salary: 31200, totalMonths: 120, age: 50 }, // weekly = £600
    expected: { redundancy: 9000 }, // 10 yrs * 1.5x * £600 = £9000
    rule: 'ERA 1996 s.162 (1.5x multiplier for 41+)',
    boundaryTested: 'Upper band (41+)',
  },
  {
    id: 'SC-T-008',
    name: 'SRP Weekly pay just below GB statutory cap (Age 50, 10 years, £750/wk)',
    calculator: 'Redundancy',
    inputs: { salary: 39000, totalMonths: 120, age: 50 }, // weekly = £750
    expected: { redundancy: 11250 }, // 10 yrs * 1.5x * £750 = £11,250
    rule: 'ERA 1996 s.227 (Weekly cap threshold)',
    boundaryTested: 'Just below GB weekly cap (£750 vs £751)',
  },
  {
    id: 'SC-T-009',
    name: 'SRP Weekly pay exactly at GB statutory cap (Age 50, 10 years, £751/wk)',
    calculator: 'Redundancy',
    inputs: { salary: 39052, totalMonths: 120, age: 50 }, // weekly = £751
    expected: { redundancy: 11265 }, // 10 yrs * 1.5x * £751 = £11,265
    rule: 'ERA 1996 s.227 / SI 2026/310 (£751 cap)',
    boundaryTested: 'Exact GB weekly cap (£751)',
  },
  {
    id: 'SC-T-010',
    name: 'SRP Weekly pay well above GB statutory cap (Age 50, 10 years, £1,500/wk)',
    calculator: 'Redundancy',
    inputs: { salary: 78000, totalMonths: 120, age: 50 }, // weekly = £1500, capped at £751
    expected: { redundancy: 11265 }, // 10 yrs * 1.5x * £751 = £11,265
    rule: 'ERA 1996 s.227 (Cap enforcement)',
    boundaryTested: 'Above GB weekly cap (£1500 capped at £751)',
  },
  {
    id: 'SC-T-011',
    name: 'SRP Maximum statutory cap — 20 years all in 41+ band (Age 62, 20 yrs)',
    calculator: 'Redundancy',
    inputs: { salary: 52000, totalMonths: 240, age: 62 }, // weekly = £1000, capped at £751
    expected: { redundancy: 22530 }, // 20 yrs * 1.5x * £751 = £22,530
    rule: 'ERA 1996 s.162(3) (20-year service ceiling in 1.5x band)',
    boundaryTested: 'Maximum service cap (20 years in 1.5x band)',
  },
  {
    id: 'SC-T-011b',
    name: 'SRP Service crossing 40/41 band boundary (Age 55, 20 yrs service)',
    calculator: 'Redundancy',
    inputs: { salary: 52000, totalMonths: 240, age: 55 }, // weekly = £1000, capped at £751
    expected: { redundancy: 20653 }, // 15 yrs @ 1.5x + 5 yrs @ 1.0x = 27.5 wks * £751 = £20,653
    rule: 'ERA 1996 s.162 (Cross-band counting back from termination age)',
    boundaryTested: '20 years service crossing 40/41 threshold',
  },
  {
    id: 'SC-T-012',
    name: 'SRP Service exceeding 20-year cap (Age 65, 25 years service)',
    calculator: 'Redundancy',
    inputs: { salary: 52000, totalMonths: 300, age: 65 }, // weekly = £1000, capped at £751
    expected: { redundancy: 22530 }, // strictly capped at 20 yrs * 1.5x = £22,530
    rule: 'ERA 1996 s.162(3) (20-year service ceiling)',
    boundaryTested: 'Service exceeding 20-year cap (25 years)',
  },
  {
    id: 'SC-T-013',
    name: 'SRP Northern Ireland statutory cap (Age 62, 20 years service, NI jurisdiction)',
    calculator: 'Redundancy',
    inputs: { salary: 52000, totalMonths: 240, age: 62, jurisdiction: 'NI' },
    expected: { redundancy: 23490 }, // 20 yrs * 1.5x * £783 = £23,490
    rule: 'ERO(NI) 1996 (Northern Ireland weekly cap £783)',
    boundaryTested: 'Northern Ireland cap (£783/wk vs GB £751/wk)',
  },

  // 2. Statutory Notice Boundaries (ERA 1996 s.86)
  {
    id: 'SC-T-014',
    name: 'Notice Service < 1 month (0 weeks)',
    calculator: 'Notice',
    inputs: { salary: 30000, totalMonths: 0, age: 30 },
    expected: { noticeWeeks: 0 },
    rule: 'ERA 1996 s.86(1) (< 1 month = 0 notice)',
    boundaryTested: 'Notice service < 1 month',
  },
  {
    id: 'SC-T-015',
    name: 'Notice Service 1 month to 2 years (1 week)',
    calculator: 'Notice',
    inputs: { salary: 30000, totalMonths: 18, age: 30 },
    expected: { noticeWeeks: 1 },
    rule: 'ERA 1996 s.86(1)(a) (1 month to 2 years = 1 week)',
    boundaryTested: 'Notice service 18 months',
  },
  {
    id: 'SC-T-016',
    name: 'Notice Service exactly 2 years (2 weeks)',
    calculator: 'Notice',
    inputs: { salary: 30000, totalMonths: 24, age: 30 },
    expected: { noticeWeeks: 2 },
    rule: 'ERA 1996 s.86(1)(b) (1 week per year for 2+ years)',
    boundaryTested: 'Notice service 2-year boundary',
  },
  {
    id: 'SC-T-017',
    name: 'Notice Service 12 years (12 weeks)',
    calculator: 'Notice',
    inputs: { salary: 30000, totalMonths: 144, age: 30 },
    expected: { noticeWeeks: 12 },
    rule: 'ERA 1996 s.86(1)(b) (12 weeks for 12 years)',
    boundaryTested: 'Notice service 12-year boundary',
  },
  {
    id: 'SC-T-018',
    name: 'Notice Service exceeding 12-year statutory cap (15 years)',
    calculator: 'Notice',
    inputs: { salary: 30000, totalMonths: 180, age: 30 },
    expected: { noticeWeeks: 12 },
    rule: 'ERA 1996 s.86(1)(b) (Capped at 12 weeks statutory maximum)',
    boundaryTested: 'Notice service exceeding 12-year cap',
  },

  // 3. Progressive Tiered Tax Engine Boundaries (SC-B-019 & ITEPA 2003)
  {
    id: 'SC-T-019',
    name: 'Progressive Tax: Basic rate band only (Salary £30,000, Offer £40,000)',
    calculator: 'Verdict',
    inputs: { salary: 30000, totalMonths: 0, age: 30, offer: 40000, reason: 'mutual', contractualNoticeWeeks: 0, offerIncludesNotice: true },
    expected: { estimatedTax: 2000, estimatedNet: 38000 },
    rule: 'ITEPA 2003 s.403 (First £30k tax-free, remaining £10k taxed at 20% basic rate)',
    boundaryTested: 'Basic rate band £12,570 to £50,270',
  },
  {
    id: 'SC-T-020',
    name: 'Progressive Tax Spillover: Crossing Higher Rate threshold £50,270',
    calculator: 'Verdict',
    inputs: { salary: 45000, totalMonths: 0, age: 35, offer: 40000, reason: 'mutual', contractualNoticeWeeks: 0, offerIncludesNotice: true },
    expected: { estimatedTax: 2946, estimatedNet: 37054 },
    rule: 'Income Tax Act 2007 (Spillover from 20% to 40% band across £50,270 threshold)',
    boundaryTested: 'Higher rate transition threshold (£50,270)',
  },
  {
    id: 'SC-T-021',
    name: 'Progressive Tax Taper Trap: Crossing £100,000 to £125,140 (60% marginal band)',
    calculator: 'Verdict',
    inputs: { salary: 95000, totalMonths: 0, age: 40, offer: 45000, reason: 'mutual', contractualNoticeWeeks: 0, offerIncludesNotice: true },
    expected: { estimatedTax: 8000, estimatedNet: 37000 },
    rule: 'Income Tax Act 2007 s.35 (Personal allowance tapering produces 60% effective marginal rate)',
    boundaryTested: 'Personal allowance taper boundary (£100,000 to £125,140)',
  },

  // 4. Step 4/5 Notice Pay Intake Toggle Boundaries (SC-B-020)
  {
    id: 'SC-T-022a',
    name: 'Notice Intake: Offer includes notice pay (SC-B-020)',
    calculator: 'Verdict',
    inputs: { salary: 52000, totalMonths: 24, age: 35, offer: 15000, reason: 'mutual', contractualNoticeWeeks: 2, offerIncludesNotice: true },
    expected: { effectiveOffer: 15000, estimatedTax: 800, estimatedNet: 14200 },
    rule: 'ITEPA 2003 s.402D (PILON £2,000 deducted from £15k offer, leaving £13k tax-free termination)',
    boundaryTested: 'Notice inclusion toggle = true',
  },
  {
    id: 'SC-T-022b',
    name: 'Notice Intake: Notice pay paid on top (SC-B-020)',
    calculator: 'Verdict',
    inputs: { salary: 52000, totalMonths: 24, age: 35, offer: 15000, reason: 'mutual', contractualNoticeWeeks: 2, offerIncludesNotice: false },
    expected: { effectiveOffer: 17000, estimatedTax: 800, estimatedNet: 16200 },
    rule: 'ITEPA 2003 s.402D (Notice £2,000 added to £15k offer, total package = £17,000)',
    boundaryTested: 'Notice inclusion toggle = false',
  },
];

console.log('================================================================');
console.log(' SettlementCheck Deterministic Calculator BVA Runner (SC-T)');
console.log('================================================================\n');

let total = 0;
let passed = 0;
let failed = 0;
const results: any[] = [];

for (const tc of TEST_CASES) {
  total++;
  let actualOutput: any = {};
  let isPass = true;
  let diff = 'None';

  if (tc.calculator === 'Redundancy') {
    const weeklyCap = tc.inputs.jurisdiction === 'NI' ? WEEKLY_CAP_NI : WEEKLY_CAP_GB;
    const actualRedundancy = calcRedundancy(
      tc.inputs.salary,
      tc.inputs.totalMonths,
      tc.inputs.age,
      weeklyCap
    );
    actualOutput.redundancy = actualRedundancy;
    if (actualRedundancy !== tc.expected.redundancy) {
      isPass = false;
      diff = `Expected redundancy £${tc.expected.redundancy}, got £${actualRedundancy}`;
    }
  } else if (tc.calculator === 'Notice') {
    const actualWeeks = statutoryNoticeWeeks(tc.inputs.totalMonths);
    actualOutput.noticeWeeks = actualWeeks;
    if (actualWeeks !== tc.expected.noticeWeeks) {
      isPass = false;
      diff = `Expected notice weeks ${tc.expected.noticeWeeks}, got ${actualWeeks}`;
    }
  } else if (tc.calculator === 'Verdict') {
    const verdictRes = getVerdict(
      tc.inputs.salary,
      tc.inputs.totalMonths,
      tc.inputs.age,
      tc.inputs.offer ?? 0,
      tc.inputs.reason ?? 'mutual',
      tc.inputs.discrimination ?? 'no',
      tc.inputs.contractualNoticeWeeks ?? 0,
      tc.inputs.jurisdiction ?? 'GB',
      tc.inputs.offerIncludesNotice ?? true,
    );
    actualOutput.estimatedTax = verdictRes.estimatedTax;
    actualOutput.estimatedNet = verdictRes.estimatedNet;
    actualOutput.effectiveOffer = verdictRes.effectiveOffer;

    if (tc.expected.estimatedTax !== undefined && verdictRes.estimatedTax !== tc.expected.estimatedTax) {
      isPass = false;
      diff = `Expected estimatedTax £${tc.expected.estimatedTax}, got £${verdictRes.estimatedTax}`;
    }
    if (tc.expected.estimatedNet !== undefined && verdictRes.estimatedNet !== tc.expected.estimatedNet) {
      isPass = false;
      diff = `Expected estimatedNet £${tc.expected.estimatedNet}, got £${verdictRes.estimatedNet}`;
    }
    if (tc.expected.effectiveOffer !== undefined && verdictRes.effectiveOffer !== tc.expected.effectiveOffer) {
      isPass = false;
      diff = `Expected effectiveOffer £${tc.expected.effectiveOffer}, got £${verdictRes.effectiveOffer}`;
    }
  }

  if (isPass) {
    passed++;
    console.log(`  ✓ [PASS] [${tc.id}] ${tc.name} — Output: ${JSON.stringify(actualOutput)}`);
  } else {
    failed++;
    console.error(`  ✗ [FAIL] [${tc.id}] ${tc.name} — Discrepancy: ${diff}`);
  }

  results.push({
    testId: tc.id,
    name: tc.name,
    calculator: tc.calculator,
    status: isPass ? 'PASS' : 'FAIL',
    boundaryTested: tc.boundaryTested,
    rule: tc.rule,
    inputs: tc.inputs,
    expected: tc.expected,
    actual: actualOutput,
    difference: diff,
    dateChecked: new Date().toISOString().split('T')[0],
  });
}

console.log('\n================================================================');
console.log(` Summary: ${passed}/${total} Tests Passed (${Math.round((passed/total)*100)}%)`);
console.log('================================================================\n');

// Write structured results to data/audit/tests.json
const outputDir = path.resolve('data/audit');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
const outputPath = path.join(outputDir, 'tests.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`Structured test records saved to: ${outputPath}`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
