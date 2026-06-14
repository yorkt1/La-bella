'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useServices } from '@/hooks/useServices'

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

// Catálogo completo de serviços — lido do Veltos (fonte única).
export function ServicesCatalog() {
  const { services, loading } = useServices()

  // Agrupa por categoria, preservando a ordem.
  const groups = services.reduce<Record<string, typeof services>>((acc, s) => {
    const key = s.category ? String(s.category) : 'outros'
    ;(acc[key] ??= []).push(s)
    return acc
  }, {})

  return (
    <section className="py-14 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {loading ? (
          <p className="text-center text-[#7A5C52]/50 text-sm py-10">Carregando serviços…</p>
        ) : services.length === 0 ? (
          <p className="text-center text-[#7A5C52]/50 text-sm py-10">
            Em breve, nosso catálogo de serviços.
          </p>
        ) : (
          Object.entries(groups).map(([cat, list]) => (
            <div key={cat} className="mb-10">
              <h2
                className="text-3xl font-light text-[#1E1E1E] mb-6 text-center capitalize"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {cat}
              </h2>
              <div className="divide-y divide-[#EAE0DC] border border-[#EAE0DC] rounded-2xl overflow-hidden">
                {list.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-start justify-between gap-4 px-6 py-5 hover:bg-[#FDFAF8] transition-colors"
                  >
                    <div className="flex-1">
                      <p
                        className="text-sm font-medium text-[#1E1E1E]"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        {s.name}
                      </p>
                      <p
                        className="text-[11px] text-[#C89B7B] mt-1"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        {s.duration_minutes} min
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className="text-lg font-semibold text-[#7A5C52]"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                      >
                        {fmt(s.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        <div className="text-center mt-10">
          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-xs font-medium tracking-widest uppercase px-9 py-4 rounded-full hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Agendar Horário <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
