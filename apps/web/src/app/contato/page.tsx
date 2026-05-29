import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com a La Belle Infini. Endereço, telefone, WhatsApp e horários de funcionamento.',
}

export default function ContatoPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <section className="bg-[#FDFAF8] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p
                className="text-[#C89B7B] text-xs tracking-[0.5em] uppercase mb-3"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Fale Conosco
              </p>
              <h1
                className="text-4xl lg:text-5xl font-light text-[#1E1E1E]"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                Contato
              </h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              {/* Info */}
              <div className="space-y-6">
                {[
                  { icon: MapPin, label: 'Endereço', value: 'Rodovia Armando Calil Bulos, 5058 — Ingleses, Florianópolis/SC' },
                  { icon: Phone, label: 'Telefone / WhatsApp', value: '(51) 99151-7799' },
                  { icon: Mail, label: 'E-mail', value: 'labelleinfini@gmail.com' },
                  { icon: Clock, label: 'Horários', value: 'Seg–Sex: 09h às 19h  |  Sábado: 09h às 16h' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white border border-[#EAE0DC] rounded-2xl p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F6E6E6] flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-[#C89B7B]" />
                    </div>
                    <div>
                      <p
                        className="text-[11px] text-[#C89B7B] tracking-widest uppercase mb-1"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        {label}
                      </p>
                      <p
                        className="text-sm text-[#1E1E1E]"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}

                <a
                  href="https://wa.me/5551991517799"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-[#25D366] text-white text-xs font-medium tracking-widest uppercase py-4 rounded-full hover:bg-[#20BD5B] transition-colors w-full"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  <MessageCircle size={16} />
                  Chamar no WhatsApp
                </a>
              </div>

              {/* Map placeholder */}
              <div className="bg-gradient-to-br from-[#F6E6E6] to-[#E8D5A3] rounded-3xl flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <MapPin size={32} className="text-[#C89B7B] mx-auto mb-3" />
                  <p
                    className="text-sm text-[#7A5C52]"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    Rodovia Armando Calil Bulos, 5058
                  </p>
                  <p
                    className="text-xs text-[#7A5C52]/60 mt-1"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    Ingleses — Florianópolis/SC
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
