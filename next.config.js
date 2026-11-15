/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  async redirects() {
    return [
      // Canonical domain enforcement: www → non-www (301)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.settlementcheck.co.uk' }],
        destination: 'https://settlementcheck.co.uk/:path*',
        permanent: true,
      },
      // /#calculator anchor links (from old CTAs, backlinks, bookmarks)
      {
        source: '/',
        has: [{ type: 'query', key: 'anchor', value: 'calculator' }],
        destination: '/calculator/',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.google-analytics.com https://va.vercel-scripts.com https://identitytoolkit.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com https://images.unsplash.com",
              "connect-src 'self' https://*.supabase.co https://api.postcodes.io https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://va.vercel-scripts.com",
              "frame-src 'self' https://www.googletagmanager.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
