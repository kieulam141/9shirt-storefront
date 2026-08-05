import { resolveLang, type Lang } from '@/lib/i18n'

export const PRIMARY_HOST = 'www.hiwaii.store'
export const VIETNAMESE_HOST = 'www.9shirt.com.vn'
export const PRIMARY_ORIGIN = `https://${PRIMARY_HOST}`
export const VIETNAMESE_ORIGIN = `https://${VIETNAMESE_HOST}`
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

export function isVietnameseDefaultHost(host?: string | null): boolean {
  const normalized = normalizeHost(host)
  if (!host) return true // Default for 9shirt storefront
  return normalized === 'localhost'
    || normalized === '127.0.0.1'
    || normalized.includes('9shirt')
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

export function getOrigin(host?: string | null): string {
  return isVietnameseDefaultHost(host) ? VIETNAMESE_ORIGIN : PRIMARY_ORIGIN
}

export function getBrandConfig(host?: string | null) {
  const isVi = isVietnameseDefaultHost(host)
  if (isVi) {
    return {
      name: '9shirt',
      companyName: 'CÔNG TY TNHH 9FASHION',
      defaultTitle: '9shirt | Áo Hawaii cá tính',
      defaultDescription: '9shirt bán áo Hawaii, quần short và outfit hè cá tính. Sản phẩm của CÔNG TY TNHH 9FASHION.',
      origin: VIETNAMESE_ORIGIN,
      keywords: ['9shirt', 'áo Hawaii', 'áo đi biển', 'áo họa tiết', 'áo du lịch', 'quần short', '9Fashion'],
    }
  }
  return {
    name: 'Hiwaii Shop',
    companyName: 'Hiwaii Shop',
    defaultTitle: 'Hiwaii Shop | Statement Hawaiian Shirts',
    defaultDescription: 'Discover unique Hawaiian shirts categorized by your lifestyle. Shop niche prints for Sports fans, Animal lovers, Music fans, and Vintage enthusiasts.',
    origin: PRIMARY_ORIGIN,
    keywords: ['Hawaiian shirt', 'custom shirt', 'football shirt', 'CR7 shirt', 'áo Hawaii', 'áo đi biển', 'Hiwaii'],
  }
}

export function toCanonical(path: string, lang: Lang, host?: string | null): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const origin = getOrigin(host)
  return lang === 'vi'
    ? `${origin}${normalized}?lang=vi`
    : `${origin}${normalized}`
}

export function languageAlternates(path: string, host?: string | null) {
  return {
    'en-US': toCanonical(path, 'en', host),
    vi: toCanonical(path, 'vi', host),
    'x-default': toCanonical(path, getDefaultLangForHost(host), host),
  }
}

export function buildSocialImageUrl({
  title,
  subtitle,
  image = DEFAULT_SOCIAL_PRODUCT_IMAGE,
  price,
  lang = 'en',
  host,
}: SocialImageParams): string {
  const params = new URLSearchParams({
    title,
    image,
    lang,
  })

  if (subtitle) params.set('subtitle', subtitle)
  if (price) params.set('price', price)

  const origin = getOrigin(host)
  return `${origin}/api/og?${params.toString()}`
}

export function socialImage(url: string, alt: string) {
  return {
    url,
    width: SOCIAL_IMAGE_WIDTH,
    height: SOCIAL_IMAGE_HEIGHT,
    alt,
  }
}
