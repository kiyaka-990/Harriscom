import type { MetadataRoute } from 'next'

import { company, services } from '@/lib/site'

/**
 * Replaces the old static public/sitemap.xml, which listed only "/" because
 * /about, /services and /contact were anchors on a single page and 404'd.
 * They are real routes now, so they belong in the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const routes: MetadataRoute.Sitemap = [
    { url: company.url, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${company.url}/services`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${company.url}/projects`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${company.url}/about`, lastModified, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${company.url}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.9 },
    { url: `${company.url}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
  ]

  return [
    ...routes,
    ...services.map((service) => ({
      url: `${company.url}/services/${service.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
