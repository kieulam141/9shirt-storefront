'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Header } from '@/components/Header'
import { withLang } from '@/lib/i18n'
import { useLang } from '@/hooks/use-lang'

export default function CustomerLoginPage() {
  const lang = useLang()
  const copy = lang === 'vi'
    ? {
      eyebrow: '9Shirt Membership',
      title: 'Đăng nhập bằng email',
      body: 'Nhập email đã mua hàng để xem hạng membership, điểm tích lũy và mã khách hàng đồng bộ từ Odoo.',
      error: 'Không đăng nhập được. Kiểm tra lại email giúp shop nhé.',
      submitting: 'Đang kiểm tra...',
      submit: 'Đăng nhập',
      back: 'Quay lại mua sắm',
      noAccount: 'Chưa có tài khoản?',
      register: 'Đăng ký',
    }
    : {
      eyebrow: 'Hiwaii Membership',
      title: 'Log in with email',
      body: 'Enter the email you used to shop and view your membership tier, points, and Odoo customer profile.',
      error: 'We could not log you in. Please check your email and try again.',
      submitting: 'Checking...',
      submit: 'Log in',
      back: 'Back to shopping',
      noAccount: 'No account yet?',
      register: 'Sign up',
    }
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    const response = await fetch('/api/account/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await response.json().catch(() => null)
    setIsSubmitting(false)

    if (!response.ok) {
      setError(data?.error || copy.error)
      return
    }

    router.push(withLang('/account', lang))
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[var(--hiwaii-bg)] text-[var(--hiwaii-text-primary)]">
      <Header />
      <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1360px] place-items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="w-full max-w-xl rounded-3xl border border-[var(--hiwaii-border)] bg-[#0a1632] p-6 shadow-[0_30px_90px_rgba(3,9,22,0.45)] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--hiwaii-accent)]">{copy.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black leading-tight">{copy.title}</h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-blue-100/85">
            {copy.body}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-black text-blue-100">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--hiwaii-border)] bg-[#07132c] px-4 text-base font-semibold text-[var(--hiwaii-text-primary)] outline-none placeholder:text-blue-100/35 focus:border-[var(--hiwaii-accent)]"
              />
            </label>
            {error ? <p className="text-sm font-bold text-red-300">{error}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--hiwaii-accent)] px-6 text-sm font-black uppercase tracking-[0.12em] text-[#071425] transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? copy.submitting : copy.submit}
            </button>
          </form>

          <Link href={withLang('/', lang)} className="mt-5 inline-flex text-sm font-black text-[var(--hiwaii-accent)]">
            {copy.back}
          </Link>
          <p className="mt-5 text-sm font-semibold text-blue-100/80">
            {copy.noAccount}{' '}
            <Link href={withLang('/account/register', lang)} className="font-black text-[var(--hiwaii-accent)]">
              {copy.register}
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}
