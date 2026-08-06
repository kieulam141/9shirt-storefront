'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { withLang } from '@/lib/i18n'
import { useLang } from '@/hooks/use-lang'

type Membership = {
  email: string
  name: string
  tier: string
  points: number
  odooCustomerCode?: string
  syncedFromOdoo: boolean
}

export function CustomerAccountMenu() {
  const lang = useLang()
  const [membership, setMembership] = useState<Membership | null>(null)
  const labels = lang === 'vi'
    ? { login: 'Đăng nhập', register: 'Đăng ký', logout: 'Thoát' }
    : { login: 'Login', register: 'Sign up', logout: 'Log out' }

  useEffect(() => {
    let mounted = true
    fetch('/api/account/session', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (mounted && data?.authenticated) setMembership(data.membership)
      })
      .catch(() => undefined)

    return () => {
      mounted = false
    }
  }, [])

  async function logout() {
    await fetch('/api/account/session', { method: 'DELETE' })
    setMembership(null)
  }

  if (!membership) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <Link
          href={withLang('/account/login', lang)}
          className="rounded-full border border-blue-200/35 bg-[#111d3a] px-4 py-2 text-sm font-extrabold text-slate-100 transition hover:border-[var(--hiwaii-accent)]/40 hover:text-[var(--hiwaii-accent)]"
        >
          {labels.login}
        </Link>
        <Link
          href={withLang('/account/register', lang)}
          className="rounded-full bg-[var(--hiwaii-accent)] px-4 py-2 text-sm font-black text-[#071425] transition hover:brightness-105"
        >
          {labels.register}
        </Link>
      </div>
    )
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Link
        href={withLang('/account', lang)}
        className="rounded-full border border-[var(--hiwaii-accent)]/35 bg-[var(--hiwaii-accent)]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-[var(--hiwaii-accent)] transition hover:bg-[var(--hiwaii-accent)] hover:text-[#071425]"
        title={`${membership.name} • ${membership.tier}`}
      >
        {membership.tier}
      </Link>
      <button
        type="button"
        onClick={logout}
        className="rounded-full border border-blue-200/20 bg-[#0f1c39] px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-blue-100/85 transition hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]"
      >
        {labels.logout}
      </button>
    </div>
  )
}
