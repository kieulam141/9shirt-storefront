'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { i18n, withLang } from '@/lib/i18n'
import { formatPrice, formatPriceDelta, priceUnitFor } from '@/lib/pricing'
import { getProductById, products, type MaterialCode, type ProductVariant } from '@/lib/products'
import { useLang } from '@/hooks/use-lang'

const SIZE_CHART_URL = 'https://cdn.9tech.cloud/3D%20Hiwaii/Stock/Hiwaii_size_chart.png'

function statusText(stockStatus: ProductVariant['stockStatus'], lang: 'en' | 'vi') {
  if (stockStatus === 'out_of_stock') return lang === 'vi' ? 'Hết hàng' : 'Out of stock'
  if (stockStatus === 'low_stock') return lang === 'vi' ? 'Sắp hết' : 'Low stock'
  return lang === 'vi' ? 'Còn hàng' : 'In stock'
}

type ShirtKind = {
  code: 'hawaiian_shirt' | 'polo_shirt' | 't_shirt' | 'shorts'
  label: string
  viLabel: string
  uplift: number
  description: string
  viDescription: string
}

const SHIRT_KINDS: ShirtKind[] = [
  {
    code: 'hawaiian_shirt',
    label: 'Hawaiian Shirt',
    viLabel: 'Áo Hawaii',
    uplift: 0,
    description: 'Relaxed resort cut with all-over print.',
    viDescription: 'Form resort thoải mái, in phủ toàn áo.',
  },
  {
    code: 'polo_shirt',
    label: 'Polo Shirt',
    viLabel: 'Áo Polo',
    uplift: 6,
    description: 'Structured collar and cleaner silhouette.',
    viDescription: 'Cổ đứng form gọn, dễ phối thường ngày.',
  },
  {
    code: 't_shirt',
    label: 'T-Shirt',
    viLabel: 'Áo T-Shirt',
    uplift: 4,
    description: 'Casual fit with softer hand-feel focus.',
    viDescription: 'Form casual thoải mái, ưu tiên độ mềm.',
  },
  {
    code: 'shorts',
    label: 'Beach Shorts',
    viLabel: 'Quần Shorts biển',
    uplift: 8,
    description: 'Matching lower piece for full set styling.',
    viDescription: 'Phối đồng bộ với áo để lên full set.',
  },
]

function getStoryTone(subNiche: string, lang: 'en' | 'vi'): string {
  if (lang === 'vi') {
    if (subNiche === 'Cat') return 'Bản in theo tinh thần mèo cá tính, vui mắt và có chiều sâu thị giác.'
    if (subNiche === 'Dog') return 'Thiết kế tôn năng lượng mạnh, thân thiện và nổi bật trong đám đông.'
    if (subNiche === 'Tiger' || subNiche === 'Lion') return 'Màu sắc cường độ cao, tạo hiệu ứng thị giác mạnh khi di chuyển.'
    if (subNiche === 'Piano' || subNiche === 'Photography') return 'Artwork theo cảm hứng nghệ thuật, thiên về bố cục và cảm xúc.'
    if (subNiche === 'Football') return 'Thiết kế lấy cảm hứng bóng đá, tập trung vào năng lượng cổ vũ và tinh thần sưu tầm.'
    return 'Thiết kế gợi cảm giác hoài niệm, mang tinh thần sưu tầm và du lịch.'
  }

  if (subNiche === 'Cat') return 'A playful cat-driven composition built for expressive summer styling.'
  if (subNiche === 'Dog') return 'A bold dog-themed artwork with crowd-catching character and depth.'
  if (subNiche === 'Tiger' || subNiche === 'Lion') return 'High-energy palettes and strong contrast engineered for standout movement.'
  if (subNiche === 'Piano' || subNiche === 'Photography') return 'An art-forward composition inspired by visual rhythm and creative identity.'
  if (subNiche === 'Football') return 'A football-inspired composition built around fan energy, collector cues, and matchday styling.'
  return 'A nostalgia-led visual language with archival travel and collector cues.'
}

export default function ProductClient({ id }: { id: string }) {
  const lang = useLang()
  const t = i18n[lang].pdp
  const product = getProductById(id)
  const { addItem } = useCart()

  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialCode>('standard_poly')
  const [selectedArtId, setSelectedArtId] = useState(id)
  const [selectedShirtKind, setSelectedShirtKind] = useState<ShirtKind['code']>('hawaiian_shirt')
  const [activeMedia, setActiveMedia] = useState(0)
  const [mockupScale, setMockupScale] = useState(1)
  const [mockupContrast, setMockupContrast] = useState(1)
  const [tryOnMode, setTryOnMode] = useState<'mockup' | 'tryon'>('mockup')

  useEffect(() => {
    if (!product) return
    setSelectedSize(product.sizes[0] || 'M')
    setSelectedMaterial('standard_poly')
    setSelectedArtId(product.id)
    const videoIndex = product.media.findIndex((m) => m.type === 'video')
    setActiveMedia(videoIndex >= 0 ? videoIndex : 0)
  }, [product])

  const artOptions = useMemo(
    () => products.filter((item) => item.niche === product?.niche).slice(0, 8),
    [product],
  )

  const selectedArtProduct = useMemo(
    () => artOptions.find((item) => item.id === selectedArtId) || product,
    [artOptions, product, selectedArtId],
  )

  useEffect(() => {
    if (!selectedArtProduct) return
    const videoIndex = selectedArtProduct.media.findIndex((m) => m.type === 'video')
    setActiveMedia(videoIndex >= 0 ? videoIndex : 0)
  }, [selectedArtProduct])

  useEffect(() => {
    setMockupScale(1)
    setMockupContrast(1)
  }, [selectedArtId, selectedShirtKind])

  const currentVariant = useMemo(
    () => product?.variants.find((v) => v.size === selectedSize && v.material === selectedMaterial),
    [product, selectedSize, selectedMaterial],
  )

  const selectedShirtKindData = useMemo(
    () => SHIRT_KINDS.find((kind) => kind.code === selectedShirtKind) || SHIRT_KINDS[0],
    [selectedShirtKind],
  )

  const selectedMaterialData = useMemo(
    () => product?.materials.find((material) => material.code === selectedMaterial) || product?.materials[0],
    [product, selectedMaterial],
  )

  const basePrice = currentVariant?.price ?? product?.price ?? 0
  const priceUnit = priceUnitFor(basePrice)
  const price = basePrice + selectedShirtKindData.uplift
  const canAddToCart = Boolean(currentVariant?.available && currentVariant?.stockStatus !== 'out_of_stock')

  const storyTone = useMemo(
    () => (selectedArtProduct ? getStoryTone(selectedArtProduct.subNiche, lang) : ''),
    [selectedArtProduct, lang],
  )

  const tryOnUrl = useMemo(() => {
    if (!selectedArtProduct) return undefined
    return selectedArtProduct.videoUrl || selectedArtProduct.media.find((item) => item.type === 'video')?.url
  }, [selectedArtProduct])

  const relatedNiche = useMemo(
    () => products.filter((item) => item.id !== product?.id && item.niche === product?.niche).slice(0, 4),
    [product],
  )

  const relatedVibe = useMemo(
    () => products.filter((item) => item.id !== product?.id && item.subNiche !== product?.subNiche).slice(0, 4),
    [product],
  )

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-4xl font-black">{t.notFound}</h1>
          <Link href={withLang('/collections', lang)} className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[var(--hiwaii-border)] px-6 text-sm font-black uppercase tracking-[0.14em]">
            {t.backToShop}
          </Link>
        </main>
      </div>
    )
  }

  const router = useRouter()

  const addToCart = () => {
    if (!canAddToCart) return
    const selectedLabel = lang === 'vi' ? selectedShirtKindData.viLabel : selectedShirtKindData.label
    addItem({
      id: `${product.id}-${selectedArtProduct?.id}-${selectedMaterial}-${selectedShirtKind}`,
      name: `${selectedArtProduct?.name || product.name} - ${selectedLabel} - ${selectedMaterialData?.label || selectedMaterial}`,
      size: selectedSize,
      quantity: 1,
      price,
      image: selectedArtProduct?.thumbnail || product.thumbnail,
    })
  }

  const buyNow = () => {
    if (!canAddToCart) return
    addToCart()
    router.push(withLang('/checkout', lang))
  }

  return (
    <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
      <Header />
      <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px]">
          <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm font-bold text-[var(--hiwaii-text-secondary)]">
            <Link href={withLang('/', lang)} className="hover:text-[var(--hiwaii-accent)]">{lang === 'vi' ? 'Mua sắm' : 'Shop'}</Link>
            <span className="mx-1">/</span>
            <Link href={withLang('/collections', lang)} className="hover:text-[var(--hiwaii-accent)]">{lang === 'vi' ? 'Bộ sưu tập' : 'Collections'}</Link>
            <span className="mx-1">/</span>
            <span>{selectedArtProduct?.name || product.name}</span>
          </nav>

          <section className="hiwaii-reveal grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <div className="overflow-hidden rounded-[1.75rem] border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] shadow-[0_28px_80px_rgba(3,9,22,0.6)]">
                {selectedArtProduct?.media[activeMedia]?.type === 'video' ? (
                  <video className="aspect-[4/5] w-full object-cover" src={selectedArtProduct.media[activeMedia].url} controls autoPlay muted loop playsInline preload="metadata" />
                ) : (
                  <div className="relative aspect-[4/5] w-full">
                    <Image src={selectedArtProduct?.media[activeMedia]?.url || selectedArtProduct?.thumbnail || product.thumbnail} alt={selectedArtProduct?.name || product.name} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 50vw" priority />
                  </div>
                )}
              </div>
              {selectedArtProduct && selectedArtProduct.media.length > 1 && (
                <div className="mt-3 grid grid-cols-5 gap-3">
                  {selectedArtProduct.media.map((item, index) => (
                    <button
                      key={`${item.url}-${index}`}
                      type="button"
                      onClick={() => setActiveMedia(index)}
                      className={`relative overflow-hidden rounded-xl border bg-[#0b1735] transition ${index === activeMedia ? 'border-[var(--hiwaii-accent)]' : 'border-[var(--hiwaii-border)] hover:border-[var(--hiwaii-accent)]'}`}
                    >
                      {item.type === 'video' ? (
                        <>
                          <video className="aspect-square w-full object-cover" src={item.url} muted playsInline preload="metadata" />
                          <span className="absolute inset-0 flex items-center justify-center bg-[#040b1b]/35 text-xs font-black uppercase tracking-[0.12em] text-white">Play</span>
                        </>
                      ) : (
                        <div className="relative aspect-square w-full">
                          <Image src={item.thumb || item.url} alt={`${selectedArtProduct.name} ${index + 1}`} fill className="object-cover" sizes="128px" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <article className="hiwaii-grid-bg rounded-[1.75rem] border border-[var(--hiwaii-border)] bg-[linear-gradient(160deg,#0f1e43_0%,#0a1734_55%,#09142d_100%)] p-7 lg:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--hiwaii-accent)]">{t.studioEyebrow}</p>
              <h1 className="mt-2 text-4xl font-black leading-[0.96] sm:text-5xl">{t.studioTitle}</h1>
              <p className="mt-4 text-sm font-bold text-[var(--hiwaii-text-secondary)]">{t.reviewLine}</p>

              <div className="mt-6 rounded-2xl border border-[var(--hiwaii-border)] bg-[#0a1939] p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hiwaii-accent)]">{t.selectedCombo}</p>
                <p className="mt-2 text-xl font-black text-[var(--hiwaii-text-primary)]">{selectedArtProduct?.name}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                  {lang === 'vi' ? selectedShirtKindData.viLabel : selectedShirtKindData.label} • {selectedSize} • {selectedMaterialData?.label || selectedMaterial}
                </p>
              </div>

              <div className="mt-7">
                <h2 className="mb-3 text-xl font-black">{t.selectArt}</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {artOptions.map((art) => (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => setSelectedArtId(art.id)}
                      className={`group overflow-hidden rounded-xl border text-left transition ${selectedArtId === art.id ? 'border-[var(--hiwaii-accent)] bg-[var(--hiwaii-accent-soft)]' : 'border-[var(--hiwaii-border)] bg-[#0f1f47] hover:border-[var(--hiwaii-accent)]'}`}
                    >
                      <div className="relative aspect-square w-full">
                        <Image src={art.thumbnail} alt={art.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
                      </div>
                      <p className="line-clamp-1 p-2 text-xs font-black text-[var(--hiwaii-text-primary)]">{art.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <h2 className="mb-3 text-xl font-black">{t.selectShirtKind}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SHIRT_KINDS.map((kind) => (
                    <button
                      key={kind.code}
                      type="button"
                      onClick={() => setSelectedShirtKind(kind.code)}
                      className={`rounded-2xl border p-4 text-left transition ${selectedShirtKind === kind.code ? 'border-[var(--hiwaii-accent)] bg-[var(--hiwaii-accent-soft)]' : 'border-[var(--hiwaii-border)] bg-[#0f1f47] hover:border-[var(--hiwaii-accent)]'}`}
                    >
                      <p className="text-xl font-black text-[var(--hiwaii-text-primary)]">{lang === 'vi' ? kind.viLabel : kind.label}</p>
                      <p className="mt-1 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{lang === 'vi' ? kind.viDescription : kind.description}</p>
                      <p className="mt-2 text-sm font-black text-[var(--hiwaii-accent)]">{kind.uplift === 0 ? (lang === 'vi' ? 'Không phụ thu' : 'No extra fee') : formatPriceDelta(kind.uplift, priceUnit)}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <h2 className="mb-3 text-xl font-black">{t.selectSize}</h2>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {product.sizes.map((size) => {
                    const variant = product.variants.find((v) => v.size === size && v.material === selectedMaterial)
                    const unavailable = !variant || !variant.available || variant.stockStatus === 'out_of_stock'
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
              </div>

              <div className="mt-7">
                <h2 className="mb-3 text-xl font-black">{t.selectMaterial}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {product.materials.map((material) => (
                    <button
                      key={material.code}
                      type="button"
                      onClick={() => setSelectedMaterial(material.code)}
                      className={`rounded-2xl border p-4 text-left transition ${selectedMaterial === material.code ? 'border-[var(--hiwaii-accent)] bg-[var(--hiwaii-accent-soft)]' : 'border-[var(--hiwaii-border)] bg-[#0f1f47] hover:border-[var(--hiwaii-accent)]'}`}
                    >
                      {material.badge ? <span className="inline-flex rounded-full border border-[var(--hiwaii-accent)] px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--hiwaii-accent)]">{material.badge}</span> : null}
                      <p className="mt-2 text-2xl font-black">{material.label}</p>
                      <p className="mt-1 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{material.benefit}</p>
                      <p className="mt-2 text-lg font-black text-[var(--hiwaii-accent)]">{material.uplift === 0 ? formatPrice(basePrice, priceUnit) : formatPriceDelta(material.uplift, priceUnit)}</p>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                  {currentVariant?.stockStatus === 'low_stock' ? t.lowStock : currentVariant?.stockStatus === 'out_of_stock' ? t.outOfStock : t.shippingTrust}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-end gap-3">
                <span className="text-5xl font-black text-[var(--hiwaii-accent)]">{formatPrice(price, priceUnit)}</span>
                {product.compareAtPrice ? <span className="text-2xl font-bold text-[var(--hiwaii-text-muted)] line-through">{formatPrice(product.compareAtPrice)}</span> : null}
              </div>
              <p className="mt-3 text-xl font-semibold text-[var(--hiwaii-text-secondary)]">{selectedArtProduct?.hook || product.hook}</p>

              <button type="button" disabled={!canAddToCart} onClick={addToCart} className={`mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 text-base font-black uppercase tracking-[0.12em] transition ${canAddToCart ? 'bg-[var(--hiwaii-accent)] text-[#061227] hover:brightness-105' : 'cursor-not-allowed bg-[#2a3556] text-[#95a4c8]'}`}>
                {t.addToCart} • {formatPrice(price, priceUnit)}
              </button>
              <button
                type="button"
                disabled={!canAddToCart}
                onClick={buyNow}
                className={`mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[var(--hiwaii-border)] px-6 text-sm font-black uppercase tracking-[0.12em] transition ${canAddToCart ? 'text-[var(--hiwaii-text-primary)] hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]' : 'cursor-not-allowed bg-[#2a3556] text-[#95a4c8]'}`}
              >
                {t.buyNow}
              </button>
              <p className="mt-3 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{t.shippingTrust}</p>
            </article>
          </section>

          <section className="hiwaii-reveal mt-8 rounded-3xl border border-[var(--hiwaii-border)] p-7 hiwaii-glass" style={{ animationDelay: '60ms' }}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hiwaii-accent)]">{t.mockupPreview}</p>
                <h2 className="mt-2 text-3xl font-black leading-[0.96]">
                  {lang === 'vi' ? 'Art + sản phẩm trong 1 khung dựng' : 'Art + product in one composited frame'}
                </h2>
              </div>
              <div className="inline-flex rounded-full border border-[var(--hiwaii-border)] p-1">
                <button
                  type="button"
                  onClick={() => setTryOnMode('mockup')}
                  className={`min-h-9 rounded-full px-4 text-xs font-black uppercase tracking-[0.12em] transition ${tryOnMode === 'mockup' ? 'bg-[var(--hiwaii-accent)] text-[#061227]' : 'text-[var(--hiwaii-text-secondary)]'}`}
                >
                  {lang === 'vi' ? 'Mockup' : 'Mockup'}
                </button>
                <button
                  type="button"
                  onClick={() => setTryOnMode('tryon')}
                  className={`min-h-9 rounded-full px-4 text-xs font-black uppercase tracking-[0.12em] transition ${tryOnMode === 'tryon' ? 'bg-[var(--hiwaii-accent)] text-[#061227]' : 'text-[var(--hiwaii-text-secondary)]'}`}
                >
                  {lang === 'vi' ? 'Try-on' : 'Try-on'}
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="rounded-2xl border border-[var(--hiwaii-border)] bg-[#060f24] p-3">
                {tryOnMode === 'mockup' || !tryOnUrl ? (
                  <div className="relative overflow-hidden rounded-xl border border-[var(--hiwaii-border)] bg-[linear-gradient(170deg,#0d1b3f_0%,#0b1631_55%,#091128_100%)] p-4">
                    <div className="absolute -left-10 top-16 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(200,255,61,0.5),rgba(200,255,61,0))] blur-2xl" />
                    <div className="absolute -right-12 bottom-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(76,149,255,0.55),rgba(76,149,255,0))] blur-2xl" />
                    <div className="relative mx-auto w-full max-w-[340px]">
                      <div className="mx-auto h-14 w-32 rounded-b-3xl border border-[var(--hiwaii-border)] bg-[#c7bca7]/20" />
                      <div className="relative mx-auto -mt-3 h-[360px] w-[290px] overflow-hidden rounded-[2.4rem] border border-[var(--hiwaii-border)] bg-[#0b1734] shadow-[0_25px_50px_rgba(1,5,15,0.55)]">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=60')] bg-cover bg-center opacity-18" />
                        <div
                          className="absolute inset-[8%] rounded-[2rem] bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${selectedArtProduct?.thumbnail || product.thumbnail})`,
                            transform: `scale(${mockupScale})`,
                            filter: `contrast(${mockupContrast}) saturate(1.08)`,
                            mixBlendMode: 'screen',
                            opacity: 0.82,
                          }}
                        />
                        <div className="absolute inset-[8%] rounded-[2rem] border border-white/20" />
                        <div className="absolute left-1/2 top-[14%] h-16 w-14 -translate-x-1/2 rounded-b-2xl border border-white/20 bg-[#0c1a37]/80" />
                      </div>
                    </div>
                    <p className="mt-4 text-center text-xs font-semibold text-[var(--hiwaii-text-secondary)]">
                      {lang === 'vi' ? 'Mô phỏng art lên phom áo để xem nhanh tổng thể trước khi chốt.' : 'Fast composited preview of artwork on shirt silhouette before checkout.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-[var(--hiwaii-border)] bg-black">
                    <video className="aspect-video w-full object-cover" src={tryOnUrl} controls autoPlay muted loop playsInline preload="metadata" />
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-[var(--hiwaii-border)] bg-[#091938] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--hiwaii-accent)]">
                  {lang === 'vi' ? 'Mockup controls' : 'Mockup controls'}
                </p>
                <div className="mt-4 space-y-4">
                  <label className="block">
                    <p className="mb-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                      {lang === 'vi' ? 'Độ phóng artwork' : 'Artwork scale'}
                    </p>
                    <input
                      type="range"
                      min={0.86}
                      max={1.24}
                      step={0.01}
                      value={mockupScale}
                      onChange={(event) => setMockupScale(Number(event.target.value))}
                      className="w-full accent-[var(--hiwaii-accent)]"
                    />
                  </label>
                  <label className="block">
                    <p className="mb-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                      {lang === 'vi' ? 'Độ tương phản in' : 'Print contrast'}
                    </p>
                    <input
                      type="range"
                      min={0.8}
                      max={1.32}
                      step={0.01}
                      value={mockupContrast}
                      onChange={(event) => setMockupContrast(Number(event.target.value))}
                      className="w-full accent-[var(--hiwaii-accent)]"
                    />
                  </label>
                  <div className="rounded-xl border border-[var(--hiwaii-border)] bg-[#061125] p-3">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--hiwaii-accent)]">
                      {lang === 'vi' ? 'Preset đang chạy' : 'Current preset'}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                      {(lang === 'vi' ? selectedShirtKindData.viLabel : selectedShirtKindData.label)} • {selectedMaterialData?.label || selectedMaterial}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-[var(--hiwaii-text-muted)]">
                      {tryOnUrl
                        ? lang === 'vi'
                          ? 'Chuyển sang tab Try-on để xem chuyển động thật của artwork này.'
                          : 'Switch to Try-on tab for real movement preview of this artwork.'
                        : lang === 'vi'
                          ? 'Artwork này chưa có clip try-on, bạn vẫn có mockup composited để kiểm tra thiết kế.'
                          : 'This artwork has no try-on clip yet; use composited mockup preview instead.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {selectedArtProduct?.videoUrl ? (
            <section className="hiwaii-reveal mt-8 rounded-3xl border border-[var(--hiwaii-border)] bg-[linear-gradient(160deg,#101f44_0%,#0b1837_70%,#081328_100%)] p-8" style={{ animationDelay: '80ms' }}>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hiwaii-accent)]">{t.tryOnTitle}</p>
              <h2 className="mt-2 text-3xl font-black">{selectedArtProduct.name}</h2>
              <p className="mt-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{t.tryOnSubtitle}</p>
              <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--hiwaii-border)] bg-black">
                <video className="aspect-video w-full object-cover" src={selectedArtProduct.videoUrl} controls muted playsInline preload="metadata" />
              </div>
            </section>
          ) : null}

          <section className="hiwaii-reveal mt-8 rounded-3xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-8" style={{ animationDelay: '120ms' }}>
            <h2 className="text-3xl font-black">{t.storyTitle}</h2>
            <p className="mt-4 text-lg font-semibold leading-relaxed text-[var(--hiwaii-text-secondary)]">{storyTone}</p>
            <p className="mt-3 text-base font-semibold leading-relaxed text-[var(--hiwaii-text-secondary)]">
              <span className="font-black text-[var(--hiwaii-accent)]">{t.storyPrefix}</span> {selectedArtProduct?.description || product.description}
            </p>
            <h3 className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-[var(--hiwaii-accent)]">{t.detailsTitle}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {product.specifications.slice(0, 4).map((spec) => (
                <article key={spec.label} className="rounded-xl border border-[var(--hiwaii-border)] bg-[#0b1737] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--hiwaii-accent)]">{spec.label}</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--hiwaii-text-primary)]">{spec.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-8">
            <h2 className="text-3xl font-black">{t.specsTitle}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {product.specifications.map((spec) => (
                <article key={spec.label} className="rounded-xl border border-[var(--hiwaii-border)] bg-[#0b1737] p-4">
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--hiwaii-accent)]">{spec.label}</p>
                  <p className="mt-2 text-base font-semibold text-[var(--hiwaii-text-primary)]">{spec.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-8">
            <h2 className="text-3xl font-black">{t.sizeChart}</h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--hiwaii-border)] bg-[#e8e2cf] p-2">
              <img src={SIZE_CHART_URL} alt="Hawaiian size chart" className="w-full rounded-xl object-contain" />
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-3xl font-black">{t.relatedNiche}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              {relatedNiche.map((item) => (
                <Link key={item.id} href={withLang(`/product/${item.id}`, lang)} className="rounded-xl border border-[var(--hiwaii-border)] bg-[#0b1737] p-4 transition hover:border-[var(--hiwaii-accent)]">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <Image src={item.thumbnail} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                  <p className="mt-3 text-sm font-black">{item.name}</p>
                  <p className="text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{formatPrice(item.price)}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-3xl font-black">{t.relatedVibe}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              {relatedVibe.map((item) => (
                <Link key={item.id} href={withLang(`/product/${item.id}`, lang)} className="rounded-xl border border-[var(--hiwaii-border)] bg-[#0b1737] p-4 transition hover:border-[var(--hiwaii-accent)]">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <Image src={item.thumbnail} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                  <p className="mt-3 text-sm font-black">{item.name}</p>
                  <p className="text-sm font-semibold text-[var(--hiwaii-text-secondary)]">{item.niche} / {item.subNiche}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
