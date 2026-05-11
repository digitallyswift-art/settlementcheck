/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  async redirects() {
    return [
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
