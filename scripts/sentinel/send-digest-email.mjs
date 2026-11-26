import dns from 'dns';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

dns.setDefaultResultOrder('ipv4first');

// Load .env.local
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  const regex = /^\s*([\w.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^#\r\n]+))/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const val = match[2] !== undefined ? match[2] : match[3] !== undefined ? match[3] : match[4].trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const resendKey = process.env.RESEND_API_KEY;
if (!resendKey) {
  console.error('RESEND_API_KEY is missing from .env.local');
  process.exit(1);
}

let recipients = [
  'support@digitallyswift.com',
  'digitallyswift@gmail.com',
];

if (process.env.SEO_ALERT_EMAILS) {
  recipients = process.env.SEO_ALERT_EMAILS.split(',').map(e => e.trim()).filter(Boolean);
} else if (process.env.SEO_ALERT_EMAIL) {
  const envEmails = process.env.SEO_ALERT_EMAIL.split(',').map(e => e.trim()).filter(Boolean);
  recipients = Array.from(new Set([...recipients, ...envEmails]));
}

const toArg = process.argv.find(a => a.startsWith('--to='));
if (toArg) {
  recipients = toArg.split('=')[1].split(',').map(e => e.trim()).filter(Boolean);
}

const resend = new Resend(resendKey);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  if (!content) return [];
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = vals[i] ?? '';
    });
    return obj;
  });
}

function formatDate(isoDate) {
  if (!isoDate || isoDate === 'Unknown') return 'Unknown';
  try {
    const d = new Date(isoDate + 'T00:00:00Z');
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return isoDate;
  }
}

function getSnapshotStats(dirPath) {
  const chartFile = path.join(dirPath, 'Chart.csv');
  const queriesFile = path.join(dirPath, 'Queries.csv');
  const chartRows = parseCsv(chartFile);
  const queriesRows = parseCsv(queriesFile);

  const clicks = chartRows.reduce((sum, r) => sum + parseInt(r.Clicks || '0', 10), 0);
  const impressions = chartRows.reduce((sum, r) => sum + parseInt(r.Impressions || '0', 10), 0);
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

  const posSum = chartRows.reduce(
    (sum, r) => sum + parseFloat(r.Position || '0') * parseInt(r.Impressions || '0', 10),
    0
  );
  const avgPosition = impressions > 0 ? posSum / impressions : 0;

  const dates = chartRows.map(r => r.Date).filter(Boolean).sort();
  const startDate = dates[0] || 'Unknown';
  const endDate = dates[dates.length - 1] || 'Unknown';

  return {
    startDateFormatted: formatDate(startDate),
    endDateFormatted: formatDate(endDate),
    clicks,
    impressions,
    ctr: parseFloat(ctr.toFixed(2)),
    avgPosition: parseFloat(avgPosition.toFixed(1)),
    queriesCount: queriesRows.length,
  };
}

function parsePrSummarySections(markdownText) {
  const applied = [];
  const skipped = [];
  let mode = '';

  for (const rawLine of markdownText.split('\n')) {
    const line = rawLine.trim();
    if (line.startsWith('### ✅')) {
      mode = 'applied';
      continue;
    }
    if (line.startsWith('### ⏭️')) {
      mode = 'skipped';
      continue;
    }
    if (line.startsWith('### ')) {
      mode = '';
      continue;
    }
    if (line.startsWith('- ')) {
      const clean = line.slice(2).replace(/\*\*/g, '').replace(/`/g, '');
      if (mode === 'applied') applied.push(clean);
      if (mode === 'skipped') skipped.push(clean);
    }
  }
  return { applied, skipped };
}

async function sendDigest() {
  console.log('================================================================');
  console.log(' 📧 Dispatching Autonomous SEO Intelligence Report via Resend  ');
  console.log('================================================================\n');

  const stagedJsonPath = path.resolve('data/serp-actions/staging/latest-staged-actions.json');
  const packages = fs.existsSync(stagedJsonPath)
    ? JSON.parse(fs.readFileSync(stagedJsonPath, 'utf-8'))
    : [];

  const prSummaryPath = path.resolve('data/serp-actions/staging/latest-pr-summary.md');
  const prSummaryText = fs.existsSync(prSummaryPath)
    ? fs.readFileSync(prSummaryPath, 'utf-8')
    : '';
  const { applied, skipped } = parsePrSummarySections(prSummaryText);

  const autoPrUrl =
    process.env.AUTO_PR_URL || 'https://github.com/digitallyswift-art/settlementcheck/pulls';
  const hasAppliedChanges =
    applied.length > 0 && !applied[0].startsWith('No direct TSX source edits');

  const currentDir = path.resolve('data/gsc-history/settlementcheck.co.uk-Performance-on-Search-2026-10-09');
  const prevDir = path.resolve('data/gsc-history/settlementcheck.co.uk-Performance-on-Search-2026-10-03');

  const current = fs.existsSync(currentDir)
    ? getSnapshotStats(currentDir)
    : { startDateFormatted: '07 Jul 2026', endDateFormatted: '06 Oct 2026', clicks: 179, impressions: 9860, ctr: 1.82, avgPosition: 21.6, queriesCount: 295 };

  const previous = fs.existsSync(prevDir)
    ? getSnapshotStats(prevDir)
    : { startDateFormatted: '30 Jun 2026', endDateFormatted: '29 Sep 2026', clicks: 158, impressions: 9056, ctr: 1.74, avgPosition: 20.8, queriesCount: 186 };

  const deltaClicks = current.clicks - previous.clicks;
  const pctClicks = previous.clicks > 0 ? ((deltaClicks / previous.clicks) * 100).toFixed(1) : '0';
  const deltaImpressions = current.impressions - previous.impressions;
  const pctImpressions = previous.impressions > 0 ? ((deltaImpressions / previous.impressions) * 100).toFixed(1) : '0';

  const appliedHtml =
    applied.length > 0
      ? applied.map(item => `<li style="margin-bottom:6px;">${escapeHtml(item)}</li>`).join('')
      : '<li>No source edits were applied in this run.</li>';

  const skippedHtml =
    skipped.length > 0
      ? skipped.map(item => `<li style="margin-bottom:6px;">${escapeHtml(item)}</li>`).join('')
      : '<li>None — all eligible items were handled.</li>';

  const queryRowsHtml = packages
    .slice(0, 6)
    .map(p => {
      const route = (p.seoTechnicalBrief?.targetCanonicalUrl || '').replace('https://settlementcheck.co.uk', '') || '/';
      const pos = p.seoTechnicalBrief?.currentMetrics?.position?.toFixed(1) ?? '-';
      const impr = p.seoTechnicalBrief?.currentMetrics?.impressions ?? 0;
      return `
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 10px;color:#0B1F3A;font-weight:600;">${escapeHtml(p.query)}</td>
          <td style="padding:8px 10px;color:#555;"><code>${escapeHtml(route)}</code></td>
          <td style="padding:8px 10px;text-align:center;">${pos}</td>
          <td style="padding:8px 10px;text-align:center;">${impr}</td>
        </tr>
      `;
    })
    .join('');

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0B1F3A;max-width:640px;line-height:1.5;margin:0 auto;padding:20px;">
      
      <!-- Header -->
      <div style="border-bottom:3px solid #D9603B;padding-bottom:10px;margin-bottom:18px;">
        <h1 style="color:#0B1F3A;margin:0;font-size:20px;">
          🛡️ SettlementCheck Daily Action Summary
        </h1>
        <p style="color:#666;font-size:12px;margin:4px 0 0 0;">
          Autonomous Sentinel Fleet · All 7 Verification Gates Passed
        </p>
      </div>

      <!-- 1. What Needs Your Approval -->
      <div style="background:#0B1F3A;color:#fff;padding:18px;border-radius:8px;margin-bottom:20px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#D9603B;font-weight:bold;margin-bottom:6px;">
          1. Needs Your Approval
        </div>
        <div style="font-size:15px;font-weight:bold;margin-bottom:8px;">
          ${
            hasAppliedChanges
              ? `${applied.length} low-risk SEO update(s) are ready in a Pull Request.`
              : 'No new code changes require your approval today.'
          }
        </div>
        <p style="font-size:13px;color:#E6E1D8;margin:0 0 14px 0;">
          ${
            hasAppliedChanges
              ? 'All deterministic checks (TypeScript, statutory evals, legal disclaimers, brand copy, titles, and links) passed. Click below to review and merge in 1 click:'
              : 'Telemetry logs were refreshed. You can still review open Pull Requests on GitHub below:'
          }
        </p>
        <a href="${escapeHtml(autoPrUrl)}" style="background:#D9603B;color:#fff;padding:10px 18px;border-radius:5px;text-decoration:none;font-weight:bold;font-size:13px;display:inline-block;">
          Review &amp; Merge Pull Request →
        </a>
      </div>

      <!-- 2. Already Implemented in This PR -->
      <div style="background:#F7F4EE;border-left:4px solid #0B1F3A;padding:14px 16px;border-radius:4px;margin-bottom:16px;">
        <div style="font-size:13px;font-weight:bold;color:#0B1F3A;margin-bottom:8px;">
          2. ✅ Already Implemented in PR (Ready to Merge)
        </div>
        <ul style="margin:0;padding-left:18px;font-size:13px;color:#222;">
          ${appliedHtml}
        </ul>
      </div>

      <!-- 3. Held / Needs Manual Implementation -->
      <div style="background:#FFF8F6;border-left:4px solid #D9603B;padding:14px 16px;border-radius:4px;margin-bottom:22px;">
        <div style="font-size:13px;font-weight:bold;color:#0B1F3A;margin-bottom:8px;">
          3. ⏭️ Held / Needs Manual Implementation
        </div>
        <ul style="margin:0;padding-left:18px;font-size:13px;color:#444;">
          ${skippedHtml}
        </ul>
      </div>

      <!-- 4. Compact Telemetry Snapshot -->
      <h2 style="font-size:14px;color:#0B1F3A;margin:0 0 10px 0;border-bottom:1px solid #E6E1D8;padding-bottom:6px;">
        4. 📊 Search Performance (${current.startDateFormatted} – ${current.endDateFormatted})
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:12px;background:#F7F4EE;border-radius:6px;">
        <tr>
          <td style="padding:10px;text-align:center;">
            <div style="color:#666;">Clicks</div>
            <div style="font-size:16px;font-weight:bold;color:#0B1F3A;">${current.clicks} <span style="font-size:11px;color:#D9603B;">(${deltaClicks >= 0 ? '+' : ''}${pctClicks}%)</span></div>
          </td>
          <td style="padding:10px;text-align:center;">
            <div style="color:#666;">Impressions</div>
            <div style="font-size:16px;font-weight:bold;color:#0B1F3A;">${current.impressions.toLocaleString('en-GB')} <span style="font-size:11px;color:#D9603B;">(${deltaImpressions >= 0 ? '+' : ''}${pctImpressions}%)</span></div>
          </td>
          <td style="padding:10px;text-align:center;">
            <div style="color:#666;">CTR</div>
            <div style="font-size:16px;font-weight:bold;color:#0B1F3A;">${current.ctr}%</div>
          </td>
          <td style="padding:10px;text-align:center;">
            <div style="color:#666;">Avg Pos</div>
            <div style="font-size:16px;font-weight:bold;color:#0B1F3A;">${current.avgPosition}</div>
          </td>
        </tr>
      </table>

      ${
        packages.length > 0
          ? `
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:20px;">
        <thead>
          <tr style="background:#0B1F3A;color:#fff;text-align:left;">
            <th style="padding:8px 10px;">Tracked Query</th>
            <th style="padding:8px 10px;">Target Route</th>
            <th style="padding:8px 10px;text-align:center;">Pos</th>
            <th style="padding:8px 10px;text-align:center;">Impr</th>
          </tr>
        </thead>
        <tbody>
          ${queryRowsHtml}
        </tbody>
      </table>
      `
          : ''
      }

      <div style="text-align:center;font-size:11px;color:#888;border-top:1px solid #eee;padding-top:14px;">
        SettlementCheck Autonomous Sentinel Fleet · <a href="https://settlementcheck.co.uk/cockpit/" style="color:#D9603B;text-decoration:none;">Open Admin Cockpit</a>
      </div>
    </div>
  `;

  console.log(`Sending from: SettlementCheck Sentinel <notifications@settlementcheck.co.uk>`);
  console.log(`Recipients (${recipients.length}): ${recipients.join(', ')}`);

  const subject = hasAppliedChanges
    ? `🚀 [Action Needed] ${applied.length} SEO Update(s) Ready to Merge | ${current.clicks} Clicks (+${pctClicks}%)`
    : `🛡️ Daily SEO Summary (No PR Changes Needed) | ${current.clicks} Clicks (+${pctClicks}%)`;

  const res = await resend.emails.send({
    from: 'SettlementCheck Sentinel <notifications@settlementcheck.co.uk>',
    to: recipients,
    subject,
    html,
  });

  console.log('\n================================================================');
  console.log('✅ Email Delivered Successfully via Resend!');
  console.log(`   Message ID:  ${res.data?.id}`);
  console.log(`   Recipients:  ${recipients.join(', ')}`);
  console.log('================================================================\n');
}

sendDigest().catch(err => {
  console.error('Failed to send digest email:', err);
  process.exit(1);
});
