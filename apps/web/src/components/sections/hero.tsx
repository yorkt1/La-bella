'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Users, Award, Star } from 'lucide-react'

const badges = [
  { icon: Users, value: '500+', label: 'clientes atendidas' },
  { icon: Award, value: '5 anos', label: 'de experiência' },
  { icon: Star, value: '4.9★', label: 'avaliação média' },
]

export function HeroSection() {
  return (
    <section className="relative h-screen max-h-screen bg-gradient-to-br from-[#FDFAF8] via-[#F6E6E6] to-[#E8D5A3]/20 flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center w-full pt-20">
        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p
            className="text-[#C89B7B] text-[10px] tracking-[0.5em] uppercase mb-4"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Beleza & Estética — Florianópolis
          </p>

          <h1
            className="text-4xl lg:text-5xl xl:text-[3.5rem] font-light text-[#1E1E1E] leading-[1.1] mb-5"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Realce sua
            <br />
            <em className="not-italic text-[#C89B7B]">beleza natural</em>
            <br />
            com cuidado
          </h1>

          <p
            className="text-[#7A5C52]/80 text-sm leading-relaxed mb-7 max-w-md"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Maquiagem, unhas, bronzeamento e estética em Ingleses.
            Agende online e transforme sua autoestima.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/agendar"
              className="bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-[11px] font-medium tracking-widest uppercase px-8 py-3.5 rounded-full hover:opacity-90 transition-all duration-200 shadow-lg shadow-[#C89B7B]/25"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Agendar Online
            </Link>
            <Link
              href="/servicos"
              className="border border-[#D4AF37] text-[#D4AF37] text-[11px] font-medium tracking-widest uppercase px-8 py-3.5 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-200"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Ver Serviços
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap gap-6 mt-8 pt-7 border-t border-[#EAE0DC]">
            {badges.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#C89B7B]/12 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-[#C89B7B]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1E1E1E] leading-none" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {value}
                  </p>
                  <p className="text-[10px] text-[#7A5C52]/60 mt-0.5" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Foto */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
          className="relative hidden lg:flex items-center justify-center"
        >
          <div
            className="relative w-full max-w-[420px] overflow-hidden"
            style={{
              aspectRatio: '4/5',
              maxHeight: 'calc(100vh - 160px)',
              borderRadius: '48% 52% 42% 58% / 48% 36% 64% 52%',
            }}
          >
            <Image
              src="https://res.cloudinary.com/dqewxdbfx/image/upload/v1781557800/ChatGPT_Image_11_de_jun._de_2026_15_45_03_rozrwk.png"
              alt="La Belle Infini"
              fill
              sizes="(min-width: 1024px) 420px, 0px"
              className="object-cover"
              priority
            />
          </div>

          {/* Card agendamento */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute -bottom-4 left-4 bg-white rounded-2xl shadow-xl shadow-[#7A5C52]/10 p-3.5 flex items-center gap-3 max-w-[190px]"
          >
            <div className="w-9 h-9 rounded-full bg-[#E0F4F1] flex items-center justify-center shrink-0">
              <Star size={14} className="text-[#006064] fill-[#006064]" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#1E1E1E] leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                Agendamento online
              </p>
              <p className="text-[10px] text-[#7A5C52]/60 mt-0.5" style={{ fontFamily: 'var(--font-poppins)' }}>
                Disponível 24h
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <div className="w-px h-10 bg-gradient-to-b from-[#C89B7B]/60 to-transparent" />
        <p className="text-[9px] text-[#C89B7B]/60 tracking-widest uppercase" style={{ fontFamily: 'var(--font-poppins)' }}>
          Explorar
        </p>
      </motion.div>
    </section>
  )
}
