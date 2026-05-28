'use client'

import { useState, useEffect, useCallback } from 'react'
import { Topbar } from '@/components/admin/layout/topbar'
import { Search, Filter, Download, UserPlus, Star, X } from 'lucide-react'

interface Client {
  id: string
  name: string
  phone: string
  tier: 'rose' | 'gold' | 'platinum'
  points: number
  status: string
  visits: number
  last_visit: string
}

const tierConfig: Record<string, { label: string; classes: string }> = {
  rose:     { label: 'Rose',     classes: 'bg-[#F6E6E6] text-[#7A5C52]' },
  gold:     { label: 'Gold',     classes: 'bg-[#FFF8E1] text-[#B8860B]' },
  platinum: { label: 'Platinum', classes: 'bg-[#E3F2FD] text-[#1565C0]' },
}

function getInitials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const fetchClients = useCallback(async (s: string, t: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (s) params.set('search', s)
      if (t) params.set('tier', t)
      const res = await fetch(`/api/admin/clients?${params}`)
      if (res.ok) setClients(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchClients(search, tierFilter), 350)
    return () => clearTimeout(t)
  }, [search, tierFilter, fetchClients])

  function exportCSV() {
    const header = 'Nome,WhatsApp,Nível,Visitas,Última visita,Pontos,Status'
    const rows = clients.map(c =>
      `"${c.name}","${c.phone}","${c.tier}",${c.visits},"${c.last_visit}",${c.points},"${c.status}"`
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'clientes.csv'
    a.click()
  }

  return (
    <>
      <Topbar title="Clientes" subtitle="Gerenciamento de clientes e fidelidade" />
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5C52]/40" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome ou telefone..."
                className="pl-9 pr-4 py-2.5 rounded-xl border border-[#EAE0DC] text-sm text-[#1E1E1E] placeholder-[#7A5C52]/40 focus:outline-none focus:border-[#C89B7B] transition-colors w-72"
                style={{ fontFamily: 'var(--font-poppins)' }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm transition-colors ${tierFilter ? 'border-[#C89B7B] text-[#C89B7B]' : 'border-[#EAE0DC] text-[#7A5C52] hover:border-[#C89B7B]'}`}
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              <Filter size={14} />
              Filtros {tierFilter && <X size={12} onClick={(e) => { e.stopPropagation(); setTierFilter('') }} />}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#EAE0DC] rounded-xl text-sm text-[#7A5C52] hover:border-[#C89B7B] transition-colors"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              <Download size={14} />
              Exportar CSV
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-sm rounded-full hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              <UserPlus size={14} />
              Nova Cliente
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="flex gap-2">
            {['', 'rose', 'gold', 'platinum'].map((t) => (
              <button
                key={t || 'all'}
                onClick={() => setTierFilter(t)}
                className={`px-4 py-1.5 rounded-full text-xs border transition-all ${tierFilter === t ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]' : 'border-[#EAE0DC] text-[#7A5C52] hover:border-[#C89B7B]'}`}
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {t ? tierConfig[t].label : 'Todas'}
              </button>
            ))}
          </div>
        )}

        <div className="bg-white border border-[#EAE0DC] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#C89B7B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : clients.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
                {search || tierFilter ? 'Nenhuma cliente encontrada' : 'Nenhuma cliente cadastrada ainda'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EAE0DC] bg-[#FDFAF8]">
                  {['Cliente', 'WhatsApp', 'Nível', 'Visitas', 'Última visita', 'Pontos', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[10px] text-[#7A5C52]/60 tracking-widest uppercase" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE0DC]">
                {clients.map((client) => {
                  const tier = tierConfig[client.tier] ?? tierConfig.rose
                  return (
                    <tr key={client.id} className="hover:bg-[#FDFAF8] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C89B7B] to-[#7A5C52] flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>
                              {getInitials(client.name)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>
                              {client.name}
                            </p>
                            {client.status === 'inactive' && (
                              <p className="text-[10px] text-[#E65100]" style={{ fontFamily: 'var(--font-poppins)' }}>Inativa</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>{client.phone}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wide ${tier.classes}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                          <Star size={9} className="fill-current" />
                          {tier.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#1E1E1E] font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>{client.visits}x</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>{client.last_visit}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-[#D4AF37]" style={{ fontFamily: 'var(--font-poppins)' }}>{client.points} pts</span>
                      </td>
                      <td className="px-5 py-4">
                        <a href={`/admin/dashboard/clientes/${client.id}`} className="text-xs text-[#C89B7B] hover:text-[#7A5C52] transition-colors" style={{ fontFamily: 'var(--font-poppins)' }}>
                          Ver ficha →
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
