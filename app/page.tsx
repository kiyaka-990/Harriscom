import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import StatsBar from '@/components/StatsBar'
import { About, Process, WhyUs, Testimonials, CTABand } from '@/components/Sections'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ChatBot from '@/components/ChatBot'
import ScrollRevealProvider from '@/components/ScrollRevealProvider'

export default function Home() {
  return (
    <ScrollRevealProvider>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <About />
        <Services />
        <Portfolio />
        <Process />
        <WhyUs />
        <Testimonials />
        <CTABand />
        <Contact />
      </main>
      <Footer />
      <ChatBot />
    </ScrollRevealProvider>
  )
}
