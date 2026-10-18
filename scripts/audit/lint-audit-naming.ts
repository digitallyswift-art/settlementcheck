import fs from 'fs';
import path from 'path';

/**
 * Deterministic Audit Artifact & Naming Convention Linter
 * Enforces uniform, human-readable file naming, H1 header consistency,
 * metadata completeness, and zero dead cross-document links across docs/audit/.
 */

interface PhaseSpec {
  phaseId: string;
  expectedFile: string;
  expectedH1Prefix: string;
}

// Canonical registry of all allowed audit deliverables (Phases 01 through 10)
const ALLOWED_DELIVERABLES: Record<string, PhaseSpec> = {
  'phase-01a-source-register.md': {
    phaseId: '01A',
    expectedFile: 'phase-01a-source-register.md',
    expectedH1Prefix: '# Phase 01A — Statutory & Legal Source Register',
  },
  'phase-01b-project-discovery.md': {
    phaseId: '01B',
    expectedFile: 'phase-01b-project-discovery.md',
    expectedH1Prefix: '# Phase 01B — Project Discovery & Architecture Baseline Report',
  },
  'phase-02-website-inventory.md': {
    phaseId: '02',
    expectedFile: 'phase-02-website-inventory.md',
    expectedH1Prefix: '# Phase 02 — Complete Website & Route Inventory Report',
  },
  'phase-03-implementation-review.md': {
    phaseId: '03',
    expectedFile: 'phase-03-implementation-review.md',
    expectedH1Prefix: '# Phase 03 — Source Code & Implementation Review Report',
  },
  'phase-04a-legal-compliance-audit.md': {
    phaseId: '04A',
    expectedFile: 'phase-04a-legal-compliance-audit.md',
    expectedH1Prefix: '# Phase 04A — Legal Compliance Audit Report',
  },
  'phase-04b-tax-compliance-audit.md': {
    phaseId: '04B',
    expectedFile: 'phase-04b-tax-compliance-audit.md',
    expectedH1Prefix: '# Phase 04B — UK Employment Tax & HMRC Compliance Audit Report',
  },
  'phase-05-calculator-audit.md': {
    phaseId: '05',
    expectedFile: 'phase-05-calculator-audit.md',
    expectedH1Prefix: '# Phase 05 — Settlement Calculator & Statutory Formula Audit Report',
  },
  'phase-06-product-gap-analysis.md': {
    phaseId: '06',
    expectedFile: 'phase-06-product-gap-analysis.md',
    expectedH1Prefix: '# Phase 06 — Product & User Protection Gap Analysis Report',
  },
  'phase-07-unsupported-claims-and-privacy.md': {
    phaseId: '07',
    expectedFile: 'phase-07-unsupported-claims-and-privacy.md',
    expectedH1Prefix: '# Phase 07 — Unsupported Claims & Document Privacy Audit Report',
  },
  'phase-08a-seo-aeo-audit.md': {
    phaseId: '08A',
    expectedFile: 'phase-08a-seo-aeo-audit.md',
    expectedH1Prefix: '# Phase 08A — SEO & AEO Technical Architecture Audit Report',
  },
  'phase-08b-conversion-commercial-audit.md': {
    phaseId: '08B',
    expectedFile: 'phase-08b-conversion-commercial-audit.md',
    expectedH1Prefix: '# Phase 08B — Conversion & Commercial Opportunity Audit Report',
  },
  'phase-09-forum-demand-matrix.md': {
    phaseId: '09',
    expectedFile: 'phase-09-forum-demand-matrix.md',
    expectedH1Prefix: '# Phase 09 — Qualitative Forum Demand & Anxiety Matrix',
  },
  'phase-10a-prioritised-remediation-backlog.md': {
    phaseId: '10A',
    expectedFile: 'phase-10a-prioritised-remediation-backlog.md',
    expectedH1Prefix: '# Phase 10A — Prioritised Remediation Backlog & Human-in-the-Loop Roadmap',
  },
  'phase-10b-executive-summary.md': {
    phaseId: '10B',
    expectedFile: 'phase-10b-executive-summary.md',
    expectedH1Prefix: '# Phase 10B — Final Executive Summary & Board MOAT Report',
  },
};

const AUDIT_DIR = path.resolve('docs/audit');

function runNamingLint(): void {
  console.log('====================================================');
  console.log(' SettlementCheck Audit Naming & Structure Linter   ');
  console.log('====================================================\n');

  if (!fs.existsSync(AUDIT_DIR)) {
    console.error(`FATAL: docs/audit directory does not exist at ${AUDIT_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(AUDIT_DIR);
  const errors: string[] = [];
  let checkedCount = 0;

  for (const file of files) {
    if (file === 'README.md') {
      checkedCount++;
      continue;
    }

    // 1. Strict Filename Regex & Canonical Registry Check
    const spec = ALLOWED_DELIVERABLES[file];
    if (!spec) {
      errors.push(
        `UNAUTHORIZED_FILE: "${file}" does not conform to two-digit zero-padded phase schema (e.g. "phase-01a-source-register.md") or is not registered in ALLOWED_DELIVERABLES.`
      );
      continue;
    }

    const filePath = path.join(AUDIT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // 2. Line 1 H1 Header Check
    const line1 = lines[0]?.trim() || '';
    if (!line1.startsWith(spec.expectedH1Prefix)) {
      errors.push(
        `HEADER_MISMATCH in "${file}":\n  Expected to start with: "${spec.expectedH1Prefix}"\n  Received:               "${line1}"`
      );
    }

    // 3. Required Metadata Preamble Check
    const requiredMetadata = [
      '**Project:** SettlementCheck (settlementcheck.co.uk)',
      '**Audit Phase:**',
      '**Date of Audit:**',
    ];
    for (const meta of requiredMetadata) {
      if (!content.includes(meta)) {
        errors.push(`MISSING_METADATA in "${file}": Document lacks required token "${meta}".`);
      }
    }

    // 4. Broken Local Markdown Links Check
    const linkMatches = content.match(/\[.*?\]\((file:\/\/\/c:\/settlementcheck\/docs\/audit\/[^)#]+)/g);
    if (linkMatches) {
      for (const match of linkMatches) {
        const rawTarget = match.replace(/\[.*?\]\(file:\/\/\/c:\/settlementcheck\/docs\/audit\//, '').replace(/\)$/, '');
        const targetPath = path.join(AUDIT_DIR, rawTarget);
        if (!fs.existsSync(targetPath)) {
          errors.push(`BROKEN_LINK in "${file}": Target file "${rawTarget}" does not exist in docs/audit/.`);
        }
      }
    }

    checkedCount++;
    console.log(`  ✓ Checked [${spec.phaseId}] ${file}`);
  }

  console.log(`\nVerified ${checkedCount} file(s) in docs/audit/ against canonical phase schema.`);

  if (errors.length > 0) {
    console.error('\n❌ NAMING CONVENTION / STRUCTURE VIOLATIONS DETECTED:');
    errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
    console.error('\nFix the above violations to satisfy the Antigravity Zero-Assumption Protocol.\n');
    process.exit(1);
  }

  console.log('✅ ALL CLEAR: 100% compliance with strict audit naming conventions & headers!\n');
}

runNamingLint();
