import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'

const mockServices = [
  {
    id: '1',
    name: 'Limpeza de Pele Profunda',
    slug: 'limpeza-de-pele',
    category: 'Facial',
    duration_minutes: 90,
    price: 180,
    description: 'Tratamento completo para remover impurezas e revigorar a pele.',
  },
  {
    id: '2',
    name: 'Design de Sobrancelha',
    slug: 'design-sobrancelha',
    category: 'Sobrancelha',
    duration_minutes: 45,
    price: 80,
    description: 'Modelagem perfeita com linha, pinça e henna para realçar o olhar.',
  },
  {
    id: '3',
    name: 'Extensão de Cílios',
    slug: 'extensao-cilios',
    category: 'Cílios',
    duration_minutes: 150,
    price: 250,
    description: 'Volume e comprimento naturais com fios sintéticos de alta qualidade.',
  },
  {
    id: '4',
    name: 'Peeling Facial',
    slug: 'peeling-facial',
    category: 'Facial',
    duration_minutes: 60,
    price: 220,
    description: 'Renovação celular intensa para pele mais jovem e luminosa.',
  },
  {
    id: '5',
    name: 'Drenagem Linfática',
    slug: 'drenagem-linfatica',
    category: 'Corporal',
    duration_minutes: 60,
    price: 150,
    description: 'Técnica manual para eliminar toxinas e reduzir inchaços.',
  },
  {
    id: '6',
    name: 'Hidratação Facial',
    slug: 'hidratacao-facial',
    category: 'Facial',
    duration_minutes: 60,
    price: 160,
    description: 'Reposição intensa de hidratação para pele seca e opaca.',
  },
  {
    id: '7',
    name: 'Manutenção de Cílios',
    slug: 'manutencao-cilios',
    category: 'Cílios',
    duration_minutes: 90,
    price: 130,
    description: 'Reposição dos fios caídos para manter o volume original.',
  },
  {
    id: '8',
    name: 'Henna de Sobrancelha',
    slug: 'henna-sobrancelha',
    category: 'Sobrancelha',
    duration_minutes: 30,
    price: 60,
    description: 'Coloração natural de longa duração para sobrancelhas mais expressivas.',
  },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

interface ServiceCardProps {
  service: (typeof mockServices)[0]
}

function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/servicos/${service.slug}`} className="group block">
      <div className="bg-white border border-[#EAE0DC] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#C89B7B] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(122,92,82,0.12)]">
        {/* Image placeholder */}
        <div className="h-48 bg-gradient-to-br from-[#F6E6E6] to-[#E8D5A3] flex items-center justify-center">
          <span
            className="text-3xl font-light text-[#C89B7B]/50 italic"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {service.category}
          </span>
        </div>

        <div className="p-5">
          <span
            className="text-[10px] text-[#C89B7B] tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {service.category}
          </span>
          <h3
            className="text-lg text-[#1E1E1E] mt-1 mb-2 group-hover:text-[#C89B7B] transition-colors"
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
            <div className="flex items-center gap-1.5 text-[#7A5C52]/60">
              <Clock size={12} />
              <span className="text-xs" style={{ fontFamily: 'var(--font-poppins)' }}>
                {service.duration_minutes} min
              </span>
            </div>
            <span
              className="text-base font-semibold text-[#7A5C52]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {formatCurrency(service.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function ServicesGrid() {
  return (
    <section className="py-20 bg-[#FDFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* CTA */}
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
