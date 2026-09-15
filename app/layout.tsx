import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import { Column, LayoutProvider, ThemeInit, ThemeProvider } from '@once-ui-system/core'

import './globals.css'

import Navbar from '@/components/chrome/Navbar'
import Footer from '@/components/chrome/Footer'
import ScrollProgress from '@/components/chrome/ScrollProgress'
import FloatingDock from '@/components/chrome/FloatingDock'
import CookieConsent from '@/components/chrome/CookieConsent'
import HarriAgent from '@/components/agent/HarriAgent'
import { company, contact } from '@/lib/site'

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

/**
 * The site is designed dark-only, so the theme is pinned rather than following
 * the system preference — a light rendering of this palette does not exist.
 */
const themeConfig = {
  theme: 'dark',
  brand: 'indigo',
  accent: 'yellow',
  neutral: 'slate',
  solid: 'contrast',
  'solid-style': 'flat',
  border: 'playful',
  surface: 'translucent',
  transition: 'all',
  scaling: '100',
  'viz-style': 'categorical',
} as const

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: `${company.name} | Construction & General Supplies in Nairobi, Kenya`,
    template: `%s | ${company.shortName}`,
  },
  description: company.description,
  applicationName: company.shortName,
  keywords: [
    'construction company Nairobi',
    'building contractor Kenya',
    'general supplies Nairobi',
    'office fit-out Nairobi',
    'renovation contractor Kenya',
    'NCA registered contractor',
    'Harriscom Company Limited',
  ],
  authors: [{ name: company.name, url: company.url }],
  creator: company.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: company.url,
    siteName: company.name,
    title: `${company.name} — ${company.tagline}`,
    description: company.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${company.name} — ${company.tagline}`,
    description: company.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'construction',
}

export const viewport: Viewport = {
  themeColor: '#0b1230',
  width: 'device-width',
  initialScale: 1,
}

/** Structured data so the office shows up correctly in local search results. */
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: company.name,
  alternateName: company.shortName,
  description: company.description,
  url: company.url,
  telephone: contact.phone,
  email: contact.email,
  foundingDate: '2022-10-21',
  founder: { '@type': 'Person', name: company.director },
  identifier: company.registration,
  areaServed: { '@type': 'Country', name: 'Kenya' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${contact.address.line1}, ${contact.address.line2}`,
    postOfficeBoxNumber: '38631-00100',
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: contact.geo.lat,
    longitude: contact.geo.lng,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '08:00', closes: '14:00' },
  ],
  priceRange: 'KES',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable}`}
      data-theme="dark"
    >
      <head>
        <ThemeInit config={themeConfig} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <ThemeProvider
          theme="dark"
          brand="indigo"
          accent="yellow"
          neutral="slate"
          solid="contrast"
          solidStyle="flat"
          border="playful"
          surface="translucent"
          transition="all"
          scaling="100"
        >
          <LayoutProvider>
            <a className="h-skip-link" href="#main">
              Skip to content
            </a>
            <ScrollProgress />
            <Navbar />
            <Column as="main" id="main" fillWidth horizontal="center">
              {children}
            </Column>
            <Footer />
            <FloatingDock />
            <HarriAgent />
            <CookieConsent />
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
