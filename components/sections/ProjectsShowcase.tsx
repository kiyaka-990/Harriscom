'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Column, Row, Text } from '@once-ui-system/core'

import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/sections/SectionHeading'
import { useReveal, useSpotlight } from '@/hooks/useReveal'
import { projects, type Project } from '@/lib/site'

const FILTERS: { id: 'all' | Project['category']; label: string }[] = [
  { id: 'all', label: 'All work' },
  { id: 'construction', label: 'Construction' },
  { id: 'interior', label: 'Interiors' },
  { id: 'supply', label: 'Supply' },
]

const CATEGORY_COLOURS: Record<Project['category'], string> = {
  construction: '#4A5FC1',
  interior: '#8B5FC0',
  supply: '#3DAF64',
}

interface ProjectsShowcaseProps {
  initialFilter?: 'all' | Project['category']
  limit?: number
  showHeading?: boolean
}

export default function ProjectsShowcase({
  initialFilter = 'all',
  limit,
  showHeading = true,
}: ProjectsShowcaseProps) {
  const [active, setActive] = useState<'all' | Project['category']>(initialFilter)
  const { ref, seen } = useReveal<HTMLDivElement>({ threshold: 0.05 })
  const spotlightRef = useSpotlight<HTMLDivElement>()

  const filtered = projects.filter((project) => active === 'all' || project.category === active)
  const shown = limit ? filtered.slice(0, limit) : filtered

  return (
    <Column fillWidth horizontal="center" paddingX="24" id="projects">
      <Column fillWidth maxWidth="xl" gap="40">
        {showHeading && (
          <Row fillWidth horizontal="between" vertical="end" wrap gap="24">
            <SectionHeading
              eyebrow="Selected work"
              title="Projects we have handed over."
              body="A sample of recent contracts across Nairobi and the wider metro."
            />
          </Row>
        )}

        <Row gap="8" wrap role="tablist" aria-label="Filter projects by category">
          {FILTERS.map((filter) => {
            const isActive = active === filter.id
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(filter.id)}
                className={isActive ? undefined : 'h-glass'}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: 999,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  border: isActive ? '1px solid transparent' : undefined,
                  background: isActive
                    ? 'linear-gradient(135deg, var(--h-amber) 0%, #ffcf6b 100%)'
                    : undefined,
                  color: isActive ? '#0b1230' : 'var(--neutral-on-background-medium)',
                  transition: 'all 0.25s ease',
                }}
              >
                {filter.label}
              </button>
            )
          })}
        </Row>

        <div ref={spotlightRef} style={{ width: '100%' }}>
          <div
            ref={ref}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))',
              gap: '1.25rem',
            }}
          >
            {shown.map((project, index) => (
              <Reveal key={project.id} show={seen} delay={index * 0.06}>
                <figure
                  className="h-spotlight h-glass"
                  style={{
                    position: 'relative',
                    margin: 0,
                    borderRadius: 20,
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: project.tall ? '4 / 5' : '4 / 3',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={project.image}
                      alt={`${project.title}, ${project.location}`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(to top, rgba(6,9,22,0.95) 0%, rgba(6,9,22,0.25) 52%, transparent 100%)',
                      }}
                    />
                  </div>

                  <figcaption
                    style={{
                      position: 'absolute',
                      inset: 'auto 0 0 0',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <Row gap="8" vertical="center">
                      <span
                        style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: 6,
                          background: `${CATEGORY_COLOURS[project.category]}26`,
                          border: `1px solid ${CATEGORY_COLOURS[project.category]}55`,
                          color: CATEGORY_COLOURS[project.category],
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {project.category}
                      </span>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        {project.year}
                      </Text>
                    </Row>
                    <Text variant="heading-strong-s" onBackground="neutral-strong">
                      {project.title}
                    </Text>
                    <Text variant="body-default-xs" onBackground="neutral-medium">
                      {project.location}
                    </Text>
                    <Text
                      variant="body-default-xs"
                      onBackground="neutral-weak"
                      className="h-clamp-3"
                      style={{ lineHeight: 1.6 }}
                    >
                      {project.summary}
                    </Text>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>

        {shown.length === 0 && (
          <Text variant="body-default-m" onBackground="neutral-weak" align="center">
            No projects in this category yet — ask us and we will send references.
          </Text>
        )}
      </Column>
    </Column>
  )
}
