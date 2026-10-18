import fs from 'fs';
import path from 'path';

const APP_DIR = path.resolve('app/api');

function findApiRoutes(dir: string): string[] {
  let res: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      res.push(...findApiRoutes(full));
    } else if (e.name === 'route.ts' || e.name === 'route.js') {
      res.push(full);
    }
  }
  return res;
}

const files = findApiRoutes(APP_DIR);
console.log(`Found ${files.length} API routes`);

const apiInventory = files.map(file => {
  const relFile = path.relative(process.cwd(), file).replace(/\\/g, '/');
  const route = '/' + path.dirname(relFile).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');

  const methods: string[] = [];
  if (/export\s+async\s+function\s+GET/i.test(content)) methods.push('GET');
  if (/export\s+async\s+function\s+POST/i.test(content)) methods.push('POST');
  if (/export\s+async\s+function\s+PUT/i.test(content)) methods.push('PUT');
  if (/export\s+async\s+function\s+DELETE/i.test(content)) methods.push('DELETE');
  if (/export\s+async\s+function\s+OPTIONS/i.test(content)) methods.push('OPTIONS');

  const authType = /CRON_SECRET|bearer/i.test(content)
    ? 'CRON_SECRET / Bearer'
    : /session|cookie|token/i.test(content)
    ? 'Session / Token'
    : 'Public Unauthenticated';

  const usesSupabase = content.includes('supabase');
  const usesResend = content.includes('resend') || content.includes('Resend');
  const usesAiGateway = content.includes('ai') || content.includes('gemini') || content.includes('anthropic');

  // Supabase tables
  const tableMatches = [...content.matchAll(/from\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
  const tables = Array.from(new Set(tableMatches));

  return {
    route,
    file: relFile,
    methods: methods.join(', '),
    authType,
    usesSupabase,
    tables,
    usesResend,
    usesAiGateway,
  };
});

fs.writeFileSync(
  path.resolve('data/audit/api-inventory.json'),
  JSON.stringify(apiInventory, null, 2),
  'utf8'
);
console.log('Saved data/audit/api-inventory.json');
console.log(JSON.stringify(apiInventory, null, 2));
