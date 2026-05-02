import type { Metadata } from 'next'
import { Antonio, Be_Vietnam_Pro, Lexend, Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/context/CartContext'
import { PRIMARY_ORIGIN } from '@/lib/seo'
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
  title: {
    default: 'Hiwaii Shop | Statement Hawaiian Shirts',
    template: '%s | Hiwaii Shop',
  },
  description: 'Discover unique Hawaiian shirts categorized by your lifestyle. Shop niche prints for Animal lovers, Music fans, and Vintage enthusiasts.',
  openGraph: {
    title: 'Hiwaii Shop | Statement Hawaiian Shirts',
    description: 'Discover unique Hawaiian shirts categorized by your lifestyle. Shop niche prints for Animal lovers, Music fans, and Vintage enthusiasts.',
    type: 'website',
    siteName: 'Hiwaii Shop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hiwaii Shop | Statement Hawaiian Shirts',
    description: 'Discover unique Hawaiian shirts categorized by your lifestyle. Shop niche prints for Animal lovers, Music fans, and Vintage enthusiasts.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable} ${viBodyFont.variable} ${viDisplayFont.variable} bg-slate-900`}>
      <body className="font-sans antialiased bg-gradient-to-b from-slate-900 to-slate-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <CartProvider>
          {children}
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
