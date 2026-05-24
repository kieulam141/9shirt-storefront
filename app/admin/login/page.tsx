import { LockKeyhole } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { isAdminPasswordConfigured, loginAdmin } from '../actions'

type AdminLoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams
  const hasInvalidPasswordError = params.error === '1'
  const isConfigured = isAdminPasswordConfigured()

  return (
    <main className="min-h-screen bg-[#030916] text-[var(--hiwaii-text-primary)]">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="hiwaii-glass rounded-lg border border-[var(--hiwaii-border)] p-6 shadow-2xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-md border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface-soft)] text-[var(--hiwaii-accent)]">
              <LockKeyhole className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--hiwaii-accent)]">
                Hiwaii CMS
              </p>
              <h1 className="text-3xl font-black uppercase leading-none text-white">
                Admin Login
              </h1>
            </div>
          </div>

          {!isConfigured && (
            <div className="mb-5 rounded-md border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100">
              Set HIWAII_ADMIN_PASSWORD before signing in.
            </div>
          )}

          {hasInvalidPasswordError && (
            <div className="mb-5 rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
              Invalid admin password.
            </div>
          )}

          <form action={loginAdmin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-[var(--hiwaii-text-secondary)]">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                disabled={!isConfigured}
                required
                className="h-11 border-[var(--hiwaii-border)] bg-slate-950/60 text-white placeholder:text-[var(--hiwaii-text-muted)] focus-visible:border-[var(--hiwaii-accent)] focus-visible:ring-[var(--hiwaii-accent)]/30"
              />
            </div>

            <Button
              type="submit"
              disabled={!isConfigured}
              className="h-11 w-full bg-[var(--hiwaii-accent)] font-extrabold uppercase tracking-[0.12em] text-slate-950 hover:bg-[var(--hiwaii-accent)]/90"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
