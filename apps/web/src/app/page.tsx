import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/sections/hero'
import { ServicesGrid } from '@/components/sections/services-grid'
import { AboutSection } from '@/components/sections/about-section'
import { PromotionBanner } from '@/components/sections/promotion-banner'
import { Testimonials } from '@/components/sections/testimonials'
import { CTABooking } from '@/components/sections/cta-booking'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesGrid />
        <AboutSection />
        <PromotionBanner />
        <Testimonials />
        <CTABooking />
      </main>
      <Footer />
    </>
  )
}
