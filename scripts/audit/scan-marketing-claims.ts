/**
 * Deterministic Marketing Claims & CAP Code Auditor
 * Scans app/ and components/ for unsubstantiated market assertions
 * 
 * Usage:
 *   npx tsx scripts/audit/scan-marketing-claims.ts
 */

import fs from 'fs';
import path from 'path';

const HIGH_RISK_PATTERNS: Array<{ phrase: string; regex: RegExp; riskReason: string; severity: 'P1' | 'P2' }> = [
  {
    phrase: 'typical settlement',
    regex: /\btypical\s+settlement\b/i,
    riskReason: 'Suggests a standard settlement payout baseline without empirical verification (CAP Code 3.1).',
    severity: 'P1',
  },
  {
    phrase: '1 to 3 months',
    regex: /\b(1\s*to\s*3\s*months?|one\s*to\s*three\s*months?)\b/i,
    riskReason: 'Informal HR rule-of-thumb presented as an authoritative legal benchmark (CAP Code 3.7).',
    severity: 'P1',
  },
  {
    phrase: 'most employers',
    regex: /\bmost\s+employers\b/i,
    riskReason: 'Broad, unproven collective assertion about employer conduct or offer values.',
    severity: 'P2',
  },
  {
    phrase: 'almost always',
    regex: /\balmost\s+always\b/i,
    riskReason: 'Overstated certainty in legal or negotiation outcomes.',
    severity: 'P2',
  },
  {
    phrase: 'true maximum',
    regex: /\btrue\s+maximum\b/i,
    riskReason: 'Ambiguous claim overlooking uncapped discrimination awards vs statutory compensatory limits.',
    severity: 'P1',
  },
  {
    phrase: 'average settlement',
    regex: /\baverage\s+settlement\b/i,
    riskReason: 'Implies statistically verified average across UK settlements without published sample data.',
    severity: 'P1',
  },
  {
    phrase: 'market data',
    regex: /\bmarket\s+data\b/i,
    riskReason: 'Implies third-party or representative market data exists unless qualified as internal platform telemetry.',
    severity: 'P2',
  },
  {
    phrase: 'most solicitors',
    regex: /\bmost\s+solicitors\b/i,
    riskReason: 'Unsubstantiated claim about solicitor pricing, acceptance rates, or negotiation practices.',
    severity: 'P2',
  },
];

interface Finding {
  id: string;
  file: string;
  lineNumber: number;
  pattern: string;
  matchedText: string;
  context: string;
  riskReason: string;
  severity: 'P1' | 'P2';
  recommendedAction: string;
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
console.log(' SettlementCheck Deterministic Claims & CAP Code Scanner');
console.log('================================================================\n');

const files: string[] = [];
DIRS_TO_SCAN.forEach(d => getAllFiles(path.resolve(d), files));
console.log(`Scanning ${files.length} source files for unsupported marketing claims...\n`);

const findings: Finding[] = [];
let findingIndex = 1;

for (const filePath of files) {
  const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip comments or test files
    if (line.trim().startsWith('//') || line.trim().startsWith('*') || relPath.includes('test') || relPath.includes('audit')) {
      continue;
    }

    for (const pattern of HIGH_RISK_PATTERNS) {
      if (pattern.regex.test(line)) {
        const id = `SC-E-CLM-${String(findingIndex++).padStart(3, '0')}`;
        const match = line.match(pattern.regex)?.[0] || pattern.phrase;
        
        findings.push({
          id,
          file: relPath,
          lineNumber: i + 1,
          pattern: pattern.phrase,
          matchedText: match,
          context: line.trim().substring(0, 140),
          riskReason: pattern.riskReason,
          severity: pattern.severity,
          recommendedAction: `Qualify or rephrase "${match}" to cite specific statutory terms or empirical telemetry.`,
        });

        console.log(`  ⚠ [${pattern.severity}] [${id}] ${relPath}:${i + 1} — Matched: "${match}"`);
        console.log(`    Context: "${line.trim().substring(0, 100)}..."`);
      }
    }
  }
}

console.log('\n================================================================');
console.log(` Scan Complete: Found ${findings.length} potentially unverified marketing claims.`);
console.log('================================================================\n');

// Write structured findings to data/audit/claims-findings.json
const outputDir = path.resolve('data/audit');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
const outputPath = path.join(outputDir, 'claims-findings.json');
fs.writeFileSync(outputPath, JSON.stringify(findings, null, 2), 'utf-8');
console.log(`Structured claims findings saved to: ${outputPath}`);
