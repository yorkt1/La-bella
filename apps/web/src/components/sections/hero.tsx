'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Award, Star, MessageCircle } from 'lucide-react'

const badges = [
  { icon: Users, value: '500+', label: 'clientes atendidas' },
  { icon: Award, value: '5 anos', label: 'de experiência' },
  { icon: Star, value: '4.9★', label: 'avaliação média' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#FDFAF8] via-[#F6E6E6] to-[#E8D5A3]/20 flex items-center pt-24 overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#C89B7B]/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-[#D4AF37]/6 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center w-full py-16">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <p
            className="text-[#C89B7B] text-xs tracking-[0.5em] uppercase mb-5"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Clínica Estética Premium
          </p>

          <h1
            className="text-5xl lg:text-[4.5rem] font-light text-[#1E1E1E] leading-[1.1] mb-6"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Realce sua
            <br />
            <em className="not-italic text-[#C89B7B]">beleza natural</em>
            <br />
            com cuidado
          </h1>

          <p
            className="text-[#7A5C52]/80 text-base leading-relaxed mb-10 max-w-md"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Tratamentos estéticos de alto padrão com profissionais especializadas.
            Agende online e transforme sua autoestima.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/agendar"
              className="bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-xs font-medium tracking-widest uppercase px-9 py-4 rounded-full hover:opacity-90 transition-all duration-200 shadow-lg shadow-[#C89B7B]/25"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Agendar Online
            </Link>
            <Link
              href="/servicos"
              className="border border-[#D4AF37] text-[#D4AF37] text-xs font-medium tracking-widest uppercase px-9 py-4 rounded-full hover:bg-[#D4AF37]/10 transition-all duration-200"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Ver Serviços
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-[#EAE0DC]">
            {badges.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C89B7B]/12 flex items-center justify-center">
                  <Icon size={16} className="text-[#C89B7B]" />
                </div>
                <div>
                  <p
                    className="text-base font-semibold text-[#1E1E1E] leading-none"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {value}
                  </p>
                  <p
                    className="text-xs text-[#7A5C52]/60 mt-0.5"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
          className="relative hidden lg:block"
        >
          {/* Main blob */}
          <div
            className="relative w-full aspect-[4/5] bg-gradient-to-br from-[#F6E6E6] via-[#EAD4C8] to-[#E8D5A3] flex items-center justify-center"
            style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
          >
            <div className="text-center">
              <p
                className="text-5xl font-light text-[#C89B7B]/50 italic"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                La Bella
              </p>
              <p
                className="text-lg font-light text-[#D4AF37]/60 tracking-[0.4em] uppercase"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                Infiní
              </p>
            </div>
          </div>

          {/* Floating card — agendamento */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl shadow-[#7A5C52]/10 p-4 flex items-center gap-3 max-w-[200px]"
          >
            <div className="w-10 h-10 rounded-full bg-[#E0F4F1] flex items-center justify-center shrink-0">
              <Star size={16} className="text-[#006064] fill-[#006064]" />
            </div>
            <div>
              <p
                className="text-xs font-medium text-[#1E1E1E] leading-tight"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Agendamento online
              </p>
              <p
                className="text-[10px] text-[#7A5C52]/60 mt-0.5"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Disponível 24h
              </p>
            </div>
          </motion.div>

          {/* Floating card — whatsapp */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute top-8 -right-4 bg-[#1E1E1E] rounded-2xl shadow-xl p-4 flex items-center gap-3"
          >
            <MessageCircle size={18} className="text-[#25D366]" />
            <p
              className="text-[11px] text-white"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Lembretes automáticos
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-[#C89B7B]/60 to-transparent" />
        <p
          className="text-[10px] text-[#C89B7B]/60 tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          Explorar
        </p>
      </motion.div>
    </section>
  )
}
