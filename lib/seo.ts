import { resolveLang, type Lang } from '@/lib/i18n'

export const PRIMARY_HOST = 'www.hiwaii.store'
export const PRIMARY_ORIGIN = `https://${PRIMARY_HOST}`

type SearchParams = Record<string, string | string[] | undefined>

export function getLangFromSearchParams(searchParams?: SearchParams): Lang {
  const raw = searchParams?.lang
  const value = Array.isArray(raw) ? raw[0] : raw
  return resolveLang(value)
}

export function toCanonical(path: string, lang: Lang): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return lang === 'vi'
    ? `${PRIMARY_ORIGIN}${normalized}?lang=vi`
    : `${PRIMARY_ORIGIN}${normalized}`
}

export function languageAlternates(path: string) {
  return {
    'en-US': toCanonical(path, 'en'),
    vi: toCanonical(path, 'vi'),
    'x-default': toCanonical(path, 'en'),
  }
}

