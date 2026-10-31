/**
 * Deterministic Brand & Copy Compliance Scanner
 * Scans app/ and components/ for em dashes, banned buzzwords, US legal terms, and generic CTAs
 * 
 * Usage:
 *   npx tsx scripts/audit/scan-copy-brand.ts
 */

import fs from 'fs';
import path from 'path';

interface CopyRule {
  name: string;
  regex: RegExp;
  severity: 'P1' | 'P2';
  guideline: string;
}

const COPY_RULES: CopyRule[] = [
  {
    name: 'EM_DASH_DETECTED',
    regex: /—/g,
    severity: 'P1',
    guideline: 'Strict BRAND.md non-negotiable: 0 em dashes allowed. Use hyphens with spaces or restructure into shorter sentences.',
  },
  {
    name: 'BANNED_BUZZWORD_DONT_WORRY',
    regex: /\bdon't\s+worry\b/i,
    severity: 'P2',
    guideline: 'Patronizing tone. Use objective reassurance instead.',
  },
  {
    name: 'BANNED_BUZZWORD_REACH_OUT',
    regex: /\breach\s+out\b/i,
    severity: 'P2',
    guideline: 'Corporate cliché. Use "contact", "speak to", or "instruct".',
  },
  {
    name: 'BANNED_BUZZWORD_TOUCH_BASE',
    regex: /\btouch\s+base\b/i,
    severity: 'P2',
    guideline: 'Corporate jargon. Use "discuss" or "review".',
  },
  {
    name: 'BANNED_BUZZWORD_LEVERAGE',
    regex: /\bleverage\b/i,
    severity: 'P2',
    guideline: 'Aggressive corporate term. Use "advantage", "position", or "strength".',
  },
  {
    name: 'AI_CLICHE_TAPESTRY_DELVE',
    regex: /\b(tapestry|delve|navigating\s+the\s+complexities)\b/i,
    severity: 'P1',
    guideline: 'Robotic AI cliché prohibited by Anti-AI Quality Guard.',
  },
  {
    name: 'INTERNAL_CRO_META_JARGON',
    regex: /\b(attention\s+economy|cognitive\s+relief|existential\s+vacuum)\b/i,
    severity: 'P1',
    guideline: 'Internal CRO or prompt framework leakage. Never use internal meta-jargon in frontend prospect copy.',
  },
  {
    name: 'PRESCRIPTIVE_LEGAL_ADVICE_DETECTED',
    regex: /\b(what to say to your employer|you should ask for|do not accept this offer|the current offer is £0|without prejudice proposal)\b/i,
    severity: 'P1',
    guideline: 'Prescriptive legal instruction violates SRA boundary standards. Use descriptive phrasing (e.g. "Questions to consider with a solicitor", "Calculated illustrative negotiation range", "Offer is below the statutory baseline").',
  },
  {
    name: 'UNQUALIFIED_TEN_DAY_RIGHT_DETECTED',
    regex: /\b(legal right to 10 days|cannot withdraw the offer (?:for|within) 10 days)\b/i,
    severity: 'P1',
    guideline: 'Under English contract law (Routledge v Grant), employers can set earlier deadlines or revoke offers. ACAS 10 days is guidance only.',
  },
  {
    name: 'GENERIC_BUTTON_SUBMIT',
    regex: />\s*(Submit|Click Here)\s*</i,
    severity: 'P2',
    guideline: 'Generic CTA verb. Use action-oriented phrases such as "Calculate my estimate →" or "Check my offer now →".',
  },
];

interface Finding {
  file: string;
  lineNumber: number;
  rule: string;
  snippet: string;
  severity: 'P1' | 'P2';
  guideline: string;
}

const DIRS = ['app', 'components'];
const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];

function getFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getFiles(full));
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      results.push(full);
    }
  }
  return results;
}

console.log('================================================================');
console.log(' SettlementCheck Deterministic Brand & Copy Compliance Scanner');
console.log('================================================================\n');

const files: string[] = [];
DIRS.forEach(d => files.push(...getFiles(path.resolve(d))));

const issues: Finding[] = [];

for (const f of files) {
  const rel = path.relative(process.cwd(), f).replace(/\\/g, '/');
  if (rel.includes('test') || rel.includes('audit') || rel.includes('agentic-engine/guardrails')) continue;

  const content = fs.readFileSync(f, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*') || line.trim().startsWith('{/*')) continue;

    for (const rule of COPY_RULES) {
      if (rule.regex.test(line)) {
        issues.push({
          file: rel,
          lineNumber: i + 1,
          rule: rule.name,
          snippet: line.trim().substring(0, 100),
          severity: rule.severity,
          guideline: rule.guideline,
        });
        console.log(`  ⚠ [${rule.severity}] [${rule.name}] ${rel}:${i + 1}`);
        console.log(`    Snippet: "${line.trim().substring(0, 80)}..."`);
      }
    }
  }
}

console.log('\n================================================================');
console.log(` Copy Scan Complete: Found ${issues.length} copy style / brand issues.`);
console.log('================================================================\n');

const outputDir = path.resolve('data/audit');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
const outPath = path.join(outputDir, 'brand-copy-findings.json');
fs.writeFileSync(outPath, JSON.stringify(issues, null, 2), 'utf-8');
console.log(`Structured copy findings saved to: ${outPath}`);
