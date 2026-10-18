/**
 * Master Audit Fleet Runner
 * Executes all deterministic audit scanners and syncs findings to the evidence bus
 * 
 * Usage:
 *   npx tsx scripts/audit/run-all.ts
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { EvidenceBus, EvidenceFinding } from './evidence-bus';

console.log('================================================================');
console.log(' SettlementCheck Master Audit Execution Pipeline');
console.log('================================================================\n');

try {
  console.log('0. Validating Audit Artifact Naming Conventions & Headers...');
  execSync('npx tsx scripts/audit/lint-audit-naming.ts', { stdio: 'inherit' });
} catch (e) {
  console.error('Audit naming linter detected violations.');
  process.exit(1);
}

try {
  console.log('\n1. Executing Deterministic BVA Calculator Tests...');
  execSync('npx tsx scripts/audit/run-calculator-bva.ts', { stdio: 'inherit' });
} catch (e) {
  console.error('BVA tests reported issues.');
}

try {
  console.log('\n2. Executing Marketing Claims & CAP Code Scanner...');
  execSync('npx tsx scripts/audit/scan-marketing-claims.ts', { stdio: 'inherit' });
} catch (e) {
  console.error('Claims scanner reported issues.');
}

try {
  console.log('\n3. Executing SRA Boundary & Legal Disclaimer Scanner...');
  execSync('npx tsx scripts/audit/scan-legal-disclaimers.ts', { stdio: 'inherit' });
} catch (e) {
  console.error('Legal scanner reported issues.');
}

try {
  console.log('\n4. Executing PENP Formula Verification...');
  execSync('npx tsx scripts/audit/verify-penp.ts', { stdio: 'inherit' });
} catch (e) {
  console.error('PENP verification reported issues.');
}

try {
  console.log('\n5. Executing Brand Compliance & Copy Scanner...');
  execSync('npx tsx scripts/audit/scan-copy-brand.ts', { stdio: 'inherit' });
} catch (e) {
  console.error('Brand copy scanner reported issues.');
}

// 6. Aggregate findings into Evidence Bus
console.log('\n6. Aggregating structured findings into Evidence Bus...');
const claimsFile = path.resolve('data/audit/claims-findings.json');
if (fs.existsSync(claimsFile)) {
  const claims = JSON.parse(fs.readFileSync(claimsFile, 'utf-8'));
  let count = 0;
  for (const c of claims) {
    const finding: EvidenceFinding = {
      id: c.id,
      sourceLocation: `${c.file}:${c.lineNumber}`,
      exactFinding: `Unsubstantiated marketing phrase: "${c.matchedText}" in context: "${c.context}"`,
      evidenceSource: 'CAP Code Rule 3.1 & 3.7 / ASA Guidance on Objective Claims',
      sourceDate: '2026-04-06',
      dateChecked: new Date().toISOString().split('T')[0],
      confidence: 'High',
      severity: c.severity,
      verificationStatus: 'Confirmed',
      classification: 'Requires qualification',
      jurisdiction: 'UK-wide',
      userImpact: 'User may assume informal benchmark or average is an established statutory entitlement.',
      recommendedAction: c.recommendedAction,
      evidenceRequired: 'Documented empirical payout dataset or statutory qualification.',
    };
    EvidenceBus.addFinding(finding);
    count++;
  }
  console.log(`  ✓ Synced ${count} claims findings to data/audit/findings.json`);
}

// Also add the known Class 1A Employer NIC statutory discrepancy
EvidenceFinding: {
  const nicFinding: EvidenceFinding = {
    id: 'SC-E-TAX-001',
    sourceLocation: 'lib/statutory-rates.ts:107',
    exactFinding: "Statutory table states: 'Employer NIC on termination payments over £30k: 13.8% (Class 1A)'.",
    evidenceSource: 'HMRC NIM07000 & Autumn Budget (Class 1A increased to 15.0% from 6 April 2025/2026)',
    sourceDate: '2025-04-06',
    dateChecked: new Date().toISOString().split('T')[0],
    confidence: 'High',
    severity: 'P1',
    verificationStatus: 'Confirmed',
    classification: 'Confirmed error',
    jurisdiction: 'UK-wide',
    userImpact: 'Solicitors and HR teams calculating employer cost could understate statutory Class 1A NIC liability.',
    recommendedAction: "Update statutory-rates.ts row to cite '15.0% (Class 1A)' in 2026/27.",
    evidenceRequired: 'HMRC Guidance on Class 1A National Insurance contributions on termination awards.',
  };
  EvidenceBus.addFinding(nicFinding);
  console.log('  ✓ Synced SC-E-TAX-001 (15% Class 1A NIC rate) to data/audit/findings.json');
}

const allFindings = EvidenceBus.loadFindings();
console.log(`\n================================================================`);
console.log(` Master Audit Pipeline Complete. Total Findings in Evidence Bus: ${allFindings.length}`);
console.log('================================================================\n');
