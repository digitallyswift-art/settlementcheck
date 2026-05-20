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
        destination: '/calculator',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
