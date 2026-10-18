import fs from 'fs';
import path from 'path';

const findingsPath = path.resolve('data/audit/findings.json');
const forumDemandPath = path.resolve('data/audit/forum-demand.json');

const mainFindings = JSON.parse(fs.readFileSync(findingsPath, 'utf8'));
const forumDemands = JSON.parse(fs.readFileSync(forumDemandPath, 'utf8'));

console.log('Existing findings:', mainFindings.length);
const existingIds = new Set(mainFindings.map((f: any) => f.id));

let added = 0;
for (const item of forumDemands) {
  if (!existingIds.has(item.id)) {
    mainFindings.push({
      id: item.id,
      sourceLocation: `${item.forumSource.platform} (${item.forumSource.threadTitle})`,
      exactFinding: `Qualitative employee demand analysis [${item.category}]: ${item.userProblem}`,
      evidenceSource: `${item.forumSource.threadUrl}; GSC Query Cluster (${item.gscTelemetry.liveImpressions} live impr, ${item.gscTelemetry.liveClicks} clicks)`,
      sourceDate: item.forumSource.dateObserved,
      dateChecked: item.forumSource.checkedDate,
      confidence: "High",
      severity: item.severity,
      verificationStatus: "Confirmed",
      classification: "Opportunity",
      jurisdiction: "UK-wide",
      userImpact: `Employee Quote: "${item.userQuote.substring(0, 180)}..."`,
      recommendedAction: item.nextGenOpportunity,
      evidenceRequired: `Forum thread citation and GSC live query volume verification.`
    });
    existingIds.add(item.id);
    added++;
  }
}

fs.writeFileSync(findingsPath, JSON.stringify(mainFindings, null, 2), 'utf8');
console.log('Added Phase 09 findings:', added);
console.log('Total findings now:', mainFindings.length);
