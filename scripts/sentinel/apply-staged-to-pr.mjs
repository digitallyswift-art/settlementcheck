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

function formatPageName(relPath) {
  const slug = relPath
    .replace(/^app\//, '')
    .replace(/\/page\.tsx$/, '')
    .split('/')
    .pop();
  if (!slug || slug === 'app') return 'Home page';
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function tryApplyInProseUpgrade(pkg) {
  const placement = pkg.inProsePlacement;
  if (!placement || !placement.targetFilePath || !placement.matchedExcerpt || !placement.replacementExcerpt) {
    return { status: 'SKIPPED_NO_ACTION', reason: 'No link update needed.' };
  }

  const relPath = placement.targetFilePath.replace(/\\/g, '/');
  const pageName = formatPageName(relPath);
  if (!isAllowlistedFile(relPath)) {
    return {
      status: 'NEEDS_ATTENTION',
      reason: `On the "${pageName}" page, review adding a link for "${placement.anchorText}" (this page is protected from automatic edits).`,
    };
  }

  const absPath = path.resolve(relPath);
  if (!fs.existsSync(absPath)) {
    return { status: 'SKIPPED_NO_ACTION', reason: `Page "${pageName}" does not exist.` };
  }

  const content = fs.readFileSync(absPath, 'utf-8');
  const hasNextLink = /import\s+Link\s+from\s+['"]next\/link['"]/.test(content);
  const jsxReplacement = toJsxProse(placement.replacementExcerpt, hasNextLink);

  // Check deterministically if the target link or upgraded text is already live on the page
  const targetRoute = normalizeTrailingSlash(pkg.seoTechnicalBrief?.internalLinkGraph?.destinationRoute || '/');
  const linkAlreadyPresent =
    content.includes(jsxReplacement) ||
    content.includes(`href="${targetRoute}"`) ||
    content.includes(`href='${targetRoute}'`);

  const occurrences = content.split(placement.matchedExcerpt).length - 1;
  if (occurrences === 0) {
    if (linkAlreadyPresent) {
      return {
        status: 'ALREADY_LIVE',
        reason: `"${pageName}" guide already links to "${targetRoute}" (no action needed).`,
      };
    }
    return {
      status: 'NEEDS_ATTENTION',
      reason: `On the "${pageName}" guide, please ask your developer/agent to add a link to "${targetRoute}" using the phrase "${placement.anchorText}" (the exact sentence wasn't found automatically).`,
    };
  }
  if (occurrences > 1) {
    return {
      status: 'NEEDS_ATTENTION',
      reason: `On the "${pageName}" guide, the phrase "${placement.anchorText}" appears ${occurrences} times—choose which one should link to "${targetRoute}".`,
    };
  }

  const updated = content.replace(placement.matchedExcerpt, jsxReplacement);

  if (!DRY_RUN) {
    fs.writeFileSync(absPath, updated, 'utf-8');
  }

  return {
    status: 'APPLIED',
    applied: true,
    file: relPath,
    type: 'Guide Link & Copy',
    detail: `Updated a sentence on the "${pageName}" guide so readers can click "${placement.anchorText}" to go straight to the calculator.`,
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
  const needsAttention = [];
  const alreadyUpToDate = [];

  for (const pkg of packages) {
    const isLowRisk = pkg.deploymentRisk === 'LOW_RISK';
    const isCompliant =
      pkg.statutoryAudit?.isCompliant === true &&
      pkg.statutoryAudit?.sraBoundaryPassed === true &&
      pkg.antiAiQuality?.isLowEffort === false;

    if (!isLowRisk || !isCompliant) {
      needsAttention.push({
        query: pkg.query,
        reason: `Held for manual review because this change is marked ${pkg.deploymentRisk} or needs a compliance check.`,
      });
      continue;
    }

    const proseRes = tryApplyInProseUpgrade(pkg);
    if (proseRes.status === 'APPLIED') {
      appliedActions.push({ query: pkg.query, priority: pkg.priority, ...proseRes });
    } else if (proseRes.status === 'ALREADY_LIVE') {
      alreadyUpToDate.push({ query: pkg.query, reason: proseRes.reason });
    } else if (proseRes.status === 'NEEDS_ATTENTION') {
      needsAttention.push({ query: pkg.query, reason: proseRes.reason });
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
    `- **Updates Applied Automatically:** ${appliedActions.length}`,
    `- **Already Up to Date:** ${alreadyUpToDate.length}`,
    `- **Needs Your Attention:** ${needsAttention.length}`,
    ``,
    `### ✅ Actions Applied`,
    appliedActions.length > 0
      ? appliedActions.map((a) => `- **${a.type} ("${a.query}")**: ${a.detail}`).join('\n')
      : `- No new website edits were needed today (everything is already up to date).`,
    ``,
    `### ⏭️ Skipped / Held for Review`,
    needsAttention.length > 0
      ? needsAttention.map((s) => `- **For "${s.query}"**: ${s.reason}`).join('\n')
      : `- Nothing needed from you today — all checks passed and eligible updates are already live.`,
    ``,
    `### 🛡️ Deterministic Quality Gates`,
    `- \`npm run verify\` (\`tsc\`, \`evals\`, \`audit:legal\`, \`audit:copy\`, \`audit:titles\`, \`check:links\`, \`lint:audit\`) must pass.`,
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
