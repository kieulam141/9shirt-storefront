import type { MetadataRoute } from 'next'
import { PRIMARY_ORIGIN } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const coreRoutes: MetadataRoute.Sitemap = ['/', '/contact'].flatMap((route) => ([
    {
      url: `${PRIMARY_ORIGIN}${route}`,
      lastModified: now,
      changeFrequency: route === '/' ? 'daily' : 'weekly',
      priority: route === '/' ? 1 : 0.8,
    },
    {
      url: `${PRIMARY_ORIGIN}${route}?lang=vi`,
      lastModified: now,
      changeFrequency: route === '/' ? 'daily' : 'weekly',
      priority: route === '/' ? 0.95 : 0.75,
    },
  ]))

  return coreRoutes
}
