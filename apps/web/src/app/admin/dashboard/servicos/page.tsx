'use client'

import { useState, useEffect } from 'react'
import { Topbar } from '@/components/admin/layout/topbar'
import { Plus, Clock, Pencil, Eye, EyeOff } from 'lucide-react'

interface Service {
  id: string
  name: string
  category: string | null
  price: number
  duration_minutes: number
  is_active: boolean
  is_featured: boolean
}

const categories = ['Todos', 'facial', 'cilios', 'sobrancelha', 'corpo', 'outros']
const categoryLabels: Record<string, string> = {
  facial: 'Facial', cilios: 'Cílios', sobrancelha: 'Sobrancelha', corpo: 'Corporal', outros: 'Outros',
}

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

export default function ServicosAdminPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [togglingId, setTogglingId] = useState<string | null>(null)

  async function fetchServices(cat: string) {
    setLoading(true)
    try {
      const params = cat ? `?category=${cat}` : ''
      const res = await fetch(`/api/admin/services${params}`)
      if (res.ok) setServices(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchServices(category) }, [category])

  async function toggleActive(service: Service) {
    setTogglingId(service.id)
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !service.is_active }),
      })
      if (res.ok) {
        setServices(prev => prev.map(s => s.id === service.id ? { ...s, is_active: !s.is_active } : s))
      }
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <>
      <Topbar title="Serviços" subtitle="Catálogo de tratamentos" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 border border-[#EAE0DC] rounded-xl overflow-hidden">
            {categories.map((cat) => {
              const key = cat === 'Todos' ? '' : cat
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(key)}
                  className={`px-4 py-2 text-xs transition-all ${category === key ? 'bg-[#1E1E1E] text-white' : 'text-[#7A5C52] hover:bg-[#F6E6E6]'}`}
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {categoryLabels[cat] ?? cat}
                </button>
              )
            })}
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-sm rounded-full hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            <Plus size={14} />
            Novo Serviço
          </button>
        </div>

        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#C89B7B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-sm text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
              Nenhum serviço encontrado
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((s) => (
              <div key={s.id}
                className={`bg-white border rounded-2xl overflow-hidden transition-all ${s.is_active ? 'border-[#EAE0DC]' : 'border-[#EAE0DC] opacity-60'}`}>
                <div className="h-28 bg-gradient-to-br from-[#F6E6E6] to-[#E8D5A3] flex items-center justify-center relative">
                  <span className="text-xl font-light text-[#C89B7B]/50 italic" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {categoryLabels[s.category ?? ''] ?? s.category ?? '—'}
                  </span>
                  {s.is_featured && (
                    <span className="absolute top-2 right-2 text-[9px] bg-[#D4AF37] text-white px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Destaque
                    </span>
                  )}
                  {!s.is_active && (
                    <span className="absolute top-2 left-2 text-[9px] bg-[#7A5C52] text-white px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Inativo
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-[#C89B7B] uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {categoryLabels[s.category ?? ''] ?? s.category ?? '—'}
                  </p>
                  <h4 className="text-sm font-medium text-[#1E1E1E] mb-3 leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>{s.name}</h4>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[#7A5C52]/50">
                      <Clock size={11} />
                      <span className="text-[11px]" style={{ fontFamily: 'var(--font-poppins)' }}>{s.duration_minutes}min</span>
                    </div>
                    <span className="text-base font-semibold text-[#7A5C52]" style={{ fontFamily: 'var(--font-playfair)' }}>{fmt(s.price)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-[#EAE0DC] rounded-xl text-xs text-[#7A5C52] hover:border-[#C89B7B] transition-all" style={{ fontFamily: 'var(--font-poppins)' }}>
                      <Pencil size={11} />
                      Editar
                    </button>
                    <button
                      onClick={() => toggleActive(s)}
                      disabled={togglingId === s.id}
                      className="w-9 h-9 flex items-center justify-center border border-[#EAE0DC] rounded-xl text-[#7A5C52] hover:border-[#C89B7B] transition-all disabled:opacity-50"
                      title={s.is_active ? 'Desativar' : 'Ativar'}
                    >
                      {togglingId === s.id
                        ? <div className="w-3 h-3 border border-[#C89B7B] border-t-transparent rounded-full animate-spin" />
                        : s.is_active ? <Eye size={13} /> : <EyeOff size={13} />
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
