'use client'

import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react'
import { Lang, resolveLang } from '@/lib/i18n'
import { getDefaultLangForHost } from '@/lib/seo'

const LangContext = createContext<Lang>('en')

export function LangProvider({ children, initialLang = 'en' }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const explicitLang = params.get('lang')
    const nextLang = explicitLang === 'en' || explicitLang === 'vi'
      ? resolveLang(explicitLang)
      : getDefaultLangForHost(window.location.hostname)
    setLang(nextLang)
    document.documentElement.lang = nextLang
  }, [])

  return createElement(LangContext.Provider, { value: lang }, children)
}

export function useLang(): Lang {
  return useContext(LangContext)
}
