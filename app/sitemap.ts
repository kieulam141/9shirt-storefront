import type { MetadataRoute } from 'next'
import { products } from '@/lib/products'
import { PRIMARY_ORIGIN } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const coreRoutes: MetadataRoute.Sitemap = ['/', '/collections'].flatMap((route) => ([
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

  const productRoutes: MetadataRoute.Sitemap = products.flatMap((product) => ([
    {
      url: `${PRIMARY_ORIGIN}/product/${product.id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${PRIMARY_ORIGIN}/product/${product.id}?lang=vi`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.65,
    },
  ]))

  return [...coreRoutes, ...productRoutes]
}
