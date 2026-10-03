import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/results/'],
      },
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
          'Applebot-Extended',
          'cohere-ai',
        ],
        allow: '/',
        disallow: ['/results/'],
      },
    ],
    sitemap: 'https://settlementcheck.co.uk/sitemap.xml',
  }
}
