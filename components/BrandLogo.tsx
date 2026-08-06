'use client'

import Image from 'next/image'
import Link from 'next/link'

import { withLang } from '@/lib/i18n'
import { useLang } from '@/hooks/use-lang'

type BrandLogoProps = {
  compact?: boolean
}

export function BrandLogo({ compact = false }: BrandLogoProps) {
  const lang = useLang()

  return (
    <Link href={withLang('/', lang)} className="flex items-center gap-3" aria-label="9shirt home">
      <span className={`relative block shrink-0 ${compact ? 'h-10 w-8' : 'h-12 w-9'}`}>
        <Image
          src="/brand/9shirt-logo.png"
          alt=""
          fill
          className="object-contain"
          sizes={compact ? '32px' : '36px'}
          priority={!compact}
        />
      </span>
      <span className={`shirt-brand-wordmark ${compact ? 'text-2xl' : 'text-3xl'} font-black uppercase tracking-tight`}>9shirt</span>
    </Link>
  )
}
