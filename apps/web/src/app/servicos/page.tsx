import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Serviços | La Belle Infiní',
  description: 'Maquiagem profissional, unhas, bronzeamento e muito mais em Ingleses, Florianópolis. Conheça nossos serviços e valores.',
}

const services = [
  { name: 'Teste de Maquiagem (Pré-evento)', price: 80,  duration: 30,  description: 'Ideal para planejar o look perfeito antes do grande dia. Testamos cores, técnicas e durabilidade.' },
  { name: 'Maquiagem Infantil',              price: 90,  duration: 30,  description: 'Make delicada e segura para as pequenas. Produtos hipoalergênicos e temáticas divertidas.' },
  { name: 'Maquiagem Social',                price: 120, duration: 45,  description: 'Make elegante para eventos, jantares e ocasiões especiais. Acabamento impecável e duradouro.' },
  { name: 'Maquiagem para Formatura',        price: 150, duration: 60,  description: 'Look deslumbrante para marcar essa conquista com ainda mais beleza e brilho.' },
  { name: 'Maquiagem para Madrinha',         price: 180, duration: 60,  description: 'Harmonizado com a proposta do casamento. Beleza que acompanha a noiva sem ofuscar.' },
  { name: 'Maquiagem Artística',             price: 200, duration: 90,  description: 'Criações únicas para editoriais, cosplay, festas temáticas e eventos especiais.' },
  { name: 'Maquiagem com Airbrush',          price: 220, duration: 90,  description: 'Técnica profissional com pistola de ar comprimido. Acabamento perfeito, leve e ultra-durável.' },
  { name: 'Maquiagem para Noiva',            price: 250, duration: 120, description: 'Visual impecável e emocionante para o dia mais especial da sua vida. Inclui teste prévio.' },
  { name: 'Pacote Maquiagem + Penteado',     price: 300, duration: 150, description: 'O combo completo para a noiva ou debutante. Make + penteado exclusivo em um único atendimento.' },
]

const photos = [
  { src: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/foto_central_da_dona_ezzmtr.jpg',                      alt: 'Maquiagem profissional' },
  { src: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/foto_de_uma_menina_na_cadeira_qzubre.jpg',             alt: 'Atendimento no salão' },
  { src: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/foto_da_profisional_com_a_m%C3%A3o_no_cliente_ipg6ez.jpg', alt: 'Profissional em atendimento' },
  { src: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018047/fotos_da_unha_oqh6ep.jpg',                             alt: 'Unhas' },
  { src: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/6_fotos_juntas_de_bronze_x0mt1q.jpg',                  alt: 'Bronzeamento' },
  { src: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/foto_de_duas_pessoas_fazendo_unha_e5uq6u.jpg',         alt: 'Manicure em dupla' },
]

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

export default function ServicosPage() {
  return (
    <>
      <Header />
      <main className="pt-24">

        {/* Hero */}
        <section className="bg-[#FDFAF8] py-16 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-[#C89B7B] text-xs tracking-[0.5em] uppercase mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
              Catálogo Completo
            </p>
            <h1 className="text-5xl font-light text-[#1E1E1E] mb-5" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Nossos Serviços
            </h1>
            <p className="text-[#7A5C52]/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>
              Maquiagem profissional, unhas, bronzeamento, estética e muito mais.
              Tudo em um único espaço em Ingleses, Florianópolis.
            </p>
          </div>
        </section>

        {/* Tabela de serviços */}
        <section className="py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-light text-[#1E1E1E] mb-8 text-center" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Maquiagem
            </h2>
            <div className="divide-y divide-[#EAE0DC] border border-[#EAE0DC] rounded-2xl overflow-hidden">
              {services.map(s => (
                <div key={s.name} className="flex items-start justify-between gap-4 px-6 py-5 hover:bg-[#FDFAF8] transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{s.name}</p>
                    <p className="text-xs text-[#7A5C52]/60 mt-1 leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>{s.description}</p>
                    <p className="text-[11px] text-[#C89B7B] mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>{s.duration} min</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-semibold text-[#7A5C52]" style={{ fontFamily: 'var(--font-playfair)' }}>{fmt(s.price)}</p>
                  </div>
                </div>
              ))}
              {/* Taxa domicílio */}
              <div className="flex items-start justify-between gap-4 px-6 py-5 bg-[#FFF8E1]">
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#E65100]" style={{ fontFamily: 'var(--font-poppins)' }}>Atendimento a domicílio</p>
                  <p className="text-xs text-[#E65100]/70 mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>Taxa extra por deslocamento, além do valor do serviço escolhido.</p>
                </div>
                <p className="text-lg font-semibold text-[#E65100] shrink-0" style={{ fontFamily: 'var(--font-playfair)' }}>+ {fmt(50)}</p>
              </div>
            </div>

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

        {/* Galeria */}
        <section className="py-14 bg-[#FDFAF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-light text-[#1E1E1E] mb-8 text-center" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Nosso Trabalho
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map(photo => (
                <div key={photo.src} className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image src={photo.src} alt={photo.alt} fill className="object-cover hover:scale-105 transition-transform duration-500" />
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
