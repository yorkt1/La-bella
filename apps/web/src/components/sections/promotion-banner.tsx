import Link from 'next/link'
import { Tag, ArrowRight } from 'lucide-react'

export function PromotionBanner() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1E1E1E] rounded-3xl px-8 py-12 lg:px-14 lg:py-14 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#D4AF37]/6 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#C89B7B]/6 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Tag size={14} className="text-[#D4AF37]" />
                <span
                  className="text-[#D4AF37] text-xs tracking-widest uppercase"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Promoção do Mês
                </span>
              </div>
              <h2
                className="text-3xl lg:text-5xl font-light text-white leading-tight mb-4"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                20% off em
                <br />
                <em className="not-italic text-[#D4AF37]">Limpeza de Pele</em>
              </h2>
              <p
                className="text-white/60 text-sm mb-2"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Use o cupom: <span className="text-[#D4AF37] font-medium tracking-widest">PELE20</span>
              </p>
              <p
                className="text-white/40 text-xs"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Válido até 31/05/2026 · Sujeito à disponibilidade
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/agendar"
                className="bg-[#D4AF37] text-[#1E1E1E] text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-full hover:bg-[#C49E2A] transition-colors inline-flex items-center gap-2"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Aproveitar Agora
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/promocoes"
                className="border border-white/30 text-white/70 text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-full hover:border-white/60 hover:text-white transition-all duration-200"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Todas as Promoções
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
