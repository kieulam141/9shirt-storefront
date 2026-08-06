'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useLang } from '@/hooks/use-lang'
import { useIsViHost } from '@/hooks/use-brand'

export default function ShippingPolicyPage() {
  const lang = useLang()
  const isViHost = useIsViHost()

  return (
    <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
      <Header />
      
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="hiwaii-reveal hiwaii-grid-bg rounded-3xl border border-[var(--hiwaii-border)] bg-[#0a1736]/40 p-8 md:p-12 space-y-8 shadow-2xl backdrop-blur-md">
          <div className="space-y-2 border-b border-[var(--hiwaii-border)] pb-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--hiwaii-accent)]">
              {lang === 'vi' ? 'Hỗ trợ khách hàng' : 'Customer Support'}
            </p>
            <h1 className="text-4xl font-black md:text-5xl">
              {lang === 'vi' ? 'Chính sách vận chuyển' : 'Shipping Policy'}
            </h1>
          </div>

          <div className="space-y-6 text-slate-300 font-semibold leading-relaxed">
            {isViHost ? (
              // 9Shirt Shipping Policy
              lang === 'vi' ? (
                <>
                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">1. Thời gian giao hàng</h2>
                    <p>Mọi đơn hàng tại 9shirt được in ấn và chuẩn bị từ điểm vận hành của CÔNG TY TNHH 9FASHION tại số 16 ngõ 1 Đốc Ngữ, Sơn Tây, Hà Nội. Thời gian giao hàng dự kiến:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Nội thành Hà Nội:</strong> 1 - 2 ngày làm việc.</li>
                      <li><strong>Các tỉnh thành miền Bắc & miền Trung:</strong> 2 - 3 ngày làm việc.</li>
                      <li><strong>Các tỉnh thành miền Nam:</strong> 3 - 5 ngày làm việc.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">2. Phí vận chuyển</h2>
                    <p>9Shirt áp dụng chính sách <strong>MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC</strong> cho tất cả các đơn hàng, không giới hạn giá trị đơn hàng tối thiểu.</p>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">3. Đơn vị vận chuyển đối tác</h2>
                    <p>Đơn hàng được chuyển phát thông qua các đối tác giao vận hàng đầu Việt Nam như Giao Hàng Nhanh (GHN), Viettel Post hoặc Giao Hàng Tiết Kiệm (GHTK) để đảm bảo hàng hóa đến tay khách hàng nhanh nhất và an toàn nhất.</p>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">4. Kiểm tra và nhận hàng</h2>
                    <p>Khi nhận hàng, quý khách được quyền mở gói hàng kiểm tra mẫu mã, size số và chất vải trước khi thanh toán cho nhân viên giao hàng (áp dụng cho đơn COD).</p>
                  </section>
                </>
              ) : (
                <>
                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">1. Delivery Timeframes</h2>
                    <p>All 9Shirt orders are printed and fulfilled directly from our workshop in Son Tay, Hanoi. Estimated delivery times:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Hanoi Area:</strong> 1 - 2 business days.</li>
                      <li><strong>Central & Northern Vietnam:</strong> 2 - 3 business days.</li>
                      <li><strong>Southern Vietnam:</strong> 3 - 5 business days.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">2. Shipping Fees</h2>
                    <p>9Shirt offers <strong>FREE NATIONWIDE SHIPPING</strong> for all orders, with no minimum purchase required.</p>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">3. Shipping Partners</h2>
                    <p>We partner with major Vietnamese carriers including Giao Hang Nhanh (GHN), Viettel Post, and Giao Hang Tiet Kiem (GHTK) to ensure quick and reliable delivery.</p>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">4. Inspection upon Delivery</h2>
                    <p>For Cash on Delivery (COD) orders, customers are welcome to inspect the package (check the style, size, and fabric feel) before making the payment.</p>
                  </section>
                </>
              )
            ) : (
              // Hiwaii Shipping Policy
              lang === 'vi' ? (
                <>
                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">1. Thời gian xử lý & vận chuyển</h2>
                    <p>Sản phẩm của Hiwaii được vận chuyển từ hệ thống kho tại Hoa Kỳ. Thời gian vận chuyển:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Vận chuyển nội địa Mỹ:</strong> 3 - 5 ngày làm việc.</li>
                      <li><strong>Vận chuyển quốc tế:</strong> 7 - 14 ngày làm việc tùy quốc gia.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">2. Phí vận chuyển toàn cầu</h2>
                    <p>Miễn phí vận chuyển cho các đơn hàng từ $75 trở lên. Với đơn hàng dưới $75, phí vận chuyển tiêu chuẩn sẽ được tính khi thanh toán.</p>
                  </section>
                </>
              ) : (
                <>
                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">1. Processing & Shipping Times</h2>
                    <p>Hiwaii products are shipped from our US fulfillment centers. Delivery times:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Standard US Shipping:</strong> 3 - 5 business days.</li>
                      <li><strong>International Shipping:</strong> 7 - 14 business days depending on destination.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">2. Shipping Costs</h2>
                    <p>Free standard shipping is automatically applied to all orders over $75. For orders under $75, flat-rate shipping is calculated at checkout.</p>
                  </section>
                </>
              )
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
