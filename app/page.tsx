import type { Metadata } from 'next'
import { headers } from 'next/headers'
import HomeClient from './HomeClient'
import { buildSocialImageUrl, getLangFromSearchParams, languageAlternates, socialImage, toCanonical } from '@/lib/seo'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const params = await searchParams
  const lang = getLangFromSearchParams(params, (await headers()).get('host'))
  const title =
    lang === 'vi'
      ? 'Hiwaii Shop | Áo Hawaii statement theo phong cách sống'
      : 'Hiwaii Shop | Statement Hawaiian Shirts by Lifestyle'
  const description =
    lang === 'vi'
      ? 'Khám phá áo Hawaii độc đáo theo từng phong cách sống. Mua nhanh theo ngách Sports, Animal, Art & Music, Vintage.'
      : 'Discover unique Hawaiian shirts categorized by lifestyle. Shop niche prints for Sports fans, Animal lovers, Art & Music fans, and Vintage enthusiasts.'
  const socialPreview = buildSocialImageUrl({
    title: lang === 'vi' ? 'Áo Hawaii nổi bật cho mùa mới' : 'Statement Hawaiian shirts',
    subtitle: lang === 'vi'
      ? 'Mẫu bóng đá, animal, art và vintage với hình sản phẩm bắt mắt.'
      : 'Football, animal, art, and vintage drops with high-impact product visuals.',
    lang,
  })

  return {
    title,
    description,
    keywords: lang === 'vi'
      ? ['áo Hawaii', 'áo đi biển', 'áo bóng đá CR7', 'áo họa tiết', 'Hiwaii']
      : ['Hawaiian shirts', 'CR7 shirt', 'football Hawaiian shirt', 'summer shirt', 'Hiwaii'],
    alternates: {
      canonical: toCanonical('/', lang),
      languages: languageAlternates('/'),
    },
    openGraph: {
      title,
      description,
      url: toCanonical('/', lang),
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

export default function HomePage() {
  return <HomeClient />
}
