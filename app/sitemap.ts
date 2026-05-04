import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://settlementcheck.co.uk'
  const now = new Date()

  return [
    { url: `${base}/`,                                              lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/how-it-works/`,                                lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/for-solicitors/`,                              lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/employer-recommended-solicitor/`,       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/privacy/`,                                     lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${base}/terms/`,                                       lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${base}/disclaimer/`,                                  lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
  ]
}
