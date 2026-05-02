'use client'

import { useEffect, useState } from 'react'
import { Lang, resolveLang } from '@/lib/i18n'

export function useLang(): Lang {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const nextLang = resolveLang(params.get('lang'))
    setLang(nextLang)
    document.documentElement.lang = nextLang
  }, [])

  return lang
}
