import fs from 'fs';
import path from 'path';

const findingsPath = path.resolve('data/audit/findings.json');
const seoFindingsPath = path.resolve('data/audit/seo-aeo-findings.json');
const comFindingsPath = path.resolve('data/audit/commercial-findings.json');

const mainFindings = JSON.parse(fs.readFileSync(findingsPath, 'utf8'));
const seoFindings = JSON.parse(fs.readFileSync(seoFindingsPath, 'utf8'));
const comFindings = JSON.parse(fs.readFileSync(comFindingsPath, 'utf8'));

console.log('Existing findings:', mainFindings.length);
const existingIds = new Set(mainFindings.map((f: any) => f.id));

let added = 0;
for (const f of [...seoFindings, ...comFindings]) {
  if (!existingIds.has(f.id)) {
    mainFindings.push(f);
    existingIds.add(f.id);
    added++;
  }
}

fs.writeFileSync(findingsPath, JSON.stringify(mainFindings, null, 2), 'utf8');
console.log('Added new findings:', added);
console.log('Total findings now:', mainFindings.length);
