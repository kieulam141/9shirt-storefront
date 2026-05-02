import type { Metadata } from 'next'
import ProductClient from './ProductClient'
import { getProductById } from '@/lib/products'
import { getLangFromSearchParams, languageAlternates, PRIMARY_ORIGIN, toCanonical } from '@/lib/seo'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const { id } = await params
  const query = await searchParams
  const lang = getLangFromSearchParams(query)
  const product = getProductById(id)

  if (!product) {
    return {
      title: 'Product not found',
      description: 'This product is not available.',
    }
  }

  return {
    title: `${product.name} | Hiwaii`,
    description: product.description,
    alternates: {
      canonical: toCanonical(`/product/${product.id}`, lang),
      languages: languageAlternates(`/product/${product.id}`),
    },
    openGraph: {
      title: `${product.name} | Hiwaii`,
      description: product.description,
      type: 'website',
      url: toCanonical(`/product/${product.id}`, lang),
      locale: lang === 'vi' ? 'vi_VN' : 'en_US',
      images: [{ url: product.thumbnail, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Hiwaii`,
      description: product.description,
      images: [product.thumbnail],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = getProductById(id)

  const productJsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description,
        sku: product.specifications.find((spec) => spec.label === 'SKU / Type code')?.value || product.id,
        brand: { '@type': 'Brand', name: 'Hiwaii' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: product.price.toFixed(2),
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
