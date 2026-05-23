'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/products'
import { i18n, withLang } from '@/lib/i18n'
import { formatPrice } from '@/lib/pricing'
import { useLang } from '@/hooks/use-lang'

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const lang = useLang()
  const common = i18n[lang].common
  const badgeText = product.badge === 'Trending'
    ? common.trending
    : product.badge === 'Premium Edition'
      ? common.premiumEdition
      : common.bestSeller

  return (
    <Link href={withLang(`/product/${product.id}`, lang)} className="group block h-full">
      <article className="relative h-full overflow-hidden rounded-2xl border border-blue-200/15 bg-gradient-to-br from-[#152a56] via-[#0c1838] to-[#0a142f] transition-all duration-300 hover:-translate-y-1 hover:border-lime-300/35 hover:shadow-2xl hover:shadow-[#050d22]/60">
        <div className={`relative w-full overflow-hidden bg-[#050d22] ${compact ? 'h-72' : 'h-80'}`}>
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={compact ? '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw' : '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw'}
            quality={64}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020713]/85 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 rounded-full border border-lime-300/45 bg-lime-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-lime-200">
            {badgeText}
          </div>
        </div>
        <div className="p-6">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-blue-200/80">{product.niche} / {product.subNiche}</p>
          <h3 className="mb-2 line-clamp-2 text-xl font-black text-slate-100 transition-colors group-hover:text-lime-300">
            {product.name}
          </h3>
          <p className={`text-sm font-semibold text-blue-100/75 ${compact ? 'mb-3 line-clamp-1' : 'mb-4 line-clamp-2'}`}>
            {product.hook}
          </p>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <span className="text-4xl font-black text-lime-300">{formatPrice(product.price)}</span>
              {product.compareAtPrice ? <span className="ml-2 text-sm font-bold text-blue-100/55 line-through">{formatPrice(product.compareAtPrice)}</span> : null}
            </div>
            <span className="text-sm font-bold text-blue-100/70">{product.sizes.length} {common.sizes}</span>
          </div>
          <div className="w-full rounded-full border border-blue-200/30 bg-[#12244b] py-3 text-center text-sm font-extrabold uppercase tracking-[0.12em] text-slate-100 transition-colors group-hover:border-lime-300/40 group-hover:text-lime-300">
            {common.viewProduct}
          </div>
        </div>
      </article>
    </Link>
  )
}
