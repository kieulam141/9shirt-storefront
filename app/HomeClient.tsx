'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { i18n, withLang } from '@/lib/i18n'
import { niches, products } from '@/lib/products'
import { useLang } from '@/hooks/use-lang'

export default function HomeClient() {
  const lang = useLang()
  const t = i18n[lang].home
  const featured = products.slice(0, 6)
  const hero = featured[0]
  const studioPicks = featured.slice(0, 3)
  const [studioFocus, setStudioFocus] = useState(studioPicks[0]?.id || hero.id)
  const activeStudio = useMemo(
    () => studioPicks.find((item) => item.id === studioFocus) || studioPicks[0],
    [studioFocus, studioPicks],
  )

  return (
    <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
      <Header />

      <main>
        <section className="px-4 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[1.12fr_0.88fr]">
            <article className="hiwaii-reveal hiwaii-grid-bg hiwaii-orb-bg rounded-[2rem] border border-[var(--hiwaii-border)] bg-[linear-gradient(155deg,#111f44_0%,#0c1835_60%,#091328_100%)] p-8 lg:p-12">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--hiwaii-accent)]">{t.eyebrow}</p>
              <h1 className="mt-5 text-5xl font-black leading-[0.94] text-[var(--hiwaii-text-primary)] sm:text-6xl">{t.title}</h1>
              <p className="mt-6 max-w-2xl text-lg font-semibold text-[var(--hiwaii-text-secondary)]">{t.subtitle}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={withLang('/collections', lang)} className="inline-flex min-h-11 items-center rounded-full bg-[var(--hiwaii-accent)] px-7 text-sm font-black uppercase tracking-[0.14em] text-[#071425] transition hover:brightness-105">
                  {t.ctaPrimary}
                </Link>
                <Link href={withLang('/collections', lang)} className="inline-flex min-h-11 items-center rounded-full border border-[var(--hiwaii-border)] px-7 text-sm font-black uppercase tracking-[0.14em] text-[var(--hiwaii-text-primary)] transition hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]">
                  {t.ctaSecondary}
                </Link>
              </div>
              <ul className="mt-7 space-y-2 text-sm font-bold text-[var(--hiwaii-text-secondary)]">
                <li>{t.value1}</li>
                <li>{t.value2}</li>
                <li>{t.value3}</li>
              </ul>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  lang === 'vi' ? '1. Chọn artwork' : '1. Pick artwork',
                  lang === 'vi' ? '2. Chọn kiểu áo' : '2. Choose shirt kind',
                  lang === 'vi' ? '3. Xem mockup và chốt đơn' : '3. Preview mockup and checkout',
                ].map((step) => (
                  <div key={step} className="rounded-xl border border-[var(--hiwaii-border)] bg-[#091631] px-4 py-3 text-xs font-black uppercase tracking-[0.1em] text-[var(--hiwaii-text-secondary)]">
                    {step}
                  </div>
                ))}
              </div>
            </article>
            <div className="hiwaii-reveal hiwaii-sheen relative overflow-hidden rounded-[2rem] border border-[var(--hiwaii-border)] bg-[#07132f]" style={{ animationDelay: '90ms' }}>
              <div className="relative min-h-[520px] w-full">
                <Image src={hero.thumbnail} alt={hero.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 44vw" priority />
              </div>
              <div className="border-t border-[var(--hiwaii-border)] bg-[#07142e]/95 p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--hiwaii-accent)]">{lang === 'vi' ? 'Mẫu đang hot' : 'Trending now'}</p>
                <h2 className="mt-2 text-2xl font-black">{hero.name}</h2>
                <p className="mt-1 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{hero.hook}</p>
                <Link href={withLang(`/product/${hero.id}`, lang)} className="mt-4 inline-flex min-h-10 items-center rounded-full border border-[var(--hiwaii-border)] px-5 text-xs font-black uppercase tracking-[0.12em] transition hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]">
                  {lang === 'vi' ? 'Xem mockup sản phẩm' : 'View mockup setup'}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1360px] rounded-[2rem] border border-[var(--hiwaii-border)] p-6 md:p-8 hiwaii-glass">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--hiwaii-accent)]">
                  {lang === 'vi' ? 'Live design playground' : 'Live design playground'}
                </p>
                <h2 className="mt-2 text-3xl font-black leading-[0.96] sm:text-4xl">
                  {lang === 'vi' ? 'Chọn art, dựng mockup áo, xem try-on ngay' : 'Pick art, render mockup, preview try-on instantly'}
                </h2>
              </div>
              <Link href={withLang(`/product/${activeStudio?.id || hero.id}`, lang)} className="inline-flex min-h-11 items-center rounded-full bg-[var(--hiwaii-accent)] px-7 text-xs font-black uppercase tracking-[0.14em] text-[#071425] transition hover:brightness-105">
                {lang === 'vi' ? 'Mở studio đầy đủ' : 'Open full studio'}
              </Link>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
              <div className="space-y-3">
                {studioPicks.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStudioFocus(item.id)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${studioFocus === item.id ? 'border-[var(--hiwaii-accent)] bg-[var(--hiwaii-accent-soft)]' : 'border-[var(--hiwaii-border)] bg-[#081736] hover:border-[var(--hiwaii-accent)]'}`}
                  >
                    <div className="flex gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <Image src={item.thumbnail} alt={item.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div>
                        <p className="text-sm font-black">{item.name}</p>
                        <p className="mt-1 text-xs font-semibold text-[var(--hiwaii-text-secondary)]">{item.hook}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <article className="hiwaii-metal-border rounded-2xl p-4">
                <div className="relative overflow-hidden rounded-xl border border-[var(--hiwaii-border)] bg-[#040b1b]">
                  <div className="relative aspect-[16/10] w-full">
                    <Image src={activeStudio?.thumbnail || hero.thumbnail} alt={activeStudio?.name || hero.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 54vw" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(3,8,20,0.92),rgba(3,8,20,0.1))] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--hiwaii-accent)]">
                      {lang === 'vi' ? 'Mockup output' : 'Mockup output'}
                    </p>
                    <p className="mt-1 text-xl font-black">{activeStudio?.name || hero.name}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-[var(--hiwaii-border)] bg-[#081736] p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--hiwaii-accent)]">{lang === 'vi' ? 'Art layer' : 'Art layer'}</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{activeStudio?.subNiche || hero.subNiche}</p>
                  </div>
                  <div className="rounded-xl border border-[var(--hiwaii-border)] bg-[#081736] p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--hiwaii-accent)]">{lang === 'vi' ? 'Mockup type' : 'Mockup type'}</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{lang === 'vi' ? 'Hawaii shirt' : 'Hawaiian shirt'}</p>
                  </div>
                  <div className="rounded-xl border border-[var(--hiwaii-border)] bg-[#081736] p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--hiwaii-accent)]">{lang === 'vi' ? 'Try-on clip' : 'Try-on clip'}</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{activeStudio?.videoUrl ? (lang === 'vi' ? 'Sẵn sàng' : 'Available') : (lang === 'vi' ? 'Chưa có' : 'Pending')}</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1360px] gap-4 md:grid-cols-2 xl:grid-cols-4">
            {t.trust.map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-[var(--hiwaii-border)] bg-[#081633] p-5">
                <h3 className="text-base font-black text-[var(--hiwaii-text-primary)]">{title}</h3>
                <p className="mt-1 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="best-sellers" className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1360px]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--hiwaii-accent)]">{t.sectionFeatured}</p>
            <h2 className="mt-3 text-4xl font-black leading-[0.96] text-[var(--hiwaii-text-primary)]">{t.sectionFeaturedTitle}</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1360px] rounded-[2rem] border border-[var(--hiwaii-border)] bg-[linear-gradient(160deg,#102048_0%,#0b1837_58%,#09152f_100%)] p-8 lg:p-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--hiwaii-accent)]">{lang === 'vi' ? 'Design studio' : 'Design studio'}</p>
                <h2 className="mt-2 text-4xl font-black leading-[0.96]">{lang === 'vi' ? 'Tạo phối áo theo gu của bạn' : 'Build your own mockup combo'}</h2>
              </div>
              <Link href={withLang('/collections', lang)} className="inline-flex min-h-11 items-center rounded-full bg-[var(--hiwaii-accent)] px-7 text-xs font-black uppercase tracking-[0.14em] text-[#071425] transition hover:brightness-105">
                {lang === 'vi' ? 'Mở xưởng mockup' : 'Open mockup studio'}
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {studioPicks.map((item, index) => (
                <Link key={item.id} href={withLang(`/product/${item.id}`, lang)} className="group rounded-2xl border border-[var(--hiwaii-border)] bg-[#0a1736] p-4 transition hover:border-[var(--hiwaii-accent)]">
                  <div className="relative aspect-[5/4] w-full overflow-hidden rounded-xl">
                    <Image src={item.thumbnail} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--hiwaii-accent)]">{lang === 'vi' ? `Bước ${index + 1}` : `Step ${index + 1}`}</p>
                  <h3 className="mt-1 text-lg font-black">{item.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{item.hook}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="lifestyle" className="px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1360px] rounded-[2rem] border border-[var(--hiwaii-border)] bg-gradient-to-br from-[#111f44] via-[#0b1837] to-[#09162e] p-8 lg:p-11">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--hiwaii-accent)]">{t.sectionLifestyle}</p>
            <h2 className="mt-3 text-4xl font-black leading-[0.96] text-[var(--hiwaii-text-primary)]">{t.sectionLifestyleTitle}</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {niches.map((niche) => (
                <Link
                  key={niche.label}
                  href={withLang(`/collections?niche=${encodeURIComponent(niche.label)}`, lang)}
                  className="group rounded-2xl border border-[var(--hiwaii-border)] bg-[#0b1736] p-5 transition hover:border-[var(--hiwaii-accent)]"
                >
                  <h3 className="text-2xl font-black text-[var(--hiwaii-text-primary)]">{niche.label}</h3>
                  <p className="mt-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{niche.subNiches.join(' • ')}</p>
                  <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-[var(--hiwaii-accent)]">
                    {lang === 'vi' ? 'Mua theo nhóm' : 'Explore niche'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="support" className="border-t border-[var(--hiwaii-border)] bg-[#061024] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1360px] gap-6 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--hiwaii-accent)]">Hiwaii</h3>
            <p className="mt-3 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
              {lang === 'vi'
                ? 'Áo Hawaii in full-print theo phong cách sống. Lọc nhanh theo niche, mua nhanh theo vibe.'
                : 'Statement Hawaiian shirts organized by lifestyle. Discover faster and shop with confidence.'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--hiwaii-text-primary)]">{lang === 'vi' ? 'Mua sắm' : 'Shop'}</h4>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
              <li><Link href={withLang('/collections', lang)}>{lang === 'vi' ? 'Tất cả sản phẩm' : 'All shirts'}</Link></li>
              <li><Link href={withLang('/collections?niche=Animal', lang)}>Animal</Link></li>
              <li><Link href={withLang('/collections?niche=Art%20%26%20Music', lang)}>Art & Music</Link></li>
              <li><Link href={withLang('/collections?niche=Vintage', lang)}>Vintage</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--hiwaii-text-primary)]">{lang === 'vi' ? 'Hỗ trợ' : 'Support'}</h4>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
              <li>{lang === 'vi' ? 'Giao hàng 3-5 ngày' : '3-5 day delivery'}</li>
              <li>{lang === 'vi' ? 'Đổi trả dễ dàng' : 'Easy returns'}</li>
              <li>{lang === 'vi' ? 'Thanh toán bảo mật' : 'Secure checkout'}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--hiwaii-text-primary)]">{lang === 'vi' ? 'Về Hiwaii' : 'About'}</h4>
            <p className="mt-3 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
              {lang === 'vi' ? 'Dòng áo statement cho mùa hè và du lịch.' : 'Statement shirt line for travel, gifting, and standout daily wear.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

