import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Antonio, Be_Vietnam_Pro, Lexend, Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/context/CartContext'
import { LangProvider } from '@/hooks/use-lang'
import { BrandProvider } from '@/hooks/use-brand'
import { buildSocialImageUrl, getDefaultLangForHost, getBrandConfig, socialImage, isVietnameseDefaultHost } from '@/lib/seo'
import './globals.css'

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-hiwaii-body',
})

const displayFont = Antonio({
  subsets: ['latin'],
  variable: '--font-hiwaii-display',
})

// Vietnamese-specific fonts
const viBodyFont = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-vi-body',
})

const viDisplayFont = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: ['700', '800', '900'],
  variable: '--font-vi-display',
})

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers()
  const host = requestHeaders.get('host')
  const brand = getBrandConfig(host)
  const lang = getDefaultLangForHost(host)

  const socialPreview = buildSocialImageUrl({
    title: brand.defaultTitle,
    subtitle: brand.defaultDescription,
    lang,
    host,
  })

  return {
    metadataBase: new URL(brand.origin),
    applicationName: brand.name,
    title: {
      default: brand.defaultTitle,
      template: `%s | ${brand.name}`,
    },
    description: brand.defaultDescription,
    keywords: brand.keywords,
    openGraph: {
      title: brand.defaultTitle,
      description: brand.defaultDescription,
      type: 'website',
      siteName: brand.name,
      images: [
        socialImage(
          socialPreview,
          brand.defaultTitle,
        ),
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: brand.defaultTitle,
      description: brand.defaultDescription,
      images: [socialPreview],
    },
    icons: {
      icon: [
        {
          url: '/favicon.ico',
          sizes: 'any',
        },
        {
          url: '/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          url: '/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          url: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          url: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      shortcut: '/favicon.ico',
      apple: '/apple-icon.png',
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const host = requestHeaders.get('host')
  const isViHost = isVietnameseDefaultHost(host)
  const brand = getBrandConfig(host)
  const origin = brand.origin
  const headerLang = requestHeaders.get('x-hiwaii-lang')
  const defaultLang = headerLang === 'en' || headerLang === 'vi'
    ? headerLang
    : getDefaultLangForHost(host)

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.companyName,
    url: origin,
    logo: `${origin}/icon-512x512.png`,
    taxID: '0110712144',
    address: 'Số 16 ngõ 1 Đốc Ngữ, Sơn Tây, Hà Nội',
    telephone: '0396218880',
    email: 'kieutunglam0612@gmail.com',
    sameAs: ['https://zalo.me/0396218880', 'https://www.facebook.com/9shirt.com.vn'],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brand.name,
    url: origin,
    inLanguage: ['en', 'vi'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${origin}/collections?niche={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang={defaultLang} className={`${bodyFont.variable} ${displayFont.variable} ${viBodyFont.variable} ${viDisplayFont.variable} bg-slate-900`}>
      <body className="font-sans antialiased bg-gradient-to-b from-slate-900 to-slate-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <LangProvider initialLang={defaultLang}>
          <BrandProvider isViHost={isViHost}>
            <CartProvider>
              {children}
            </CartProvider>
          </BrandProvider>
        </LangProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
