'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getAllPosts } from '@/lib/blog'
import { withLang } from '@/lib/i18n'
import { useLang } from '@/hooks/use-lang'

export function BlogClient() {
  const lang = useLang()
  const posts = useMemo(() => getAllPosts(), [])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category)))
    return ['All', ...cats]
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCat = selectedCategory === 'All' || post.category === selectedCategory
      const matchSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchCat && matchSearch
    })
  }, [posts, selectedCategory, searchQuery])

  const featuredPost = posts[0]

  return (
    <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
      <Header />

      <main className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 lg:px-8">
        {/* Banner Section */}
        <div className="hiwaii-reveal mb-12 rounded-3xl border border-lime-300/20 bg-[linear-gradient(135deg,#0d1e40_0%,#0a1630_60%,#091429_100%)] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-lime-300/10 blur-3xl" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block rounded-full border border-lime-300/40 bg-lime-300/10 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-lime-300">
              9Shirt Journal & SEO Blog
            </span>
            <h1 className="text-4xl font-black md:text-5xl leading-tight">
              {lang === 'vi' ? 'Góc Thời Trang, Chất Liệu & Outfit Hè' : 'Fashion Journal & Travel Outfits'}
            </h1>
            <p className="text-base text-slate-300 font-semibold leading-relaxed">
              {lang === 'vi'
                ? 'Tổng hợp kiến thức về chất lụa Latin, công nghệ in 3D sắc nét, phong cách sơ mi cổ Cuban và cẩm nang chọn size áo Hawaii chuẩn phom dáng người Việt.'
                : 'Explore Latin silk fabrics, 3D sublimation print technology, Cuban collar styling, and sizing guides.'}
            </p>
          </div>
        </div>

        {/* Featured Post Card */}
        {featuredPost && selectedCategory === 'All' && !searchQuery && (
          <section className="mb-12">
            <div className="hiwaii-reveal group relative overflow-hidden rounded-3xl border border-[var(--hiwaii-border)] bg-[#0b1736] transition hover:border-lime-300/50 lg:grid lg:grid-cols-12">
              <div className="relative aspect-[16/10] w-full lg:col-span-7 lg:aspect-auto">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="p-8 lg:col-span-5 lg:flex lg:flex-col lg:justify-center lg:p-10 space-y-4">
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-wider text-lime-300">
                  <span>{featuredPost.category}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <h2 className="text-2xl font-black md:text-3xl text-white group-hover:text-lime-300 transition-colors">
                  <Link href={withLang(`/blog/${featuredPost.slug}`, lang)}>
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="text-sm font-medium text-slate-300 leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{featuredPost.date}</span>
                  <Link
                    href={withLang(`/blog/${featuredPost.slug}`, lang)}
                    className="inline-flex items-center text-xs font-black uppercase tracking-widest text-lime-300 hover:underline"
                  >
                    {lang === 'vi' ? 'Đọc bài viết →' : 'Read Article →'}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filter & Search Bar */}
        <div className="mb-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[var(--hiwaii-border)] pb-6">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition ${
                  selectedCategory === cat
                    ? 'bg-lime-300 text-[#061227]'
                    : 'border border-[var(--hiwaii-border)] bg-[#0c1a3b] text-slate-300 hover:border-lime-300/40 hover:text-white'
                }`}
              >
                {cat === 'All' ? (lang === 'vi' ? 'Tất cả bài viết' : 'All Posts') : cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'vi' ? 'Tìm bài viết...' : 'Search articles...'}
              className="w-full rounded-full border border-[var(--hiwaii-border)] bg-[#0a1632] px-4 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-lime-300"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--hiwaii-border)] bg-[#0a1736]/60 transition hover:border-lime-300/40 hover:bg-[#0c1c42]"
            >
              <Link href={withLang(`/blog/${post.slug}`, lang)} className="relative aspect-[16/10] w-full overflow-hidden bg-[#050e24]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </Link>
              <div className="p-6 flex flex-1 flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-black uppercase text-lime-300">
                    <span>{post.category}</span>
                    <span className="text-slate-400 font-semibold">{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-lime-300 transition-colors line-clamp-2">
                    <Link href={withLang(`/blog/${post.slug}`, lang)}>{post.title}</Link>
                  </h3>
                  <p className="text-xs font-medium text-slate-300 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>{post.date}</span>
                  <Link
                    href={withLang(`/blog/${post.slug}`, lang)}
                    className="text-lime-300 uppercase font-black tracking-wider hover:underline"
                  >
                    {lang === 'vi' ? 'Xem thêm →' : 'Read More →'}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
