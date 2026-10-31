/**
 * Deterministic Legal, SRA, FCA, CMA & 5 Adversarial Traps Compliance Scanner
 * Scans app/ and components/ for SRA boundary compliance, FCA Claims Management rules,
 * CMA fee transparency, the 5 Adversarial Legal Traps, and US legal terminology.
 *
 * Exits with code 1 if any P0 or P1 violation is detected.
 *
 * Usage:
 *   npx tsx scripts/audit/scan-legal-disclaimers.ts
 */

import fs from 'fs';
import path from 'path';

const FORBIDDEN_LEGAL_PHRASES: Array<{
  phrase: string;
  regulator: 'SRA' | 'FCA' | 'CMA' | 'COMMON_LAW_STATUTE' | 'UK_JURISDICTION';
  regex: RegExp;
  severity: 'P0' | 'P1';
  issue: string;
}> = [
  // SRA Boundary & Master Contrast Matrix (Prescriptive vs Descriptive)
  {
    phrase: 'we advise you to',
    regulator: 'SRA',
    regex: /\bwe\s+advise\s+you\s+to\b/i,
    severity: 'P0',
    issue: 'Unauthorised legal advice phrasing (LSA 2007 s.12). Use objective descriptive phrasing.',
  },
  {
    phrase: 'our legal advice is',
    regulator: 'SRA',
    regex: /\bour\s+legal\s+advice\s+is\b/i,
    severity: 'P0',
    issue: 'Unauthorised legal advice phrasing (LSA 2007 s.12).',
  },
  {
    phrase: 'as your solicitor',
    regulator: 'SRA',
    regex: /\bas\s+your\s+solicitor\b/i,
    severity: 'P0',
    issue: 'Holding out as an authorised solicitor (SRA Standards and Regulations).',
  },
  {
    phrase: 'as your legal representative',
    regulator: 'SRA',
    regex: /\bas\s+your\s+legal\s+representative\b/i,
    severity: 'P0',
    issue: 'Holding out as a legal representative.',
  },
  {
    phrase: 'I advise you to',
    regulator: 'SRA',
    regex: /\bI\s+advise\s+you\s+to\b/i,
    severity: 'P0',
    issue: 'Direct prescriptive advice.',
  },
  {
    phrase: 'this legal advice confirms',
    regulator: 'SRA',
    regex: /\bthis\s+legal\s+advice\s+confirms\b/i,
    severity: 'P0',
    issue: 'Describing platform output as legal advice.',
  },
  {
    phrase: 'prescriptive Master Contrast Matrix phrase',
    regulator: 'SRA',
    regex: /\b(what to say to your employer|you should ask for|do not accept this offer|(?<!if\s+you\s+|if\s+i\s+|whether\s+you\s+|when\s+you\s+)do not sign|do not resign|demand a higher settlement|the current offer (?:presented )?is £0)\b/i,
    severity: 'P1',
    issue: 'Prescriptive legal instruction violates Master Contrast Matrix and SRA Rule 5 boundary.',
  },

  // FCA Claims Management (FSMA 2000 RAO 2001 art. 89G) & Consumer Duty (PRIN 2A)
  {
    phrase: 'FCA regulated claim evaluation phrase',
    regulator: 'FCA',
    regex: /\b(we will recover what you are owed|your claim is worth £|you have a strong tribunal case|guaranteed tribunal win)\b/i,
    severity: 'P0',
    issue: 'Crosses into regulated Claims Management under FSMA 2000 RAO 2001 art. 89G.',
  },

  // Trap 1: Offer Revocation & Deadlines (Routledge v Grant / Hyde v Wrench)
  {
    phrase: 'Trap 1 (Routledge v Grant 10-day false entitlement)',
    regulator: 'COMMON_LAW_STATUTE',
    regex: /\b(legal right to 10 days|cannot withdraw the offer (?:for|within) 10 days|employers must provide (?:a minimum of )?10 calendar days|entitled to (?:a minimum of )?10 calendar days|10 calendar days.{0,30}required for the agreement to be legally binding)\b/i,
    severity: 'P1',
    issue: 'Trap 1: ACAS Code 4 (10 calendar days) is statutory guidance, not a binding rule or irrevocable lock (Routledge v Grant).',
  },

  // Trap 2: Section 111A ERA 1996 Scope Boundary
  {
    phrase: 'Trap 2 (Overbroad s.111A confidentiality)',
    regulator: 'COMMON_LAW_STATUTE',
    regex: /\b(section 111a protects all conversations|protected conversations are completely confidential in all cases|cannot be mentioned in any tribunal claim)\b/i,
    severity: 'P1',
    issue: 'Trap 2: Section 111A ERA 1996 applies strictly to ordinary unfair dismissal and excludes discrimination, whistleblowing, breach of contract, or improper behaviour.',
  },

  // Trap 3: Common Law Without Prejudice (Rush & Tompkins / Barnetson)
  {
    phrase: 'Trap 3 (Direct-to-HR Without Prejudice template)',
    regulator: 'SRA',
    regex: /\b(without prejudice proposal|without prejudice:\s*settlement agreement proposal|send this (?:letter|proposal|demand|email) (?:directly )?to (?:your employer|hr)|dear \[(?:hr|manager))\b/i,
    severity: 'P0',
    issue: 'Trap 3: Direct-to-HR Without Prejudice templates risk waiving privilege or revoking the offer. Frame strictly as an Intake Agenda for Your Instructed Solicitor.',
  },

  // Trap 4: Unqualified Statutory Baselines (ERA 1996 s.141 & Boston Deep Sea Fishing)
  {
    phrase: 'Trap 4 (Unqualified Non-Negotiable Statutory Floor)',
    regulator: 'COMMON_LAW_STATUTE',
    regex: /\b(non-negotiable statutory floor|guaranteed statutory payout in all cases)\b/i,
    severity: 'P1',
    issue: 'Trap 4: Label as Calculated Statutory Baselines (Subject to Eligibility) under ERA 1996 s.141 and Boston Deep Sea Fishing.',
  },

  // Trap 5 & CMA DMCC Act 2024 / CPUTR 2008: Fee Contribution Accuracy
  {
    phrase: 'Trap 5 / CMA (False statutory fee obligation or unqualified free claim)',
    regulator: 'CMA',
    regex: /\b(employer is (?:legally )?required to (?:pay|cover)|employers must (?:pay|cover) (?:the cost of )?your legal (?:advice|fee)|required to pay for your legal advice|employer must cover the cost|100% free legal advice)\b/i,
    severity: 'P1',
    issue: 'Trap 5 & CMA DMCC Act 2024: Employers customarily contribute £350 to £750 + VAT toward legal fees as a commercial convention, not a statutory obligation.',
  },

  // US Legal Terminology
  {
    phrase: 'attorney',
    regulator: 'UK_JURISDICTION',
    regex: /\battorney\b/i,
    severity: 'P1',
    issue: 'US legal term. Use "solicitor" (SRA-regulated).',
  },
  {
    phrase: 'at-will',
    regulator: 'UK_JURISDICTION',
    regex: /\bat-will\b/i,
    severity: 'P1',
    issue: 'US employment doctrine. Inapplicable under UK Employment Rights Act 1996.',
  },
  {
    phrase: 'severance pay',
    regulator: 'UK_JURISDICTION',
    regex: /\bseverance\s+pay\b/i,
    severity: 'P1',
    issue: 'US terminology. Use "settlement agreement" or "statutory redundancy pay".',
  },
  {
    phrase: 'layoff (unqualified US usage)',
    regulator: 'UK_JURISDICTION',
    regex: /\blayoffs?\b/i,
    severity: 'P1',
    issue: 'US terminology. Use "redundancy".',
  },
  {
    phrase: 'labor court',
    regulator: 'UK_JURISDICTION',
    regex: /\blabor\s+court\b/i,
    severity: 'P1',
    issue: 'Non-UK terminology. Use "Employment Tribunal".',
  },
];

interface LegalFinding {
  id: string;
  file: string;
  lineNumber: number;
  regulator: string;
  phrase: string;
  context: string;
  severity: 'P0' | 'P1';
  issue: string;
}

const DIRS_TO_SCAN = ['app', 'components'];
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

console.log('================================================================');
console.log(' SettlementCheck Legal, SRA, FCA, CMA & 5-Trap Compliance Scanner');
console.log('================================================================\n');

const files: string[] = [];
DIRS_TO_SCAN.forEach(d => getAllFiles(path.resolve(d), files));
console.log(`Scanning ${files.length} source files for Legal, SRA, FCA & CMA compliance...\n`);

const findings: LegalFinding[] = [];
let findingIndex = 1;

for (const filePath of files) {
  const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip comment lines or test/audit files
    if (
      line.trim().startsWith('//') ||
      line.trim().startsWith('*') ||
      line.trim().startsWith('/*') ||
      line.trim().startsWith('{/*') ||
      relPath.includes('test') ||
      relPath.includes('audit')
    ) {
      continue;
    }

    for (const forbidden of FORBIDDEN_LEGAL_PHRASES) {
      if (forbidden.regex.test(line)) {
        const id = `SC-E-LEG-${String(findingIndex++).padStart(3, '0')}`;
        findings.push({
          id,
          file: relPath,
          lineNumber: i + 1,
          regulator: forbidden.regulator,
          phrase: forbidden.phrase,
          context: line.trim().substring(0, 140),
          severity: forbidden.severity,
          issue: forbidden.issue,
        });

        console.log(`  ⚠ [${forbidden.severity}] [${forbidden.regulator}] [${id}] ${relPath}:${i + 1} - "${forbidden.phrase}"`);
        console.log(`    Issue: ${forbidden.issue}`);
        console.log(`    Context: "${line.trim().substring(0, 100)}..."`);
      }
    }
  }
}

console.log('\n================================================================');
console.log(` Scan Complete: Found ${findings.length} Legal / SRA / FCA / CMA boundary issues.`);
console.log('================================================================\n');

// Write structured findings to data/audit/legal-findings.json
const outputDir = path.resolve('data/audit');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
const outputPath = path.join(outputDir, 'legal-findings.json');
fs.writeFileSync(outputPath, JSON.stringify(findings, null, 2), 'utf-8');
console.log(`Structured legal findings saved to: ${outputPath}`);

if (findings.length > 0) {
  process.exit(1);
}
