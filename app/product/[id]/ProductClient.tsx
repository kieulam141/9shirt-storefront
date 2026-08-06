'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { useCart } from '@/context/CartContext'
import { CONTACT_PHONE, ZALO_URL } from '@/lib/contact'
import { displayNiche, displaySubNiche } from '@/lib/display-labels'
import { i18n, withLang } from '@/lib/i18n'
import { formatPrice, priceUnitFor } from '@/lib/pricing'
import { getProductById, products, type ProductVariant } from '@/lib/products'
import { useLang } from '@/hooks/use-lang'

const SIZE_CHART_URL = '/9shirt-size-chart.png'

function statusText(stockStatus: ProductVariant['stockStatus'], lang: 'en' | 'vi') {
  if (stockStatus === 'out_of_stock') return lang === 'vi' ? 'Hết hàng' : 'Out of stock'
  if (stockStatus === 'low_stock') return lang === 'vi' ? 'Sắp hết' : 'Low stock'
  return lang === 'vi' ? 'Còn hàng' : 'In stock'
}

export default function ProductClient({ id }: { id: string }) {
  const lang = useLang()
  const t = i18n[lang].pdp
  const product = getProductById(id)
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState('M')
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    if (!product) return
    setSelectedSize(product.sizes[0] || 'M')
    setActiveImage(0)
  }, [product])

  const imageMedia = useMemo(
    () => product?.media.filter((item) => item.type === 'image') || [],
    [product],
  )

  const currentVariant = useMemo(
    () => product?.variants.find((variant) => variant.size === selectedSize && variant.available),
    [product, selectedSize],
  )

  const price = currentVariant?.price ?? product?.price ?? 0
  const priceUnit = priceUnitFor(price)
  const canAddToCart = Boolean(currentVariant && currentVariant.stockStatus !== 'out_of_stock')

  const relatedProducts = useMemo(
    () => products.filter((item) => item.id !== product?.id && item.niche === product?.niche).slice(0, 4),
    [product],
  )

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-4xl font-black">{t.notFound}</h1>
          <Link href={withLang('/', lang)} className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[var(--hiwaii-border)] px-6 text-sm font-black uppercase tracking-[0.14em]">
            {t.backToShop}
          </Link>
        </main>
      </div>
    )
  }

  const selectedImage = imageMedia[activeImage]?.url || product.thumbnail

  const addToCart = () => {
    if (!canAddToCart) return
    addItem({
      id: `${product.id}-${selectedSize}`,
      name: product.name,
      size: selectedSize,
      quantity: 1,
      price,
      image: product.thumbnail,
    })
  }

  return (
    <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
      <Header />
      <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px]">
          <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm font-bold text-[var(--hiwaii-text-secondary)]">
            <Link href={withLang('/', lang)} className="hover:text-[var(--hiwaii-accent)]">{lang === 'vi' ? 'Mua sắm' : 'Shop'}</Link>
            <span className="mx-1">/</span>
            <a href={withLang('/#lifestyle', lang)} className="hover:text-[var(--hiwaii-accent)]">{lang === 'vi' ? 'Phong cách' : 'Lifestyle'}</a>
            <span className="mx-1">/</span>
            <span>{product.name}</span>
          </nav>

          <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="overflow-hidden rounded-2xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)]">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    priority
                  />
                </div>
              </div>
              {imageMedia.length > 1 ? (
                <div className="mt-3 grid grid-cols-5 gap-3">
                  {imageMedia.slice(0, 5).map((item, index) => (
                    <button
                      key={`${item.url}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`relative aspect-square overflow-hidden rounded-xl border bg-[#0b1735] transition ${index === activeImage ? 'border-[var(--hiwaii-accent)]' : 'border-[var(--hiwaii-border)] hover:border-[var(--hiwaii-accent)]'}`}
                    >
                      <Image src={item.thumb || item.url} alt={`${product.name} ${index + 1}`} fill className="object-cover" sizes="128px" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <article className="rounded-2xl border border-[var(--hiwaii-border)] bg-[linear-gradient(160deg,#0f1e43_0%,#0a1734_55%,#09142d_100%)] p-7 lg:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--hiwaii-accent)]">
                {displayNiche(product.niche)} / {displaySubNiche(product.subNiche)}
              </p>
              <h1 className="mt-3 text-4xl font-black leading-[0.96] sm:text-5xl">{product.name}</h1>
              <p className="mt-4 text-lg font-semibold leading-relaxed text-[var(--hiwaii-text-secondary)]">{product.hook}</p>

              <div className="mt-6 flex flex-wrap items-end gap-3">
                <span className="text-5xl font-black text-[var(--hiwaii-accent)]">{formatPrice(price, priceUnit)}</span>
                {product.compareAtPrice ? <span className="text-2xl font-bold text-[var(--hiwaii-text-muted)] line-through">{formatPrice(product.compareAtPrice)}</span> : null}
              </div>

              <div className="mt-7">
                <h2 className="mb-3 text-xl font-black">{t.selectSize}</h2>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {product.sizes.map((size) => {
                    const variant = product.variants.find((item) => item.size === size && item.available)
                    const unavailable = !variant || variant.stockStatus === 'out_of_stock'
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={unavailable}
                        onClick={() => setSelectedSize(size)}
                        className={`min-h-11 rounded-xl border text-sm font-black transition ${unavailable ? 'cursor-not-allowed border-[var(--hiwaii-border)] bg-[#111b36] text-[var(--hiwaii-text-muted)]' : selectedSize === size ? 'border-[var(--hiwaii-accent)] bg-[var(--hiwaii-accent-soft)] text-[var(--hiwaii-text-primary)]' : 'border-[var(--hiwaii-border)] bg-[#0f1f47] text-[var(--hiwaii-text-primary)] hover:border-[var(--hiwaii-accent)]'}`}
                        aria-label={`${size} ${statusText(variant?.stockStatus || 'out_of_stock', lang)}`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
                <p className="mt-3 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                  {currentVariant?.stockStatus === 'low_stock' ? t.lowStock : canAddToCart ? t.shippingTrust : t.outOfStock}
                </p>
              </div>

              <button type="button" disabled={!canAddToCart} onClick={addToCart} className={`mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 text-base font-black uppercase tracking-[0.12em] transition ${canAddToCart ? 'bg-[var(--hiwaii-accent)] text-[#061227] hover:brightness-105' : 'cursor-not-allowed bg-[#2a3556] text-[#95a4c8]'}`}>
                {t.addToCart} • {formatPrice(price, priceUnit)}
              </button>
              <Link href={withLang('/checkout', lang)} className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[var(--hiwaii-border)] px-6 text-sm font-black uppercase tracking-[0.12em] text-[var(--hiwaii-text-primary)] transition hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]">
                {t.buyNow}
              </Link>
            </article>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-2xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-7">
              <h2 className="text-3xl font-black">{t.storyTitle}</h2>
              <p className="mt-4 text-base font-semibold leading-relaxed text-[var(--hiwaii-text-secondary)]">{product.description}</p>
              <div className="mt-5 rounded-2xl border border-[var(--hiwaii-accent)]/35 bg-[var(--hiwaii-accent)]/8 p-5">
                <h3 className="text-lg font-black text-[var(--hiwaii-accent)]">Tư vấn chọn size</h3>
                <ul className="mt-3 space-y-2 text-sm font-semibold leading-relaxed text-[var(--hiwaii-text-secondary)]">
                  <li>Form áo Hawaii 9shirt rộng hơn khoảng 1 size so với áo thường. Nếu thường mặc S, cân nhắc chọn XS; thường mặc L, cân nhắc chọn M.</li>
                  <li>Nếu thích mặc rộng rãi, thoải mái đi biển hoặc phối layer, hãy chọn theo số đo áo thực tế trong bảng size.</li>
                  <li>Bảng size phù hợp vóc dáng người Việt Nam, có đủ từ 2XS đến 5XL. Khi phân vân giữa 2 size, ưu tiên chọn size lớn hơn nếu thích form thoải mái.</li>
                </ul>
                <a
                  href={ZALO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center rounded-full border border-[var(--hiwaii-accent)]/45 px-5 text-xs font-black uppercase tracking-[0.12em] text-[var(--hiwaii-accent)] transition hover:bg-[var(--hiwaii-accent)] hover:text-[#061227]"
                >
                  Chat Zalo tư vấn size • {CONTACT_PHONE}
                </a>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {product.specifications.slice(0, 4).map((spec) => (
                  <article key={spec.label} className="rounded-xl border border-[var(--hiwaii-border)] bg-[#0b1737] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--hiwaii-accent)]">{spec.label}</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--hiwaii-text-primary)]">{spec.value}</p>
                  </article>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-7">
              <h2 className="text-3xl font-black">{t.sizeChart}</h2>
              <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--hiwaii-border)] bg-[#e8e2cf] p-2">
                <div className="relative aspect-[3/4] w-full">
                  <Image src={SIZE_CHART_URL} alt="Bảng size áo Hawaii 9shirt phù hợp với người Việt Nam" fill className="rounded-xl object-contain" sizes="(max-width: 1024px) 100vw, 38vw" />
                </div>
              </div>
            </article>
          </section>

          {relatedProducts.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-3xl font-black">{t.relatedNiche}</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((item) => (
                  <ProductCard key={item.id} product={item} compact />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  )
}
