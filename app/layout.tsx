import type { Metadata } from 'next'
import { Antonio, Be_Vietnam_Pro, Lexend, Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/context/CartContext'
import { FloatingContact } from '@/components/FloatingContact'
import { BrandProvider } from '@/hooks/use-brand'
import { LangProvider } from '@/hooks/use-lang'
import { CONTACT_EMAIL, CONTACT_PHONE, META_FANPAGE_URL, ZALO_URL } from '@/lib/contact'
import { buildSocialImageUrl, PRIMARY_ORIGIN, socialImage } from '@/lib/seo'
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
  applicationName: '9shirt',
  title: {
    default: '9shirt | Áo Hawaii cá tính',
    template: '%s | 9shirt',
  },
  description: '9shirt bán áo Hawaii cá tính, quần short và outfit hè nổi bật. Sản phẩm của CÔNG TY TNHH 9FASHION.',
  keywords: ['9shirt', 'áo Hawaii', 'áo đi biển', 'áo họa tiết', 'áo du lịch', 'quần short'],
  openGraph: {
    title: '9shirt | Áo Hawaii cá tính',
    description: 'Áo Hawaii cá tính, quần short và outfit hè nổi bật. CÔNG TY TNHH 9FASHION.',
    type: 'website',
    siteName: '9shirt',
    images: [
      socialImage(
        buildSocialImageUrl({
          title: '9shirt áo Hawaii cá tính',
          subtitle: 'Áo Hawaii cá tính, quần short và outfit hè của CÔNG TY TNHH 9FASHION.',
        }),
        '9shirt áo Hawaii cá tính',
      ),
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '9shirt | Áo Hawaii cá tính',
    description: 'Áo Hawaii cá tính, quần short và outfit hè nổi bật. CÔNG TY TNHH 9FASHION.',
    images: [
      buildSocialImageUrl({
        title: '9shirt áo Hawaii cá tính',
        subtitle: 'Áo Hawaii cá tính, quần short và outfit hè.',
      }),
    ],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const defaultLang = 'vi'
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CÔNG TY TNHH 9FASHION',
    url: PRIMARY_ORIGIN,
    logo: `${PRIMARY_ORIGIN}/brand/9shirt-logo.png`,
    taxID: '0110712144',
    address: 'Số 16 ngõ 1 Đốc Ngữ, Sơn Tây, Hà Nội',
    telephone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    sameAs: [ZALO_URL, META_FANPAGE_URL],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '9shirt',
    url: PRIMARY_ORIGIN,
    inLanguage: 'vi',
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
        <BrandProvider isViHost>
          <LangProvider initialLang={defaultLang}>
            <CartProvider>
              {children}
              <FloatingContact />
            </CartProvider>
          </LangProvider>
        </BrandProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
