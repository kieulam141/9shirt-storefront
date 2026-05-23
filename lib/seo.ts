import { resolveLang, type Lang } from '@/lib/i18n'

export const PRIMARY_HOST = 'www.hiwaii.store'
export const PRIMARY_ORIGIN = `https://${PRIMARY_HOST}`

type SearchParams = Record<string, string | string[] | undefined>

export function normalizeHost(host?: string | null): string {
  return (host || '').toLowerCase().split(':')[0].replace(/\.$/, '')
}

export function isVietnameseDefaultHost(host?: string | null): boolean {
  const normalized = normalizeHost(host)
  return normalized.startsWith('9shirt.') || normalized.startsWith('www.9shirt.')
}

export function getDefaultLangForHost(host?: string | null): Lang {
  return isVietnameseDefaultHost(host) ? 'vi' : 'en'
}

export function getLangFromSearchParams(searchParams?: SearchParams, host?: string | null): Lang {
  const raw = searchParams?.lang
  const value = Array.isArray(raw) ? raw[0] : raw
  if (value === 'en' || value === 'vi') return resolveLang(value)
  return getDefaultLangForHost(host)
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
