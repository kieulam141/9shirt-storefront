import type { MetadataRoute } from 'next'
import { products } from '@/lib/products'
import { BLOG_POSTS } from '@/lib/blog'
import { PRIMARY_ORIGIN } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const coreRoutes: MetadataRoute.Sitemap = ['/', '/collections', '/blog', '/contact', '/shipping-policy', '/return-policy'].flatMap((route) => ([
    {
      url: `${PRIMARY_ORIGIN}${route}`,
      lastModified: now,
      changeFrequency: route === '/' ? 'daily' : 'weekly',
      priority: route === '/' ? 1 : (route === '/blog' ? 0.85 : 0.8),
    },
    {
      url: `${PRIMARY_ORIGIN}${route}?lang=vi`,
      lastModified: now,
      changeFrequency: route === '/' ? 'daily' : 'weekly',
      priority: route === '/' ? 0.95 : (route === '/blog' ? 0.8 : 0.75),
    },
  ]))

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.flatMap((post) => ([
    {
      url: `${PRIMARY_ORIGIN}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${PRIMARY_ORIGIN}/blog/${post.slug}?lang=vi`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
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

  return [...coreRoutes, ...blogRoutes, ...productRoutes]
}
