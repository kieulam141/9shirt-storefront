import { redirect } from 'next/navigation'

import { isAdminAuthenticated, logoutAdmin } from '../actions'

export default async function AdminProductsPage() {
  if (!await isAdminAuthenticated()) {
    redirect('/admin/login')
  }

  return (
    <main className="min-h-screen bg-[#030916] px-6 py-10 text-[var(--hiwaii-text-primary)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-5 border-b border-[var(--hiwaii-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--hiwaii-accent)]">
              Hiwaii CMS
            </p>
            <h1 className="mt-2 text-4xl font-black uppercase leading-none text-white">
              Product CMS
            </h1>
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="h-10 rounded-md border border-[var(--hiwaii-border)] px-4 text-sm font-bold uppercase tracking-[0.12em] text-[var(--hiwaii-text-secondary)] transition hover:border-[var(--hiwaii-accent)] hover:text-[var(--hiwaii-accent)]"
            >
              Sign Out
            </button>
          </form>
        </header>

        <section className="hiwaii-glass rounded-lg border border-[var(--hiwaii-border)] p-6">
          <p className="text-lg font-semibold text-white">
            Product editor placeholder
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--hiwaii-text-secondary)]">
            Admin authentication is active. Task 6 will replace this placeholder with the product management UI.
          </p>
        </section>
      </div>
    </main>
  )
}
