import { Column } from '@once-ui-system/core'

import VideoHero from '@/components/sections/VideoHero'
import StatsStrip from '@/components/sections/StatsStrip'
import ServicesGrid from '@/components/sections/ServicesGrid'
import ProjectsShowcase from '@/components/sections/ProjectsShowcase'
import ProcessTimeline from '@/components/sections/ProcessTimeline'
import WhyUs from '@/components/sections/WhyUs'
import Testimonials from '@/components/sections/Testimonials'
import Faq from '@/components/sections/Faq'
import CtaBand from '@/components/sections/CtaBand'
import ContactSection from '@/components/contact/ContactSection'

export default function HomePage() {
  return (
    <Column fillWidth horizontal="center">
      <VideoHero />
      <Column fillWidth horizontal="center" gap="128" paddingY="104">
        <StatsStrip />
        <ServicesGrid />
        <ProjectsShowcase limit={6} />
        <ProcessTimeline />
        <WhyUs />
        <Testimonials />
        <Faq />
        <CtaBand />
        <ContactSection />
      </Column>
    </Column>
  )
}
