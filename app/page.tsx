import type { Metadata } from 'next'
import HomeClient from './HomeClient'
import { getLangFromSearchParams, languageAlternates, toCanonical } from '@/lib/seo'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const params = await searchParams
  const lang = getLangFromSearchParams(params)
  const title =
    lang === 'vi'
      ? 'Hiwaii Shop | Áo Hawaii statement theo phong cách sống'
      : 'Hiwaii Shop | Statement Hawaiian Shirts by Lifestyle'
  const description =
    lang === 'vi'
      ? 'Khám phá áo Hawaii độc đáo theo từng phong cách sống. Mua nhanh theo ngách Animal, Art & Music, Vintage.'
      : 'Discover unique Hawaiian shirts categorized by lifestyle. Shop niche prints for Animal lovers, Art & Music fans, and Vintage enthusiasts.'

  return {
    title,
    description,
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default function HomePage() {
  return <HomeClient />
}

