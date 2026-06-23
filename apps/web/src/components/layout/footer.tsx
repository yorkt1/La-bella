import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, MapPin, Phone, Clock } from 'lucide-react'

const services = [
  { label: 'Maquiagem para Noiva', href: '/servicos' },
  { label: 'Maquiagem Social', href: '/servicos' },
  { label: 'Maquiagem Artística', href: '/servicos' },
  { label: 'Pacote Maquiagem + Penteado', href: '/servicos' },
  { label: 'Bronzeamento', href: '/servicos' },
]

const links = [
  { label: 'Início', href: '/' },
  { label: 'Serviços', href: '/servicos' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Promoções', href: '/promocoes' },
  { label: 'Agendar', href: '/agendar' },
  { label: 'Política de Privacidade', href: '/politica-de-privacidade' },
]

export function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="mb-5">
            <Image
              src="https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018047/foto_da_logo_derkfr.jpg"
              alt="La Belle Infini"
              width={160}
              height={60}
              className="h-14 w-auto object-contain"
            />
          </div>
          <p className="text-sm leading-relaxed mb-6">
            Espaço completo de beleza e bem-estar em Ingleses, Florianópolis. Maquiagem, unhas, bronzeamento e muito mais.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/labelleinfini/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/5 text-white/60 shadow-sm shadow-black/10 transition-all duration-200 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37]"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://facebook.com/labella"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/5 text-white/60 shadow-sm shadow-black/10 transition-all duration-200 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37]"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Serviços */}
        <div>
          <h4
            className="text-white text-sm font-medium tracking-widest uppercase mb-5"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Serviços
          </h4>
          <ul className="space-y-2.5">
            {services.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm hover:text-[#D4AF37] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <div>
          <h4
            className="text-white text-sm font-medium tracking-widest uppercase mb-5"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Links
          </h4>
          <ul className="space-y-2.5">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm hover:text-[#D4AF37] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h4
            className="text-white text-sm font-medium tracking-widest uppercase mb-5"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Contato
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-[#C89B7B] mt-0.5 shrink-0" />
              <span className="text-sm">Rodovia Armando Calil Bulos, 5058 — Ingleses, Florianópolis/SC</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-[#C89B7B] shrink-0" />
              <a href="tel:+5551991517799" className="text-sm hover:text-[#D4AF37] transition-colors">
                (51) 99151-7799
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={16} className="text-[#C89B7B] mt-0.5 shrink-0" />
              <div className="text-sm">
                <p>Seg a Sex: 09h – 19h</p>
                <p>Sábado: 09h – 16h</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} La Belle Infini. Todos os direitos reservados.
          </p>
          <div className="flex flex-col items-center sm:items-end gap-1">
            <p className="text-xs text-white/40">
              labelleinfini@gmail.com · Ingleses, Florianópolis/SC
            </p>
            <p className="text-xs text-white/40">
              Desenvolvido por{' '}
              <a
                href="https://www.softvances.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/55 transition-colors hover:text-[#D4AF37]"
              >
                softvances.com.br
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
