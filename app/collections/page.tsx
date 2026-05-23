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

  const title =
    lang === 'vi'
      ? 'Hiwaii Lifestyle | Bộ sưu tập áo Hawaii theo phong cách'
      : 'Hiwaii Lifestyle | Unique Hawaiian Shirts Curated by Style'
  const description =
    lang === 'vi'
      ? 'Lọc theo niche Sports, Animal, Art & Music, Vintage để tìm mẫu áo Hawaii phù hợp phong cách của bạn.'
      : 'Explore Hiwaii lifestyle collections across Sports, Animal, Art & Music, and Vintage niches.'
  const socialPreview = buildSocialImageUrl({
    title: lang === 'vi' ? 'Bộ sưu tập áo Hawaii theo vibe' : 'Shop Hawaiian shirts by lifestyle',
    subtitle: lang === 'vi'
      ? 'Sports, Animal, Art & Music, Vintage - xem mẫu thật, chọn size nhanh.'
      : 'Sports, Animal, Art & Music, Vintage - scan bold designs fast.',
    lang,
  })

  return {
    title,
    description,
    keywords: lang === 'vi'
      ? ['bộ sưu tập áo Hawaii', 'áo Hawaii bóng đá', 'áo Hawaii animal', 'áo Hawaii vintage']
      : ['Hawaiian shirt collection', 'football Hawaiian shirt', 'animal Hawaiian shirt', 'vintage Hawaiian shirt'],
    alternates: {
      canonical: toCanonical('/collections', lang),
      languages: languageAlternates('/collections'),
    },
    openGraph: {
      title,
      description,
      url: toCanonical('/collections', lang),
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

export default function CollectionsPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hiwaii Collections',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://www.hiwaii.store/product/${product.id}`,
      name: product.name,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.hiwaii.store/' },
      { '@type': 'ListItem', position: 2, name: 'Collections', item: 'https://www.hiwaii.store/collections' },
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
