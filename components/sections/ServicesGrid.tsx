'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Column, Icon, Row, Text } from '@once-ui-system/core'

import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/sections/SectionHeading'
import { useReveal, useSpotlight } from '@/hooks/useReveal'
import { services } from '@/lib/site'

const ACCENTS: Record<string, string> = {
  navy: '#4A5FC1',
  crimson: '#E14B4B',
  emerald: '#3DAF64',
  teal: '#2A9ABF',
  violet: '#8B5FC0',
  amber: '#F5A623',
}

export default function ServicesGrid({ limit }: { limit?: number }) {
  const { ref, seen } = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const spotlightRef = useSpotlight<HTMLDivElement>()
  const shown = limit ? services.slice(0, limit) : services

  return (
    <Column fillWidth horizontal="center" paddingX="24" id="services">
      <Column fillWidth maxWidth="xl" gap="48">
        <SectionHeading
          eyebrow="What we do"
          title="Six disciplines, one accountable contractor."
          body="Most projects need more than one trade. Running them under a single contract means one programme, one cost plan and one person answering the phone."
        />

        <div ref={spotlightRef} style={{ width: '100%' }}>
          <div
            ref={ref}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(19rem, 1fr))',
              gap: '1.25rem',
            }}
          >
            {shown.map((service, index) => (
              <Reveal key={service.slug} show={seen} delay={index * 0.08}>
                <Link
                  href={`/services/${service.slug}`}
                  className="h-spotlight h-glass"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    borderRadius: 20,
                    overflow: 'hidden',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden' }}>
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(to top, rgba(8,11,26,0.96) 4%, ${ACCENTS[service.accent]}22 55%, transparent 100%)`,
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: 14,
                        left: 14,
                        padding: '0.25rem 0.6rem',
                        borderRadius: 8,
                        background: 'rgba(8,11,26,0.6)',
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${ACCENTS[service.accent]}66`,
                        color: ACCENTS[service.accent],
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                      }}
                    >
                      {service.num}
                    </span>
                  </div>

                  <Column gap="12" padding="24" style={{ flex: 1 }}>
                    <Text variant="heading-strong-m" onBackground="neutral-strong">
                      {service.title}
                    </Text>
                    <Text
                      variant="body-default-s"
                      onBackground="neutral-weak"
                      style={{ lineHeight: 1.7, flex: 1 }}
                    >
                      {service.short}
                    </Text>
                    <Row vertical="center" gap="8" paddingTop="4">
                      <Text
                        variant="label-strong-s"
                        style={{ color: ACCENTS[service.accent] }}
                      >
                        Explore service
                      </Text>
                      <Icon name="arrowUpRight" size="xs" style={{ color: ACCENTS[service.accent] }} />
                    </Row>
                  </Column>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        {limit && limit < services.length && (
          <Row horizontal="center">
            <Link
              href="/services"
              className="h-glass"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.85rem 1.6rem',
                borderRadius: 999,
                color: 'var(--neutral-on-background-strong)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              All services
              <Icon name="chevronRight" size="xs" />
            </Link>
          </Row>
        )}
      </Column>
    </Column>
  )
}
