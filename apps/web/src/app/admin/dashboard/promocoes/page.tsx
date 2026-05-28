'use client'

import { useState, useEffect } from 'react'
import { Topbar } from '@/components/admin/layout/topbar'
import { Plus, Tag, Eye, EyeOff, Trash2, X } from 'lucide-react'

interface Promotion {
  id: string
  title: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  coupon_code: string
  starts_at: string
  ends_at: string
  segment: string
  max_uses: number | null
  uses_count: number
  is_visible: boolean
}

const segmentLabels: Record<string, string> = {
  all: 'Todas as clientes',
  vip: 'VIP (Gold + Platinum)',
  inactive: 'Inativas 60+ dias',
  birthday: 'Aniversariantes',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function fmtDiscount(type: string, value: number) {
  return type === 'percent' ? `${value}% off` : `R$ ${value.toFixed(2).replace('.', ',')} off`
}

function isActive(p: Promotion) {
  const now = new Date()
  return new Date(p.starts_at) <= now && new Date(p.ends_at) >= now && p.is_visible
}

export default function PromocoesAdminPage() {
  const [promos, setPromos] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', discount_type: 'percent', discount_value: '', coupon_code: '',
    starts_at: '', ends_at: '', segment: 'all', max_uses: '', is_visible: true,
  })

  async function fetchPromos() {
    setLoading(true)
    const res = await fetch('/api/admin/promotions')
    if (res.ok) setPromos(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchPromos() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          discount_value: Number(form.discount_value),
          max_uses: form.max_uses ? Number(form.max_uses) : undefined,
          coupon_code: form.coupon_code.toUpperCase(),
        }),
      })
      if (res.ok) {
        setShowForm(false)
        setForm({ title: '', discount_type: 'percent', discount_value: '', coupon_code: '', starts_at: '', ends_at: '', segment: 'all', max_uses: '', is_visible: true })
        await fetchPromos()
      }
    } finally {
      setSaving(false)
    }
  }

  async function toggleVisibility(promo: Promotion) {
    const res = await fetch(`/api/admin/promotions/${promo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_visible: !promo.is_visible }),
    })
    if (res.ok) setPromos(prev => prev.map(p => p.id === promo.id ? { ...p, is_visible: !p.is_visible } : p))
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta promoção?')) return
    const res = await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' })
    if (res.ok) setPromos(prev => prev.filter(p => p.id !== id))
  }

  const inputClass = 'w-full rounded-xl border border-[#EAE0DC] px-4 py-2.5 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#C89B7B] transition-colors'

  return (
    <>
      <Topbar title="Promoções" subtitle="Cupons e campanhas de desconto" />
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>
              {promos.filter(isActive).length} ativas · {promos.length} total
            </span>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-sm rounded-full hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            <Plus size={14} />
            Nova Promoção
          </button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>Nova Promoção</h3>
                <button onClick={() => setShowForm(false)} className="text-[#7A5C52]/50 hover:text-[#1E1E1E]"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Título</label>
                  <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Boas-vindas 10% off" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Tipo</label>
                    <select value={form.discount_type} onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))} className={inputClass}>
                      <option value="percent">Porcentagem (%)</option>
                      <option value="fixed">Valor fixo (R$)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Desconto</label>
                    <input required type="number" min="0.01" step="0.01" value={form.discount_value} onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))} placeholder={form.discount_type === 'percent' ? '10' : '30.00'} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Cupom</label>
                    <input required value={form.coupon_code} onChange={e => setForm(f => ({ ...f, coupon_code: e.target.value.toUpperCase() }))} placeholder="BEMVINDA" className={inputClass} style={{ textTransform: 'uppercase' }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Segmento</label>
                    <select value={form.segment} onChange={e => setForm(f => ({ ...f, segment: e.target.value }))} className={inputClass}>
                      {Object.entries(segmentLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Início</label>
                    <input required type="datetime-local" value={form.starts_at} onChange={e => setForm(f => ({ ...f, starts_at: e.target.value }))} className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Fim</label>
                    <input required type="datetime-local" value={form.ends_at} onChange={e => setForm(f => ({ ...f, ends_at: e.target.value }))} className={inputClass} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Limite de usos (opcional)</label>
                  <input type="number" min="1" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))} placeholder="Sem limite" className={inputClass} />
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <input type="checkbox" id="visible" checked={form.is_visible} onChange={e => setForm(f => ({ ...f, is_visible: e.target.checked }))} className="w-4 h-4 accent-[#C89B7B]" />
                  <label htmlFor="visible" className="text-sm text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Visível no site</label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border border-[#EAE0DC] rounded-full text-sm text-[#7A5C52] hover:border-[#C89B7B] transition-all" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 py-3 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-sm rounded-full hover:opacity-90 transition-opacity disabled:opacity-60" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {saving ? 'Salvando...' : 'Criar Promoção'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#C89B7B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : promos.length === 0 ? (
          <div className="py-24 text-center bg-white border border-[#EAE0DC] rounded-2xl">
            <Tag size={32} className="text-[#EAE0DC] mx-auto mb-3" />
            <p className="text-sm text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>Nenhuma promoção criada ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {promos.map((promo) => {
              const active = isActive(promo)
              const expired = new Date(promo.ends_at) < new Date()
              return (
                <div key={promo.id} className={`bg-white border rounded-2xl p-5 flex items-center gap-5 ${active ? 'border-[#C89B7B]/40' : 'border-[#EAE0DC] opacity-70'}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${active ? 'bg-[#F6E6E6]' : 'bg-[#FDFAF8]'}`}>
                    <Tag size={18} className={active ? 'text-[#C89B7B]' : 'text-[#7A5C52]/40'} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{promo.title}</p>
                      {active && <span className="text-[9px] bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full uppercase tracking-wide font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>Ativa</span>}
                      {expired && <span className="text-[9px] bg-[#FFEBEE] text-[#C62828] px-2 py-0.5 rounded-full uppercase tracking-wide font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>Expirada</span>}
                    </div>
                    <p className="text-xs text-[#7A5C52]/60" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {segmentLabels[promo.segment]} · {fmtDate(promo.starts_at)} até {fmtDate(promo.ends_at)}
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-6 shrink-0">
                    <div className="text-center">
                      <p className="text-base font-semibold text-[#C89B7B]" style={{ fontFamily: 'var(--font-playfair)' }}>{fmtDiscount(promo.discount_type, promo.discount_value)}</p>
                      <p className="text-[10px] text-[#7A5C52]/50 font-mono">{promo.coupon_code}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-base font-semibold text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>{promo.uses_count}</p>
                      <p className="text-[10px] text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>{promo.max_uses ? `/${promo.max_uses}` : 'usos'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => toggleVisibility(promo)} title={promo.is_visible ? 'Ocultar' : 'Tornar visível'}
                      className="w-9 h-9 border border-[#EAE0DC] rounded-xl flex items-center justify-center text-[#7A5C52] hover:border-[#C89B7B] transition-all">
                      {promo.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => handleDelete(promo.id)} title="Excluir"
                      className="w-9 h-9 border border-[#EAE0DC] rounded-xl flex items-center justify-center text-[#7A5C52] hover:border-[#C62828] hover:text-[#C62828] transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
