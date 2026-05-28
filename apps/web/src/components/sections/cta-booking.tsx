import Link from 'next/link'
import { Calendar, MessageCircle } from 'lucide-react'

export function CTABooking() {
  return (
    <section className="py-24 bg-[#1E1E1E] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
        <p
          className="text-[#D4AF37] text-xs tracking-[0.5em] uppercase mb-5"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          Agende Agora
        </p>
        <h2
          className="text-4xl lg:text-6xl font-light text-white leading-tight mb-6"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Cuide-se hoje.
          <br />
          <em className="not-italic text-[#D4AF37]">Você merece.</em>
        </h2>
        <p
          className="text-white/50 text-sm leading-relaxed mb-10 max-w-md mx-auto"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          Agendamento online disponível 24 horas. Escolha seu serviço, horário e profissional favorita.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/agendar"
            className="bg-[#D4AF37] text-[#1E1E1E] text-xs font-medium tracking-widest uppercase px-10 py-4 rounded-full hover:bg-[#C49E2A] transition-colors inline-flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            <Calendar size={14} />
            Agendar Online
          </Link>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white text-xs font-medium tracking-widest uppercase px-10 py-4 rounded-full hover:bg-[#20BD5B] transition-colors inline-flex items-center gap-2"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/40">
          {['Seg–Sex: 09h–19h', 'Sábado: 09h–16h', 'Agendamento online 24h'].map((item) => (
            <span
              key={item}
              className="text-xs"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
