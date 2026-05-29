'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, MessageCircle } from 'lucide-react'

const navLinks = [
  { href: '/servicos', label: 'Serviços' },
  { href: '/loja', label: 'Loja' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/promocoes', label: 'Promoções' },
  { href: '/contato', label: 'Contato' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#1E1E1E] transition-all duration-300 ${
        scrolled ? 'py-3 shadow-xl' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group">
          <span
            className="text-2xl font-light text-white tracking-[0.3em] uppercase transition-colors group-hover:text-[#D4AF37]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            La Bella
          </span>
          <span
            className="text-xs font-light text-[#D4AF37] tracking-[0.5em] uppercase"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Infiní
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-white/70 hover:text-[#D4AF37] text-xs tracking-widest uppercase transition-colors duration-200"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/cliente"
            className="text-white/50 hover:text-white text-[11px] tracking-widest uppercase transition-colors"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Meus Agendamentos
          </Link>
          <a
            href="https://wa.me/5548996156188"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-[#25D366] hover:text-white transition-colors"
          >
            <MessageCircle size={20} />
          </a>
          <Link
            href="/agendar"
            className="bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-[11px] font-medium tracking-widest uppercase px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Agendar
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white hover:text-[#D4AF37] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-6 flex flex-col gap-5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="text-white/80 text-sm tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/cliente"
            onClick={() => setMobileOpen(false)}
            className="text-white/60 text-xs tracking-widest uppercase text-center"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Meus Agendamentos
          </Link>
          <Link
            href="/agendar"
            onClick={() => setMobileOpen(false)}
            className="bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-xs font-medium tracking-widest uppercase px-6 py-3.5 rounded-full text-center mt-2"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Agendar Online
          </Link>
        </div>
      )}
    </header>
  )
}
