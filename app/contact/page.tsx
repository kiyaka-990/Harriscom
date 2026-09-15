import type { Metadata } from 'next'
import { Column } from '@once-ui-system/core'

import PageHeader from '@/components/sections/PageHeader'
import ContactSection from '@/components/contact/ContactSection'
import Faq from '@/components/sections/Faq'
import { contact } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Talk to Harriscom about a build, renovation or supply contract. Call ${contact.phone}, email ${contact.email}, or book a free site visit in the Nairobi metro.`,
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <Column fillWidth horizontal="center">
      <PageHeader
        eyebrow="Contact"
        title="Book a free site visit."
        body="No cost, no obligation. We walk the site with you, measure what is there, and follow up with a costed proposal within one working day."
      />
      <Column fillWidth horizontal="center" gap="128" paddingY="48">
        <ContactSection showHeading={false} />
        <Faq />
      </Column>
    </Column>
  )
}
