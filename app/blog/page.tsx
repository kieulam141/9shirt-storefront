import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { BlogClient } from './BlogClient'
import { getAllPosts } from '@/lib/blog'
import { getBrandConfig, getDefaultLangForHost, getOrigin, languageAlternates, toCanonical } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host')
  const brand = getBrandConfig(host)
  const lang = getDefaultLangForHost(host)

  const title = lang === 'vi' ? 'Blog & Cẩm nang Áo Hawaii' : 'Blog & Styling Guides'
  const description =
    lang === 'vi'
      ? 'Tổng hợp bài viết kinh nghiệm về chất lụa Latin, công nghệ in 3D sắc nét, phong cách cổ Cuban và cách chọn size áo Hawaii 9shirt chuẩn nhất.'
      : 'Explore Hawaiian shirt guides, Latin silk fabric breakdown, 3D printing technology, and Cuban collar styling tips.'

  return {
    title,
    description,
    keywords: [
      'blog áo hawaii',
      'chất lụa latin là gì',
      'in chuyển nhiệt 3d',
      'áo cổ cuban',
      'bảng size áo hawaii',
      'phối đồ áo đi biển nam',
      brand.name,
    ],
    alternates: {
      canonical: toCanonical('/blog', lang, host),
      languages: languageAlternates('/blog', host),
    },
    openGraph: {
      title,
      description,
      url: toCanonical('/blog', lang, host),
      type: 'website',
    },
  }
}

export default async function BlogPage() {
  const requestHeaders = await headers()
  const host = requestHeaders.get('host')
  const brand = getBrandConfig(host)
  const origin = getOrigin(host)
  const posts = getAllPosts()

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${brand.name} Blog & Guides`,
    description: 'Chuyên mục bài viết thời trang, chất liệu lụa Latin và phong cách áo Hawaii du lịch.',
    url: `${origin}/blog`,
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `${origin}/blog/${post.slug}`,
      datePublished: post.date,
      image: post.image,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <BlogClient />
    </>
  )
}
