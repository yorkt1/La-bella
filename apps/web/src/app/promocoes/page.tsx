import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Tag, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Promoções',
  description: 'Ofertas especiais e promoções exclusivas da La Bella Infiní.',
}

const promotions = [
  {
    id: '1',
    title: '20% off em Limpeza de Pele',
    coupon: 'PELE20',
    discount: '20% de desconto',
    description: 'Aproveite 20% de desconto na Limpeza de Pele Profunda. Ideal para renovar a pele neste mês.',
    expires: '31/05/2026',
    segment: 'Todas as clientes',
  },
  {
    id: '2',
    title: 'Pacote Sobrancelha + Henna',
    coupon: 'BROWLOOK',
    discount: 'R$ 30 de desconto',
    description: 'Design de Sobrancelha + Henna com R$ 30 de desconto. Combo perfeito para um olhar marcante.',
    expires: '15/06/2026',
    segment: 'Todas as clientes',
  },
  {
    id: '3',
    title: 'Volta com 15% off',
    coupon: 'VOLTEI',
    discount: '15% de desconto',
    description: 'Exclusivo para clientes que não visitam a clínica há mais de 60 dias. Que saudade!',
    expires: '30/06/2026',
    segment: 'Clientes inativas',
  },
]

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
            <p
              className="text-white/50 text-sm"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Ofertas exclusivas para você cuidar da sua beleza com ainda mais vantagem.
            </p>
          </div>
        </section>

        <section className="py-16 bg-[#FDFAF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="bg-white border border-[#EAE0DC] rounded-2xl p-7 flex flex-col gap-4 hover:border-[#D4AF37] hover:shadow-lg transition-all duration-300"
                >
                  <div>
                    <span
                      className="text-[10px] text-[#D4AF37] tracking-widest uppercase"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                      {promo.segment}
                    </span>
                    <h3
                      className="text-xl text-[#1E1E1E] mt-1 mb-3"
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {promo.title}
                    </h3>
                    <p
                      className="text-sm text-[#7A5C52]/70 leading-relaxed"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                      {promo.description}
                    </p>
                  </div>

                  <div className="bg-[#FDFAF8] border border-[#EAE0DC] rounded-xl p-3 flex items-center justify-between">
                    <span
                      className="text-xs text-[#7A5C52]/60"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                      Cupom:
                    </span>
                    <span
                      className="text-sm font-semibold text-[#D4AF37] tracking-widest"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                      {promo.coupon}
                    </span>
                    <span
                      className="text-xs text-[#2E7D32] font-medium"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                      {promo.discount}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#7A5C52]/40">
                    <Clock size={11} />
                    <span className="text-[11px]" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Válido até {promo.expires}
                    </span>
                  </div>

                  <Link
                    href="/agendar"
                    className="bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-xs font-medium tracking-widest uppercase py-3 rounded-full text-center hover:opacity-90 transition-opacity"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    Agendar com Desconto
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
