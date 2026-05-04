import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/results/'],
      },
    ],
    sitemap: 'https://settlementcheck.co.uk/sitemap.xml',
  }
}
