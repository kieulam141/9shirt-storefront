'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { useCart } from '@/context/CartContext'
import { withLang } from '@/lib/i18n'
import { formatPrice, priceUnitFor } from '@/lib/pricing'
import { useLang } from '@/hooks/use-lang'
import { useIsViHost } from '@/hooks/use-brand'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const lang = useLang()
  const isViHost = useIsViHost()
  const router = useRouter()
  
  const unit = priceUnitFor(total)
  const isVnd = unit === 'vndK'

  // Form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [ward, setWard] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr'>('cod')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState('')

  // Redirect if cart is empty (unless order is already placed)
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      router.push(withLang('/cart', lang))
    }
  }, [items, orderSuccess, router, lang])

  // Generate a mock order ID
  const orderId = useMemo(() => {
    return '9S' + Math.floor(100000 + Math.random() * 900000)
  }, [])

  // Calculate final total (including tax 10% for USD, or flat price for VND)
  const finalPriceValue = isVnd ? total : total * 1.1
  const finalPriceString = formatPrice(finalPriceValue, unit)
  
  // VietQR URL generation
  const vietQrUrl = useMemo(() => {
    const amountInVnd = total * 1000
    return `https://img.vietqr.io/image/MB-999914101996-print.png?amount=${amountInVnd}&addInfo=9SHIRT%20${orderId}&accountName=KIEU%20TUNG%20LAM`
  }, [total, orderId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !phone || !province || !district || !ward || !addressDetail || (!isViHost && !email)) {
      alert(lang === 'vi' ? 'Vui lòng nhập đầy đủ thông tin giao hàng!' : 'Please fill in all shipping fields!')
      return
    }

    setIsSubmitting(true)
    
    // Construct order payload
    const orderPayload = {
      orderId,
      customer: {
        fullName,
        email,
        phone,
        address: `${addressDetail}, ${ward}, ${district}, ${province}`,
      },
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      total: finalPriceValue,
      paymentMethod,
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.checkoutUrl) {
          clearCart()
          window.location.href = data.checkoutUrl
          return
        }
        setCreatedOrderId(orderId)
        setOrderSuccess(true)
        clearCart()
      } else {
        throw new Error('Failed to create order')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(lang === 'vi' ? 'Đã xảy ra lỗi trong quá trình đặt hàng. Vui lòng thử lại!' : 'An error occurred. Please try again!')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="hiwaii-reveal hiwaii-grid-bg rounded-3xl border border-[var(--hiwaii-accent)]/20 bg-[#0a1736] p-8 md:p-12 space-y-6 shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--hiwaii-accent)]/10 border border-[var(--hiwaii-accent)]/30">
              <svg className="h-10 w-10 text-[var(--hiwaii-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-4xl font-black text-[var(--hiwaii-text-primary)]">
              {lang === 'vi' ? 'Đặt hàng thành công!' : 'Order Placed!'}
            </h1>
            
            <div className="text-slate-300 space-y-2 font-semibold">
              <p>{lang === 'vi' ? `Cảm ơn bạn đã mua sắm tại 9Shirt. Mã đơn hàng của bạn là:` : `Thank you for shopping at Hiwaii. Your order ID is:`}</p>
              <p className="text-2xl font-black text-[var(--hiwaii-accent)]">{createdOrderId}</p>
            </div>

            {paymentMethod === 'vietqr' && (
              <div className="mt-8 p-6 bg-slate-900/60 rounded-2xl border border-slate-700 space-y-4 max-w-sm mx-auto">
                <p className="text-sm font-black text-[var(--hiwaii-accent)] uppercase tracking-wider">
                  {lang === 'vi' ? 'Quét mã VietQR chuyển khoản' : 'Scan VietQR to Transfer'}
                </p>
                <div className="relative mx-auto aspect-square w-full max-w-[240px] bg-white p-2 rounded-xl">
                  <img src={vietQrUrl} alt="VietQR Code" className="w-full h-full object-contain" />
                </div>
                <div className="text-left text-xs space-y-1 text-slate-300">
                  <p>🏛️ <strong>{lang === 'vi' ? 'Ngân hàng:' : 'Bank:'}</strong> MB Bank (Ngân hàng Quân đội)</p>
                  <p>💳 <strong>{lang === 'vi' ? 'Số tài khoản:' : 'Account No:'}</strong> 999914101996</p>
                  <p>👤 <strong>{lang === 'vi' ? 'Chủ tài khoản:' : 'Account Name:'}</strong> KIEU TUNG LAM</p>
                  <p>💰 <strong>{lang === 'vi' ? 'Số tiền:' : 'Amount:'}</strong> {finalPriceString}</p>
                  <p>📝 <strong>{lang === 'vi' ? 'Nội dung:' : 'Description:'}</strong> 9SHIRT {createdOrderId}</p>
                </div>
              </div>
            )}

            <div className="pt-6">
              <Link
                href={withLang('/', lang)}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--hiwaii-accent)] px-8 text-sm font-black uppercase tracking-[0.14em] text-[#071425] transition hover:brightness-105"
              >
                {lang === 'vi' ? 'Tiếp tục mua sắm' : 'Continue Shopping'}
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
      <Header />
      
      <main className="mx-auto max-w-[1360px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--hiwaii-accent)]">
            {lang === 'vi' ? 'Thanh toán an toàn' : 'Secure Checkout'}
          </p>
          <h1 className="mt-2 text-4xl font-black">{lang === 'vi' ? 'Tiến hành Thanh toán' : 'Checkout'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shipping Form & Payment Method */}
          <div className="lg:col-span-7 space-y-8">
            <fieldset className="hiwaii-reveal rounded-2xl border border-[var(--hiwaii-border)] bg-[#0a1736]/40 p-6 space-y-4">
              <legend className="px-3 text-lg font-black text-[var(--hiwaii-accent)] uppercase tracking-wider">
                {lang === 'vi' ? 'Thông tin giao hàng' : 'Shipping Address'}
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block space-y-2">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-wide">
                    {lang === 'vi' ? 'Họ và tên *' : 'Full Name *'}
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={lang === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
                    className="min-h-11 w-full rounded-xl border border-[var(--hiwaii-border)] bg-[#0a1632] px-4 text-sm font-semibold text-[var(--hiwaii-text-primary)] outline-none focus:border-[var(--hiwaii-accent)] focus:ring-1 focus:ring-[var(--hiwaii-accent)]"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-wide">
                    {lang === 'vi' ? 'Số điện thoại *' : 'Phone Number *'}
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912345678"
                    className="min-h-11 w-full rounded-xl border border-[var(--hiwaii-border)] bg-[#0a1632] px-4 text-sm font-semibold text-[var(--hiwaii-text-primary)] outline-none focus:border-[var(--hiwaii-accent)] focus:ring-1 focus:ring-[var(--hiwaii-accent)]"
                  />
                </label>
              </div>

              {!isViHost ? (
                <label className="block space-y-2">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-wide">
                    Email *
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="min-h-11 w-full rounded-xl border border-[var(--hiwaii-border)] bg-[#0a1632] px-4 text-sm font-semibold text-[var(--hiwaii-text-primary)] outline-none focus:border-[var(--hiwaii-accent)] focus:ring-1 focus:ring-[var(--hiwaii-accent)]"
                  />
                </label>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="block space-y-2">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-wide">
                    {lang === 'vi' ? 'Tỉnh / Thành phố *' : 'Province / City *'}
                  </span>
                  <input
                    type="text"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder={lang === 'vi' ? 'Hà Nội' : 'Hanoi'}
                    className="min-h-11 w-full rounded-xl border border-[var(--hiwaii-border)] bg-[#0a1632] px-4 text-sm font-semibold text-[var(--hiwaii-text-primary)] outline-none focus:border-[var(--hiwaii-accent)]"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-wide">
                    {lang === 'vi' ? 'Quận / Huyện *' : 'District *'}
                  </span>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder={lang === 'vi' ? 'Sơn Tây' : 'Son Tay'}
                    className="min-h-11 w-full rounded-xl border border-[var(--hiwaii-border)] bg-[#0a1632] px-4 text-sm font-semibold text-[var(--hiwaii-text-primary)] outline-none focus:border-[var(--hiwaii-accent)]"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-wide">
                    {lang === 'vi' ? 'Phường / Xã *' : 'Ward *'}
                  </span>
                  <input
                    type="text"
                    required
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder={lang === 'vi' ? 'Đốc Ngữ' : 'Doc Ngu'}
                    className="min-h-11 w-full rounded-xl border border-[var(--hiwaii-border)] bg-[#0a1632] px-4 text-sm font-semibold text-[var(--hiwaii-text-primary)] outline-none focus:border-[var(--hiwaii-accent)]"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-xs font-black text-slate-300 uppercase tracking-wide">
                  {lang === 'vi' ? 'Địa chỉ chi tiết (Số nhà, đường...) *' : 'Street Address *'}
                </span>
                <input
                  type="text"
                  required
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  placeholder={lang === 'vi' ? '11 Đốc Ngữ' : '11 Doc Ngu'}
                  className="min-h-11 w-full rounded-xl border border-[var(--hiwaii-border)] bg-[#0a1632] px-4 text-sm font-semibold text-[var(--hiwaii-text-primary)] outline-none focus:border-[var(--hiwaii-accent)]"
                />
              </label>
            </fieldset>

            <fieldset className="hiwaii-reveal rounded-2xl border border-[var(--hiwaii-border)] bg-[#0a1736]/40 p-6 space-y-4">
              <legend className="px-3 text-lg font-black text-[var(--hiwaii-accent)] uppercase tracking-wider">
                {lang === 'vi' ? 'Phương thức thanh toán' : 'Payment Method'}
              </legend>

              {isViHost ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`rounded-2xl border p-4 text-left transition flex items-center justify-between ${paymentMethod === 'cod' ? 'border-[var(--hiwaii-accent)] bg-[var(--hiwaii-accent-soft)]' : 'border-[var(--hiwaii-border)] bg-[#0f1f47] hover:border-[var(--hiwaii-accent)]'}`}
                >
                  <div>
                    <p className="text-base font-black text-[var(--hiwaii-text-primary)]">
                      💵 {lang === 'vi' ? 'Thanh toán khi nhận hàng (COD)' : 'Cash on Delivery (COD)'}
                    </p>
                    <p className="mt-1 text-xs text-slate-300 font-semibold">
                      {lang === 'vi' ? 'Nhận hàng rồi mới trả tiền mặt' : 'Pay with cash upon delivery'}
                    </p>
                  </div>
                  {paymentMethod === 'cod' && (
                    <span className="w-5 h-5 rounded-full bg-[var(--hiwaii-accent)] flex items-center justify-center text-[#061227] text-xs font-black">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('vietqr')}
                  className={`rounded-2xl border p-4 text-left transition flex items-center justify-between ${paymentMethod === 'vietqr' ? 'border-[var(--hiwaii-accent)] bg-[var(--hiwaii-accent-soft)]' : 'border-[var(--hiwaii-border)] bg-[#0f1f47] hover:border-[var(--hiwaii-accent)]'}`}
                >
                  <div>
                    <p className="text-base font-black text-[var(--hiwaii-text-primary)]">
                      📱 {lang === 'vi' ? 'Chuyển khoản VietQR' : 'VietQR Bank Transfer'}
                    </p>
                    <p className="mt-1 text-xs text-slate-300 font-semibold">
                      {lang === 'vi' ? 'Quét mã VietQR chuyển khoản nhanh' : 'Instant transfer via VietQR'}
                    </p>
                  </div>
                  {paymentMethod === 'vietqr' && (
                    <span className="w-5 h-5 rounded-full bg-[var(--hiwaii-accent)] flex items-center justify-center text-[#061227] text-xs font-black">✓</span>
                  )}
                </button>
              </div>
              ) : (
                <div className="rounded-2xl border border-[var(--hiwaii-accent)] bg-[var(--hiwaii-accent-soft)] p-4">
                  <p className="text-base font-black text-[var(--hiwaii-text-primary)]">
                    Shopify secure checkout
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-300">
                    You will be redirected to Hiwaii&apos;s Shopify checkout to complete payment securely.
                  </p>
                </div>
              )}
            </fieldset>
          </div>

          {/* Cart Summary Column */}
          <div className="lg:col-span-5">
            <div className="hiwaii-grid-bg sticky top-24 rounded-2xl border border-[var(--hiwaii-border)] bg-[linear-gradient(165deg,#111f44_0%,#0a1734_64%,#081327_100%)] p-6 space-y-6">
              <h2 className="text-2xl font-black border-b border-[var(--hiwaii-border)] pb-4">
                {lang === 'vi' ? 'Đơn hàng của bạn' : 'Your Order'}
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center justify-between">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-700">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black truncate">{item.name}</p>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        {lang === 'vi' ? 'Size:' : 'Size:'} {item.size} • {lang === 'vi' ? 'SL:' : 'Qty:'} {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-black text-[var(--hiwaii-accent)]">
                      {formatPrice(item.price * item.quantity, unit)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing Totals */}
              <div className="border-t border-[var(--hiwaii-border)] pt-4 space-y-3 font-semibold text-slate-300 text-sm">
                <div className="flex justify-between">
                  <span>{lang === 'vi' ? 'Tạm tính' : 'Subtotal'}</span>
                  <span>{formatPrice(total, unit)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'vi' ? 'Vận chuyển' : 'Shipping'}</span>
                  <span className="text-[var(--hiwaii-accent)] font-black">{lang === 'vi' ? 'Miễn phí' : 'Free'}</span>
                </div>
                {!isVnd && (
                  <div className="flex justify-between">
                    <span>{lang === 'vi' ? 'Thuế (10%)' : 'Tax (10%)'}</span>
                    <span>{formatPrice(total * 0.1, unit)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white text-lg font-black border-t border-[var(--hiwaii-border)] pt-3">
                  <span>{lang === 'vi' ? 'Tổng cộng' : 'Total'}</span>
                  <span className="text-[var(--hiwaii-accent)] text-2xl">{finalPriceString}</span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-12 rounded-full bg-[var(--hiwaii-accent)] text-[#071425] text-base font-black uppercase tracking-wider flex items-center justify-center transition hover:brightness-105 disabled:bg-[#2c3755] disabled:text-[#9bb2d8] disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#071425] border-t-transparent" />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 mr-2" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    {isViHost
                      ? (lang === 'vi' ? `Đặt hàng • ${finalPriceString}` : `Place Order • ${finalPriceString}`)
                      : `Continue to Shopify • ${finalPriceString}`}
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-slate-400 font-semibold text-center leading-relaxed">
                {lang === 'vi' 
                  ? 'Bằng việc đặt hàng, bạn đồng ý với các Điều khoản mua bán của 9Shirt.'
                  : 'By continuing, you agree to Hiwaii\'s Shopify checkout terms.'}
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
