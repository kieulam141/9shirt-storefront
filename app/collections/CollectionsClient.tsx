'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { i18n, withLang } from '@/lib/i18n'
import { bundleOffers, bundleTypeGroups, niches, products } from '@/lib/products'
import { useLang } from '@/hooks/use-lang'

type SortMode = 'popular' | 'price_low' | 'price_high'

const NICHE_ICONS: Record<string, string> = {
  Animal: '🐾',
  'Art & Music': '🎵',
  Vintage: '🕰️',
}

export default function CollectionsClient() {
  const lang = useLang()
  const t = i18n[lang].collections
  const [activeNiche, setActiveNiche] = useState<string>('all')
  const [activeSubNiche, setActiveSubNiche] = useState<string>('all')
  const [sortMode, setSortMode] = useState<SortMode>('popular')
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const niche = params.get('niche')
    if (niche) setActiveNiche(niche)
  }, [])

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeNiche !== 'all') list = list.filter((item) => item.niche === activeNiche)
    if (activeSubNiche !== 'all') list = list.filter((item) => item.subNiche === activeSubNiche)
    if (keyword.trim().length > 0) {
      const q = keyword.trim().toLowerCase()
      list = list.filter((item) => item.name.toLowerCase().includes(q) || item.hook.toLowerCase().includes(q) || item.subNiche.toLowerCase().includes(q))
    }
    if (sortMode === 'price_low') list.sort((a, b) => a.price - b.price)
    if (sortMode === 'price_high') list.sort((a, b) => b.price - a.price)
    if (sortMode === 'popular') list.sort((a, b) => (a.badge === 'Best seller' ? -1 : 1) - (b.badge === 'Best seller' ? -1 : 1))
    return list
  }, [activeNiche, activeSubNiche, keyword, sortMode])

  const topNiche = filtered.slice(0, 2)
  const previewArt = filtered[0] || products[0]

  const nicheCounts = useMemo(() => {
    const map: Record<string, number> = { all: products.length }
    for (const p of products) {
      map[p.niche] = (map[p.niche] || 0) + 1
    }
    return map
  }, [])

  return (
    <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
      <Header />
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px]">
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--hiwaii-border)] bg-[linear-gradient(135deg,#0f2048_0%,#0b1837_50%,#09142f_100%)] p-8 lg:p-12">
            {/* decorative orb */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--hiwaii-accent)]/6 blur-[80px]" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-16 left-1/4 h-48 w-48 rounded-full bg-blue-500/8 blur-[60px]" aria-hidden="true" />
            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--hiwaii-accent)]">{t.title}</p>
              <h1 className="mt-3 max-w-2xl text-5xl font-black leading-[0.94] text-[var(--hiwaii-text-primary)] lg:text-6xl">{t.title}</h1>
              <p className="mt-4 max-w-lg text-base font-semibold text-[var(--hiwaii-text-secondary)]">{t.subtitle}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--hiwaii-accent)]/30 bg-[var(--hiwaii-accent)]/8 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--hiwaii-accent)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--hiwaii-accent)]" />
                  {products.length} {lang === 'vi' ? 'thiết kế' : 'designs'}
                </span>
                <span className="inline-flex items-center rounded-full border border-[var(--hiwaii-border)] bg-[#0a1632] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--hiwaii-text-secondary)]">
                  {lang === 'vi' ? 'Lọc theo nghệ thuật' : 'Filter by artwork'}
                </span>
                <span className="inline-flex items-center rounded-full border border-[var(--hiwaii-border)] bg-[#0a1632] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--hiwaii-text-secondary)]">
                  {lang === 'vi' ? 'Chọn style áo ở PDP' : 'Choose shirt kind on PDP'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <section className="mx-auto mt-8 max-w-[1360px] rounded-2xl border border-[var(--hiwaii-border)] p-6 hiwaii-glass">
          <div className="grid items-center gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hiwaii-accent)]">
                {lang === 'vi' ? 'Build from art' : 'Build from art'}
              </p>
              <h2 className="mt-2 text-3xl font-black leading-[0.96]">
                {lang === 'vi' ? 'Lọc artwork trước, dựng mockup sau' : 'Filter artwork first, generate mockup second'}
              </h2>
              <p className="mt-3 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                {lang === 'vi' ? 'Chọn niche và sub-niche ở bên trái. Khi đã đúng vibe, mở product studio để đổi kiểu áo, chất liệu và xem clip try-on.' : 'Use niche and sub-niche filters first. Once the vibe matches, open product studio to switch shirt type, material, and watch try-on clips.'}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={withLang(`/product/${previewArt.id}`, lang)} className="inline-flex min-h-11 items-center rounded-full bg-[var(--hiwaii-accent)] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#071425] transition hover:brightness-105">
                  {lang === 'vi' ? 'Mở mockup studio' : 'Open mockup studio'}
                </Link>
                <span className="inline-flex min-h-11 items-center rounded-full border border-[var(--hiwaii-border)] px-5 text-xs font-black uppercase tracking-[0.14em] text-[var(--hiwaii-text-secondary)]">
                  {lang === 'vi' ? 'Bước 3: xem try-on' : 'Step 3: watch try-on'}
                </span>
              </div>
            </div>
            <article className="hiwaii-metal-border rounded-2xl p-4">
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl">
                <Image src={previewArt.thumbnail} alt={previewArt.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black">{previewArt.name}</p>
                  <p className="text-xs font-semibold text-[var(--hiwaii-text-secondary)]">{previewArt.niche} / {previewArt.subNiche}</p>
                </div>
                <p className="text-lg font-black text-[var(--hiwaii-accent)]">${previewArt.price.toFixed(2)}</p>
              </div>
            </article>
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-[1360px] rounded-2xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hiwaii-accent)]">{t.bundleTitle}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{t.bundleSubtitle}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {bundleTypeGroups.map((group) => (
              <article key={group.type} className="rounded-xl border border-[var(--hiwaii-border)] bg-[#0b1736] p-4">
                <h3 className="text-lg font-black text-[var(--hiwaii-text-primary)]">{group.label}</h3>
                <p className="mt-1 min-h-10 text-xs font-semibold text-[var(--hiwaii-text-secondary)]">{group.description}</p>
                <p className="mt-2 text-sm font-black text-[var(--hiwaii-accent)]">{lang === 'vi' ? 'Từ' : 'From'} ${group.fromPrice.toFixed(2)}</p>
                <p className="mt-2 text-xs font-semibold text-[var(--hiwaii-text-muted)]">{group.bundleHint}</p>
              </article>
            ))}
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-[var(--hiwaii-accent)]">{t.bundleOfferTitle}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
              {bundleOffers.map((offer) => {
                const savings = Math.round(((offer.compareAtPrice - offer.bundlePrice) / offer.compareAtPrice) * 100)
                return (
                  <article key={offer.id} className="relative rounded-xl border border-[var(--hiwaii-border)] bg-[#09142f] p-4 transition hover:border-[var(--hiwaii-accent)]">
                    <div className="absolute right-4 top-4 rounded-full bg-[var(--hiwaii-accent)] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#071425]">
                      -{savings}%
                    </div>
                    <h4 className="text-sm font-black text-[var(--hiwaii-text-primary)]">{offer.title}</h4>
                    <p className="mt-1 text-xs font-semibold text-[var(--hiwaii-text-secondary)]">{offer.types.join(' + ')}</p>
                    <div className="mt-3 flex items-end gap-2">
                      <span className="text-2xl font-black text-[var(--hiwaii-accent)]">${offer.bundlePrice.toFixed(2)}</span>
                      <span className="text-xs font-semibold text-[var(--hiwaii-text-muted)] line-through">${offer.compareAtPrice.toFixed(2)}</span>
                    </div>
                    <Link
                      href={withLang('/collections?niche=Animal', lang)}
                      className="mt-3 inline-flex min-h-11 items-center rounded-full border border-[var(--hiwaii-border)] px-4 text-xs font-black uppercase tracking-[0.14em] text-[var(--hiwaii-text-primary)] transition hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]"
                    >
                      {t.bundleCta}
                    </Link>
                  </article>
                )
              })}
          </div>
        </section>

        <div className="mx-auto mt-8 grid max-w-[1360px] gap-8 lg:grid-cols-[290px_1fr]">
          <aside className="h-fit rounded-2xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-5 lg:sticky lg:top-24">
            <h2 className="text-sm font-black uppercase tracking-[0.15em] text-[var(--hiwaii-accent)]">Lifestyle tree</h2>
            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setActiveNiche('all')
                  setActiveSubNiche('all')
                }}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm font-bold transition ${activeNiche === 'all' ? 'border-[var(--hiwaii-accent)] bg-[var(--hiwaii-accent-soft)] text-[var(--hiwaii-text-primary)]' : 'border-[var(--hiwaii-border)] text-[var(--hiwaii-text-secondary)] hover:text-[var(--hiwaii-text-primary)]'}`}
              >
                <span>{t.allNiches}</span>
                <span className="rounded-full bg-[#0a1632] px-2 py-0.5 text-[10px] font-black text-[var(--hiwaii-text-muted)]">{nicheCounts.all}</span>
              </button>
              {niches.map((niche) => (
                <div key={niche.label} className="rounded-xl border border-[var(--hiwaii-border)] p-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNiche(niche.label)
                      setActiveSubNiche('all')
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-bold transition ${activeNiche === niche.label ? 'bg-[var(--hiwaii-accent-soft)] text-[var(--hiwaii-text-primary)]' : 'text-[var(--hiwaii-text-secondary)] hover:text-[var(--hiwaii-text-primary)]'}`}
                  >
                    <span>{NICHE_ICONS[niche.label] ?? '🎨'} {niche.label}</span>
                    <span className="rounded-full bg-[#0a1632] px-2 py-0.5 text-[10px] font-black text-[var(--hiwaii-text-muted)]">{nicheCounts[niche.label] ?? 0}</span>
                  </button>
                  <div className="mt-2 space-y-1">
                    {niche.subNiches.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => {
                          setActiveNiche(niche.label)
                          setActiveSubNiche(sub)
                        }}
                        className={`w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition ${activeSubNiche === sub ? 'bg-[var(--hiwaii-accent-soft)] text-[var(--hiwaii-text-primary)]' : 'text-[var(--hiwaii-text-muted)] hover:text-[var(--hiwaii-text-secondary)]'}`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[240px]">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--hiwaii-text-muted)]" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder={lang === 'vi' ? 'Tìm theo tên artwork, sub-niche...' : 'Search artwork name or sub-niche...'}
                    className="min-h-11 w-full rounded-xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] pl-9 pr-3 text-sm font-semibold text-[var(--hiwaii-text-primary)] outline-none placeholder:text-[var(--hiwaii-text-muted)] focus:ring-2 focus:ring-[var(--hiwaii-accent)]"
                  />
                </div>
                <span className="text-sm font-bold text-[var(--hiwaii-text-secondary)]">{lang === 'vi' ? 'Sắp xếp' : 'Sort'}</span>
                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className="min-h-11 rounded-xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] px-3 text-sm font-semibold text-[var(--hiwaii-text-primary)] outline-none focus:ring-2 focus:ring-[var(--hiwaii-accent)]"
                >
                  <option value="popular">{t.sortPopular}</option>
                  <option value="price_low">{t.sortPriceLow}</option>
                  <option value="price_high">{t.sortPriceHigh}</option>
                </select>
                <span className="inline-flex items-center rounded-full border border-[var(--hiwaii-border)] bg-[#0b1736] px-4 py-2 text-xs font-black text-[var(--hiwaii-text-secondary)]">
                  {filtered.length} {lang === 'vi' ? 'kết quả' : 'results'}
                </span>
              </div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveNiche('all')
                    setActiveSubNiche('all')
                    setSortMode('popular')
                  }}
                  className="min-h-11 rounded-full border border-[var(--hiwaii-border)] px-5 text-xs font-black uppercase tracking-[0.14em] text-[var(--hiwaii-text-secondary)] transition hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]">
                  {t.reset}
                </button>
              </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {activeNiche !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setActiveNiche('all')}
                  className="rounded-full border border-[var(--hiwaii-accent)] bg-[var(--hiwaii-accent-soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[var(--hiwaii-text-primary)]"
                >
                  {activeNiche} ×
                </button>
              ) : null}
              {activeSubNiche !== 'all' ? (
                <button
                  type="button"
                  onClick={() => setActiveSubNiche('all')}
                  className="rounded-full border border-[var(--hiwaii-accent)] bg-[var(--hiwaii-accent-soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[var(--hiwaii-text-primary)]"
                >
                  {activeSubNiche} ×
                </button>
              ) : null}
              {keyword.trim() ? (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="rounded-full border border-[var(--hiwaii-accent)] bg-[var(--hiwaii-accent-soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[var(--hiwaii-text-primary)]"
                >
                  {keyword} ×
                </button>
              ) : null}
            </div>

            {topNiche.length > 0 && (
              <div className="mb-6 rounded-2xl border border-[var(--hiwaii-border)] bg-[#0c1a38] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--hiwaii-accent)]">{t.trendingBlock}</p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {topNiche.map((item) => (
                    <Link key={item.id} href={withLang(`/product/${item.id}`, lang)} className="group flex items-center gap-3 rounded-xl border border-[var(--hiwaii-border)] bg-[#0a1530] p-3 transition hover:border-[var(--hiwaii-accent)]">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                        <Image src={item.thumbnail} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="56px" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-[var(--hiwaii-text-primary)]">{item.name}</p>
                        <p className="mt-0.5 line-clamp-1 text-xs font-semibold text-[var(--hiwaii-text-secondary)]">{item.hook}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-10 text-center">
                <p className="text-lg font-black text-[var(--hiwaii-text-primary)]">{t.noProducts}</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNiche('all')
                    setActiveSubNiche('all')
                  }}
                  className="mt-5 min-h-11 rounded-full border border-[var(--hiwaii-border)] px-6 text-sm font-black uppercase tracking-[0.14em] text-[var(--hiwaii-text-secondary)] transition hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]"
                >
                  {t.reset}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} compact />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

