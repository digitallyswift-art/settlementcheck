#!/usr/bin/env node
/**
 * SettlementCheck Tracking & UTM Audit Script
 * Checks:
 * 1. Forbidden utm_* parameters on internal Next.js routes/links/router.push
 * 2. Non-snake_case UTM values (uppercase, spaces, hyphens, %20, dots)
 * 3. B2C vs B2B lead separation (no generate_lead/qualify_lead in solicitor onboarding;
 *    no mixing solicitor_* and generate_lead in the same file)
 * 4. Required audience_role on lead/solicitor funnel events
 * 5. Outbound email templates using raw settlementcheck.co.uk links instead of buildTrackedUrl
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['app', 'components', 'lib'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx']);

const findings = [];

function walk(dir) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(rel);
    } else if (EXTS.has(path.extname(entry.name))) {
      auditFile(rel);
    }
  }
}

function auditFile(relPath) {
  const content = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
  const lines = content.split(/\r?\n/);
  const normPath = relPath.replace(/\\/g, '/');

  // File-level B2C/B2B mix check
  const hasB2CEvent = /['"](generate_lead|qualify_lead|lead_submitted)['"]/.test(content);
  const hasB2BEvent = /['"](solicitor_application_submitted|solicitor_form_step)['"]/.test(content);
  if (hasB2CEvent && hasB2BEvent) {
    findings.push({
      severity: 'ERROR',
      file: normPath,
      line: 1,
      rule: 'B2B_B2C_SEPARATION',
      message: 'File mixes B2C employee lead events and B2B solicitor onboarding events.',
    });
  }

  lines.forEach((line, idx) => {
    const lineNo = idx + 1;

    // 1. Check for UTMs on internal relative links or router.push
    if (
      (/href\s*=\s*[{"'`]+\/[^"'`}]*utm_/i.test(line) ||
        /router\.(push|replace)\s*\(\s*["'`]\/[^"'`]*utm_/i.test(line))
    ) {
      findings.push({
        severity: 'ERROR',
        file: normPath,
        line: lineNo,
        rule: 'NO_INTERNAL_UTM',
        message: 'Internal link or navigation contains utm_* parameter (breaks GA4 session attribution).',
      });
    }

    // 2. Check UTM casing / format (must be lowercase snake_case, catch %, ., -, spaces, uppercase)
    const utmMatches = line.matchAll(/utm_(source|medium|campaign|content|term)=([^\s"'`&?#]+)/g);
    for (const m of utmMatches) {
      const key = m[1];
      const val = m[2];
      // Ignore dynamic template interpolations like ${...}
      if (val.startsWith('${')) continue;
      if (!/^[a-z0-9_]+$/.test(val)) {
        findings.push({
          severity: 'ERROR',
          file: normPath,
          line: lineNo,
          rule: 'UTM_SNAKE_CASE',
          message: `utm_${key}="${val}" is not lowercase snake_case (^[a-z0-9_]+$).`,
        });
      }
    }

    // 3. Check B2C event contamination in solicitor onboarding routes
    if (normPath.includes('for-solicitors') && /['"](generate_lead|qualify_lead|lead_submitted)['"]/.test(line)) {
      findings.push({
        severity: 'ERROR',
        file: normPath,
        line: lineNo,
        rule: 'B2B_B2C_SEPARATION',
        message: 'Solicitor onboarding route must NEVER fire B2C generate_lead/qualify_lead/lead_submitted.',
      });
    }

    // 4. Check audience_role on core funnel events
    const funnelEventMatch = line.match(
      /(?:gtag\s*\(\s*['"]event['"]\s*,|trackClientEvent\s*\(|trackEvent\s*\()\s*['"](generate_lead|qualify_lead|lead_submitted|lead_form_step|solicitor_application_submitted|solicitor_form_step|solicitor_postcode_checked)['"]/
    );
    if (funnelEventMatch) {
      const block = lines.slice(idx, Math.min(lines.length, idx + 8)).join(' ');
      if (!/audience_role\s*:/.test(block)) {
        findings.push({
          severity: 'ERROR',
          file: normPath,
          line: lineNo,
          rule: 'MISSING_AUDIENCE_ROLE',
          message: `Funnel event "${funnelEventMatch[1]}" is missing audience_role ('Employee Client' or 'Solicitor Partner').`,
        });
      }
    }

    // 5. Check outbound user/solicitor email templates for raw settlementcheck.co.uk hrefs without UTMs
    if (
      (normPath.includes('lead-ingestion') || normPath.includes('save-results')) &&
      /href=["']https:\/\/settlementcheck\.co\.uk/.test(line) &&
      !/utm_source=/.test(line) &&
      !/Utm\}/.test(line)
    ) {
      findings.push({
        severity: 'ERROR',
        file: normPath,
        line: lineNo,
        rule: 'EMAIL_MISSING_UTM',
        message: 'Outbound email link to settlementcheck.co.uk must use buildTrackedUrl() with UTMs.',
      });
    }
  });
}

for (const dir of SCAN_DIRS) walk(dir);

if (findings.length === 0) {
  console.log('PASS: 0 tracking/UTM violations found across app/, components/, lib/.');
  process.exit(0);
}

for (const f of findings) {
  console.log(`[${f.severity}] ${f.file}:${f.line} (${f.rule}) — ${f.message}`);
}
const errors = findings.filter((f) => f.severity === 'ERROR').length;
console.log(`\nSummary: ${findings.length} finding(s) (${errors} error(s)).`);
process.exit(errors > 0 ? 1 : 0);
