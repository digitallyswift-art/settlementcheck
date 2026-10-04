import fs from 'fs';
import path from 'path';

const APP_DIR = path.resolve('app');
const COMPONENTS_DIR = path.resolve('components');

function getRoutes(dir, currentRoute = '') {
  let routes = [];
  if (!fs.existsSync(dir)) return routes;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith('(') && entry.name.endsWith(')')) {
        routes.push(...getRoutes(path.join(dir, entry.name), currentRoute));
      } else if (entry.name.startsWith('@')) {
        continue;
      } else {
        const nextRoute = currentRoute + '/' + entry.name;
        routes.push(...getRoutes(path.join(dir, entry.name), nextRoute));
      }
    } else if (entry.name === 'page.tsx' || entry.name === 'page.ts' || entry.name === 'route.ts') {
      routes.push(currentRoute === '' ? '/' : currentRoute + '/');
    }
  }
  return routes;
}

const validRoutes = new Set(getRoutes(APP_DIR));
validRoutes.add('/sitemap.xml');
validRoutes.add('/robots.txt');

function scanFiles(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanFiles(full));
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = [...scanFiles(APP_DIR), ...scanFiles(COMPONENTS_DIR)];
const hrefRegex = /href\s*=\s*["']([^"']+)["']/g;
const hrefObjRegex = /href:\s*["']([^"']+)["']/g;
const urlRegex = /url:\s*`\${base}([^`]+)`/g;

let issues = [];
let scannedCount = 0;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const relFile = path.relative(process.cwd(), file);

  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    checkHref(match[1], relFile);
  }
  while ((match = hrefObjRegex.exec(content)) !== null) {
    checkHref(match[1], relFile);
  }
  while ((match = urlRegex.exec(content)) !== null) {
    checkHref(match[1], relFile);
  }
}

function checkHref(rawHref, file) {
  scannedCount++;
  if (rawHref.startsWith('http://') || rawHref.startsWith('https://') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('#')) {
    return;
  }

  const [urlWithoutHash] = rawHref.split('#');
  const [pathname] = urlWithoutHash.split('?');
  
  if (pathname && pathname !== '/' && !pathname.includes('.') && !pathname.endsWith('/')) {
    issues.push({
      type: 'MISSING_TRAILING_SLASH',
      rawHref,
      file,
      details: `Path "${pathname}" should have a trailing slash for Next.js trailingSlash: true.`
    });
  }

  const normalized = pathname.endsWith('/') ? pathname : pathname + '/';

  if (!validRoutes.has(pathname) && !validRoutes.has(normalized)) {
    if (!pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.endsWith('.png') && !pathname.endsWith('.jpg') && !pathname.endsWith('.svg') && !pathname.endsWith('.ico')) {
      issues.push({
        type: 'BROKEN_ROUTE',
        rawHref,
        file,
        details: `Route "${pathname}" does not exist in the app directory!`
      });
    }
  }
}

console.log(`\n======================================================`);
console.log(`🔍 SettlementCheck Broken Link & Route Integrity Check`);
console.log(`======================================================`);
console.log(`• Total Routes Discovered: ${validRoutes.size}`);
console.log(`• Total Links Scanned:     ${scannedCount} across ${allFiles.length} files`);

if (issues.length === 0) {
  console.log(`\n✅ ALL CLEAR: 0 broken routes and 0 trailing slash errors found! Everything is top-notch.\n`);
  process.exit(0);
} else {
  console.error(`\n❌ FOUND ${issues.length} ISSUE(S):\n`);
  for (const iss of issues) {
    console.error(`  [${iss.type}] in ${iss.file}: ${iss.rawHref} -> ${iss.details}`);
  }
  process.exit(1);
}
