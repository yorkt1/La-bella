'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Tag,
  DollarSign,
  MessageCircle,
  Gift,
  UserCog,
  Settings,
  LogOut,
  X,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/agenda', icon: Calendar, label: 'Agenda' },
  { href: '/dashboard/clientes', icon: Users, label: 'Clientes' },
  { href: '/dashboard/servicos', icon: Scissors, label: 'Serviços' },
  { href: '/dashboard/promocoes', icon: Tag, label: 'Promoções' },
  { href: '/dashboard/financeiro', icon: DollarSign, label: 'Financeiro' },
  { href: '/dashboard/whatsapp', icon: MessageCircle, label: 'WhatsApp' },
  { href: '/dashboard/fidelidade', icon: Gift, label: 'Fidelidade' },
  { href: '/dashboard/equipe', icon: UserCog, label: 'Equipe' },
  { href: '/dashboard/configuracoes', icon: Settings, label: 'Configurações' },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#1E1E1E] h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-7 flex items-center justify-between border-b border-white/8">
        <div>
          <p
            className="text-xl font-light text-white tracking-[0.3em] uppercase leading-none"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            La Bella
          </p>
          <p
            className="text-[10px] font-light text-[#D4AF37] tracking-[0.5em] uppercase"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Infiní
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/40 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl mb-0.5 text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-[#C89B7B]/20 text-[#C89B7B]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              <Icon
                size={16}
                className={`shrink-0 ${isActive ? 'text-[#C89B7B]' : 'text-white/40 group-hover:text-white/70'}`}
              />
              <span>{label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C89B7B]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/8">
        <button
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-white/40 hover:text-white hover:bg-white/5 transition-all text-sm"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          <LogOut size={16} className="shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  )
}
