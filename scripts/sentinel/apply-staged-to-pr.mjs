#!/usr/bin/env node
/**
 * SettlementCheck Autonomous Auto-PR Applier
 * Reads validated LOW_RISK packages from `data/serp-actions/staging/latest-staged-actions.json`,
 * applies safe, allowlisted SEO/copy/internal-link improvements to source files,
 * and writes a structured action summary to `data/serp-actions/staging/latest-pr-summary.md`.
 *
 * Usage:
 *   node scripts/sentinel/apply-staged-to-pr.mjs
 *   node scripts/sentinel/apply-staged-to-pr.mjs --dry-run
 */

import fs from 'fs';
import path from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const STAGED_JSON_PATH = path.resolve('data/serp-actions/staging/latest-staged-actions.json');
const PR_SUMMARY_PATH = path.resolve('data/serp-actions/staging/latest-pr-summary.md');

// Only low-risk content/guide routes may be auto-edited by the PR bot.
// Core calculator logic, statutory rates, auth, APIs, and config are strictly excluded.
const ALLOWLIST_PREFIXES = ['app/guides/', 'app/sectors/', 'app/scenarios/'];
const PROTECTED_PATHS = [
  'app/page.tsx',
  'app/calculator/',
  'app/results/',
  'app/get-matched/',
  'app/api/',
  'lib/calculations.ts',
  'lib/statutory-rates.ts',
  'next.config.js',
];

function isAllowlistedFile(relPath) {
  const normalized = relPath.replace(/\\/g, '/').replace(/^\/+/, '');
  if (PROTECTED_PATHS.some((p) => normalized === p || normalized.startsWith(p))) {
    return false;
  }
  return ALLOWLIST_PREFIXES.some((prefix) => normalized.startsWith(prefix)) && normalized.endsWith('.tsx');
}

function normalizeTrailingSlash(url) {
  if (!url || url === '/') return '/';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const [pathname, hash] = url.split('#');
  const withSlash = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return hash ? `${withSlash}#${hash}` : withSlash;
}

/**
 * Converts markdown links `[anchor](url)` to JSX `<Link href="url">anchor</Link>`
 * when inserting into a Next.js TSX file that imports `Link` from `next/link`.
 */
function toJsxProse(text, hasNextLinkImport) {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, anchor, rawUrl) => {
    const href = normalizeTrailingSlash(rawUrl.trim());
    if (hasNextLinkImport) {
      return `<Link href="${href}" className="text-[#D9603B] underline hover:opacity-80">${anchor}</Link>`;
    }
    return `<a href="${href}" className="text-[#D9603B] underline hover:opacity-80">${anchor}</a>`;
  });
}

function tryApplyInProseUpgrade(pkg) {
  const placement = pkg.inProsePlacement;
  if (!placement || !placement.targetFilePath || !placement.matchedExcerpt || !placement.replacementExcerpt) {
    return { applied: false, reason: 'No in-prose placement payload provided.' };
  }

  const relPath = placement.targetFilePath.replace(/\\/g, '/');
  if (!isAllowlistedFile(relPath)) {
    return { applied: false, reason: `Path \`${relPath}\` is outside the low-risk auto-edit allowlist.` };
  }

  const absPath = path.resolve(relPath);
  if (!fs.existsSync(absPath)) {
    return { applied: false, reason: `Target file \`${relPath}\` does not exist.` };
  }

  const content = fs.readFileSync(absPath, 'utf-8');
  const occurrences = content.split(placement.matchedExcerpt).length - 1;
  if (occurrences === 0) {
    return { applied: false, reason: `Matched excerpt not found in \`${relPath}\` (may already be updated).` };
  }
  if (occurrences > 1) {
    return { applied: false, reason: `Matched excerpt appears ${occurrences} times in \`${relPath}\` (ambiguous).` };
  }

  const hasNextLink = /import\s+Link\s+from\s+['"]next\/link['"]/.test(content);
  const jsxReplacement = toJsxProse(placement.replacementExcerpt, hasNextLink);
  const updated = content.replace(placement.matchedExcerpt, jsxReplacement);

  if (!DRY_RUN) {
    fs.writeFileSync(absPath, updated, 'utf-8');
  }

  return {
    applied: true,
    file: relPath,
    type: 'In-Prose Copy & Internal Link',
    detail: `Updated a sentence in \`${relPath}\` to link readers directly to \`${placement.anchorText}\`.`,
  };
}

function tryApplyMetadataUpgrade(pkg) {
  if (pkg.actuationScope === 'ADDITIVE_CONTENT_AND_LINKS') {
    return { applied: false, reason: 'Metadata overwrite blocked by ADDITIVE_CONTENT_AND_LINKS scope.' };
  }

  const canonical = pkg.seoTechnicalBrief?.targetCanonicalUrl;
  if (!canonical) {
    return { applied: false, reason: 'Missing targetCanonicalUrl.' };
  }

  let routePath = canonical.replace(/^https?:\/\/[^/]+/, '').replace(/^\/+|\/+$/g, '');
  const relPath = routePath ? `app/${routePath}/page.tsx` : 'app/page.tsx';

  if (!isAllowlistedFile(relPath)) {
    return { applied: false, reason: `Route \`${relPath}\` is outside the low-risk metadata allowlist.` };
  }

  const absPath = path.resolve(relPath);
  if (!fs.existsSync(absPath)) {
    return { applied: false, reason: `Route file \`${relPath}\` not found.` };
  }

  const newTitle = pkg.copyPackage?.calibratedTitle;
  const newDesc = pkg.copyPackage?.calibratedMetaDescription;
  if (!newTitle || !newDesc || newTitle.length > 65 || newDesc.length > 160) {
    return { applied: false, reason: 'Calibrated title/description missing or exceeds safe length bounds.' };
  }

  let content = fs.readFileSync(absPath, 'utf-8');
  let changed = false;

  const titleRegex = /(export\s+const\s+metadata[\s\S]*?title:\s*)(['"`])([^'"`]+)\2/;
  const descRegex = /(export\s+const\s+metadata[\s\S]*?description:\s*)(['"`])([^'"`]+)\2/;

  const safeTitle = newTitle.replace(/'/g, "\\'");
  const safeDesc = newDesc.replace(/'/g, "\\'");

  if (titleRegex.test(content)) {
    const match = content.match(titleRegex);
    if (match && match[3] !== newTitle) {
      content = content.replace(titleRegex, `$1'${safeTitle}'`);
      changed = true;
    }
  }

  if (descRegex.test(content)) {
    const match = content.match(descRegex);
    if (match && match[3] !== newDesc) {
      content = content.replace(descRegex, `$1'${safeDesc}'`);
      changed = true;
    }
  }

  if (!changed) {
    return { applied: false, reason: `Metadata in \`${relPath}\` already matches or uses dynamic generateMetadata.` };
  }

  if (!DRY_RUN) {
    fs.writeFileSync(absPath, content, 'utf-8');
  }

  return {
    applied: true,
    file: relPath,
    type: 'Google Search Headline & Summary',
    detail: `Updated Google search headline (${newTitle.length} chars) and 2-line Google summary (${newDesc.length} chars) for \`${relPath}\` (page layout unchanged).`,
  };
}

function main() {
  console.log('================================================================');
  console.log(` 🤖 SettlementCheck Auto-PR Applier ${DRY_RUN ? '(DRY RUN)' : ''}`);
  console.log('================================================================\n');

  if (!fs.existsSync(STAGED_JSON_PATH)) {
    console.log('No staged actions file found at data/serp-actions/staging/latest-staged-actions.json.');
    process.exit(0);
  }

  const packages = JSON.parse(fs.readFileSync(STAGED_JSON_PATH, 'utf-8'));
  const appliedActions = [];
  const skippedActions = [];

  for (const pkg of packages) {
    const isLowRisk = pkg.deploymentRisk === 'LOW_RISK';
    const isCompliant =
      pkg.statutoryAudit?.isCompliant === true &&
      pkg.statutoryAudit?.sraBoundaryPassed === true &&
      pkg.antiAiQuality?.isLowEffort === false;

    if (!isLowRisk || !isCompliant) {
      skippedActions.push({
        query: pkg.query,
        reason: `Held for manual review (risk=${pkg.deploymentRisk}, compliant=${isCompliant}).`,
      });
      continue;
    }

    const proseRes = tryApplyInProseUpgrade(pkg);
    if (proseRes.applied) {
      appliedActions.push({ query: pkg.query, priority: pkg.priority, ...proseRes });
    } else {
      skippedActions.push({ query: pkg.query, reason: `Prose: ${proseRes.reason}` });
    }

    const metaRes = tryApplyMetadataUpgrade(pkg);
    if (metaRes.applied) {
      appliedActions.push({ query: pkg.query, priority: pkg.priority, ...metaRes });
    }
  }

  const timestamp = new Date().toISOString();
  const summaryLines = [
    `## 🤖 Autonomous Sentinel Action Summary`,
    ``,
    `- **Run Timestamp (UTC):** ${timestamp}`,
    `- **Mode:** ${DRY_RUN ? 'Dry Run (no files modified)' : 'Auto-PR Branch'}`,
    `- **Packages Evaluated:** ${packages.length}`,
    `- **Source Fixes Applied:** ${appliedActions.length}`,
    `- **Held / Skipped:** ${skippedActions.length}`,
    ``,
    `### ✅ Actions Applied`,
    appliedActions.length > 0
      ? appliedActions.map((a) => `- **[${a.priority}] "${a.query}"** (${a.type}): ${a.detail}`).join('\n')
      : `- No direct TSX source edits were needed (staged telemetry & \`data/serp-actions/\` logs updated).`,
    ``,
    `### ⏭️ Skipped / Held for Review`,
    skippedActions.length > 0
      ? skippedActions.map((s) => `- **"${s.query}"**: ${s.reason}`).join('\n')
      : `- None.`,
    ``,
    `### 🛡️ Deterministic Quality Gates`,
    `- \`npm run verify\` (\`tsc\`, \`evals\`, \`audit:legal\`, \`audit:copy\`, \`audit:titles\`, \`check:links\`, \`lint:audit\`) must pass before this PR is ready for 1-click merge.`,
    ``,
  ];

  const summaryMd = summaryLines.join('\n');
  if (!DRY_RUN) {
    fs.writeFileSync(PR_SUMMARY_PATH, summaryMd, 'utf-8');
  }

  console.log(summaryMd);
  console.log(`✅ Summary ${DRY_RUN ? 'previewed' : `written to ${path.relative(process.cwd(), PR_SUMMARY_PATH)}`}.`);
}

main();
