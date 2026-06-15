import type { Metadata } from 'next'
import { Tag } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PromotionsPageContent } from '@/components/sections/promotions-page-content'

export const metadata: Metadata = {
  title: 'Promoções',
  description: 'Ofertas especiais e promoções exclusivas da La Belle Infini.',
}

export default function PromocoesPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <section className="bg-gradient-to-br from-[#1E1E1E] to-[#2E2020] py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <Tag size={24} className="text-[#D4AF37] mx-auto mb-4" />
            <h1
              className="text-4xl lg:text-5xl font-light text-white mb-4"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Promoções Especiais
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
              Ofertas exclusivas para você cuidar da sua beleza com ainda mais vantagem.
            </p>
          </div>
        </section>

        <PromotionsPageContent />
      </main>
      <Footer />
    </>
  )
}
