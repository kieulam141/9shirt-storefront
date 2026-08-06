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
  const title = '9shirt | Áo Hawaii cá tính'
  const description = '9shirt bán áo Hawaii, quần short và outfit hè cá tính. Sản phẩm của CÔNG TY TNHH 9FASHION.'
  const socialPreview = buildSocialImageUrl({
    title: '9shirt áo Hawaii cá tính',
    subtitle: 'Áo Hawaii cá tính, quần short và outfit hè nổi bật.',
    lang,
  })

  return {
    title,
    description,
    keywords: ['9shirt', 'áo Hawaii', 'áo đi biển', 'áo họa tiết', 'áo du lịch', 'quần short'],
    alternates: {
      canonical: toCanonical('/', lang),
      languages: languageAlternates('/'),
    },
    openGraph: {
      title,
      description,
      url: toCanonical('/', lang),
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

export default function HomePage() {
  return <HomeClient />
}
