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
  const title = lang === 'vi' ? `Chính sách đổi trả | ${brand.name}` : `Return Policy | ${brand.name}`

  return {
    title,
    description: `Chính sách đổi trả và bảo hành sản phẩm trong vòng 7 ngày của ${brand.name}. Hỗ trợ đổi size nhanh chóng.`,
    alternates: {
      canonical: toCanonical('/return-policy', lang, host),
      languages: languageAlternates('/return-policy', host),
    },
  }
}

export default async function ReturnPolicyPage() {
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
            <span className="text-xs font-black uppercase tracking-[0.2em] text-lime-300">Đổi trả & Bảo hành</span>
            <h1 className="mt-2 text-4xl font-black">{isVi ? 'Chính sách đổi trả' : 'Return Policy'}</h1>
            <p className="mt-3 text-sm text-slate-400 font-semibold">Đổi size miễn phí trong vòng 7 ngày</p>
          </div>

          <div className="space-y-6 text-slate-200 leading-relaxed font-medium">
            <section className="space-y-2">
              <h2 className="text-xl font-black text-lime-300">1. Điều kiện đổi trả</h2>
              <ul className="list-disc pl-6 space-y-1 text-slate-300">
                <li>Sản phẩm còn nguyên tem mác, chưa qua sử dụng, giặt tẩy.</li>
                <li>Thời gian đổi hàng: Trong vòng <strong>07 ngày</strong> kể từ khi khách nhận được sản phẩm.</li>
                <li>Áp dụng đổi size hoặc đổi mẫu có giá trị tương đương/cao hơn.</li>
              </ul>
            </section>

            <section className="space-y-2 border-t border-blue-200/10 pt-6">
              <h2 className="text-xl font-black text-lime-300">2. Chi phí đổi size</h2>
              <p>Trường hợp đổi size do mặc rộng/chật, 9Shirt hỗ trợ thu đổi tận nhà (shipper mang size mới tới đưa và nhận lại size cũ). Phí vận chuyển 2 chiều là 30k.</p>
              <p>Trường hợp sản phẩm bị lỗi sản xuất, gửi sai mẫu hoặc sai size so với đơn đặt: 9Shirt chịu <strong>100% chi phí đổi trả 2 chiều</strong>.</p>
            </section>

            <section className="space-y-2 border-t border-blue-200/10 pt-6">
              <h2 className="text-xl font-black text-lime-300">3. Quy trình thực hiện</h2>
              <p>Liên hệ ngay Zalo CSKH: <strong className="text-lime-300">0396218880</strong> kèm mã đơn hàng hoặc SĐT đặt hàng. Đội ngũ CSKH sẽ sắp xếp cho shipper tới đổi tận tay trong vòng 2-3 ngày.</p>
            </section>
          </div>

          <div className="pt-6 border-t border-blue-200/10 text-center">
            <Link
              href={withLang('/collections', lang)}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-lime-300 px-8 text-sm font-black uppercase tracking-wider text-[#061227] transition hover:brightness-105"
            >
              {isVi ? 'Quay lại mua sắm' : 'Shop Now'}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
