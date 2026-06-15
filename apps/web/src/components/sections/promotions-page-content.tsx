'use client'

import Link from 'next/link'
import { Clock, Tag } from 'lucide-react'
import { usePromotions } from '@/hooks/usePromotions'

function discountLabel(type: 'percentual' | 'fixo', value: number) {
  if (type === 'percentual') return `${value}% de desconto`
  return `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} de desconto`
}

function dateLabel(date: string | null) {
  if (!date) return 'sem data final'
  const parsed = new Date(date)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString('pt-BR')
  }
  return date.split('-').reverse().join('/')
}

export function PromotionsPageContent() {
  const { promotions, loading, error } = usePromotions()

  return (
    <section className="py-16 bg-[#FDFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-14 text-[#7A5C52]/50 text-sm">
            Carregando promoções...
          </div>
        ) : error ? (
          <div className="bg-white border border-[#EAE0DC] rounded-2xl px-6 py-14 text-center">
            <Tag size={34} className="mx-auto text-[#D4AF37]/35 mb-4" />
            <p className="text-[#D32F2F] text-sm font-medium mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
              Não foi possível carregar as promoções.
            </p>
            <p className="text-[#7A5C52]/60 text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
              {error}
            </p>
          </div>
        ) : promotions.length === 0 ? (
          <div className="bg-white border border-[#EAE0DC] rounded-2xl px-6 py-14 text-center">
            <Tag size={34} className="mx-auto text-[#C89B7B]/35 mb-4" />
            <p className="text-[#7A5C52]/60 text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
              No momento não há promoções vigentes.
            </p>
          </div>
        ) : (
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
                    Todas as clientes
                  </span>
                  <h3
                    className="text-xl text-[#1E1E1E] mt-1 mb-3"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {promo.title}
                  </h3>
                  {promo.description && (
                    <p
                      className="text-sm text-[#7A5C52]/70 leading-relaxed"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                      {promo.description}
                    </p>
                  )}
                </div>

                <div className="bg-[#FDFAF8] border border-[#EAE0DC] rounded-xl p-3 flex items-center justify-between gap-3">
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
                    {promo.coupon ?? 'SEM CUPOM'}
                  </span>
                  <span
                    className="text-xs text-[#2E7D32] font-medium text-right"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {discountLabel(promo.discountType, promo.discountValue)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[#7A5C52]/40">
                  <Clock size={11} />
                  <span className="text-[11px]" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Válido até {dateLabel(promo.expires)}
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
        )}
      </div>
    </section>
  )
}
