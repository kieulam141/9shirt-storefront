'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { displayNiche, displaySubNiche } from '@/lib/display-labels'
import { i18n, withLang } from '@/lib/i18n'
import { CONTACT_EMAIL, CONTACT_PHONE, META_FANPAGE_URL, ZALO_URL } from '@/lib/contact'
import { niches, products } from '@/lib/products'
import { useLang } from '@/hooks/use-lang'

export default function HomeClient() {
  const lang = useLang()
  const t = i18n[lang].home
  const featured = products.slice(0, 6)
  const hero = featured[0]

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
                <a href={withLang('/#best-sellers', lang)} className="inline-flex min-h-11 items-center rounded-full bg-[var(--hiwaii-accent)] px-7 text-sm font-black uppercase tracking-[0.14em] text-[#071425] transition hover:brightness-105">
                  {lang === 'vi' ? 'Mua mẫu bán chạy' : t.ctaPrimary}
                </a>
                <a href={withLang('/#lifestyle', lang)} className="inline-flex min-h-11 items-center rounded-full border border-[var(--hiwaii-border)] px-7 text-sm font-black uppercase tracking-[0.14em] text-[var(--hiwaii-text-primary)] transition hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]">
                  {lang === 'vi' ? 'Chọn theo phong cách' : 'Shop by style'}
                </a>
              </div>
              <ul className="mt-7 space-y-2 text-sm font-bold text-[var(--hiwaii-text-secondary)]">
                <li>{t.value1}</li>
                <li>{t.value2}</li>
                <li>{t.value3}</li>
              </ul>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  lang === 'vi' ? '1. Chọn mẫu' : '1. Pick design',
                  lang === 'vi' ? '2. Chọn size' : '2. Pick size',
                  lang === 'vi' ? '3. Đặt hàng' : '3. Checkout',
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
                  {lang === 'vi' ? 'Xem sản phẩm' : 'View product'}
                </Link>
              </div>
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
                  <h3 className="text-2xl font-black text-[var(--hiwaii-text-primary)]">{displayNiche(niche.label)}</h3>
                  <p className="mt-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{niche.subNiches.map(displaySubNiche).join(' • ')}</p>
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
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--hiwaii-accent)]">9shirt</h3>
            <p className="mt-3 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
              Áo Hawaii full-print và outfit hè cá tính. Chọn nhanh theo vibe, xem mẫu rõ ràng, hỗ trợ bởi CÔNG TY TNHH 9FASHION.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--hiwaii-text-primary)]">Phong cách</h4>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
              <li><Link href={withLang('/collections?niche=Sports', lang)}>Thể thao</Link></li>
              <li><Link href={withLang('/collections?niche=Animal', lang)}>Động vật</Link></li>
              <li><Link href={withLang('/collections?niche=Art%20%26%20Music', lang)}>Nghệ thuật & âm nhạc</Link></li>
              <li><Link href={withLang('/collections?niche=Vintage', lang)}>Vintage</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--hiwaii-text-primary)]">Hỗ trợ</h4>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
              <li>Giao từ Hà Nội 2-4 ngày</li>
              <li>Tư vấn size nhanh</li>
              <li>Xác nhận đơn rõ ràng</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--hiwaii-text-primary)]">Thông tin công ty</h4>
            <div className="mt-3 space-y-1 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
              <p>CÔNG TY TNHH 9FASHION</p>
              <p>MST: 0110712144</p>
              <p>Số 16 ngõ 1 Đốc Ngữ, Sơn Tây, Hà Nội</p>
              <p>Hotline: {CONTACT_PHONE}</p>
              <p>Email: {CONTACT_EMAIL}</p>
              <p>
                <a href={ZALO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--hiwaii-accent)]">
                  Chat Zalo
                </a>
                {' / '}
                <a href={META_FANPAGE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--hiwaii-accent)]">
                  Fanpage Meta
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
