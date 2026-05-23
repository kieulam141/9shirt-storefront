import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Antonio, Be_Vietnam_Pro, Lexend, Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/context/CartContext'
import { LangProvider } from '@/hooks/use-lang'
import { buildSocialImageUrl, getDefaultLangForHost, PRIMARY_ORIGIN, socialImage } from '@/lib/seo'
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

export const metadata: Metadata = {
  metadataBase: new URL(PRIMARY_ORIGIN),
  applicationName: 'Hiwaii Shop',
  title: {
    default: 'Hiwaii Shop | Statement Hawaiian Shirts',
    template: '%s | Hiwaii Shop',
  },
  description: 'Discover unique Hawaiian shirts categorized by your lifestyle. Shop niche prints for Sports fans, Animal lovers, Music fans, and Vintage enthusiasts.',
  keywords: ['Hawaiian shirt', 'custom shirt', 'football shirt', 'CR7 shirt', 'áo Hawaii', 'áo đi biển', 'Hiwaii'],
  openGraph: {
    title: 'Hiwaii Shop | Statement Hawaiian Shirts',
    description: 'Discover unique Hawaiian shirts categorized by your lifestyle. Shop niche prints for Sports fans, Animal lovers, Music fans, and Vintage enthusiasts.',
    type: 'website',
    siteName: 'Hiwaii Shop',
    images: [
      socialImage(
        buildSocialImageUrl({
          title: 'Hiwaii statement Hawaiian shirts',
          subtitle: 'Bold drops, lifestyle niches, product mockups, and football-inspired designs.',
        }),
        'Hiwaii statement Hawaiian shirts',
      ),
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hiwaii Shop | Statement Hawaiian Shirts',
    description: 'Discover unique Hawaiian shirts categorized by your lifestyle. Shop niche prints for Sports fans, Animal lovers, Music fans, and Vintage enthusiasts.',
    images: [
      buildSocialImageUrl({
        title: 'Hiwaii statement Hawaiian shirts',
        subtitle: 'Bold drops, lifestyle niches, product mockups, and football-inspired designs.',
      }),
    ],
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const headerLang = requestHeaders.get('x-hiwaii-lang')
  const defaultLang = headerLang === 'en' || headerLang === 'vi'
    ? headerLang
    : getDefaultLangForHost(requestHeaders.get('host'))
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Hiwaii',
    url: PRIMARY_ORIGIN,
    logo: `${PRIMARY_ORIGIN}/icon.svg`,
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Hiwaii Shop',
    url: PRIMARY_ORIGIN,
    inLanguage: ['en', 'vi'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${PRIMARY_ORIGIN}/collections?niche={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang={defaultLang} className={`${bodyFont.variable} ${displayFont.variable} ${viBodyFont.variable} ${viDisplayFont.variable} bg-slate-900`}>
      <body className="font-sans antialiased bg-gradient-to-b from-slate-900 to-slate-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <LangProvider initialLang={defaultLang}>
          <CartProvider>
            {children}
          </CartProvider>
        </LangProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
