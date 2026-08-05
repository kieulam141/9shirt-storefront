import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { withLang } from '@/lib/i18n'
import { getBrandConfig, getDefaultLangForHost, languageAlternates, toCanonical } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host')
  const brand = getBrandConfig(host)
  const lang = getDefaultLangForHost(host)
  const title = lang === 'vi' ? `Liên hệ & Hỗ trợ | ${brand.name}` : `Contact & Support | ${brand.name}`

  return {
    title,
    description: `Thông tin liên hệ hotline, Zalo và địa chỉ hỗ trợ của ${brand.name}.`,
    alternates: {
      canonical: toCanonical('/contact', lang, host),
      languages: languageAlternates('/contact', host),
    },
  }
}

export default async function ContactPage() {
  const requestHeaders = await headers()
  const host = requestHeaders.get('host')
  const lang = getDefaultLangForHost(host)
  const isVi = lang === 'vi'

  return (
    <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="hiwaii-reveal rounded-3xl border border-blue-200/15 bg-[#081329] p-8 md:p-12 space-y-8">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-lime-300">CSKH & Support</span>
            <h1 className="mt-2 text-4xl font-black">{isVi ? 'Liên hệ & Hỗ trợ' : 'Contact Us'}</h1>
            <p className="mt-3 text-base text-slate-300 font-semibold">
              {isVi
                ? 'Đội ngũ hỗ trợ khách hàng của 9Shirt sẵn sàng phục vụ 24/7 qua Hotline, Zalo và Email.'
                : 'Our support team is ready to help you with size selection, order tracking, and custom requests.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-blue-200/10 pt-8">
            <div className="rounded-2xl border border-blue-200/10 bg-[#0c1b3a] p-6 space-y-3">
              <div className="text-2xl">📞</div>
              <h2 className="text-lg font-black text-lime-300">{isVi ? 'Hotline & Zalo' : 'Phone & Zalo'}</h2>
              <p className="text-sm font-bold text-white">0396218880 / 0389630994</p>
              <p className="text-xs text-slate-400 font-semibold">
                {isVi ? 'Phục vụ từ 8h00 - 22h00 hàng ngày' : 'Daily 8:00 - 22:00 (GMT+7)'}
              </p>
              <a
                href="https://zalo.me/0396218880"
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 rounded-full border border-lime-300/40 bg-lime-300/10 px-4 py-1.5 text-xs font-black uppercase text-lime-200 hover:bg-lime-300/20"
              >
                Chat Zalo Ngay 💬
              </a>
            </div>

            <div className="rounded-2xl border border-blue-200/10 bg-[#0c1b3a] p-6 space-y-3">
              <div className="text-2xl">🏢</div>
              <h2 className="text-lg font-black text-lime-300">{isVi ? 'Văn phòng & Kho hàng' : 'Address'}</h2>
              <p className="text-sm font-bold text-white">Số 16 ngõ 1 Đốc Ngữ, Sơn Tây, Hà Nội</p>
              <p className="text-xs text-slate-400 font-semibold">CÔNG TY TNHH 9FASHION • MST: 0110712144</p>
            </div>

            <div className="rounded-2xl border border-blue-200/10 bg-[#0c1b3a] p-6 space-y-3">
              <div className="text-2xl">✉️</div>
              <h2 className="text-lg font-black text-lime-300">Email</h2>
              <p className="text-sm font-bold text-white">support@9shirt.com.vn</p>
              <p className="text-xs text-slate-400 font-semibold">
                {isVi ? 'Phản hồi trong vòng 24 giờ làm việc' : 'Response within 24 business hours'}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200/10 bg-[#0c1b3a] p-6 space-y-3">
              <div className="text-2xl">💳</div>
              <h2 className="text-lg font-black text-lime-300">{isVi ? 'Tài khoản Công ty' : 'Bank Account'}</h2>
              <p className="text-sm font-bold text-white">STK: 89088868 - Techcombank</p>
              <p className="text-xs text-slate-400 font-semibold">Chủ TK: CÔNG TY TNHH 9FASHION</p>
            </div>
          </div>

          <div className="pt-6 text-center">
            <Link
              href={withLang('/collections', lang)}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-lime-300 px-8 text-sm font-black uppercase tracking-wider text-[#061227] transition hover:brightness-105"
            >
              {isVi ? 'Quay lại Bộ sưu tập' : 'Browse Collections'}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
