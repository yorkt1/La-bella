import type { Metadata } from 'next'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ServicesCatalog } from '@/components/sections/services-catalog'

export const metadata: Metadata = {
  title: 'Serviços | La Belle Infini',
  description: 'Maquiagem profissional, unhas, bronzeamento e muito mais em Ingleses, Florianópolis. Conheça nossos serviços e valores.',
}

const photos = [
  { src: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/foto_central_da_dona_ezzmtr.jpg',                      alt: 'Maquiagem profissional' },
  { src: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/foto_de_uma_menina_na_cadeira_qzubre.jpg',             alt: 'Atendimento no salão' },
  { src: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/foto_da_profisional_com_a_m%C3%A3o_no_cliente_ipg6ez.jpg', alt: 'Profissional em atendimento' },
  { src: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018047/fotos_da_unha_oqh6ep.jpg',                             alt: 'Unhas' },
  { src: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/6_fotos_juntas_de_bronze_x0mt1q.jpg',                  alt: 'Bronzeamento' },
  { src: 'https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018046/foto_de_duas_pessoas_fazendo_unha_e5uq6u.jpg',         alt: 'Manicure em dupla' },
]

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

        {/* Catálogo real (lido do Veltos) */}
        <ServicesCatalog />

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
