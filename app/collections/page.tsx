import type { Metadata } from 'next'
import { headers } from 'next/headers'
import CollectionsClient from './CollectionsClient'
import { buildSocialImageUrl, getLangFromSearchParams, languageAlternates, socialImage, toCanonical } from '@/lib/seo'
import { products } from '@/lib/products'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const params = await searchParams
  const lang = getLangFromSearchParams(params, (await headers()).get('host'))

  const title = '9shirt | Mua theo phong cách'
  const description = 'Lọc theo niche và phong cách để tìm áo Hawaii 9shirt phù hợp gu mặc.'
  const socialPreview = buildSocialImageUrl({
    title: 'Phong cách 9shirt',
    subtitle: 'Chọn niche, xem sản phẩm thật và đặt outfit hè theo gu.',
    lang,
  })

  return {
    title,
    description,
    keywords: ['9shirt', 'phong cách áo Hawaii', 'áo đi biển', 'áo họa tiết', 'áo Hawaii theo gu'],
    alternates: {
      canonical: toCanonical('/collections', lang),
      languages: languageAlternates('/collections'),
    },
    openGraph: {
      title,
      description,
      url: toCanonical('/collections', lang),
      locale: 'vi_VN',
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

export default function CollectionsPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '9shirt Collections',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: toCanonical(`/product/${product.id}`, 'vi'),
      name: product.name,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: toCanonical('/', 'vi') },
      { '@type': 'ListItem', position: 2, name: 'Phong cách', item: toCanonical('/collections', 'vi') },
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
