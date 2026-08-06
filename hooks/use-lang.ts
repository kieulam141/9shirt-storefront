'use client'

import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react'
import { Lang } from '@/lib/i18n'

const LangContext = createContext<Lang>('vi')

export function LangProvider({ children }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>('vi')

  useEffect(() => {
    setLang('vi')
    document.documentElement.lang = 'vi'
  }, [])

  return createElement(LangContext.Provider, { value: lang }, children)
}

export function useLang(): Lang {
  return useContext(LangContext)
}
