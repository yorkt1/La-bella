'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Ana Carolina S.',
    service: 'Extensão de Cílios',
    rating: 5,
    text: 'Fui pela primeira vez e me apaixonei! A profissional é extremamente cuidadosa e o resultado ficou incrível. Meus cílios parecem naturais e durou muito mais do que eu esperava.',
    date: 'Maio 2026',
  },
  {
    id: 2,
    name: 'Mariana P.',
    service: 'Limpeza de Pele',
    rating: 5,
    text: 'Melhor limpeza de pele que já fiz na vida! Minha pele ficou completamente renovada. O ambiente é super agradável e aconchegante. Já agendei o retorno!',
    date: 'Abril 2026',
  },
  {
    id: 3,
    name: 'Fernanda L.',
    service: 'Design de Sobrancelha',
    rating: 5,
    text: 'Profissional incrível! Entendeu exatamente o que eu queria e o resultado ficou perfeito. Design natural e muito bem feito. Já indiquei para todas as amigas.',
    date: 'Maio 2026',
  },
  {
    id: 4,
    name: 'Juliana R.',
    service: 'Drenagem Linfática',
    rating: 5,
    text: 'Comecei as sessões de drenagem linfática e a diferença é visível! Minhas pernas ficaram muito mais leves e o inchaço reduziu bastante. Atendimento nota 10.',
    date: 'Março 2026',
  },
  {
    id: 5,
    name: 'Patricia M.',
    service: 'Peeling Facial',
    rating: 5,
    text: 'O peeling transformou minha pele! As manchas clararam e a textura melhorou muito. Me sinto mais confiante saindo sem maquiagem. Recomendo demais!',
    date: 'Abril 2026',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-[#EAE0DC]'}
        />
      ))}
    </div>
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const visible = 3
  const max = testimonials.length - visible

  const prev = () => setCurrent((c) => Math.max(0, c - 1))
  const next = () => setCurrent((c) => Math.min(max, c + 1))

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p
              className="text-[#C89B7B] text-xs tracking-[0.5em] uppercase mb-3"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Depoimentos
            </p>
            <h2
              className="text-4xl lg:text-5xl font-light text-[#1E1E1E]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              O que nossas clientes dizem
            </h2>
          </div>

          <div className="hidden sm:flex gap-3">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-10 h-10 rounded-full border border-[#EAE0DC] flex items-center justify-center text-[#7A5C52] hover:border-[#C89B7B] hover:text-[#C89B7B] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              disabled={current >= max}
              className="w-10 h-10 rounded-full border border-[#EAE0DC] flex items-center justify-center text-[#7A5C52] hover:border-[#C89B7B] hover:text-[#C89B7B] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Próximo"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.slice(current, current + visible).map((t) => (
            <div
              key={t.id}
              className="bg-[#FDFAF8] border border-[#EAE0DC] rounded-2xl p-6 flex flex-col gap-4"
            >
              <StarRating rating={t.rating} />
              <p
                className="text-sm text-[#7A5C52]/80 leading-relaxed flex-1 italic"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#EAE0DC]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C89B7B] to-[#7A5C52] flex items-center justify-center">
                  <span
                    className="text-white text-xs font-medium"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {getInitials(t.name)}
                  </span>
                </div>
                <div>
                  <p
                    className="text-sm font-medium text-[#1E1E1E]"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-[10px] text-[#7A5C52]/50"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {t.service} · {t.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
