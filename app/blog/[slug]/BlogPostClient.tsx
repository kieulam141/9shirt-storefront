'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { getPostBySlug, getRelatedPosts } from '@/lib/blog'
import { getProductById } from '@/lib/products'
import { withLang } from '@/lib/i18n'
import { useLang } from '@/hooks/use-lang'

export function BlogPostClient({ slug }: { slug: string }) {
  const lang = useLang()
  const post = getPostBySlug(slug)
  const relatedPosts = getRelatedPosts(slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-4xl font-black">{lang === 'vi' ? 'Không tìm thấy bài viết' : 'Post not found'}</h1>
          <Link
            href={withLang('/blog', lang)}
            className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[var(--hiwaii-border)] px-6 text-sm font-black uppercase tracking-[0.14em]"
          >
            {lang === 'vi' ? 'Quay lại danh sách Blog' : 'Back to Blog'}
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const featuredProducts = (post.featuredProductIds || [])
    .map((id) => getProductById(id))
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400">
          <Link href={withLang('/', lang)} className="hover:text-lime-300">
            {lang === 'vi' ? 'Trang chủ' : 'Home'}
          </Link>
          <span>/</span>
          <Link href={withLang('/blog', lang)} className="hover:text-lime-300">
            Blog
          </Link>
          <span>/</span>
          <span className="text-slate-200 truncate max-w-[200px] sm:max-w-none">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="hiwaii-reveal space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-wider text-lime-300">
            <span className="rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-1">
              {post.category}
            </span>
            <span>•</span>
            <span>{post.readTime}</span>
            <span>•</span>
            <span className="text-slate-400">{post.date}</span>
          </div>

          <h1 className="text-3xl font-black sm:text-4xl md:text-5xl leading-tight text-white">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg font-semibold text-slate-300 leading-relaxed italic border-l-4 border-lime-300 pl-4 py-1 bg-slate-900/40 rounded-r-xl">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <div className="h-10 w-10 rounded-full bg-lime-300/20 border border-lime-300/40 flex items-center justify-center font-black text-lime-300 text-sm">
              9S
            </div>
            <div>
              <p className="text-xs font-black text-white">{post.author}</p>
              <p className="text-[11px] font-semibold text-slate-400">Chuyên gia Thời Trang & Chất Liệu 9Shirt</p>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="my-8 relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-[var(--hiwaii-border)] bg-[#07132d]">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 896px" />
        </div>

        {/* HTML Article Body */}
        <article
          className="prose prose-invert max-w-none prose-headings:font-black prose-headings:text-lime-300 prose-p:text-slate-200 prose-p:leading-relaxed prose-li:text-slate-200 prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Featured Products Showcase Box */}
        {featuredProducts.length > 0 && (
          <section className="my-12 rounded-3xl border border-lime-300/30 bg-[linear-gradient(145deg,#0e1e44_0%,#091531_60%,#071126_100%)] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-lime-300">
                  {lang === 'vi' ? 'Gợi Ý Outfit Từ Bài Viết' : 'Featured Products in Article'}
                </span>
                <h3 className="text-2xl font-black text-white">
                  {lang === 'vi' ? 'Sản phẩm 9Shirt nhắc tới trong bài' : 'Shop Featured Shirts'}
                </h3>
              </div>
              <Link
                href={withLang('/collections', lang)}
                className="inline-flex items-center text-xs font-black uppercase tracking-wider text-lime-300 hover:underline"
              >
                {lang === 'vi' ? 'Xem toàn bộ 9shirt →' : 'View All Products →'}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredProducts.map((product) => (
                product ? <ProductCard key={product.id} product={product} /> : null
              ))}
            </div>
          </section>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-[var(--hiwaii-border)] pt-12 space-y-8">
            <h3 className="text-2xl font-black text-white">
              {lang === 'vi' ? 'Bài viết liên quan khác' : 'Related Articles'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <div key={rPost.slug} className="group rounded-2xl border border-[var(--hiwaii-border)] bg-[#0a1736]/40 p-4 space-y-3 transition hover:border-lime-300/40">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#061026]">
                    <Image src={rPost.image} alt={rPost.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="280px" />
                  </div>
                  <div className="text-[11px] font-black uppercase text-lime-300">{rPost.category}</div>
                  <h4 className="text-sm font-black text-white line-clamp-2 group-hover:text-lime-300 transition-colors">
                    <Link href={withLang(`/blog/${rPost.slug}`, lang)}>{rPost.title}</Link>
                  </h4>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
