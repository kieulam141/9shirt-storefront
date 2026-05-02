import type { MetadataRoute } from 'next'
import { PRIMARY_HOST, PRIMARY_ORIGIN } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${PRIMARY_ORIGIN}/sitemap.xml`,
    host: PRIMARY_HOST,
  }
}
