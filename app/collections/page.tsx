import type { Metadata } from 'next'
import { headers } from 'next/headers'
import CollectionsClient from './CollectionsClient'
import { buildSocialImageUrl, getBrandConfig, getLangFromSearchParams, getOrigin, languageAlternates, socialImage, toCanonical } from '@/lib/seo'
import { products } from '@/lib/products'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const params = await searchParams
  const host = (await headers()).get('host')
  const brand = getBrandConfig(host)
  const lang = getLangFromSearchParams(params, host)

  const title = lang === 'vi' ? 'Mua theo phong cách' : 'Shop by Style'
  const description =
    lang === 'vi'
      ? `Lọc theo niche và phong cách để tìm áo Hawaii ${brand.name} phù hợp gu mặc.`
      : `Explore ${brand.name} lifestyle collections across Sports, Animal, Art & Music, and Vintage niches.`
  const socialPreview = buildSocialImageUrl({
    title: lang === 'vi' ? 'Bộ sưu tập áo Hawaii theo vibe' : 'Shop Hawaiian shirts by lifestyle',
    subtitle: lang === 'vi'
      ? 'Sports, Animal, Art & Music, Vintage - xem mẫu thật, chọn size nhanh.'
      : 'Sports, Animal, Art & Music, Vintage - scan bold designs fast.',
    lang,
    host,
  })

  return {
    title,
    description,
    keywords: lang === 'vi'
      ? ['bộ sưu tập áo Hawaii', 'áo Hawaii bóng đá', 'áo Hawaii animal', 'áo Hawaii vintage']
      : ['Hawaiian shirt collection', 'football Hawaiian shirt', 'animal Hawaiian shirt', 'vintage Hawaiian shirt'],
    alternates: {
      canonical: toCanonical('/collections', lang, host),
      languages: languageAlternates('/collections', host),
    },
    openGraph: {
      title,
      description,
      url: toCanonical('/collections', lang, host),
      locale: lang === 'vi' ? 'vi_VN' : 'en_US',
      type: 'website',
      images: [socialImage(socialPreview, title)],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialPreview],
    },
  }
}

export default async function CollectionsPage() {
  const requestHeaders = await headers()
  const host = requestHeaders.get('host')
  const brand = getBrandConfig(host)
  const origin = getOrigin(host)

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${brand.name} Collections`,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${origin}/product/${product.id}`,
      name: product.name,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
      { '@type': 'ListItem', position: 2, name: 'Collections', item: `${origin}/collections` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CollectionsClient />
    </>
  )
}
