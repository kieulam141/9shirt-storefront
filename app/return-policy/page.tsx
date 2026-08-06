'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useLang } from '@/hooks/use-lang'
import { useIsViHost } from '@/hooks/use-brand'

export default function ReturnPolicyPage() {
  const lang = useLang()
  const isViHost = useIsViHost()

  return (
    <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
      <Header />
      
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="hiwaii-reveal hiwaii-grid-bg rounded-3xl border border-[var(--hiwaii-border)] bg-[#0a1736]/40 p-8 md:p-12 space-y-8 shadow-2xl backdrop-blur-md">
          <div className="space-y-2 border-b border-[var(--hiwaii-border)] pb-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--hiwaii-accent)]">
              {lang === 'vi' ? 'Chính sách mua hàng' : 'Store Policies'}
            </p>
            <h1 className="text-4xl font-black md:text-5xl">
              {lang === 'vi' ? 'Chính sách đổi trả' : 'Return & Refund Policy'}
            </h1>
          </div>

          <div className="space-y-6 text-slate-300 font-semibold leading-relaxed">
            {isViHost ? (
              // 9Shirt Return Policy
              lang === 'vi' ? (
                <>
                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">1. Thời gian đổi trả</h2>
                    <p>9Shirt hỗ trợ quý khách đổi hàng/trả hàng trong vòng <strong>7 ngày</strong> kể từ ngày nhận được sản phẩm thành công.</p>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">2. Điều kiện áp dụng đổi trả</h2>
                    <p>Sản phẩm cần thỏa mãn các điều kiện sau:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Sản phẩm còn nguyên tem mác, nhãn sườn của 9Shirt.</li>
                      <li>Sản phẩm chưa qua giặt là, không bám bẩn, không có mùi lạ và chưa qua sử dụng.</li>
                      <li>Không bị rách, sứt chỉ hoặc hư hại do tác động vật lý sau khi nhận hàng.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">3. Chính sách đổi size linh hoạt</h2>
                    <p>Vì tỷ lệ đơn hàng size M và L rất cao và phom dáng của chúng tôi là phom resort rộng rãi thoải mái:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>9Shirt hỗ trợ <strong>đổi size miễn phí</strong> (hỗ trợ phí ship 1 chiều gửi lại) nếu quý khách mặc không vừa hoặc muốn đổi sang phom rộng/ôm hơn.</li>
                      <li>Trường hợp quý khách muốn đổi sang mẫu mã khác, vui lòng liên hệ bộ phận hỗ trợ khách hàng để được hướng dẫn chi tiết.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">4. Quy trình đổi trả nhanh chóng</h2>
                    <p>Để tiến hành đổi size hoặc hoàn trả sản phẩm:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Liên hệ qua Hotline/Zalo: <strong>0396218880</strong> hoặc gửi email tới <strong>kieutunglam0612@gmail.com</strong>.</li>
                      <li>Cung cấp Mã đơn hàng (ví dụ: 9Sxxxxxx) và hình ảnh sản phẩm cần đổi trả.</li>
                      <li>Bộ phận CSKH sẽ điều phối shipper mang áo mới tới đổi trực tiếp cho quý khách ngay tại nhà (quý khách chỉ cần đưa lại áo cũ cho shipper, không cần ra bưu cục).</li>
                    </ol>
                  </section>
                </>
              ) : (
                <>
                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">1. Exchange & Return Window</h2>
                    <p>9Shirt supports returns and size exchanges within <strong>7 days</strong> from the date of package delivery.</p>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">2. Conditions for Returns</h2>
                    <p>Items must meet the following criteria:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Tags and brand labels must remain attached.</li>
                      <li>Items must be unworn, unwashed, and free of smells or stains.</li>
                      <li>No physical damage or modifications after receipt.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">3. Flexible Size Exchanges</h2>
                    <p>Because size M and L are our most popular choices and fit with a relaxed resort styling:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>We offer <strong>free size exchanges</strong> (we cover one-way return shipping) if your shirt does not fit as expected.</li>
                      <li>To switch to a completely different style, please contact customer support for catalog arrangements.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">4. Quick Exchange Process</h2>
                    <p>To initiate a return or exchange:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Contact us via Hotline/Zalo: <strong>0396218880</strong> or email <strong>kieutunglam0612@gmail.com</strong>.</li>
                      <li>Provide your Order ID (e.g., 9Sxxxxxx) and photos of the item.</li>
                      <li>Our CSKH team will coordinate a home-exchange service (where the courier delivers the new item and picks up the old one directly at your door).</li>
                    </ol>
                  </section>
                </>
              )
            ) : (
              // Hiwaii Return Policy
              lang === 'vi' ? (
                <>
                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">1. Đổi trả hàng trong 30 ngày</h2>
                    <p>Hiwaii hỗ trợ đổi trả hàng miễn phí trong vòng 30 ngày kể từ ngày mua cho khách hàng tại Hoa Kỳ.</p>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">2. Quy trình đổi trả quốc tế</h2>
                    <p>Quý khách vui lòng liên hệ bộ phận hỗ trợ toàn cầu để nhận nhãn trả hàng (return label) in sẵn.</p>
                  </section>
                </>
              ) : (
                <>
                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">1. 30-Day Return Window</h2>
                    <p>Hiwaii offers a 30-day return window for all unwashed, unworn items. Return labels are provided for standard US orders.</p>
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-2xl font-black text-[var(--hiwaii-accent)]">2. International Returns</h2>
                    <p>International orders can be returned; however, return shipping costs are the responsibility of the customer. Contact support to initiate an international claim.</p>
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
