'use client'

import Image from 'next/image'
import { CartItem as CartItemType, useCart } from '@/context/CartContext'
import { formatPrice, priceUnitFor } from '@/lib/pricing'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const unit = priceUnitFor(item.price)

  return (
    <div className="group flex items-start gap-5 rounded-2xl border border-[var(--hiwaii-border)] bg-[var(--hiwaii-surface)] p-5 transition-all hover:border-[var(--hiwaii-accent)]/50 hover:bg-[#0d1d3f]">
      {/* Thumbnail */}
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-[var(--hiwaii-border)] bg-[#040b1b]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="112px"
        />
      </div>

      {/* Details column */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {/* Name + remove */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-black text-[var(--hiwaii-text-primary)]">{item.name}</h3>
            <span className="mt-1.5 inline-flex items-center rounded-full border border-[var(--hiwaii-border)] bg-[#0b1736] px-3 py-0.5 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--hiwaii-text-secondary)]">
              SIZE {item.size}
            </span>
          </div>
          <button
            onClick={() => removeItem(item.id, item.size)}
            className="shrink-0 rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
            aria-label="Remove item"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Qty + subtotal */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-[var(--hiwaii-border)] bg-[#0a1632] p-1">
            <button
              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-black text-[var(--hiwaii-text-secondary)] transition hover:bg-[var(--hiwaii-accent)]/10 hover:text-[var(--hiwaii-accent)]"
            >
              −
            </button>
            <span className="min-w-[2rem] text-center text-sm font-black text-[var(--hiwaii-text-primary)]">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-black text-[var(--hiwaii-text-secondary)] transition hover:bg-[var(--hiwaii-accent)]/10 hover:text-[var(--hiwaii-accent)]"
            >
              +
            </button>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold text-[var(--hiwaii-text-muted)]">{formatPrice(item.price, unit)} each</p>
            <p className="text-xl font-black text-[var(--hiwaii-accent)]">{formatPrice(item.price * item.quantity, unit)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
