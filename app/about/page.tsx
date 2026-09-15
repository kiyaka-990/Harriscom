import type { Metadata } from 'next'
import Image from 'next/image'
import { Column, Row, Text } from '@once-ui-system/core'

import PageHeader from '@/components/sections/PageHeader'
import ProcessTimeline from '@/components/sections/ProcessTimeline'
import WhyUs from '@/components/sections/WhyUs'
import StatsStrip from '@/components/sections/StatsStrip'
import Testimonials from '@/components/sections/Testimonials'
import Faq from '@/components/sections/Faq'
import CtaBand from '@/components/sections/CtaBand'
import SectionHeading from '@/components/sections/SectionHeading'
import { company, contact, counties } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description: `${company.name} is a Kenyan-owned construction and general supplies contractor registered ${company.registration}, working across Nairobi and 12 counties.`,
  alternates: { canonical: '/about' },
}

const FACTS = [
  { label: 'Registered', value: company.registration },
  { label: 'Incorporated', value: company.founded },
  { label: 'Director', value: company.director },
  { label: 'Head office', value: `${contact.address.line1}, ${contact.address.line2}` },
  { label: 'Counties served', value: `${counties.length} and nationwide on scope` },
  { label: 'Compliance', value: 'NCA compliant · insured · ETR invoicing' },
]

export default function AboutPage() {
  return (
    <Column fillWidth horizontal="center">
      <PageHeader
        eyebrow="About us"
        title="A young contractor with old-fashioned habits."
        body={`${company.name} was incorporated in ${company.foundedYear} and has handed over more than 150 projects since. We are not the biggest contractor in Nairobi. We are the one that measures the work, prices it honestly, and tells you the week something slips.`}
      />

      <Column fillWidth horizontal="center" gap="128" paddingY="64" paddingX="24">
        <Row fillWidth maxWidth="xl" gap="48" wrap m={{ direction: 'column' }}>
          <Column gap="24" style={{ flex: '1 1 24rem' }}>
            <SectionHeading eyebrow="Our story" title="Built on the jobs nobody else wanted to finish." />
            <Text variant="body-default-m" onBackground="neutral-weak" style={{ lineHeight: 1.9 }}>
              Harriscom started in {company.foundedYear} taking on the contracts other firms had walked
              away from — half-finished blocks, fit-outs running months late, supply chains that had
              collapsed mid-programme. Rescuing other people&rsquo;s projects taught us exactly which
              habits cause them to fail: quotes that are guesses, programmes nobody updates, and a
              client who only hears bad news at handover.
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak" style={{ lineHeight: 1.9 }}>
              So we built the company around the opposite. Every quotation comes off a measured bill
              of quantities. Every site has a resident supervisor and a named project manager. Every
              Friday you get progress photographs, spend against budget and a look-ahead for the
              coming week. None of that is remarkable — it is simply what a construction contract is
              supposed to look like.
            </Text>
            <Text variant="body-default-m" onBackground="neutral-weak" style={{ lineHeight: 1.9 }}>
              Today we work across {counties.length} counties from our office at{' '}
              {contact.address.line1} on {contact.address.line2.replace(', Nairobi CBD', '')}, on
              everything from a three-bedroom home to a G+5 residential block, with a supply arm that
              keeps our own sites — and other contractors&rsquo; — stocked to programme.
            </Text>
          </Column>

          <Column gap="16" style={{ flex: '1 1 20rem' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 5',
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              <Image
                src="/images/about.jpg"
                alt="Harriscom team on a live construction site in Nairobi"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                style={{ objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(6,9,22,0.7), transparent 55%)',
                }}
              />
            </div>

            <Column className="h-glass" radius="l" padding="24" gap="16">
              {FACTS.map((fact) => (
                <Row key={fact.label} horizontal="between" gap="16" vertical="start">
                  <Text variant="body-default-xs" onBackground="neutral-weak" style={{ flex: '0 0 8rem' }}>
                    {fact.label}
                  </Text>
                  <Text
                    variant="body-default-s"
                    onBackground="neutral-medium"
                    style={{ textAlign: 'right', flex: 1 }}
                  >
                    {fact.value}
                  </Text>
                </Row>
              ))}
            </Column>
          </Column>
        </Row>

        <StatsStrip />
        <ProcessTimeline />
        <WhyUs />
        <Testimonials />
        <Faq />
        <CtaBand />
      </Column>
    </Column>
  )
}
