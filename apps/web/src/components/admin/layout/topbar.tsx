'use client'

import { useState } from 'react'
import { Menu, Bell, Search } from 'lucide-react'
import { Sidebar } from './sidebar'

interface TopbarProps {
  title: string
  subtitle?: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative h-full w-64">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <header className="bg-white border-b border-[#EAE0DC] px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#7A5C52] hover:text-[#1E1E1E] transition-colors"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <div>
            <h1
              className="text-xl font-semibold text-[#1E1E1E] leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="text-xs text-[#7A5C52]/60 mt-0.5"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5C52]/40" />
            <input
              type="search"
              placeholder="Buscar..."
              className="pl-9 pr-4 py-2 rounded-xl border border-[#EAE0DC] text-sm text-[#1E1E1E] placeholder-[#7A5C52]/40 focus:outline-none focus:border-[#C89B7B] transition-colors w-56"
              style={{ fontFamily: 'var(--font-poppins)' }}
            />
          </div>

          <button className="relative w-9 h-9 rounded-full bg-[#F6E6E6] flex items-center justify-center text-[#7A5C52] hover:bg-[#EAD4D4] transition-colors">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E65100]" />
          </button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C89B7B] to-[#7A5C52] flex items-center justify-center">
            <span
              className="text-white text-xs font-medium"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              A
            </span>
          </div>
        </div>
      </header>
    </>
  )
}
