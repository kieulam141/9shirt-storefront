'use client'

import Link from 'next/link'
import { BrandLogo } from '@/components/BrandLogo'
import { withLang } from '@/lib/i18n'
import { useLang } from '@/hooks/use-lang'
import { CONTACT_EMAIL, CONTACT_PHONE, META_FANPAGE_URL, ZALO_URL } from '@/lib/contact'

export function Footer() {
  const lang = useLang()

  return (
    <footer id="support" className="border-t border-blue-200/15 bg-[#030919] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1360px] gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <BrandLogo compact />
          <p className="text-sm font-semibold leading-relaxed text-[var(--hiwaii-text-secondary)]">
            Thương hiệu áo Hawaii, quần short và outfit hè cá tính của CÔNG TY TNHH 9FASHION.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--hiwaii-text-primary)]">
            Phong cách
          </h4>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
            <li><Link href={withLang('/collections?niche=Sports', lang)}>Thể thao</Link></li>
            <li><Link href={withLang('/collections?niche=Animal', lang)}>Động vật</Link></li>
            <li><Link href={withLang('/collections?niche=Art%20%26%20Music', lang)}>Nghệ thuật & âm nhạc</Link></li>
            <li><Link href={withLang('/collections?niche=Vintage', lang)}>Vintage</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--hiwaii-text-primary)]">
            Hỗ trợ
          </h4>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
            <li>
              <Link href={withLang('/shipping-policy', lang)} className="hover:text-[var(--hiwaii-accent)]">
                Chính sách vận chuyển
              </Link>
            </li>
            <li>
              <Link href={withLang('/return-policy', lang)} className="hover:text-[var(--hiwaii-accent)]">
                Chính sách đổi trả
              </Link>
            </li>
            <li>
              <Link href={withLang('/contact', lang)} className="hover:text-[var(--hiwaii-accent)]">
                Liên hệ & Hỗ trợ
              </Link>
            </li>
            <li>
              <a href={ZALO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--hiwaii-accent)]">
                Chat Zalo
              </a>
            </li>
            <li>
              <a href={META_FANPAGE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--hiwaii-accent)]">
                Fanpage Meta
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--hiwaii-text-primary)]">
            Thông tin công ty
          </h4>
          <div className="mt-3 text-sm font-semibold text-[var(--hiwaii-text-secondary)] space-y-1">
            <p>CÔNG TY TNHH 9FASHION</p>
            <p>MST: 0110712144</p>
            <p>Số 16 ngõ 1 Đốc Ngữ, Sơn Tây, Hà Nội</p>
            <p>Hotline: {CONTACT_PHONE}</p>
            <p>Email: {CONTACT_EMAIL}</p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-[1360px] border-t border-blue-200/10 pt-8 text-center text-xs font-semibold text-[var(--hiwaii-text-muted)]">
        <p>&copy; {new Date().getFullYear()} 9shirt. CÔNG TY TNHH 9FASHION.</p>
      </div>
    </footer>
  )
}
