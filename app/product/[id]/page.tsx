import type { Metadata } from 'next'
import { headers } from 'next/headers'
import ProductClient from './ProductClient'
import { getProductById } from '@/lib/products'
import { formatPrice, structuredPrice } from '@/lib/pricing'
import { buildSocialImageUrl, getBrandConfig, getLangFromSearchParams, getOrigin, languageAlternates, socialImage, toCanonical } from '@/lib/seo'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const { id } = await params
  const query = await searchParams
  const host = (await headers()).get('host')
  const brand = getBrandConfig(host)
  const lang = getLangFromSearchParams(query, host)
  const product = getProductById(id)

  if (!product) {
    return {
      title: lang === 'vi' ? 'Không tìm thấy sản phẩm' : 'Product not found',
      description: lang === 'vi' ? 'Sản phẩm này hiện không khả dụng.' : 'This product is not available.',
    }
  }

  const socialPreview = buildSocialImageUrl({
    title: product.name,
    subtitle: product.hook,
    image: product.thumbnail,
    price: formatPrice(product.price),
    lang,
    host,
  })

  return {
    title: product.name,
    description: product.description,
    keywords: [
      product.name,
      product.niche,
      product.subNiche,
      product.productType,
      brand.name,
      'Hawaiian shirt',
      'áo Hawaii',
    ],
    alternates: {
      canonical: toCanonical(`/product/${product.id}`, lang, host),
      languages: languageAlternates(`/product/${product.id}`, host),
    },
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      url: toCanonical(`/product/${product.id}`, lang, host),
      locale: lang === 'vi' ? 'vi_VN' : 'en_US',
      images: [socialImage(socialPreview, product.name)],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [socialPreview],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const host = (await headers()).get('host')
  const brand = getBrandConfig(host)
  const origin = getOrigin(host)
  const product = getProductById(id)
  const offerPrice = product ? structuredPrice(product.price) : null

  const productJsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description,
        sku: product.specifications.find((spec: { label: string; value: string }) => spec.label === 'SKU / Type code')?.value || product.id,
        brand: { '@type': 'Brand', name: brand.name },
        offers: {
          '@type': 'Offer',
          priceCurrency: offerPrice?.priceCurrency,
          price: offerPrice?.price,
          availability: 'https://schema.org/InStock',
          url: `${origin}/product/${product.id}`,
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
