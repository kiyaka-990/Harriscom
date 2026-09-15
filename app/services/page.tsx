import type { Metadata } from 'next'
import { Column } from '@once-ui-system/core'

import PageHeader from '@/components/sections/PageHeader'
import ServicesGrid from '@/components/sections/ServicesGrid'
import ProcessTimeline from '@/components/sections/ProcessTimeline'
import Faq from '@/components/sections/Faq'
import CtaBand from '@/components/sections/CtaBand'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Building construction, renovations and fit-out, general supplies, electrical and plumbing, interior design and project management across Nairobi and Kenya.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return (
    <Column fillWidth horizontal="center">
      <PageHeader
        eyebrow="Services"
        title="Everything a building needs, under one contract."
        body="Six disciplines run by one accountable contractor. Take the whole package or a single trade — the reporting and the warranty are the same either way."
      />
      <Column fillWidth horizontal="center" gap="128" paddingY="80">
        <ServicesGrid />
        <ProcessTimeline />
        <Faq />
        <CtaBand />
      </Column>
    </Column>
  )
}
