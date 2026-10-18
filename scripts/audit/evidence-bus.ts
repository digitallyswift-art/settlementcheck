/**
 * Central Evidence Bus for SettlementCheck Audit System
 * Standardizes evidence logging, validates finding schemas, and generates compliant markdown tables.
 * 
 * Usage:
 *   npx tsx scripts/audit/evidence-bus.ts --export
 */

import fs from 'fs';
import path from 'path';

export interface EvidenceFinding {
  id: string; // SC-E-001
  sourceLocation: string; // file, URL, or route
  exactFinding: string;
  evidenceSource: string; // authoritative citation or test
  sourceDate: string; // YYYY-MM-DD or N/A
  dateChecked: string;
  confidence: 'High' | 'Medium' | 'Low';
  severity: 'P0' | 'P1' | 'P2' | 'P3' | 'Informational';
  verificationStatus: 'Confirmed' | 'Partially verified' | 'Unverified' | 'Unable to verify' | 'Resolved';
  classification: 'Confirmed error' | 'Requires qualification' | 'Potential risk' | 'Product gap' | 'Opportunity' | 'Correct';
  jurisdiction: 'England and Wales' | 'Scotland' | 'Northern Ireland' | 'UK-wide' | 'Other' | 'Not applicable';
  userImpact: string;
  recommendedAction: string;
  evidenceRequired: string;
}

const AUDIT_DATA_DIR = path.resolve('data/audit');
const FINDINGS_FILE = path.join(AUDIT_DATA_DIR, 'findings.json');

export class EvidenceBus {
  public static loadFindings(): EvidenceFinding[] {
    if (!fs.existsSync(FINDINGS_FILE)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(FINDINGS_FILE, 'utf-8'));
  }

  public static saveFindings(findings: EvidenceFinding[]): void {
    if (!fs.existsSync(AUDIT_DATA_DIR)) {
      fs.mkdirSync(AUDIT_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FINDINGS_FILE, JSON.stringify(findings, null, 2), 'utf-8');
  }

  public static addFinding(finding: EvidenceFinding): void {
    const existing = this.loadFindings();
    const idx = existing.findIndex(f => f.id === finding.id);
    if (idx >= 0) {
      existing[idx] = finding;
    } else {
      existing.push(finding);
    }
    this.saveFindings(existing);
  }

  public static generateMarkdownTable(findings: EvidenceFinding[]): string {
    const header = '| Finding ID | URL or source file | Exact claim, statement, behaviour or finding | Source or evidence | Source publication/update date | Date checked | Confidence | Severity | Verification status | Finding classification | Applicable jurisdiction | User impact | Recommended action | Evidence required for resolution |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n';
    
    const rows = findings.map(f => {
      return `| \`${f.id}\` | \`${f.sourceLocation}\` | ${f.exactFinding.replace(/\|/g, '\\|')} | ${f.evidenceSource.replace(/\|/g, '\\|')} | ${f.sourceDate} | ${f.dateChecked} | ${f.confidence} | ${f.severity} | ${f.verificationStatus} | ${f.classification} | ${f.jurisdiction} | ${f.userImpact.replace(/\|/g, '\\|')} | ${f.recommendedAction.replace(/\|/g, '\\|')} | ${f.evidenceRequired.replace(/\|/g, '\\|')} |`;
    }).join('\n');

    return header + rows;
  }
}

// CLI handler
if (process.argv.includes('--export')) {
  const findings = EvidenceBus.loadFindings();
  console.log(`Loaded ${findings.length} findings from evidence bus.`);
  console.log('\n--- Generated Mandatory Markdown Evidence Table ---\n');
  console.log(EvidenceBus.generateMarkdownTable(findings));
}
