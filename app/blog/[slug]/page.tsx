import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { BlogPostClient } from './BlogPostClient'
import { getPostBySlug } from '@/lib/blog'
import { buildSocialImageUrl, getBrandConfig, getDefaultLangForHost, getOrigin, languageAlternates, socialImage, toCanonical } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const host = (await headers()).get('host')
  const brand = getBrandConfig(host)
  const lang = getDefaultLangForHost(host)
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: lang === 'vi' ? 'Không tìm thấy bài viết' : 'Post not found',
      description: 'Bài viết này hiện không khả dụng.',
    }
  }

  const title = post.title
  const description = post.excerpt
  const socialPreview = buildSocialImageUrl({
    title: post.title,
    subtitle: post.excerpt,
    image: post.image,
    lang,
    host,
  })

  return {
    title,
    description,
    keywords: post.keywords,
    alternates: {
      canonical: toCanonical(`/blog/${post.slug}`, lang, host),
      languages: languageAlternates(`/blog/${post.slug}`, host),
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: toCanonical(`/blog/${post.slug}`, lang, host),
      locale: lang === 'vi' ? 'vi_VN' : 'en_US',
      images: [socialImage(socialPreview, post.title)],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialPreview],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const host = (await headers()).get('host')
  const brand = getBrandConfig(host)
  const origin = getOrigin(host)
  const post = getPostBySlug(slug)

  const articleJsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.image,
        datePublished: post.date,
        author: {
          '@type': 'Organization',
          name: brand.name,
        },
        publisher: {
          '@type': 'Organization',
          name: brand.companyName,
          logo: {
            '@type': 'ImageObject',
            url: `${origin}/icon-512x512.png`,
          },
        },
        mainEntityOfPage: `${origin}/blog/${post.slug}`,
      }
    : null

  const breadcrumbJsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${origin}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: `${origin}/blog/${post.slug}` },
        ],
      }
    : null

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <BlogPostClient slug={slug} />
    </>
  )
}
