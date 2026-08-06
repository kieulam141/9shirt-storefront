'use client'

import { META_FANPAGE_URL, ZALO_URL } from '@/lib/contact'

export function FloatingContact() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6">
      <a
        href={ZALO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo 9shirt"
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--hiwaii-accent)]/40 bg-[var(--hiwaii-accent)] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#071425] shadow-2xl shadow-black/40 transition hover:brightness-110"
      >
        Zalo
      </a>
      <a
        href={META_FANPAGE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nhắn Fanpage Meta 9shirt"
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-blue-200/20 bg-[#0b1736]/95 px-4 text-xs font-black uppercase tracking-[0.12em] text-[var(--hiwaii-accent)] shadow-2xl shadow-black/40 backdrop-blur transition hover:border-[var(--hiwaii-accent)]/50 hover:bg-[var(--hiwaii-accent)]/10"
      >
        Meta
      </a>
    </div>
  )
}

