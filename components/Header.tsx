'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { i18n, withLang } from '@/lib/i18n'
import { useLang } from '@/hooks/use-lang'

export function Header() {
  const { items } = useCart()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const lang = useLang()
  const t = i18n[lang].header
  const pathname = usePathname()

  function navClass(href: string) {
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
    return `relative text-sm font-extrabold uppercase tracking-[0.14em] transition-colors hover:text-lime-300 ${
      isActive
        ? 'text-lime-300 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-lime-300'
        : 'text-slate-100'
    }`
  }

  return (
    <header className="sticky top-0 z-50 border-b border-blue-200/15 bg-[#050d22]/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-[76px] w-full max-w-[1360px] items-center px-4 sm:px-6 lg:px-8">
        <Link href={withLang('/', lang)} className="mr-auto flex items-center gap-3 text-lime-300">
          <span className="text-4xl font-black tracking-tight">HIWAII</span>
          <span className="hidden rounded-full border border-lime-300/40 bg-lime-300/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-lime-200 lg:inline-flex">
            {lang === 'vi' ? 'xưởng mockup' : 'mockup lab'}
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href={withLang('/', lang)} className={navClass('/')}>
            {t.shop}
          </Link>
          <Link href={withLang('/collections', lang)} className={navClass('/collections')}>
            {t.collections}
          </Link>
          <a href={withLang('/#lifestyle', lang)} className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-100 transition-colors hover:text-lime-300">
            {t.lifestyle}
          </a>
          <a href={withLang('/#support', lang)} className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-100 transition-colors hover:text-lime-300">
            {t.contact}
          </a>
        </nav>
        <div className="ml-4 hidden items-center gap-2 rounded-full border border-blue-200/20 bg-[#0f1c39] px-3 py-1.5 md:flex">
          <Link href={withLang('/', 'en')} className={`text-xs font-black uppercase tracking-[0.14em] ${lang === 'en' ? 'text-lime-300' : 'text-slate-300 hover:text-slate-100'}`}>EN</Link>
          <span className="text-blue-200/40">/</span>
          <Link href={withLang('/', 'vi')} className={`text-xs font-black uppercase tracking-[0.14em] ${lang === 'vi' ? 'text-lime-300' : 'text-slate-300 hover:text-slate-100'}`}>VI</Link>
        </div>
        <Link
          href={withLang('/collections', lang)}
          className="ml-3 hidden min-h-10 items-center rounded-full border border-lime-300/30 bg-lime-300/10 px-4 text-xs font-extrabold uppercase tracking-[0.14em] text-lime-200 transition hover:bg-lime-300/20 lg:inline-flex"
        >
          {lang === 'vi' ? 'Build mockup' : 'Build mockup'}
        </Link>
        <Link
          href={withLang('/cart', lang)}
          className={`relative ml-6 rounded-full border px-5 py-2 text-sm font-extrabold uppercase tracking-[0.14em] transition-colors hover:border-lime-300/40 hover:text-lime-300 ${pathname === '/cart' ? 'border-lime-300/50 bg-lime-300/10 text-lime-300' : 'border-blue-200/35 bg-[#111d3a] text-slate-100'}`}
        >
          {t.cart}
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-lime-300 px-1 text-[10px] font-black text-[#0a132b]">
              {cartCount}
            </span>
          )}
        </Link>
        <Link
          href={withLang('/cart', lang)}
          className="relative ml-4 rounded-full border border-blue-200/35 bg-[#111d3a] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-100 md:hidden"
        >
          {t.cart}
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-lime-300 px-1 text-[10px] font-black text-[#0a132b]">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
      <div className="border-t border-blue-300/10 px-4 py-2 md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-6 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-200">
          <Link href={withLang('/', lang)} className={pathname === '/' ? 'text-lime-300' : ''}>{t.shop}</Link>
          <Link href={withLang('/collections', lang)} className={pathname.startsWith('/collections') ? 'text-lime-300' : ''}>{t.collections}</Link>
          <a href={withLang('/#lifestyle', lang)}>{t.lifestyle}</a>
          <Link href={withLang('/', lang === 'en' ? 'vi' : 'en')} className="ml-auto rounded-full border border-blue-200/25 px-2 py-1">{lang === 'en' ? 'VI' : 'EN'}</Link>
        </div>
      </div>
    </header>
  )
}
