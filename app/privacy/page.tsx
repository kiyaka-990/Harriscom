import type { Metadata } from 'next'
import { Column, Text } from '@once-ui-system/core'

import PageHeader from '@/components/sections/PageHeader'
import CookieSettingsButton from '@/components/chrome/CookieSettingsButton'
import { company, contact } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy & cookies',
  description: `How ${company.name} handles the information you send through this website.`,
  alternates: { canonical: '/privacy' },
}

const SECTIONS = [
  {
    heading: 'What we collect',
    body: [
      'When you send an enquiry through the contact form or through Harri, our website assistant, we receive the details you type: your name, phone number, email address, the site location and what you told us about the project.',
      'We do not ask for identity documents, payment details or anything else through this website.',
    ],
  },
  {
    heading: 'What we do with it',
    body: [
      'We use it to answer your enquiry, arrange a site visit and prepare a quotation. That is the whole purpose.',
      'Enquiries are emailed to our own mailbox and kept in that mailbox. We do not sell your details, and we do not pass them to advertisers or data brokers.',
    ],
  },
  {
    heading: 'Cookies',
    body: [
      'Strictly necessary cookies keep the site working — they remember your cookie choice and protect form submissions. These cannot be switched off.',
      'Analytics cookies, if you allow them, tell us anonymously which pages people read before they enquire, so we can improve those pages. Marketing cookies, if you allow them, tell us which campaign brought you here.',
      'The Google Map on our contact page is loaded from Google and sets Google’s own cookies. That is why it does not load until you press the button.',
    ],
  },
  {
    heading: 'The website assistant',
    body: [
      'Harri answers from a fixed set of information about this company. Your conversation is held in your own browser for the length of your visit. If you give Harri your name and contact details, it emails them to us as an enquiry, exactly as the contact form does.',
      'Do not send confidential documents or payment information through the chat.',
    ],
  },
  {
    heading: 'How long we keep it',
    body: [
      'Enquiries that do not become projects are kept for up to two years so we can pick the conversation back up. Records relating to contracts we actually performed are kept for as long as Kenyan tax and construction record-keeping rules require.',
    ],
  },
  {
    heading: 'Your choices',
    body: [
      `Ask us what we hold about you, ask us to correct it, or ask us to delete it, by emailing ${contact.email} or calling ${contact.phone}. We will respond within a reasonable period.`,
      'You can change your cookie choices at any time using the button below.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <Column fillWidth horizontal="center">
      <PageHeader
        eyebrow="Privacy"
        title="Privacy & cookies"
        body={`How ${company.name} handles what you send us through this website.`}
      />

      <Column fillWidth horizontal="center" paddingX="24" paddingY="48" paddingBottom="128">
        <Column fillWidth maxWidth="m" gap="40">
          {SECTIONS.map((section) => (
            <Column key={section.heading} gap="12">
              <Text variant="heading-strong-s" onBackground="neutral-strong">
                {section.heading}
              </Text>
              {section.body.map((paragraph) => (
                <Text
                  key={paragraph.slice(0, 40)}
                  variant="body-default-m"
                  onBackground="neutral-weak"
                  style={{ lineHeight: 1.9 }}
                >
                  {paragraph}
                </Text>
              ))}
            </Column>
          ))}

          <CookieSettingsButton />

          <Text variant="body-default-xs" onBackground="neutral-weak">
            {company.name} · {company.registration} · {contact.address.line1},{' '}
            {contact.address.line2} · {contact.email}
          </Text>
        </Column>
      </Column>
    </Column>
  )
}
