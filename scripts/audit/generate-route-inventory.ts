import fs from 'fs';
import path from 'path';

export interface RouteInventoryItem {
  id: string;
  route: string;
  type: 'page' | 'api' | 'sitemap' | 'robots';
  tier: string;
  intent: 'Transactional' | 'Informational' | 'Commercial Investigation' | 'Navigational' | 'System / Utility' | 'B2B Partner';
  file: string;
  title: string | null;
  description: string | null;
  canonical: string | null;
  canonicalFormat: 'absolute' | 'relative' | 'missing' | 'n/a';
  canonicalMatches: boolean;
  robotsDirective: string;
  isIndexable: boolean;
  isInSitemap: boolean;
  sitemapPriority: number | null;
  h1: string | null;
  primaryCTA: { text: string; href: string } | null;
  schemas: string[];
  disclaimers: {
    legalAdvice: boolean;
    sraBoundary: boolean;
    employerPaysFees: boolean;
    taxAdvice: boolean;
  };
  statutoryCitations: string[];
  unsupportedClaims: string[];
  inboundLinksCount: number;
}

const APP_DIR = path.resolve('app');
const COMPONENTS_DIR = path.resolve('components');

// Discover all routes in app directory
function findAllRoutes(dir: string, route = ''): Array<{ type: 'page' | 'api' | 'sitemap' | 'robots'; file: string; route: string }> {
  let res: Array<{ type: 'page' | 'api' | 'sitemap' | 'robots'; file: string; route: string }> = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith('(') && entry.name.endsWith(')')) {
        res.push(...findAllRoutes(path.join(dir, entry.name), route));
      } else if (entry.name.startsWith('@')) {
        continue;
      } else {
        const nextRoute = route + '/' + entry.name;
        res.push(...findAllRoutes(path.join(dir, entry.name), nextRoute));
      }
    } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
      res.push({ type: 'page', file: path.join(dir, entry.name), route: route === '' ? '/' : route + '/' });
    } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
      res.push({ type: 'api', file: path.join(dir, entry.name), route });
    } else if (entry.name === 'sitemap.ts' || entry.name === 'sitemap.js') {
      res.push({ type: 'sitemap', file: path.join(dir, entry.name), route: '/sitemap.xml' });
    } else if (entry.name === 'robots.ts' || entry.name === 'robots.js') {
      res.push({ type: 'robots', file: path.join(dir, entry.name), route: '/robots.txt' });
    }
  }
  return res;
}

// Discover all code files for link scanning
function scanAllCodeFiles(dir: string): string[] {
  let files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanAllCodeFiles(full));
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

const allCodeFiles = [...scanAllCodeFiles(APP_DIR), ...scanAllCodeFiles(COMPONENTS_DIR)];

// Calculate inbound links for each route
function countInboundLinks(targetRoute: string): number {
  let count = 0;
  const normalizedTarget = targetRoute.endsWith('/') ? targetRoute : targetRoute + '/';
  const escaped = normalizedTarget.replace(/\//g, '\\/');
  const linkRegex = new RegExp(`href[:=]\\s*["']${escaped}["']`, 'g');
  for (const file of allCodeFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(linkRegex);
    if (matches) {
      count += matches.length;
    }
  }
  return count;
}

// Discover sitemap URLs and priorities
function parseSitemap(): Map<string, number> {
  const sitemapFile = path.resolve('app/sitemap.ts');
  const sitemapMap = new Map<string, number>();
  if (!fs.existsSync(sitemapFile)) return sitemapMap;
  const content = fs.readFileSync(sitemapFile, 'utf8');
  const matches = [...content.matchAll(/url:\s*`\${base}([^`]+)`[^}]*priority:\s*([0-9.]+)/g)];
  for (const m of matches) {
    sitemapMap.set(m[1], parseFloat(m[2]));
  }
  return sitemapMap;
}

function determineTier(route: string, type: string): string {
  if (type === 'api') return 'API Endpoint';
  if (type === 'sitemap' || type === 'robots') return 'SEO Directive Endpoint';
  if (route === '/' || route === '/calculator/' || route === '/calculators/' || route === '/settlement-agreement-review/') {
    return 'Tier 1: Core Conversion Pillar';
  }
  if (route.includes('-calculator/')) {
    return 'Tier 2: Programmatic Statutory Calculator';
  }
  if (route === '/results/' || route === '/get-matched/' || route === '/how-it-works/') {
    return 'Tier 3: Funnel & Intake Stage';
  }
  if (route.startsWith('/guides/')) {
    return 'Tier 4: Statutory & Educational Guide';
  }
  if (route === '/for-solicitors/') {
    return 'Tier 5: B2B / Panel Solicitor Acquisition';
  }
  if (route === '/portal/' || route.startsWith('/dossier/')) {
    return 'Internal / Solicitor Portal Platform';
  }
  if (route === '/privacy/' || route === '/terms/' || route === '/disclaimer/' || route === '/sitemap/') {
    return 'Tier 6: Legal & Compliance';
  }
  return 'Other Page';
}

function determineIntent(route: string, type: string): RouteInventoryItem['intent'] {
  if (type === 'api' || type === 'sitemap' || type === 'robots') return 'System / Utility';
  if (route === '/portal/' || route.startsWith('/dossier/') || route === '/for-solicitors/') return 'B2B Partner';
  if (route === '/calculator/' || route === '/settlement-agreement-review/' || route === '/get-matched/' || route === '/results/') {
    return 'Transactional';
  }
  if (route.includes('-calculator/')) {
    return 'Commercial Investigation';
  }
  if (route.startsWith('/guides/')) {
    return 'Informational';
  }
  if (route === '/' || route === '/how-it-works/' || route === '/calculators/' || route === '/sitemap/') {
    return 'Navigational';
  }
  return 'Informational';
}

function cleanText(text: string): string {
  return text.replace(/<[^>]+>/g, '').replace(/\{['"]([^'"]+)['"]\}/g, '$1').replace(/\s+/g, ' ').trim();
}

function extractPageMetadata(filePath: string, route: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  let relatedFilesContent = content;

  // Check if client component exists
  const clientMatch = content.match(/import\s+(\w+)\s+from\s+['"]\.\/([^'"]+)['"]/);
  if (clientMatch) {
    const clientPathCandidate1 = path.join(path.dirname(filePath), clientMatch[2] + '.tsx');
    const clientPathCandidate2 = path.join(path.dirname(filePath), clientMatch[2] + '.ts');
    if (fs.existsSync(clientPathCandidate1)) {
      relatedFilesContent += '\n' + fs.readFileSync(clientPathCandidate1, 'utf8');
    } else if (fs.existsSync(clientPathCandidate2)) {
      relatedFilesContent += '\n' + fs.readFileSync(clientPathCandidate2, 'utf8');
    }
  }

  // Title
  let title: string | null = null;
  const titleMatch = content.match(/title:\s*(?:'([^']*)'|"([^"]*)")/);
  if (titleMatch) title = titleMatch[1] ?? titleMatch[2];

  // Description
  let description: string | null = null;
  const descMatch = content.match(/description:\s*(?:'([^']*)'|"([^"]*)")/);
  if (descMatch) description = (descMatch[1] ?? descMatch[2]).replace(/\s+/g, ' ').trim();

  // Canonical
  let canonical: string | null = null;
  let canonicalFormat: 'absolute' | 'relative' | 'missing' = 'missing';
  const canonMatch = content.match(/canonical:\s*['"]([^'"]+)['"]/);
  if (canonMatch) {
    canonical = canonMatch[1];
    canonicalFormat = canonical.startsWith('http') ? 'absolute' : 'relative';
  }

  // Robots
  let isIndex = true;
  let isFollow = true;
  const robotsMatch = content.match(/robots:\s*\{([^}]+)\}/);
  if (robotsMatch) {
    const rBody = robotsMatch[1];
    if (rBody.includes('index: false')) isIndex = false;
    if (rBody.includes('follow: false')) isFollow = false;
  }
  const robotsDirective = `${isIndex ? 'index' : 'noindex'}, ${isFollow ? 'follow' : 'nofollow'}`;
  const isIndexable = isIndex;

  // H1 extraction
  let h1: string | null = null;
  const h1Match = relatedFilesContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    h1 = cleanText(h1Match[1]);
  } else {
    // Check HomeClient title prop pattern
    const homeClientTitleMatch = content.match(/title=\{[\s\S]*?<>([\s\S]*?)<\/>[\s\S]*?\}/);
    if (homeClientTitleMatch) {
      h1 = cleanText(homeClientTitleMatch[1]);
    } else if (content.includes('<HomeClient') && route === '/') {
      h1 = 'How much should your employment settlement be?';
    }
  }

  // Primary CTA
  let primaryCTA: { text: string; href: string } | null = null;
  const ctaPropMatch = content.match(/ctaLabel=["']([^"']+)["'][\s\S]*?ctaHref=["']([^"']+)["']/);
  if (ctaPropMatch) {
    primaryCTA = { text: ctaPropMatch[1], href: ctaPropMatch[2] };
  } else {
    const linkMatches = [...relatedFilesContent.matchAll(/<Link[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/Link>/gi)];
    for (const m of linkMatches) {
      const href = m[1];
      const text = cleanText(m[2]);
      if (href.includes('/calculator/') || href.includes('/settlement-agreement-review/') || href.includes('/get-matched/')) {
        primaryCTA = { text, href };
        break;
      }
    }
    if (!primaryCTA && linkMatches.length > 0) {
      primaryCTA = {
        text: cleanText(linkMatches[0][2]),
        href: linkMatches[0][1]
      };
    }
  }

  // JSON-LD Schemas
  const schemas: string[] = [];
  const typeRegex1 = /['"]@type['"]\s*:\s*['"]([^'"]+)['"]/g;
  const typeRegex2 = /['"]@type['"]\s*:\s*\[([\s\S]*?)\]/g;
  let sMatch: RegExpExecArray | null;
  while ((sMatch = typeRegex1.exec(relatedFilesContent)) !== null) {
    const val = sMatch[1];
    if (!schemas.includes(val)) schemas.push(val);
  }
  while ((sMatch = typeRegex2.exec(relatedFilesContent)) !== null) {
    const innerMatches = sMatch[1].match(/['"]([^'"]+)['"]/g);
    if (innerMatches) {
      for (const im of innerMatches) {
        const val = im.replace(/['"]/g, '');
        if (!schemas.includes(val)) schemas.push(val);
      }
    }
  }
  // Check component-based schemas
  if (relatedFilesContent.includes('FaqAccordion') && !schemas.includes('FAQPage')) {
    schemas.push('FAQPage');
  }

  // Disclaimers
  const disclaimers = {
    legalAdvice: /not (legal|formal legal) advice|does not constitute legal advice/i.test(relatedFilesContent),
    sraBoundary: /not an SRA-regulated|not a law firm|independent employment solicitor|sra/i.test(relatedFilesContent),
    employerPaysFees: /employer pays|contribution towards your legal fees|£500 to £1,500/i.test(relatedFilesContent),
    taxAdvice: /not tax advice|consult an accountant|hmrc/i.test(relatedFilesContent),
  };

  // Statutory Citations
  const statutoryCitations: string[] = [];
  if (/Employment Rights Act 1996|ERA 1996|s\.203|Section 203/i.test(relatedFilesContent)) statutoryCitations.push('ERA 1996 s.203');
  if (/ITEPA 2003|s\.401|s\.402D|s\.403/i.test(relatedFilesContent)) statutoryCitations.push('ITEPA 2003');
  if (/Equality Act 2010|Vento/i.test(relatedFilesContent)) statutoryCitations.push('Equality Act 2010');
  if (/TUPE/i.test(relatedFilesContent)) statutoryCitations.push('TUPE Regs');
  if (/£751/i.test(relatedFilesContent)) statutoryCitations.push('£751 weekly cap');
  if (/£123,543/i.test(relatedFilesContent)) statutoryCitations.push('£123,543 compensatory cap');
  if (/£30,000/i.test(relatedFilesContent)) statutoryCitations.push('£30,000 tax exemption');

  // Unsupported claims
  const unsupportedClaims: string[] = [];
  if (/Acas Typical Settlement/i.test(relatedFilesContent)) unsupportedClaims.push('Acas Typical Settlement');
  if (/Average settlement payout £5,000 to £25,000/i.test(relatedFilesContent)) unsupportedClaims.push('Average payout £5,000 to £25,000');
  if (/1 to 3 months gross pay/i.test(relatedFilesContent)) unsupportedClaims.push('1 to 3 months typical');
  if (/most employers/i.test(relatedFilesContent)) unsupportedClaims.push('most employers');
  if (/market data/i.test(relatedFilesContent)) unsupportedClaims.push('market data');

  const expectedCanonical = `https://settlementcheck.co.uk${route}`;
  const canonicalMatches = canonical === expectedCanonical || canonical === route;

  return {
    title,
    description,
    canonical,
    canonicalFormat,
    canonicalMatches,
    robotsDirective,
    isIndexable,
    h1,
    primaryCTA,
    schemas,
    disclaimers,
    statutoryCitations,
    unsupportedClaims,
  };
}

export function generateInventory(): RouteInventoryItem[] {
  const routes = findAllRoutes(APP_DIR);
  const sitemapMap = parseSitemap();
  const items: RouteInventoryItem[] = [];

  let idCounter = 1;

  for (const r of routes) {
    const id = `RT-${String(idCounter++).padStart(3, '0')}`;
    const relFile = path.relative(process.cwd(), r.file).replace(/\\/g, '/');
    const tier = determineTier(r.route, r.type);
    const intent = determineIntent(r.route, r.type);
    const inbound = countInboundLinks(r.route);
    const isInSitemap = sitemapMap.has(r.route);
    const sitemapPriority = sitemapMap.get(r.route) ?? null;

    if (r.type === 'page') {
      const pageData = extractPageMetadata(r.file, r.route);
      items.push({
        id,
        route: r.route,
        type: r.type,
        tier,
        intent,
        file: relFile,
        title: pageData.title,
        description: pageData.description,
        canonical: pageData.canonical,
        canonicalFormat: pageData.canonicalFormat,
        canonicalMatches: pageData.canonicalMatches,
        robotsDirective: pageData.robotsDirective,
        isIndexable: pageData.isIndexable,
        isInSitemap,
        sitemapPriority,
        h1: pageData.h1,
        primaryCTA: pageData.primaryCTA,
        schemas: pageData.schemas,
        disclaimers: pageData.disclaimers,
        statutoryCitations: pageData.statutoryCitations,
        unsupportedClaims: pageData.unsupportedClaims,
        inboundLinksCount: inbound,
      });
    } else {
      items.push({
        id,
        route: r.route,
        type: r.type,
        tier,
        intent,
        file: relFile,
        title: null,
        description: null,
        canonical: null,
        canonicalFormat: 'n/a',
        canonicalMatches: false,
        robotsDirective: 'N/A (Endpoint)',
        isIndexable: false,
        isInSitemap,
        sitemapPriority,
        h1: null,
        primaryCTA: null,
        schemas: [],
        disclaimers: {
          legalAdvice: false,
          sraBoundary: false,
          employerPaysFees: false,
          taxAdvice: false,
        },
        statutoryCitations: [],
        unsupportedClaims: [],
        inboundLinksCount: inbound,
      });
    }
  }

  return items;
}

if (require.main === module) {
  const inventory = generateInventory();
  const outputPath = path.resolve('data/audit/website-inventory.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(inventory, null, 2), 'utf8');
  console.log(`Successfully generated website inventory for ${inventory.length} routes.`);
  console.log(`Saved inventory to ${outputPath}`);

  // Summary counts
  const pages = inventory.filter(i => i.type === 'page');
  const indexable = pages.filter(i => i.isIndexable);
  const noindex = pages.filter(i => !i.isIndexable);
  const missingH1 = pages.filter(i => i.isIndexable && !i.h1);

  console.log(`• Total Routes: ${inventory.length}`);
  console.log(`• Total Pages: ${pages.length}`);
  console.log(`• Indexable Pages: ${indexable.length}`);
  console.log(`• Noindex Pages: ${noindex.length}`);
  console.log(`• Missing H1: ${missingH1.length}`);
}
