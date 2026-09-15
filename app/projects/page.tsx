import type { Metadata } from 'next'
import { Column } from '@once-ui-system/core'

import PageHeader from '@/components/sections/PageHeader'
import ProjectsShowcase from '@/components/sections/ProjectsShowcase'
import StatsStrip from '@/components/sections/StatsStrip'
import Testimonials from '@/components/sections/Testimonials'
import CtaBand from '@/components/sections/CtaBand'
import type { Project } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Construction, interior fit-out and materials supply projects delivered by Harriscom across Nairobi, Kiambu, Machakos and beyond.',
  alternates: { canonical: '/projects' },
}

const VALID = ['construction', 'interior', 'supply'] as const

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams
  const initialFilter = VALID.includes(filter as (typeof VALID)[number])
    ? (filter as Project['category'])
    : 'all'

  return (
    <Column fillWidth horizontal="center">
      <PageHeader
        eyebrow="Our work"
        title="Jobs we have finished, not renderings."
        body="Every project below was delivered under contract with a measured bill of quantities behind it. Ask us for the client's contact and call them."
      />
      <Column fillWidth horizontal="center" gap="128" paddingY="64">
        <ProjectsShowcase initialFilter={initialFilter} showHeading={false} />
        <StatsStrip />
        <Testimonials />
        <CtaBand />
      </Column>
    </Column>
  )
}
