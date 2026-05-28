import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Clock, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Serviços',
  description: 'Conheça todos os nossos tratamentos estéticos: facial, cílios, sobrancelhas e muito mais.',
}

const categories = [
  { id: 'facial', label: 'Facial' },
  { id: 'cilios', label: 'Cílios' },
  { id: 'sobrancelha', label: 'Sobrancelha' },
  { id: 'corpo', label: 'Corporal' },
]

const services = [
  { id: '1', name: 'Limpeza de Pele Profunda', slug: 'limpeza-de-pele', category: 'facial', duration_minutes: 90, price: 180, description: 'Tratamento completo para remover impurezas, cravos e células mortas. Inclui vapor, extração e máscara hidratante.' },
  { id: '2', name: 'Peeling Facial', slug: 'peeling-facial', category: 'facial', duration_minutes: 60, price: 220, description: 'Renovação celular intensa para combater manchas, linhas finas e textura irregular.' },
  { id: '3', name: 'Hidratação Facial Intensiva', slug: 'hidratacao-facial', category: 'facial', duration_minutes: 60, price: 160, description: 'Reposição intensa de hidratação com ativos de alta concentração para pele radiante.' },
  { id: '4', name: 'Extensão de Cílios Fio a Fio', slug: 'extensao-cilios', category: 'cilios', duration_minutes: 150, price: 250, description: 'Aplicação fio a fio para volume e comprimento naturais. Duração de 3 a 4 semanas.' },
  { id: '5', name: 'Volume Russo', slug: 'volume-russo', category: 'cilios', duration_minutes: 180, price: 320, description: 'Técnica com leques para máximo volume e impacto. Ideal para quem busca olhar dramático.' },
  { id: '6', name: 'Manutenção de Cílios', slug: 'manutencao-cilios', category: 'cilios', duration_minutes: 90, price: 130, description: 'Reposição dos fios naturalmente caídos para manter o volume original.' },
  { id: '7', name: 'Design de Sobrancelha', slug: 'design-sobrancelha', category: 'sobrancelha', duration_minutes: 45, price: 80, description: 'Modelagem com linha, pinça e finalização para sobrancelhas perfeitas para o seu rosto.' },
  { id: '8', name: 'Henna de Sobrancelha', slug: 'henna-sobrancelha', category: 'sobrancelha', duration_minutes: 30, price: 60, description: 'Coloração natural de longa duração. Preenche falhas e intensifica o olhar.' },
  { id: '9', name: 'Drenagem Linfática', slug: 'drenagem-linfatica', category: 'corpo', duration_minutes: 60, price: 150, description: 'Técnica manual para eliminar toxinas, reduzir inchaço e melhorar a circulação.' },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function ServicosPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="bg-[#FDFAF8] py-16 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <p
              className="text-[#C89B7B] text-xs tracking-[0.5em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Catálogo Completo
            </p>
            <h1
              className="text-5xl font-light text-[#1E1E1E] mb-5"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Nossos Serviços
            </h1>
            <p
              className="text-[#7A5C52]/70 text-sm leading-relaxed"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Tratamentos estéticos de alto padrão realizados por profissionais especializadas.
              Encontre o cuidado ideal para você.
            </p>
          </div>
        </section>

        {/* Category tabs */}
        <section className="bg-white border-b border-[#EAE0DC] sticky top-[68px] z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto py-3 scrollbar-none">
            <button className="shrink-0 px-5 py-2 rounded-full bg-[#1E1E1E] text-white text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-poppins)' }}>
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="shrink-0 px-5 py-2 rounded-full border border-[#EAE0DC] text-[#7A5C52] text-xs tracking-widest uppercase hover:border-[#C89B7B] hover:text-[#C89B7B] transition-all"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Services list */}
        <section className="py-14 bg-[#FDFAF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link key={service.id} href={`/servicos/${service.slug}`} className="group">
                  <div className="bg-white border border-[#EAE0DC] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#C89B7B] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(122,92,82,0.12)]">
                    <div className="h-40 bg-gradient-to-br from-[#F6E6E6] to-[#E8D5A3] flex items-center justify-center">
                      <span
                        className="text-2xl font-light text-[#C89B7B]/50 italic"
                        style={{ fontFamily: 'var(--font-cormorant)' }}
                      >
                        {service.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3
                        className="text-lg text-[#1E1E1E] mb-2 group-hover:text-[#C89B7B] transition-colors"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                      >
                        {service.name}
                      </h3>
                      <p
                        className="text-xs text-[#7A5C52]/70 leading-relaxed mb-4 line-clamp-2"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[#7A5C52]/50">
                          <Clock size={12} />
                          <span className="text-xs" style={{ fontFamily: 'var(--font-poppins)' }}>
                            {service.duration_minutes} min
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-base font-semibold text-[#7A5C52]"
                            style={{ fontFamily: 'var(--font-playfair)' }}
                          >
                            {formatCurrency(service.price)}
                          </span>
                          <ArrowRight size={14} className="text-[#C89B7B] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
