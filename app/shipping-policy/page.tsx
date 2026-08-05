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
  const title = lang === 'vi' ? `Chính sách vận chuyển | ${brand.name}` : `Shipping Policy | ${brand.name}`

  return {
    title,
    description: `Chính sách vận chuyển toàn quốc từ kho Hà Nội của ${brand.name}. Giao hàng 2-4 ngày, đồng kiểm trước khi nhận.`,
    alternates: {
      canonical: toCanonical('/shipping-policy', lang, host),
      languages: languageAlternates('/shipping-policy', host),
    },
  }
}

export default async function ShippingPolicyPage() {
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
            <span className="text-xs font-black uppercase tracking-[0.2em] text-lime-300">Quy định giao nhận</span>
            <h1 className="mt-2 text-4xl font-black">{isVi ? 'Chính sách vận chuyển' : 'Shipping Policy'}</h1>
            <p className="mt-3 text-sm text-slate-400 font-semibold">Cập nhật lần cuối: Tháng 8/2026</p>
          </div>

          <div className="space-y-6 text-slate-200 leading-relaxed font-medium">
            <section className="space-y-2">
              <h2 className="text-xl font-black text-lime-300">1. Phạm vi & Thời gian giao hàng</h2>
              <p>9Shirt hỗ trợ giao hàng tận nơi trên toàn bộ 63 tỉnh thành Việt Nam thông qua các đối tác vận chuyển uy tín (GHTK, GHN, Viettel Post):</p>
              <ul className="list-disc pl-6 space-y-1 text-slate-300">
                <li><strong>Khu vực Hà Nội & Nội thành:</strong> 1 - 2 ngày làm việc.</li>
                <li><strong>Các Tỉnh/Thành phố khác:</strong> 2 - 4 ngày làm việc.</li>
              </ul>
            </section>

            <section className="space-y-2 border-t border-blue-200/10 pt-6">
              <h2 className="text-xl font-black text-lime-300">2. Phí vận chuyển</h2>
              <p>Phí vận chuyển chuẩn là <strong>30.000 VNĐ</strong> cho mỗi đơn hàng toàn quốc. Miễn phí vận chuyển áp dụng đối với các đơn hàng khuyến mãi combo bộ hoặc đơn từ 2 sản phẩm trở lên.</p>
            </section>

            <section className="space-y-2 border-t border-blue-200/10 pt-6">
              <h2 className="text-xl font-black text-lime-300">3. Quyền lợi kiểm tra hàng (Đồng kiểm)</h2>
              <p>Khách hàng được quyền <strong>bóc bưu phẩm và kiểm tra mẫu mã, chất lụa latin, đúng size</strong> trước khi thanh toán tiền mặt cho shipper (COD).</p>
            </section>
          </div>

          <div className="pt-6 border-t border-blue-200/10 text-center">
            <Link
              href={withLang('/collections', lang)}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-lime-300 px-8 text-sm font-black uppercase tracking-wider text-[#061227] transition hover:brightness-105"
            >
              {isVi ? 'Mua sắm ngay' : 'Shop Now'}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
