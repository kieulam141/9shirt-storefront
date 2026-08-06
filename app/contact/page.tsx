'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CONTACT_EMAIL, CONTACT_PHONE, META_FANPAGE_URL, ZALO_URL } from '@/lib/contact'

const supportCards = [
  {
    title: 'Tư vấn size',
    body: 'Gửi chiều cao, cân nặng và form mặc mong muốn qua Zalo để được gợi ý size trước khi đặt.',
    detail: 'Form áo Hawaii rộng hơn khoảng 1 size so với áo thường.',
  },
  {
    title: 'Đặt hàng & xác nhận',
    body: 'Sau khi đặt đơn, 9shirt kiểm tra thông tin nhận hàng, size và phương thức thanh toán trước khi đóng gói.',
    detail: 'Đơn COD/VietQR đều có bước xác nhận rõ ràng.',
  },
  {
    title: 'Vận chuyển',
    body: 'Đơn được xử lý từ Hà Nội. Thời gian giao dự kiến 2-4 ngày tùy khu vực và lịch vận hành của đơn vị vận chuyển.',
    detail: 'Khách được kiểm tra mẫu, size và chất vải khi nhận hàng COD.',
  },
  {
    title: 'Đổi size / đổi trả',
    body: 'Hỗ trợ đổi size trong 7 ngày nếu sản phẩm còn nguyên tình trạng ban đầu và chưa qua giặt/tẩy/sửa.',
    detail: 'Liên hệ trước qua Zalo để được hướng dẫn gửi đổi.',
  },
]

const faqItems = [
  ['Tôi phân vân giữa 2 size thì chọn thế nào?', 'Nếu thích mặc thoải mái, đi biển hoặc phối layer, hãy ưu tiên size lớn hơn. Nếu muốn gọn form, chọn theo cân nặng và số đo áo thực tế trong bảng size.'],
  ['Có thanh toán khi nhận hàng không?', 'Có. 9shirt hỗ trợ COD và VietQR. Với COD, bạn có thể kiểm tra hàng trước khi thanh toán cho nhân viên giao hàng.'],
  ['Muốn đổi size thì cần chuẩn bị gì?', 'Giữ sản phẩm sạch, nguyên tag/bao bì nếu còn, chưa giặt và chưa qua sử dụng ngoài thử size. Nhắn Zalo kèm mã đơn để được hướng dẫn.'],
  ['Tôi cần theo dõi đơn hàng thì liên hệ đâu?', `Nhắn Zalo hoặc gọi hotline ${CONTACT_PHONE}, cung cấp số điện thoại đặt hàng hoặc mã đơn để được kiểm tra nhanh.`],
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
      <Header />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <section className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[2rem] border border-[var(--hiwaii-border)] bg-[linear-gradient(155deg,#111f44_0%,#0c1835_58%,#091328_100%)] p-8 lg:p-11">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--hiwaii-accent)]">9shirt support</p>
            <h1 className="mt-4 text-5xl font-black leading-[0.94]">Hỗ trợ khách hàng</h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-relaxed text-[var(--hiwaii-text-secondary)]">
              Tư vấn size, xác nhận đơn, vận chuyển, đổi size và các vấn đề sau mua. 9shirt ưu tiên hỗ trợ nhanh qua Zalo và Fanpage.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={ZALO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-full bg-[var(--hiwaii-accent)] px-7 text-sm font-black uppercase tracking-[0.14em] text-[#071425] transition hover:brightness-105"
              >
                Chat Zalo
              </a>
              <a
                href={META_FANPAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-full border border-[var(--hiwaii-border)] px-7 text-sm font-black uppercase tracking-[0.14em] transition hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]"
              >
                Nhắn Fanpage
              </a>
            </div>
          </article>

          <aside className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-[var(--hiwaii-border)] bg-[#081633] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hiwaii-accent)]">Hotline / Zalo</p>
              <p className="mt-3 text-2xl font-black">{CONTACT_PHONE}</p>
              <p className="mt-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">Hỗ trợ 8:00-22:00 hàng ngày</p>
            </article>
            <article className="rounded-2xl border border-[var(--hiwaii-border)] bg-[#081633] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hiwaii-accent)]">Email</p>
              <p className="mt-3 break-words text-lg font-black">{CONTACT_EMAIL}</p>
              <p className="mt-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">Phản hồi trong vòng 24 giờ</p>
            </article>
            <article className="rounded-2xl border border-[var(--hiwaii-border)] bg-[#081633] p-5 sm:col-span-2">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--hiwaii-accent)]">Thông tin doanh nghiệp</p>
              <div className="mt-3 space-y-1 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                <p className="text-base font-black text-[var(--hiwaii-text-primary)]">CÔNG TY TNHH 9FASHION</p>
                <p>MST: 0110712144</p>
                <p>Địa chỉ: Số 16 ngõ 1 Đốc Ngữ, Sơn Tây, Hà Nội</p>
              </div>
            </article>
          </aside>
        </section>

        <section className="mx-auto mt-8 grid max-w-[1360px] gap-4 md:grid-cols-2 xl:grid-cols-4">
          {supportCards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-5">
              <h2 className="text-xl font-black text-[var(--hiwaii-accent)]">{card.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-[var(--hiwaii-text-secondary)]">{card.body}</p>
              <p className="mt-4 rounded-xl border border-[var(--hiwaii-border)] bg-[#07132c] p-3 text-xs font-bold leading-relaxed text-[var(--hiwaii-text-muted)]">{card.detail}</p>
            </article>
          ))}
        </section>

        <section className="mx-auto mt-8 grid max-w-[1360px] gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-[var(--hiwaii-border)] bg-[#0a1736] p-7">
            <h2 className="text-3xl font-black">Kênh hỗ trợ nên dùng</h2>
            <div className="mt-5 space-y-3 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
              <p><strong className="text-[var(--hiwaii-accent)]">Zalo:</strong> nhanh nhất cho tư vấn size, đổi size, theo dõi đơn.</p>
              <p><strong className="text-[var(--hiwaii-accent)]">Fanpage:</strong> phù hợp khi gửi ảnh outfit, hỏi mẫu mới hoặc cần tư vấn phong cách.</p>
              <p><strong className="text-[var(--hiwaii-accent)]">Email:</strong> dùng cho yêu cầu cần lưu thông tin, khiếu nại hoặc đối soát đơn hàng.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shipping-policy" className="inline-flex min-h-11 items-center rounded-full border border-[var(--hiwaii-border)] px-5 text-xs font-black uppercase tracking-[0.12em] hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]">
                Chính sách vận chuyển
              </Link>
              <Link href="/return-policy" className="inline-flex min-h-11 items-center rounded-full border border-[var(--hiwaii-border)] px-5 text-xs font-black uppercase tracking-[0.12em] hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]">
                Chính sách đổi trả
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-7">
            <h2 className="text-3xl font-black">Câu hỏi thường gặp</h2>
            <div className="mt-5 space-y-3">
              {faqItems.map(([question, answer]) => (
                <details key={question} className="rounded-xl border border-[var(--hiwaii-border)] bg-[#07132c] p-4">
                  <summary className="cursor-pointer text-sm font-black text-[var(--hiwaii-text-primary)]">{question}</summary>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-[var(--hiwaii-text-secondary)]">{answer}</p>
                </details>
              ))}
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  )
}
