/**
 * Deterministic Legal Disclaimer & SRA Boundary Auditor
 * Scans app/ and components/ for SRA boundary compliance and forbidden legal advice phrasing
 * 
 * Usage:
 *   npx tsx scripts/audit/scan-legal-disclaimers.ts
 */

import fs from 'fs';
import path from 'path';

const FORBIDDEN_LEGAL_PHRASES: Array<{ phrase: string; regex: RegExp; severity: 'P0' | 'P1' }> = [
  { phrase: 'we advise you to', regex: /\bwe\s+advise\s+you\s+to\b/i, severity: 'P0' },
  { phrase: 'our legal advice is', regex: /\bour\s+legal\s+advice\s+is\b/i, severity: 'P0' },
  { phrase: 'as your solicitor', regex: /\bas\s+your\s+solicitor\b/i, severity: 'P0' },
  { phrase: 'as your legal representative', regex: /\bas\s+your\s+legal\s+representative\b/i, severity: 'P0' },
  { phrase: 'I advise you to', regex: /\bI\s+advise\s+you\s+to\b/i, severity: 'P0' },
  { phrase: 'this legal advice confirms', regex: /\bthis\s+legal\s+advice\s+confirms\b/i, severity: 'P0' },
  { phrase: 'attorney', regex: /\battorney\b/i, severity: 'P1' },
  { phrase: 'at-will', regex: /\bat-will\b/i, severity: 'P1' },
  { phrase: 'severance pay', regex: /\bseverance\s+pay\b/i, severity: 'P1' },
];

interface LegalFinding {
  id: string;
  file: string;
  lineNumber: number;
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
console.log(' SettlementCheck Deterministic SRA Boundary & Legal Phrasing Scanner');
console.log('================================================================\n');

const files: string[] = [];
DIRS_TO_SCAN.forEach(d => getAllFiles(path.resolve(d), files));
console.log(`Scanning ${files.length} source files for SRA boundary compliance...\n`);

const findings: LegalFinding[] = [];
let findingIndex = 1;

for (const filePath of files) {
  const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip comment lines or test files
    if (line.trim().startsWith('//') || line.trim().startsWith('*') || relPath.includes('test') || relPath.includes('audit')) {
      continue;
    }

    for (const forbidden of FORBIDDEN_LEGAL_PHRASES) {
      if (forbidden.regex.test(line)) {
        const id = `SC-E-LEG-${String(findingIndex++).padStart(3, '0')}`;
        findings.push({
          id,
          file: relPath,
          lineNumber: i + 1,
          phrase: forbidden.phrase,
          context: line.trim().substring(0, 140),
          severity: forbidden.severity,
          issue: `Detected forbidden phrasing or US legal terminology "${forbidden.phrase}" violating SRA boundary or UK brand standards.`,
        });

        console.log(`  ⚠ [${forbidden.severity}] [${id}] ${relPath}:${i + 1} — "${forbidden.phrase}"`);
        console.log(`    Context: "${line.trim().substring(0, 100)}..."`);
      }
    }
  }
}

console.log('\n================================================================');
console.log(` Scan Complete: Found ${findings.length} legal phrasing / SRA boundary issues.`);
console.log('================================================================\n');

// Write structured findings to data/audit/legal-findings.json
const outputDir = path.resolve('data/audit');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
const outputPath = path.join(outputDir, 'legal-findings.json');
fs.writeFileSync(outputPath, JSON.stringify(findings, null, 2), 'utf-8');
console.log(`Structured legal findings saved to: ${outputPath}`);
