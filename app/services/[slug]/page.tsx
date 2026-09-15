import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Column, Icon, Row, Text } from '@once-ui-system/core'

import PageHeader from '@/components/sections/PageHeader'
import CtaBand from '@/components/sections/CtaBand'
import { company, projects, services } from '@/lib/site'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = services.find((entry) => entry.slug === slug)
  if (!service) return {}

  return {
    title: service.title,
    description: service.description.slice(0, 160),
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} — ${company.shortName}`,
      description: service.short,
      images: [{ url: service.image }],
    },
  }
}

const ksh = (value: number) => `Ksh ${value.toLocaleString('en-KE')}`

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params
  const service = services.find((entry) => entry.slug === slug)
  if (!service) notFound()

  const others = services.filter((entry) => entry.slug !== service.slug)
  const related = projects.slice(0, 3)

  return (
    <Column fillWidth horizontal="center">
      <PageHeader eyebrow={`Service ${service.num}`} title={service.title} body={service.short} />

      <Column fillWidth horizontal="center" gap="104" paddingY="64" paddingX="24">
        <Column fillWidth maxWidth="xl" gap="32">
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '21 / 9',
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <Image
              src={service.image}
              alt={service.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              style={{ objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(6,9,22,0.85), transparent 60%)',
              }}
            />
          </div>

          <Row fillWidth gap="32" wrap m={{ direction: 'column' }}>
            <Column gap="24" style={{ flex: '1 1 24rem' }}>
              <Text variant="body-default-l" onBackground="neutral-medium" style={{ lineHeight: 1.85 }}>
                {service.description}
              </Text>

              <Column gap="12">
                <Text variant="label-default-xs" onBackground="neutral-weak" style={{ letterSpacing: '0.16em' }}>
                  WHAT IS INCLUDED
                </Text>
                {service.deliverables.map((item) => (
                  <Row key={item} gap="12" vertical="start">
                    <Icon name="check" size="xs" style={{ color: 'var(--h-amber)', marginTop: '0.3rem' }} />
                    <Text variant="body-default-s" onBackground="neutral-weak" style={{ lineHeight: 1.7 }}>
                      {item}
                    </Text>
                  </Row>
                ))}
              </Column>
            </Column>

            <Column gap="16" style={{ flex: '0 1 22rem' }}>
              {service.rate && (
                <Column className="h-glass h-liquid" radius="l" padding="24" gap="8">
                  <Text variant="label-default-xs" onBackground="neutral-weak" style={{ letterSpacing: '0.16em' }}>
                    INDICATIVE RATE
                  </Text>
                  <Text
                    variant="heading-strong-l"
                    style={{ color: 'var(--h-amber)', fontFamily: 'var(--font-heading)' }}
                  >
                    {ksh(service.rate.from)}–{ksh(service.rate.to)}
                  </Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    per {service.rate.unit}, Nairobi. A real number comes from a free site visit and a
                    measured bill of quantities.
                  </Text>
                </Column>
              )}

              <Column className="h-glass" radius="l" padding="24" gap="16">
                <Text variant="label-strong-s" onBackground="neutral-strong">
                  Other services
                </Text>
                <Column gap="8">
                  {others.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/services/${other.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        color: 'var(--neutral-on-background-medium)',
                        fontSize: '0.88rem',
                        textDecoration: 'none',
                      }}
                    >
                      {other.title}
                      <Icon name="chevronRight" size="xs" />
                    </Link>
                  ))}
                </Column>
              </Column>

              <Link
                href="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '0.95rem 1.6rem',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, var(--h-amber) 0%, #ffcf6b 100%)',
                  color: '#0b1230',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Get a quote for this
                <Icon name="arrowUpRight" size="s" />
              </Link>
            </Column>
          </Row>
        </Column>

        <Column fillWidth maxWidth="xl" gap="24">
          <Text variant="label-default-xs" onBackground="neutral-weak" style={{ letterSpacing: '0.16em' }}>
            RECENT WORK
          </Text>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(17rem, 1fr))',
              gap: '1rem',
            }}
          >
            {related.map((project) => (
              <Column key={project.id} className="h-glass" radius="l" overflow="hidden">
                <div style={{ position: 'relative', aspectRatio: '4 / 3' }}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <Column gap="4" padding="20">
                  <Text variant="label-strong-s" onBackground="neutral-strong">
                    {project.title}
                  </Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {project.location} · {project.year}
                  </Text>
                </Column>
              </Column>
            ))}
          </div>
        </Column>

        <CtaBand />
      </Column>
    </Column>
  )
}
