import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/results/', '/portal/', '/cockpit/', '/dossier/', '/api/'],
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
          'Meta-ExternalAgent',
          'Amazonbot',
          'Bytespider',
          'DuckAssistBot',
        ],
        allow: '/',
        disallow: ['/results/', '/portal/', '/cockpit/', '/dossier/', '/api/'],
      },
    ],
    sitemap: 'https://settlementcheck.co.uk/sitemap.xml',
  }
}
