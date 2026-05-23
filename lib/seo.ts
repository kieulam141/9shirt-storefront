import { resolveLang, type Lang } from '@/lib/i18n'

export const PRIMARY_HOST = 'www.hiwaii.store'
export const PRIMARY_ORIGIN = `https://${PRIMARY_HOST}`
export const SOCIAL_IMAGE_WIDTH = 1200
export const SOCIAL_IMAGE_HEIGHT = 630
export const DEFAULT_SOCIAL_PRODUCT_IMAGE = 'https://cdn.9tech.cloud/3D%20Hiwaii/New%20Products/CR71/702636459_960250286628890_9191551945257170271_n.jpg'

type SearchParams = Record<string, string | string[] | undefined>
type SocialImageParams = {
  title: string
  subtitle?: string
  image?: string
  price?: string
  lang?: Lang
}

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

export function buildSocialImageUrl({
  title,
  subtitle,
  image = DEFAULT_SOCIAL_PRODUCT_IMAGE,
  price,
  lang = 'en',
}: SocialImageParams): string {
  const params = new URLSearchParams({
    title,
    image,
    lang,
  })

  if (subtitle) params.set('subtitle', subtitle)
  if (price) params.set('price', price)

  return `${PRIMARY_ORIGIN}/api/og?${params.toString()}`
}

export function socialImage(url: string, alt: string) {
  return {
    url,
    width: SOCIAL_IMAGE_WIDTH,
    height: SOCIAL_IMAGE_HEIGHT,
    alt,
  }
}
