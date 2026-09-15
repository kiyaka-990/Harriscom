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
import { company, contact, faqs } from '@/lib/site'
import { A11Y_INIT_SCRIPT } from '@/lib/a11y'

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
 * Defaults only. The visitor's accessibility panel owns data-theme and
 * data-scaling at runtime (lib/a11y.ts), so neither is passed to ThemeProvider
 * below — an explicit prop there is treated as a forced mode and would override
 * the toggle on every mount.
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

/** FAQ rich results are the cheapest organic surface a contractor can win. */
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
        {/* Applies the visitor's saved accessibility choices before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: A11Y_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider
          theme="system"
          brand="indigo"
          accent="yellow"
          neutral="slate"
          solid="contrast"
          solidStyle="flat"
          border="playful"
          surface="translucent"
          transition="all"
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
