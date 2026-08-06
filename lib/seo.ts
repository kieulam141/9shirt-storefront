import type { Lang } from '@/lib/i18n'

export const PRIMARY_HOST = 'www.9shirt.com.vn'
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
  host?: string | null
}

export function normalizeHost(host?: string | null): string {
  return (host || '').toLowerCase().split(':')[0].replace(/\.$/, '')
}

export function isVietnameseDefaultHost(_host?: string | null): boolean {
  return true
}

export function getDefaultLangForHost(_host?: string | null): Lang {
  return 'vi'
}

export function getLangFromSearchParams(_searchParams?: SearchParams, _host?: string | null): Lang {
  return 'vi'
}

export function toCanonical(path: string, _lang: Lang, host?: string | null): string {
  const origin = getOrigin(host)
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${origin}${normalized}`
}

export function languageAlternates(path: string, host?: string | null) {
  return {
    vi: toCanonical(path, 'vi', host),
    'x-default': toCanonical(path, 'vi', host),
  }
}

export function buildSocialImageUrl({
  title,
  subtitle,
  image = DEFAULT_SOCIAL_PRODUCT_IMAGE,
  price,
  lang = 'vi',
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

export function getBrandConfig(_host?: string | null) {
  return {
    name: '9SHIRT',
    brandName: '9SHIRT',
    companyName: '9SHIRT',
    defaultTitle: '9SHIRT - Áo Sơ Mi Hawaii & Thời Trang Đi Biển High-End',
    description: 'Xưởng thiết kế áo Hawaii & sơ mi họa tiết cao cấp 9SHIRT.',
  }
}

export function getOrigin(host?: string | null): string {
  if (!host) return PRIMARY_ORIGIN
  const normalized = normalizeHost(host)
  if (normalized.includes('localhost') || normalized.includes('127.0.0.1')) {
    return `http://${host}`
  }
  return `https://${normalized}`
}
