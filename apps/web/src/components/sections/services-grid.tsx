import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    id: '1',
    name: 'Maquiagem para Noiva',
    category: 'Maquiagem',
    price: 250,
    description: 'Visual impecável e duradouro para o dia mais especial da sua vida.',
    image: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/foto_central_da_dona_ezzmtr.jpg',
  },
  {
    id: '2',
    name: 'Maquiagem Social',
    category: 'Maquiagem',
    price: 120,
    description: 'Make elegante para eventos, jantares e ocasiões especiais.',
    image: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/foto_de_uma_menina_na_cadeira_qzubre.jpg',
  },
  {
    id: '3',
    name: 'Manicure & Pedicure',
    category: 'Unhas',
    price: 80,
    description: 'Unhas impecáveis com acabamento profissional e esmaltação de longa duração.',
    image: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018047/fotos_da_unha_oqh6ep.jpg',
  },
  {
    id: '4',
    name: 'Bronzeamento',
    category: 'Corporal',
    price: 120,
    description: 'Bronze perfeito e uniforme com técnicas que valorizam cada tom de pele.',
    image: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/6_fotos_juntas_de_bronze_x0mt1q.jpg',
  },
  {
    id: '5',
    name: 'Maquiagem para Formatura',
    category: 'Maquiagem',
    price: 150,
    description: 'Look deslumbrante para marcar essa conquista com ainda mais beleza.',
    image: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/foto_da_profisional_com_a_m%C3%A3o_no_cliente_ipg6ez.jpg',
  },
  {
    id: '6',
    name: 'Pacote Noiva Completo',
    category: 'Pacote',
    price: 300,
    description: 'Maquiagem + Penteado para o dia mais especial. Atendimento exclusivo.',
    image: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/foto_de_duas_pessoas_fazendo_unha_e5uq6u.jpg',
  },
]

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

export function ServicesGrid() {
  return (
    <section className="py-20 bg-[#FDFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[#C89B7B] text-xs tracking-[0.5em] uppercase mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
            Nossos Tratamentos
          </p>
          <h2 className="text-4xl lg:text-5xl font-light text-[#1E1E1E]" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Serviços em Destaque
          </h2>
          <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-5" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <Link key={service.id} href="/agendar" className="group block">
              <div className="bg-white border border-[#EAE0DC] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#C89B7B] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(122,92,82,0.12)]">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] bg-white/90 text-[#C89B7B] px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {service.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg text-[#1E1E1E] mb-2 group-hover:text-[#C89B7B] transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#7A5C52]/70 leading-relaxed mb-4 line-clamp-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-[#7A5C52]" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {fmt(service.price)}
                    </span>
                    <span className="text-xs text-[#C89B7B] flex items-center gap-1 group-hover:gap-2 transition-all" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Agendar <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

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
