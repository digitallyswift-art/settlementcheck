/**
 * Installs the SettlementCheck pre-push Git hook to guarantee that no code or copy
 * is ever pushed to the repository without passing:
 * - TypeScript compilation (tsc)
 * - Statutory & AI Evals (test:evals)
 * - Legal, SRA, FCA, CMA & 5-Trap Scanner (audit:legal)
 * - Brand, British English & Zero Em-Dash Scanner (audit:copy)
 * - Internal Link & Trailing Slash Verification (check:links)
 * - Audit Naming Invariants (lint:audit)
 */

import fs from 'fs';
import path from 'path';

const gitHooksDir = path.resolve('.git/hooks');

if (fs.existsSync(gitHooksDir)) {
  const prePushPath = path.join(gitHooksDir, 'pre-push');
  const hookScript = `#!/bin/sh
echo "Running SettlementCheck Legal, SRA, FCA, CMA & Brand Pre-Push Gate (npm run verify)..."
npm run verify
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ Pre-push verification FAILED. Push aborted to protect Legal, SRA, FCA, CMA & Brand compliance."
  exit 1
fi
echo "✅ All Legal, SRA, FCA, CMA & Technical gates passed. Proceeding with push."
exit 0
`;
  fs.writeFileSync(prePushPath, hookScript, { encoding: 'utf8', mode: 0o755 });
  console.log('Installed .git/hooks/pre-push compliance gate.');
}
