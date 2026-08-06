import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Header } from '@/components/Header'
import { CUSTOMER_COOKIE, getCustomerMembership, readCustomerSession } from '@/lib/customer-auth'
import { resolveLang, withLang } from '@/lib/i18n'

export default async function AccountPage({ searchParams }: { searchParams?: Promise<{ lang?: string }> }) {
  const params = await searchParams
  const lang = resolveLang(params?.lang)
  const copy = lang === 'vi'
    ? {
      eyebrow: 'Tài khoản khách hàng',
      points: 'Điểm tích lũy',
      odooCode: 'Mã khách Odoo',
      noCode: 'Chưa có mã',
      status: 'Trạng thái',
      synced: 'Đã đồng bộ Odoo',
      pending: 'Chờ endpoint Odoo',
      continue: 'Tiếp tục mua sắm',
    }
    : {
      eyebrow: 'Customer account',
      points: 'Reward points',
      odooCode: 'Odoo customer ID',
      noCode: 'Not assigned yet',
      status: 'Status',
      synced: 'Synced with Odoo',
      pending: 'Waiting for Odoo endpoint',
      continue: 'Continue shopping',
    }
  const cookieStore = await cookies()
  const session = readCustomerSession(cookieStore.get(CUSTOMER_COOKIE)?.value)
  const email = session?.email

  if (!email) {
    redirect(withLang('/account/login', lang))
  }

  const membership = await getCustomerMembership(email, session)

  return (
    <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
      <Header />
      <main className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-[var(--hiwaii-border)] bg-[#0a1632] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--hiwaii-accent)]">{copy.eyebrow}</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-4xl font-black">{membership.name}</h1>
              <p className="mt-2 text-sm font-semibold text-blue-100/85">{membership.email}</p>
            </div>
            <span className="rounded-full border border-[var(--hiwaii-accent)]/40 bg-[var(--hiwaii-accent)]/10 px-5 py-2 text-sm font-black uppercase tracking-[0.12em] text-[var(--hiwaii-accent)]">
              {membership.tier}
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-blue-200/15 bg-[#07132c] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100/75">{copy.points}</p>
              <p className="mt-2 text-3xl font-black text-[var(--hiwaii-accent)]">{membership.points}</p>
            </article>
            <article className="rounded-2xl border border-blue-200/15 bg-[#07132c] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100/75">{copy.odooCode}</p>
              <p className="mt-2 text-xl font-black">{membership.odooCustomerCode || copy.noCode}</p>
            </article>
            <article className="rounded-2xl border border-blue-200/15 bg-[#07132c] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100/75">{copy.status}</p>
              <p className="mt-2 text-xl font-black">{membership.syncedFromOdoo ? copy.synced : copy.pending}</p>
            </article>
          </div>

          <Link
            href={withLang('/#lifestyle', lang)}
            className="mt-8 inline-flex min-h-11 items-center rounded-full bg-[var(--hiwaii-accent)] px-6 text-xs font-black uppercase tracking-[0.14em] text-[#071425] transition hover:brightness-105"
          >
            {copy.continue}
          </Link>
        </section>
      </main>
    </div>
  )
}
