import Link from 'next/link'
import { Instagram, Facebook, MapPin, Phone, Clock } from 'lucide-react'

const services = [
  { label: 'Limpeza de Pele', href: '/servicos/limpeza-de-pele' },
  { label: 'Design de Sobrancelha', href: '/servicos/design-sobrancelha' },
  { label: 'Extensão de Cílios', href: '/servicos/extensao-cilios' },
  { label: 'Peeling Facial', href: '/servicos/peeling-facial' },
  { label: 'Drenagem Linfática', href: '/servicos/drenagem-linfatica' },
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
          <div className="mb-4">
            <p
              className="text-2xl font-light text-white tracking-[0.3em] uppercase"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              La Bella
            </p>
            <p
              className="text-xs font-light text-[#D4AF37] tracking-[0.5em] uppercase"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Infiní
            </p>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            Clínica estética premium dedicada a realçar sua beleza natural com tratamentos de alto padrão.
          </p>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/labella"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-[#D4AF37] transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://facebook.com/labella"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-[#D4AF37] transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
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
              <span className="text-sm">Rua das Flores, 123 — Jardins, São Paulo/SP</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-[#C89B7B] shrink-0" />
              <a href="tel:+5511999999999" className="text-sm hover:text-[#D4AF37] transition-colors">
                (11) 99999-9999
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
            © {new Date().getFullYear()} La Bella Infiní. Todos os direitos reservados.
          </p>
          <p className="text-xs text-white/40">
            CNPJ 00.000.000/0001-00 · Política de Privacidade · LGPD
          </p>
        </div>
      </div>
    </footer>
  )
}
