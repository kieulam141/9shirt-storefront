'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Header } from '@/components/Header'
import { withLang } from '@/lib/i18n'
import { useLang } from '@/hooks/use-lang'

export default function CustomerRegisterPage() {
  const lang = useLang()
  const copy = lang === 'vi'
    ? {
      eyebrow: '9Shirt Membership',
      title: 'Tạo tài khoản',
      body: 'Đăng ký bằng email để shop đồng bộ membership, ưu đãi và lịch sử mua hàng từ Odoo.',
      name: 'Họ tên',
      namePlaceholder: 'Nguyễn Văn A',
      phone: 'Số điện thoại',
      phonePlaceholder: '09...',
      error: 'Không đăng ký được. Kiểm tra lại thông tin giúp shop nhé.',
      submitting: 'Đang tạo tài khoản...',
      submit: 'Đăng ký',
      hasAccount: 'Đã có tài khoản?',
      login: 'Đăng nhập',
    }
    : {
      eyebrow: 'Hiwaii Membership',
      title: 'Create account',
      body: 'Sign up with email so we can sync membership, rewards, and order history from Odoo.',
      name: 'Full name',
      namePlaceholder: 'Your name',
      phone: 'Phone number',
      phonePlaceholder: '+1...',
      error: 'We could not create your account. Please check your details and try again.',
      submitting: 'Creating account...',
      submit: 'Sign up',
      hasAccount: 'Already have an account?',
      login: 'Log in',
    }
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    const response = await fetch('/api/account/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone }),
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
              <span className="text-sm font-black text-blue-100">{copy.name}</span>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={copy.namePlaceholder}
                className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--hiwaii-border)] bg-[#07132c] px-4 text-base font-semibold text-[var(--hiwaii-text-primary)] outline-none placeholder:text-blue-100/35 focus:border-[var(--hiwaii-accent)]"
              />
            </label>
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
            <label className="block">
              <span className="text-sm font-black text-blue-100">{copy.phone}</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={copy.phonePlaceholder}
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

          <p className="mt-5 text-sm font-semibold text-blue-100/80">
            {copy.hasAccount}{' '}
            <Link href={withLang('/account/login', lang)} className="font-black text-[var(--hiwaii-accent)]">
              {copy.login}
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}
