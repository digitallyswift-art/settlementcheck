import { NextResponse, type NextRequest } from 'next/server';
import { logSecurityEvent } from '@/lib/security/security-logger';

const PROTECTED_API_PREFIXES = ['/api/portal', '/api/cockpit'];
const PROTECTED_PAGE_PREFIXES = ['/cockpit', '/portal'];
const PUBLIC_API_ALLOWLIST = ['/api/portal/health'];
// Dossier reading and claiming endpoints enforce their own mandatory cryptographic claim_token validation
const CLAIM_TOKEN_API_PREFIXES = ['/api/portal/dossier', '/api/portal/claim'];

const cleanEnv = (val?: string) => (val || '').replace(/['"]/g, '').trim();

/**
 * Constant-time string comparison to neutralize timing attacks.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function verifyDevOrWorkerToken(token: string): boolean {
  const cronSecret = cleanEnv(process.env.CRON_SECRET) || cleanEnv(process.env.INTERNAL_WORKER_KEY);
  if (cronSecret && constantTimeEqual(token, cronSecret)) {
    return true;
  }
  // Dev passkey is strictly gated to development mode and must be explicitly provided in environment
  if (process.env.NODE_ENV === 'development') {
    const devPass = cleanEnv(process.env.DEV_PASSKEY);
    if (devPass && constantTimeEqual(token, devPass)) {
      return true;
    }
  }
  return false;
}

function decodeBase64UrlJson(segment: string): any | null {
  try {
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const jsonStr = atob(padded);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * Verifies a Firebase Auth ID Token in Next.js Edge Runtime:
 * 1. Validates token via Google Identity Toolkit `accounts:lookup` REST endpoint.
 * 2. Verifies Firebase SecureToken JWT claims + Google public JWK RS256 signature if API key has referrer restrictions.
 */
async function verifyFirebaseToken(token: string, req: NextRequest): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const firebaseApiKey = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  const firebaseProjectId = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

  // 1. Primary check: Google Identity Toolkit REST verification
  if (firebaseApiKey && !firebaseApiKey.includes('placeholder')) {
    try {
      const origin = req.headers.get('origin') || req.nextUrl.origin || 'https://settlementcheck.co.uk';
      const referer = req.headers.get('referer') || `${origin}/cockpit/`;
      const lookupRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseApiKey)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Origin: origin,
            Referer: referer,
          },
          body: JSON.stringify({ idToken: token }),
        }
      );
      if (lookupRes.ok) {
        const data = await lookupRes.json();
        if (Array.isArray(data?.users) && data.users.length > 0 && data.users[0]?.localId) {
          return true;
        }
      }
    } catch {
      // Fall through to JWT claim & JWK signature verification
    }
  }

  // 2. Fallback check: Verify Firebase SecureToken JWT claims and Google JWK RS256 signature
  const header = decodeBase64UrlJson(parts[0]);
  const payload = decodeBase64UrlJson(parts[1]);
  if (!header || !payload) return false;

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (header.alg !== 'RS256' || !header.kid) return false;
  if (typeof payload.exp !== 'number' || payload.exp <= nowSeconds) return false;
  if (typeof payload.iat !== 'number' || payload.iat > nowSeconds + 300) return false;
  if (typeof payload.sub !== 'string' || !payload.sub.trim()) return false;

  if (firebaseProjectId) {
    if (payload.aud !== firebaseProjectId) return false;
    if (payload.iss !== `https://securetoken.google.com/${firebaseProjectId}`) return false;
  } else {
    if (typeof payload.iss !== 'string' || !payload.iss.startsWith('https://securetoken.google.com/')) {
      return false;
    }
  }

  try {
    const jwksRes = await fetch(
      'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
    );
    if (jwksRes.ok) {
      const jwks = await jwksRes.json();
      const jwk = Array.isArray(jwks?.keys) ? jwks.keys.find((k: any) => k.kid === header.kid) : null;
      if (jwk && crypto?.subtle) {
        const key = await crypto.subtle.importKey(
          'jwk',
          jwk,
          { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
          false,
          ['verify']
        );
        const sigBase64 = parts[2].replace(/-/g, '+').replace(/_/g, '/');
        const sigPadded = sigBase64.padEnd(sigBase64.length + ((4 - (sigBase64.length % 4)) % 4), '=');
        const sigBinary = atob(sigPadded);
        const sigBytes = new Uint8Array(sigBinary.length);
        for (let i = 0; i < sigBinary.length; i++) {
          sigBytes[i] = sigBinary.charCodeAt(i);
        }
        const dataBytes = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
        const isValidSig = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, sigBytes, dataBytes);
        return isValidSig;
      }
    }
  } catch {
    // If JWK endpoint is unreachable in restricted edge environment, refuse unverified signature
  }

  return false;
}

export async function middleware(req: NextRequest) {
  // 0. Enforce HTTPS across all traffic in production
  const proto = req.headers.get('x-forwarded-proto');
  if (process.env.NODE_ENV === 'production' && proto === 'http') {
    const httpsUrl = req.nextUrl.clone();
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl, 301);
  }

  const { pathname } = req.nextUrl;

  const isProtectedApi = PROTECTED_API_PREFIXES.some(prefix => pathname.startsWith(prefix));
  const isProtectedPage = PROTECTED_PAGE_PREFIXES.some(prefix => pathname.startsWith(prefix));

  // 1. If not a protected page or protected API, pass through
  if (!isProtectedApi && !isProtectedPage) {
    return NextResponse.next();
  }

  // 2. Public API allowlist & Claim Token APIs
  if (PUBLIC_API_ALLOWLIST.includes(pathname)) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  // Dossier reading and claiming endpoints validate their own cryptographic claim_token
  if (CLAIM_TOKEN_API_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  // 3. Extract Token from Authorization header or Cookie
  let token: string | null = null;
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  }

  if (!token) {
    const cookieToken = req.cookies.get('sc_cockpit_auth')?.value ||
                        req.cookies.get('sb-access-token')?.value ||
                        req.cookies.get('supabase-auth-token')?.value;
    if (cookieToken) {
      token = cookieToken.trim();
    }
  }

  let isAuthenticated = false;

  if (token) {
    // 3a. Check worker token or dev passkey first
    if (verifyDevOrWorkerToken(token)) {
      isAuthenticated = true;
    }

    // 3b. Check Firebase Auth ID token
    if (!isAuthenticated) {
      isAuthenticated = await verifyFirebaseToken(token, req);
    }

    // 3c. Check Supabase Auth JWT if still not authenticated
    if (!isAuthenticated && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const userRes = await fetch(`${cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)}/auth/v1/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
          },
        });
        if (userRes.ok) {
          isAuthenticated = true;
        }
      } catch {
        // Fall through
      }
    }
  }

  // 4. API Endpoints: Strictly reject unauthenticated requests
  if (isProtectedApi) {
    if (!isAuthenticated) {
      logSecurityEvent({
        type: 'UNAUTHORIZED_ACCESS',
        path: pathname,
        method: req.method,
        ip: req.headers.get('x-forwarded-for') || undefined,
        reason: 'Attempted access to protected API without valid credentials',
      });
      const errRes = NextResponse.json(
        { success: false, error: 'Unauthorized: Valid authentication token required.' },
        { status: 401 }
      );
      errRes.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return errRes;
    }
    const apiRes = NextResponse.next();
    apiRes.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return apiRes;
  }

  // 5. Protected Administrative / Partner Pages:
  // Render login gate if unauthenticated, but guarantee zero search engine indexing
  const pageRes = NextResponse.next();
  pageRes.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  return pageRes;
}

export const config = {
  matcher: ['/cockpit/:path*', '/portal/:path*', '/api/portal/:path*', '/api/cockpit/:path*'],
};
