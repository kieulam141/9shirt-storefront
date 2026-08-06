'use client'

import Link from 'next/link'
import Image from 'next/image'
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
    return `relative text-sm font-extrabold uppercase tracking-[0.14em] transition-colors hover:text-[var(--hiwaii-accent)] ${
      isActive
        ? 'text-[var(--hiwaii-accent)] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-[var(--hiwaii-accent)]'
        : 'text-slate-100'
    }`
  }

  return (
    <header className="sticky top-0 z-50 border-b border-blue-200/15 bg-[#050d22]/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-[76px] w-full max-w-[1360px] items-center px-4 sm:px-6 lg:px-8">
        <Link href={withLang('/', lang)} className="mr-auto flex min-w-0 items-center gap-3">
          <span className="relative block h-12 w-9 shrink-0" aria-hidden="true">
            <Image
              src="/brand/9shirt-logo.png"
              alt=""
              fill
              className="object-contain"
              sizes="36px"
              priority
            />
          </span>
          <span className="shirt-brand-wordmark text-3xl font-black uppercase tracking-tight sm:text-4xl">9shirt</span>
          <span className="hidden rounded-full border border-[var(--hiwaii-accent)]/40 bg-[var(--hiwaii-accent)]/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#ffd38a] lg:inline-flex">
            áo hè
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href={withLang('/', lang)} className={navClass('/')}>
            {t.shop}
          </Link>
          <a href={withLang('/#lifestyle', lang)} className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-100 transition-colors hover:text-[var(--hiwaii-accent)]">
            {t.lifestyle}
          </a>
          <Link href={withLang('/contact', lang)} className={navClass('/contact')}>
            {t.contact}
          </Link>
        </nav>
        <Link
          href={withLang('/cart', lang)}
          className={`relative ml-6 hidden rounded-full border px-5 py-2 text-sm font-extrabold uppercase tracking-[0.14em] transition-colors hover:border-[var(--hiwaii-accent)]/40 hover:text-[var(--hiwaii-accent)] md:inline-flex ${pathname === '/cart' ? 'border-[var(--hiwaii-accent)]/50 bg-[var(--hiwaii-accent)]/10 text-[var(--hiwaii-accent)]' : 'border-blue-200/35 bg-[#111d3a] text-slate-100'}`}
        >
          {t.cart}
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--hiwaii-accent)] px-1 text-[10px] font-black text-[#0a132b]">
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
            <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--hiwaii-accent)] px-1 text-[10px] font-black text-[#0a132b]">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
      <div className="border-t border-blue-300/10 px-4 py-2 md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-6 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-200">
          <Link href={withLang('/', lang)} className={pathname === '/' ? 'text-[var(--hiwaii-accent)]' : ''}>{t.shop}</Link>
          <a href={withLang('/#lifestyle', lang)}>{t.lifestyle}</a>
          <Link href={withLang('/contact', lang)} className={pathname.startsWith('/contact') ? 'text-[var(--hiwaii-accent)]' : ''}>{t.contact}</Link>
        </div>
      </div>
    </header>
  )
}
