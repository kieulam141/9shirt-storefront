import type { Metadata } from 'next'
import { headers } from 'next/headers'
import ProductClient from './ProductClient'
import { getProductById } from '@/lib/products'
import { formatPrice, structuredPrice } from '@/lib/pricing'
import { buildSocialImageUrl, getLangFromSearchParams, languageAlternates, PRIMARY_ORIGIN, socialImage, toCanonical } from '@/lib/seo'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const { id } = await params
  const query = await searchParams
  const lang = getLangFromSearchParams(query, (await headers()).get('host'))
  const product = getProductById(id)

  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm',
      description: 'Sản phẩm này hiện không khả dụng.',
    }
  }
  const socialPreview = buildSocialImageUrl({
    title: product.name,
    subtitle: product.hook,
    image: product.thumbnail,
    price: formatPrice(product.price),
    lang,
  })

  return {
    title: `${product.name} | 9shirt`,
    description: product.description,
    keywords: [
      product.name,
      product.niche,
      product.subNiche,
      product.productType,
      '9shirt',
      'Hawaiian shirt',
      'áo Hawaii',
    ],
    alternates: {
      canonical: toCanonical(`/product/${product.id}`, lang),
      languages: languageAlternates(`/product/${product.id}`),
    },
    openGraph: {
      title: `${product.name} | 9shirt`,
      description: product.description,
      type: 'website',
      url: toCanonical(`/product/${product.id}`, lang),
      locale: 'vi_VN',
      images: [socialImage(socialPreview, product.name)],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | 9shirt`,
      description: product.description,
      images: [socialPreview],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = getProductById(id)
  const offerPrice = product ? structuredPrice(product.price) : null

  const productJsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description,
        sku: product.specifications.find((spec) => spec.label === 'SKU / Type code')?.value || product.id,
        brand: { '@type': 'Brand', name: '9shirt' },
        offers: {
          '@type': 'Offer',
          priceCurrency: offerPrice?.priceCurrency,
          price: offerPrice?.price,
          availability: 'https://schema.org/InStock',
          url: `${PRIMARY_ORIGIN}/product/${product.id}`,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '124',
        },
      }
    : null

  return (
    <>
      {productJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      ) : null}
      <ProductClient id={id} />
    </>
  )
}
