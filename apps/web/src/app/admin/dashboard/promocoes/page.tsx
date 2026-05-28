'use client'

import { useState } from 'react'
import { Topbar } from '@/components/admin/layout/topbar'
import { Plus, Tag, Eye, EyeOff, Trash2, X } from 'lucide-react'
import { usePromotions } from '@/hooks/usePromotions'
import type { Promotion } from '@/types'

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

const inputClass = 'w-full rounded-xl border border-[#EAE0DC] px-4 py-2.5 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#C89B7B] transition-colors'

type FormState = {
  title: string
  discount_type: string
  discount_value: string
  coupon_code: string
  starts_at: string
  ends_at: string
  segment: string
  max_uses: string
  is_visible: boolean
}

const emptyForm: FormState = {
  title: '', discount_type: 'percent', discount_value: '', coupon_code: '',
  starts_at: '', ends_at: '', segment: 'all', max_uses: '', is_visible: true,
}

export default function PromocoesAdminPage() {
  const { promotions, loading, create, toggleVisibility, remove } = usePromotions()
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)

  function field(key: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const ok = await create({
      title: form.title,
      discount_type: form.discount_type as 'percent' | 'fixed',
      discount_value: Number(form.discount_value),
      coupon_code: form.coupon_code.toUpperCase(),
      starts_at: form.starts_at,
      ends_at: form.ends_at,
      segment: form.segment as Promotion['segment'],
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      is_visible: form.is_visible,
    })
    setSaving(false)
    if (ok) { setShowForm(false); setForm(emptyForm) }
  }

  return (
    <>
      <Topbar title="Promoções" subtitle="Cupons e campanhas de desconto" />
      <div className="p-6 space-y-6">

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>
            {promotions.filter(isActive).length} ativas · {promotions.length} total
          </span>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-sm rounded-full hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            <Plus size={14} />Nova Promoção
          </button>
        </div>

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
                  <input required value={form.title} onChange={field('title')} placeholder="Ex: Boas-vindas 10% off" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Tipo</label>
                    <select value={form.discount_type} onChange={field('discount_type')} className={inputClass}>
                      <option value="percent">Porcentagem (%)</option>
                      <option value="fixed">Valor fixo (R$)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Desconto</label>
                    <input required type="number" min="0.01" step="0.01" value={form.discount_value} onChange={field('discount_value')} placeholder={form.discount_type === 'percent' ? '10' : '30.00'} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Cupom</label>
                    <input required value={form.coupon_code} onChange={e => setForm(f => ({ ...f, coupon_code: e.target.value.toUpperCase() }))} placeholder="BEMVINDA" className={inputClass} style={{ textTransform: 'uppercase' }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Segmento</label>
                    <select value={form.segment} onChange={field('segment')} className={inputClass}>
                      {Object.entries(segmentLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Início</label>
                    <input required type="datetime-local" value={form.starts_at} onChange={field('starts_at')} className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Fim</label>
                    <input required type="datetime-local" value={form.ends_at} onChange={field('ends_at')} className={inputClass} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium uppercase tracking-wide text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Limite de usos (opcional)</label>
                  <input type="number" min="1" value={form.max_uses} onChange={field('max_uses')} placeholder="Sem limite" className={inputClass} />
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

        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#C89B7B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : promotions.length === 0 ? (
          <div className="py-24 text-center bg-white border border-[#EAE0DC] rounded-2xl">
            <Tag size={32} className="text-[#EAE0DC] mx-auto mb-3" />
            <p className="text-sm text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>Nenhuma promoção criada ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {promotions.map(promo => {
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
                    <button onClick={() => toggleVisibility(promo.id, promo.is_visible)} title={promo.is_visible ? 'Ocultar' : 'Tornar visível'}
                      className="w-9 h-9 border border-[#EAE0DC] rounded-xl flex items-center justify-center text-[#7A5C52] hover:border-[#C89B7B] transition-all">
                      {promo.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => { if (confirm('Excluir esta promoção?')) remove(promo.id) }} title="Excluir"
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
