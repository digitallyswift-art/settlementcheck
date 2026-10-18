import brandFindings from '../../data/audit/brand-copy-findings.json';
import findings from '../../data/audit/findings.json';
import inventory from '../../data/audit/website-inventory.json';
import fs from 'fs';

console.log('=== BRAND COPY FINDINGS ANALYSIS ===');
console.log('Total brand findings:', brandFindings.length);

const byRule: Record<string, number> = {};
brandFindings.forEach((f: any) => byRule[f.rule] = (byRule[f.rule] || 0) + 1);
console.log('Violations by rule:', byRule);

const byFile: Record<string, number> = {};
brandFindings.forEach((f: any) => byFile[f.file] = (byFile[f.file] || 0) + 1);
console.log('\nTop files with violations:');
Object.entries(byFile).sort((a,b) => b[1] - a[1]).slice(0, 15).forEach(([file, cnt]) => console.log(`  ${cnt} in ${file}`));

console.log('\n=== PRIMARY CTAS ACROSS INVENTORY ===');
const pages = inventory.filter((r: any) => r.type === 'page');
const ctaCounts: Record<string, number> = {};
pages.forEach((p: any) => {
  const cta = p.primaryCTA ? `${p.primaryCTA.text} -> ${p.primaryCTA.href}` : 'NONE';
  ctaCounts[cta] = (ctaCounts[cta] || 0) + 1;
});
console.log('Primary CTA frequency across 44 pages:');
Object.entries(ctaCounts).sort((a,b) => b[1] - a[1]).forEach(([cta, cnt]) => console.log(`  ${cnt}x: "${cta}"`));

console.log('\n=== DISCLAIMERS & REASSURANCES ACROSS INVENTORY ===');
let legalDisclaimerCount = 0;
let sraBoundaryCount = 0;
let employerPaysCount = 0;
let taxDisclaimerCount = 0;

pages.forEach((p: any) => {
  if (p.disclaimers?.legalAdvice) legalDisclaimerCount++;
  if (p.disclaimers?.sraBoundary) sraBoundaryCount++;
  if (p.disclaimers?.employerPaysFees) employerPaysCount++;
  if (p.disclaimers?.taxAdvice) taxDisclaimerCount++;
});

console.log(`Legal advice disclaimer: ${legalDisclaimerCount} / ${pages.length} pages (${Math.round(legalDisclaimerCount/pages.length*100)}%)`);
console.log(`SRA boundary disclaimer: ${sraBoundaryCount} / ${pages.length} pages (${Math.round(sraBoundaryCount/pages.length*100)}%)`);
console.log(`Employer pays legal fees reassurance: ${employerPaysCount} / ${pages.length} pages (${Math.round(employerPaysCount/pages.length*100)}%)`);
console.log(`Tax advice disclaimer: ${taxDisclaimerCount} / ${pages.length} pages (${Math.round(taxDisclaimerCount/pages.length*100)}%)`);
