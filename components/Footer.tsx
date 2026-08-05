'use client'

import Link from 'next/link'
import { withLang } from '@/lib/i18n'
import { useLang } from '@/hooks/use-lang'
import { useIsViHost } from '@/hooks/use-brand'

export function Footer() {
  const lang = useLang()
  const isViHost = useIsViHost()

  return (
    <footer id="support" className="border-t border-blue-200/15 bg-[#030919] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1360px] gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <Link href={withLang('/', lang)} className="text-3xl font-black tracking-tight text-lime-300">
            {isViHost ? '9SHIRT' : 'HIWAII'}
          </Link>
          <p className="text-sm font-semibold leading-relaxed text-[var(--hiwaii-text-secondary)]">
            {isViHost
              ? (lang === 'vi'
                ? 'Thương hiệu áo Hawaii lụa latin thiết kế độc đáo và sản xuất tại Việt Nam.'
                : 'Premium Latin silk Hawaiian shirts designed and printed in Vietnam.')
              : (lang === 'vi'
                ? 'Áo Hawaii in full-print theo phong cách sống. Lọc nhanh theo niche, mua nhanh theo vibe.'
                : 'Statement Hawaiian shirts organized by lifestyle. Discover faster and shop with confidence.')}
          </p>
          {isViHost && (
            <p className="text-xs font-semibold text-[var(--hiwaii-text-muted)]">
              CÔNG TY TNHH 9FASHION • MST: 0110712144
            </p>
          )}
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--hiwaii-text-primary)]">
            {lang === 'vi' ? 'Mua sắm' : 'Shop'}
          </h4>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
            <li><Link href={withLang('/collections', lang)}>{lang === 'vi' ? 'Tất cả sản phẩm' : 'All shirts'}</Link></li>
            <li><Link href={withLang('/collections?niche=Sports', lang)}>Sports</Link></li>
            <li><Link href={withLang('/collections?niche=Animal', lang)}>Animal</Link></li>
            <li><Link href={withLang('/collections?niche=Art%20%26%20Music', lang)}>Art & Music</Link></li>
            <li><Link href={withLang('/collections?niche=Vintage', lang)}>Vintage</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--hiwaii-text-primary)]">
            {lang === 'vi' ? 'Khám phá & Hỗ trợ' : 'Discover & Support'}
          </h4>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
            <li>
              <Link href={withLang('/blog', lang)} className="hover:text-lime-300">
                {lang === 'vi' ? 'Blog & Cẩm nang thời trang' : 'Blog & Styling Guides'}
              </Link>
            </li>
            <li>
              <Link href={withLang('/shipping-policy', lang)} className="hover:text-lime-300">
                {lang === 'vi' ? 'Chính sách vận chuyển' : 'Shipping Policy'}
              </Link>
            </li>
            <li>
              <Link href={withLang('/return-policy', lang)} className="hover:text-lime-300">
                {lang === 'vi' ? 'Chính sách đổi trả' : 'Return & Refund Policy'}
              </Link>
            </li>
            <li>
              <Link href={withLang('/contact', lang)} className="hover:text-lime-300">
                {lang === 'vi' ? 'Liên hệ & Hỗ trợ' : 'Contact & Support'}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--hiwaii-text-primary)]">
            {isViHost ? (lang === 'vi' ? 'Thông tin công ty' : 'Company Info') : (lang === 'vi' ? 'Về Hiwaii' : 'About')}
          </h4>
          <div className="mt-3 text-sm font-semibold text-[var(--hiwaii-text-secondary)] space-y-1">
            {isViHost ? (
              <>
                <p>Số 16 ngõ 1 Đốc Ngữ, Sơn Tây, Hà Nội</p>
                <p>Hotline: 0396218880</p>
                <p>Email: support@9shirt.com.vn</p>
                <p className="text-xs text-[var(--hiwaii-text-muted)] pt-1">
                  STK Công ty: <strong className="text-lime-300">89088868</strong> - Techcombank
                </p>
              </>
            ) : (
              <p>
                {lang === 'vi'
                  ? 'Dòng áo statement cho mùa hè và du lịch.'
                  : 'Statement shirt line for travel, gifting, and standout daily wear.'}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-[1360px] border-t border-blue-200/10 pt-8 text-center text-xs font-semibold text-[var(--hiwaii-text-muted)]">
        <p>&copy; {new Date().getFullYear()} {isViHost ? '9shirt.com.vn • CÔNG TY TNHH 9FASHION' : 'Hiwaii.store'}. All rights reserved.</p>
      </div>
    </footer>
  )
}
