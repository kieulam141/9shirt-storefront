'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'
import { CartItem } from '@/components/CartItem'
import { useCart } from '@/context/CartContext'
import { i18n, withLang } from '@/lib/i18n'
import { formatPrice, priceUnitFor } from '@/lib/pricing'
import { useLang } from '@/hooks/use-lang'
import { useIsViHost } from '@/hooks/use-brand'

export default function CartPage() {
  const { items, total, clearCart } = useCart()
  const lang = useLang()
  const isViHost = useIsViHost()
  const t = i18n[lang].cart
  const unit = priceUnitFor(total)
  const isVnd = unit === 'vndK'
  const tax = isVnd ? 0 : total * 0.1
  const finalTotal = total + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)]">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-[var(--hiwaii-accent)]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 7H7" />
                <circle cx="10" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-[var(--hiwaii-text-primary)]">{t.emptyTitle}</h1>
            <p className="text-lg font-semibold text-[var(--hiwaii-text-secondary)]">
              {t.emptyText}
            </p>
            <Link
              href={withLang('/', lang)}
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--hiwaii-accent)] px-7 text-xs font-black uppercase tracking-[0.14em] text-[#071425] transition hover:brightness-105"
            >
              {t.continue}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
      <Header />

      <div className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--hiwaii-accent)]">
              {lang === 'vi' ? 'Giỏ hàng của bạn' : 'Your bag'}
            </p>
            <h1 className="mt-2 text-4xl font-black">{t.title}</h1>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--hiwaii-border)] bg-[#0b1736] px-5 py-2 text-sm font-black text-[var(--hiwaii-text-secondary)]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--hiwaii-accent)]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 7H7" /><circle cx="10" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /></svg>
            {items.length} {items.length === 1 ? (lang === 'vi' ? 'sản phẩm' : 'item') : (lang === 'vi' ? 'sản phẩm' : 'items')}
          </span>
        </div>

        <section className="mb-8 overflow-hidden rounded-2xl border border-[var(--hiwaii-accent)]/20 bg-[linear-gradient(135deg,#0d1e40_0%,#0a1630_60%,#091429_100%)] p-6">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--hiwaii-accent)]/30 bg-[var(--hiwaii-accent)]/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 text-[var(--hiwaii-accent)]" aria-hidden="true">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hiwaii-accent)]">
                {lang === 'vi' ? 'Muốn chỉnh sửa thêm?' : 'Need one more edit?'}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                {lang === 'vi' ? 'Quay lại trang chủ để chọn thêm mẫu theo phong cách hoặc đổi size trước khi thanh toán.' : 'Return home to pick more designs by style or change sizes before checkout.'}
              </p>
            </div>
            <Link
              href={withLang('/#lifestyle', lang)}
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--hiwaii-accent)] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#071425] transition hover:brightness-105"
            >
              {lang === 'vi' ? 'Chọn phong cách' : 'Choose style'}
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item) => (
                <CartItem key={`${item.id}-${item.size}`} item={item} />
              ))}
            </div>

            <Link
              href={withLang('/', lang)}
              className="mt-8 inline-flex items-center text-sm font-black uppercase tracking-[0.12em] text-[var(--hiwaii-accent)] transition-colors hover:brightness-110"
            >
              <span className="mr-2">←</span> {t.continue}
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="hiwaii-grid-bg hiwaii-orb-bg sticky top-24 h-fit rounded-2xl border border-[var(--hiwaii-border)] bg-[linear-gradient(165deg,#111f44_0%,#0a1734_64%,#081327_100%)] p-8">
              <h2 className="mb-6 text-2xl font-black">{t.orderSummary}</h2>

              <div className="mb-6 space-y-4 border-b border-[var(--hiwaii-border)] pb-6">
                <div className="flex justify-between text-[var(--hiwaii-text-secondary)]">
                  <span>{t.subtotal}</span>
                  <span>{formatPrice(total, unit)}</span>
                </div>
                <div className="flex justify-between text-[var(--hiwaii-text-secondary)]">
                  <span>{t.shipping}</span>
                  <span className="font-black text-[var(--hiwaii-accent)]">{t.free}</span>
                </div>
                <div className="flex justify-between text-[var(--hiwaii-text-secondary)]">
                  <span>{t.tax}</span>
                  <span>{isVnd ? t.free : formatPrice(tax, unit)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-8">
                <span className="text-xl font-black">{t.total}</span>
                <span className="text-3xl font-black text-[var(--hiwaii-accent)]">
                  {formatPrice(finalTotal, unit)}
                </span>
              </div>

              {/* Promo code */}
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  placeholder={lang === 'vi' ? 'Mã giảm giá...' : 'Promo code...'}
                  className="min-h-11 flex-1 rounded-xl border border-[var(--hiwaii-border)] bg-[#0a1632] px-4 text-sm font-semibold text-[var(--hiwaii-text-primary)] outline-none placeholder:text-[var(--hiwaii-text-muted)] focus:border-[var(--hiwaii-accent)] focus:ring-1 focus:ring-[var(--hiwaii-accent)]"
                />
                <button className="min-h-11 rounded-xl border border-[var(--hiwaii-border)] bg-[#0b1736] px-4 text-xs font-black uppercase tracking-[0.12em] text-[var(--hiwaii-text-secondary)] transition hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]">
                  {lang === 'vi' ? 'Áp dụng' : 'Apply'}
                </button>
              </div>

              <Link
                href={withLang('/checkout', lang)}
                className="mb-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--hiwaii-accent)] px-6 text-sm font-black uppercase tracking-[0.12em] text-[#071425] transition hover:brightness-105"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                {t.checkout}
              </Link>

              <button
                onClick={() => clearCart()}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[var(--hiwaii-border)] px-6 text-xs font-black uppercase tracking-[0.12em] text-[var(--hiwaii-text-secondary)] transition hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]"
              >
                {t.clear}
              </button>

              {/* Trust badges */}
              <div className="mt-8 space-y-3 border-t border-[var(--hiwaii-border)] pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--hiwaii-border)] bg-[#0a1632]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-[var(--hiwaii-accent)]" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" /><circle cx="7" cy="21" r="1" /><circle cx="17" cy="21" r="1" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--hiwaii-text-primary)]">{lang === 'vi' ? 'Giao hàng miễn phí' : 'Free shipping'}</p>
                    <p className="text-xs text-[var(--hiwaii-text-muted)]">{lang === 'vi' ? 'Áp dụng cho mọi đơn hàng' : 'On every order, no minimum'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--hiwaii-border)] bg-[#0a1632]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-[var(--hiwaii-accent)]" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--hiwaii-text-primary)]">{lang === 'vi' ? 'Thanh toán bảo mật' : 'Secure checkout'}</p>
                    <p className="text-xs text-[var(--hiwaii-text-muted)]">{lang === 'vi' ? 'Mã hóa SSL 256-bit' : '256-bit SSL encryption'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--hiwaii-border)] bg-[#0a1632]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-[var(--hiwaii-accent)]" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--hiwaii-text-primary)]">{lang === 'vi' ? 'Đảm bảo chất lượng' : 'Quality guaranteed'}</p>
                    <p className="text-xs text-[var(--hiwaii-text-muted)]">
                      {isViHost
                        ? (lang === 'vi' ? 'Dòng áo signature của 9Shirt' : 'Signature 9Shirt craftsmanship')
                        : (lang === 'vi' ? 'Dòng áo signature của Hiwaii' : 'Signature Hiwaii craftsmanship')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment methods */}
              <div className="mt-6 flex items-center justify-between border-t border-[var(--hiwaii-border)] pt-5">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--hiwaii-text-muted)]">
                  {lang === 'vi' ? 'Phương thức' : 'Pay via'}
                </p>
                <div className="flex items-center gap-2">
                  {(isViHost ? ['COD', 'VIETQR'] : ['VISA', 'MC', 'AMEX', 'PAYPAL']).map((m) => (
                    <span key={m} className="rounded border border-[var(--hiwaii-border)] bg-[#0a1632] px-2 py-1 text-[9px] font-black tracking-wide text-[var(--hiwaii-text-muted)]">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
