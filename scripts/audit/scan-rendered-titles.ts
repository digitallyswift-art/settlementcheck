#!/usr/bin/env node
/**
 * SettlementCheck Deterministic Rendered Title & SSR Pixel Guard
 * Simulates Next.js App Router root layout templating (`%s | SettlementCheck`),
 * calculates exact Arial 20px bounding box widths, detects double-branding,
 * verifies 50-60 character budgets, and audits zero em dashes across all routes.
 */

import fs from 'fs';
import path from 'path';
import { calculateSerpPixelWidth, SERP_PIXEL_BUDGETS } from '../../lib/agentic-engine/tools/serp-pixel-calculator';

interface RouteTitleAudit {
  file: string;
  route: string;
  rawTitle: string;
  effectiveTitle: string;
  isAbsolute: boolean;
  charCount: number;
  pixelWidth: number;
  hasDoubleBrand: boolean;
  hasEmDash: boolean;
  status: 'PASS' | 'WARN' | 'FAIL';
  reasons: string[];
}

function findPages(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findPages(fullPath));
    } else if (file === 'page.tsx') {
      results.push(fullPath);
    }
  }
  return results;
}

function filePathToRoute(filePath: string): string {
  const rel = path.relative('app', filePath).replace(/\\/g, '/');
  if (rel === 'page.tsx') return '/';
  const clean = rel.replace(/\/page\.tsx$/, '');
  return `/${clean}/`;
}

function auditRouteTitles(): { audits: RouteTitleAudit[]; passCount: number; failCount: number; warnCount: number } {
  const pages = findPages('app');
  const audits: RouteTitleAudit[] = [];

  for (const pagePath of pages) {
    const route = filePathToRoute(pagePath);
    const content = fs.readFileSync(pagePath, 'utf8');

    // Skip dynamic route templates that cannot be evaluated statically without parameters
    if (pagePath.includes('[id]')) {
      continue;
    }

    const absMatch = content.match(/title:\s*{\s*absolute:\s*['"]([^'"]+)['"]/);
    let rawTitle = '';
    let isAbsolute = false;

    if (absMatch) {
      rawTitle = absMatch[1];
      isAbsolute = true;
    } else {
      const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
      if (titleMatch) {
        rawTitle = titleMatch[1];
      }
    }

    if (!rawTitle) {
      // Check if page delegates to client or custom generator without local static title
      continue;
    }

    // Simulate Next.js App Router root layout templating:
    // Reads template from app/layout.tsx
    let effectiveTitle = rawTitle;
    const layoutContent = fs.readFileSync('app/layout.tsx', 'utf8');
    const templateMatch = layoutContent.match(/template:\s*['"]([^'"]+)['"]/);
    const layoutTemplate = templateMatch ? templateMatch[1] : '%s';

    if (!isAbsolute && route !== '/' && layoutTemplate !== '%s') {
      effectiveTitle = layoutTemplate.replace('%s', rawTitle);
    }

    const reasons: string[] = [];
    const charCount = effectiveTitle.length;
    const pixelWidth = calculateSerpPixelWidth(effectiveTitle, 'title');
    const hasDoubleBrand = /SettlementCheck.*SettlementCheck/i.test(effectiveTitle);
    const hasEmDash = effectiveTitle.includes('—') || content.includes('—');

    let status: 'PASS' | 'WARN' | 'FAIL' = 'PASS';

    // 1. Double Branding Check
    if (hasDoubleBrand) {
      status = 'FAIL';
      reasons.push('Double brand suffix detected in rendered title');
    }

    // 2. Pixel budget check (Google Desktop Cutoff = 580px)
    if (pixelWidth > SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MAX_PX) {
      status = 'FAIL';
      reasons.push(`Pixel width ${pixelWidth}px exceeds ${SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MAX_PX}px cutoff`);
    }

    // 3. Em Dash Check
    if (hasEmDash) {
      status = 'FAIL';
      reasons.push('Banned em dash (—) detected in file or title');
    }

    // 4. Character count budget (Hard target: 50 - 60 chars)
    if (charCount > 60) {
      status = 'FAIL';
      reasons.push(`Character count ${charCount} exceeds 60-char ceiling`);
    } else if (charCount < 45) {
      status = 'WARN';
      reasons.push(`Character count ${charCount} is under recommended 50-char floor`);
    }

    // 5. Anti-Decoupling Check on Homepage
    if (route === '/') {
      const lower = effectiveTitle.toLowerCase();
      if (!lower.includes('settlement agreement') || !lower.includes('calculator')) {
        status = 'FAIL';
        reasons.push('Anti-Decoupling Law violated: Homepage title must contain "Settlement Agreement Calculator"');
      }
    }

    // 6. Interactive Calculator Titling Invariant
    if (route.includes('calculator') && !/calculator|calc/i.test(effectiveTitle)) {
      status = 'FAIL';
      reasons.push('Interactive tool route must include "Calculator" in title');
    }

    audits.push({
      file: pagePath.replace(/\\/g, '/'),
      route,
      rawTitle,
      effectiveTitle,
      isAbsolute,
      charCount,
      pixelWidth,
      hasDoubleBrand,
      hasEmDash,
      status,
      reasons,
    });
  }

  const passCount = audits.filter(a => a.status === 'PASS').length;
  const warnCount = audits.filter(a => a.status === 'WARN').length;
  const failCount = audits.filter(a => a.status === 'FAIL').length;

  return { audits, passCount, warnCount, failCount };
}

function main() {
  console.log('======================================================');
  console.log('🛡️  SettlementCheck Synthetic Rendered Title & SSR Pixel Guard');
  console.log('======================================================\n');

  const { audits, passCount, warnCount, failCount } = auditRouteTitles();

  const criticalFailures = audits.filter(a => a.status === 'FAIL');
  if (criticalFailures.length > 0) {
    console.error(`❌ FOUND ${criticalFailures.length} TITLE INVARIANT FAILURE(S):\n`);
    for (const fail of criticalFailures) {
      console.error(`• Route: ${fail.route} (${fail.file})`);
      console.error(`  Effective Title: "${fail.effectiveTitle}"`);
      console.error(`  Metrics: ${fail.charCount} chars | ${fail.pixelWidth}px | isAbsolute: ${fail.isAbsolute}`);
      for (const reason of fail.reasons) {
        console.error(`  - ⚠️ ${reason}`);
      }
      console.error('');
    }
  }

  console.log(`Audited Routes: ${audits.length} | PASS: ${passCount} | WARN: ${warnCount} | FAIL: ${failCount}`);

  if (failCount > 0) {
    console.error('\n❌ Title & SSR Pixel Guard FAILED. Fix violations above.\n');
    process.exit(1);
  }

  console.log('\n✅ All evaluated route titles comply with pixel budgets, brand invariants, and zero em dashes.\n');
}

main();
