import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Conheça a La Belle Infini, nossa história, missão e equipe de especialistas.',
}

const team = [
  { name: 'Gabriela Costa', role: 'Fundadora & Esteticista Sênior', specialty: 'Facial & Anti-aging', initials: 'GC' },
  { name: 'Amanda Ferreira', role: 'Lashista Certificada', specialty: 'Extensão de Cílios', initials: 'AF' },
  { name: 'Letícia Santos', role: 'Especialista em Design', specialty: 'Sobrancelhas & Henna', initials: 'LS' },
]

export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#FDFAF8] to-[#F6E6E6] py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p
              className="text-[#C89B7B] text-xs tracking-[0.5em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Nossa História
            </p>
            <h1
              className="text-5xl lg:text-6xl font-light text-[#1E1E1E] mb-6"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Sobre a La Belle Infini
            </h1>
            <p
              className="text-[#7A5C52]/70 text-base leading-relaxed max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Nascemos da paixão por transformar vidas através da beleza. Há mais de 5 anos,
              combinamos técnicas avançadas, produtos premium e atendimento humanizado para
              entregar resultados que encantam.
            </p>
          </div>
        </section>

        {/* Missão */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
            {[
              { title: 'Nossa Missão', text: 'Realçar a beleza natural de cada cliente com tratamentos de excelência, proporcionando bem-estar, autoestima e transformação de forma ética e responsável.' },
              { title: 'Nossa Visão', text: 'Ser a clínica estética de referência da cidade, reconhecida pela qualidade dos tratamentos, pelo cuidado com as clientes e pelos resultados duradouros que entregamos.' },
              { title: 'Nossos Valores', text: 'Excelência técnica, ética profissional, cuidado genuíno com o bem-estar de cada cliente, respeito à individualidade e compromisso com resultados reais.' },
            ].map(({ title, text }) => (
              <div key={title} className="bg-[#FDFAF8] border border-[#EAE0DC] rounded-2xl p-7">
                <h3
                  className="text-xl text-[#C89B7B] mb-4"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm text-[#7A5C52]/80 leading-relaxed"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Equipe */}
        <section className="py-20 bg-[#F6E6E6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p
                className="text-[#C89B7B] text-xs tracking-[0.5em] uppercase mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Profissionais
              </p>
              <h2
                className="text-4xl font-light text-[#1E1E1E]"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                Nossa Equipe
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map(({ name, role, specialty, initials }) => (
                <div key={name} className="bg-white border border-[#EAE0DC] rounded-2xl p-7 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C89B7B] to-[#7A5C52] flex items-center justify-center mx-auto mb-5">
                    <span
                      className="text-white text-xl font-light"
                      style={{ fontFamily: 'var(--font-cormorant)' }}
                    >
                      {initials}
                    </span>
                  </div>
                  <h3
                    className="text-lg text-[#1E1E1E] mb-1"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {name}
                  </h3>
                  <p
                    className="text-xs text-[#C89B7B] tracking-wide uppercase mb-2"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {role}
                  </p>
                  <p
                    className="text-xs text-[#7A5C52]/60"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {specialty}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white text-center">
          <div className="max-w-lg mx-auto px-4">
            <h2
              className="text-3xl font-light text-[#1E1E1E] mb-5"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Pronta para se transformar?
            </h2>
            <Link
              href="/agendar"
              className="bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-xs font-medium tracking-widest uppercase px-10 py-4 rounded-full hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Agendar Agora
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
