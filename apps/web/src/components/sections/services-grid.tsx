'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useServices } from '@/hooks/useServices'

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

export function ServicesGrid() {
  const { services, loading } = useServices()
  const featured = services.slice(0, 6)

  return (
    <section className="py-20 bg-[#FDFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p
            className="text-[#C89B7B] text-xs tracking-[0.5em] uppercase mb-3"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Nossos Tratamentos
          </p>
          <h2
            className="text-4xl lg:text-5xl font-light text-[#1E1E1E]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Serviços em Destaque
          </h2>
          <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-5" />
        </div>

        {loading ? (
          <div className="text-center py-10 text-[#7A5C52]/50 text-sm">Carregando serviços…</div>
        ) : featured.length === 0 ? (
          <div className="text-center py-10 text-[#7A5C52]/50 text-sm">
            Em breve, nosso catálogo de serviços.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((service) => (
              <Link key={service.id} href="/agendar" className="group block">
                <div className="bg-white border border-[#EAE0DC] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#C89B7B] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(122,92,82,0.12)]">
                  <div className="relative h-36 bg-gradient-to-br from-[#F3E7E0] to-[#E8D7CE] flex items-end p-4">
                    {service.category && (
                      <span
                        className="text-[10px] bg-white/90 text-[#C89B7B] px-2.5 py-1 rounded-full uppercase tracking-wider"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        {service.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3
                      className="text-lg text-[#1E1E1E] mb-2 group-hover:text-[#C89B7B] transition-colors"
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {service.name}
                    </h3>
                    <p
                      className="text-xs text-[#7A5C52]/70 leading-relaxed mb-4"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                      {service.duration_minutes} min
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-base font-semibold text-[#7A5C52]"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                      >
                        {fmt(service.price)}
                      </span>
                      <span
                        className="text-xs text-[#C89B7B] flex items-center gap-1 group-hover:gap-2 transition-all"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        Agendar <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 border border-[#D4AF37] text-[#D4AF37] text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-200"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Ver Todos os Serviços
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
