import { execSync } from 'child_process';

const checks = [
  { name: 'tsc', cmd: 'node node_modules/typescript/lib/tsc.js --noEmit' },
  { name: 'evals', cmd: 'npm run test:evals' },
  { name: 'legal', cmd: 'npm run audit:legal' },
  { name: 'brand', cmd: 'npm run audit:copy' },
  { name: 'links', cmd: 'npm run check:links' },
  { name: 'audit-lint', cmd: 'npm run lint:audit' },
];

const results = [];
let failed = false;

for (const check of checks) {
  try {
    execSync(check.cmd, { stdio: 'pipe', encoding: 'utf8' });
    results.push(`${check.name}: PASS`);
  } catch (err) {
    failed = true;
    results.push(`${check.name}: FAIL`);
    console.error(`\n❌ [${check.name}] FAILED:`);
    if (err.stdout) console.error(err.stdout);
    if (err.stderr) console.error(err.stderr);
  }
}

console.log(`Verify Summary -> ${results.join(' | ')}`);
if (failed) {
  process.exit(1);
}
