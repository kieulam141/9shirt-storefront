import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { CartClient } from './CartClient'
import { getBrandConfig, getDefaultLangForHost, languageAlternates, toCanonical } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host')
  const brand = getBrandConfig(host)
  const lang = getDefaultLangForHost(host)
  const title = lang === 'vi' ? `Giỏ hàng | ${brand.name}` : `Cart | ${brand.name}`

  return {
    title,
    description: brand.defaultDescription,
    alternates: {
      canonical: toCanonical('/cart', lang, host),
      languages: languageAlternates('/cart', host),
    },
  }
}

export default function CartPage() {
  return <CartClient />
}
