'use client'

import { useState, useEffect } from 'react'
import { Topbar } from '@/components/admin/layout/topbar'
import { ArrowLeft, Phone, Mail, Star, Calendar, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'

const tierColors: Record<string, string> = {
  rose:     'bg-[#F6E6E6] text-[#7A5C52]',
  gold:     'bg-[#FFF8E1] text-[#B8860B]',
  platinum: 'bg-[#E3F2FD] text-[#1565C0]',
}

const skinLabels: Record<string, string> = {
  normal: 'Normal', oily: 'Oleosa', dry: 'Seca', mixed: 'Mista', sensitive: 'Sensível',
}

const howFoundLabels: Record<string, string> = {
  instagram: 'Instagram', referral: 'Indicação', google: 'Google', other: 'Outro',
}

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function ClienteFichaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [data, setData] = useState<{
    client: Record<string, unknown>
    bookings: Record<string, unknown>[]
    visits: number
    total_spent: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/clients/${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <>
        <Topbar title="Ficha da Cliente" />
        <div className="p-6 flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-[#C89B7B] border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    )
  }

  if (!data?.client) {
    return (
      <>
        <Topbar title="Ficha da Cliente" />
        <div className="p-6">
          <p className="text-sm text-[#C62828]" style={{ fontFamily: 'var(--font-poppins)' }}>Cliente não encontrado.</p>
        </div>
      </>
    )
  }

  const c = data.client as {
    name: string; phone: string; email: string | null; birth_date: string | null;
    skin_type: string | null; allergies: string | null; notes: string | null;
    how_found: string | null; loyalty_points: number; loyalty_tier: string;
    accepts_marketing: boolean; created_at: string;
  }
  const tier = tierColors[c.loyalty_tier] ?? tierColors.rose

  return (
    <>
      <Topbar title="Ficha da Cliente" />
      <div className="p-6 space-y-6">
        <Link href="/admin/dashboard/clientes"
          className="inline-flex items-center gap-2 text-sm text-[#7A5C52] hover:text-[#C89B7B] transition-colors"
          style={{ fontFamily: 'var(--font-poppins)' }}>
          <ArrowLeft size={14} />Voltar para clientes
        </Link>

        {/* Header */}
        <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6 flex flex-wrap items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C89B7B] to-[#7A5C52] flex items-center justify-center shrink-0">
            <span className="text-white text-2xl font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {c.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="text-xl text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>{c.name}</h2>
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wide ${tier}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                <Star size={9} className="fill-current" />{c.loyalty_tier}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#7A5C52]/70">
              <span className="flex items-center gap-1.5"><Phone size={12} />{c.phone}</span>
              {c.email && <span className="flex items-center gap-1.5"><Mail size={12} />{c.email}</span>}
              <span className="flex items-center gap-1.5"><Calendar size={12} />Cliente desde {new Date(c.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total de Visitas', value: `${data.visits}x` },
            { label: 'Total Gasto',      value: fmt(data.total_spent) },
            { label: 'Pontos',           value: `${c.loyalty_points} pts` },
            { label: 'Tipo de Pele',     value: c.skin_type ? skinLabels[c.skin_type] ?? c.skin_type : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-[#EAE0DC] rounded-2xl p-4 text-center">
              <p className="text-xs text-[#7A5C52]/60 uppercase tracking-wide mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>{label}</p>
              <p className="text-lg font-semibold text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Dados clínicos */}
          <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6 space-y-4">
            <h3 className="text-base text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>Dados Clínicos</h3>
            {c.allergies && (
              <div className="bg-[#FFF8E1] border border-[#E65100]/20 rounded-xl p-4 flex gap-3">
                <AlertTriangle size={16} className="text-[#E65100] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-[#E65100] uppercase tracking-wide mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>Alergias / Contraindicações</p>
                  <p className="text-sm text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>{c.allergies}</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {[
                { label: 'Data de Nascimento', value: c.birth_date ? fmtDate(c.birth_date) : '—' },
                { label: 'Como Conheceu',      value: c.how_found ? (howFoundLabels[c.how_found] ?? c.how_found) : '—' },
                { label: 'Aceita Marketing',   value: c.accepts_marketing ? 'Sim' : 'Não' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-[#EAE0DC] last:border-0">
                  <span className="text-xs text-[#7A5C52]/60 uppercase tracking-wide" style={{ fontFamily: 'var(--font-poppins)' }}>{label}</span>
                  <span className="text-sm text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{value}</span>
                </div>
              ))}
            </div>
            {c.notes && (
              <div>
                <p className="text-xs text-[#7A5C52]/60 uppercase tracking-wide mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>Observações</p>
                <p className="text-sm text-[#7A5C52] leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>{c.notes}</p>
              </div>
            )}
          </div>

          {/* Histórico real */}
          <div className="bg-white border border-[#EAE0DC] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#EAE0DC]">
              <h3 className="text-base text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>Histórico de Atendimentos</h3>
            </div>
            {data.bookings.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>Nenhum atendimento registrado</p>
              </div>
            ) : (
              <div className="divide-y divide-[#EAE0DC] max-h-96 overflow-y-auto">
                {data.bookings.map((b: Record<string, unknown>) => {
                  const service = b.services as { name: string } | null
                  const staff = b.staff as { name: string } | null
                  return (
                    <div key={b.id as string} className="px-6 py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                        <Calendar size={14} className="text-[#2E7D32]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{service?.name ?? '—'}</p>
                        <p className="text-xs text-[#7A5C52]/60" style={{ fontFamily: 'var(--font-poppins)' }}>
                          {fmtDate(b.starts_at as string)} {staff ? `· ${staff.name}` : ''}
                        </p>
                      </div>
                      {b.amount_paid && (
                        <span className="text-sm font-medium text-[#1E1E1E] shrink-0" style={{ fontFamily: 'var(--font-poppins)' }}>
                          {fmt(b.amount_paid as number)}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
