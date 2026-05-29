'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Phone, Calendar, Clock, Star, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react'

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string }> = {
  pending:     { label: 'Aguardando confirmação', icon: AlertCircle,  color: 'text-[#E65100]' },
  confirmed:   { label: 'Confirmado',             icon: CheckCircle,  color: 'text-[#006064]' },
  in_progress: { label: 'Em atendimento',         icon: CheckCircle,  color: 'text-[#2E7D32]' },
  completed:   { label: 'Concluído',              icon: CheckCircle,  color: 'text-[#2E7D32]' },
  cancelled:   { label: 'Cancelado',              icon: XCircle,      color: 'text-[#C62828]' },
  no_show:     { label: 'Não compareceu',         icon: XCircle,      color: 'text-[#7A5C52]' },
}

const tierConfig: Record<string, { label: string; class: string }> = {
  rose:     { label: 'Rose',     class: 'bg-[#F6E6E6] text-[#7A5C52]' },
  gold:     { label: 'Gold',     class: 'bg-[#FFF8E1] text-[#B8860B]' },
  platinum: { label: 'Platinum', class: 'bg-[#E3F2FD] text-[#1565C0]' },
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

type ClientData = {
  client: { id: string; name: string; phone: string; loyalty_points: number; loyalty_tier: string }
  bookings: Record<string, unknown>[]
}

export default function ClientePage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ClientData | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const digits = phone.replace(/\D/g, '')
    try {
      const res = await fetch(`/api/cliente?phone=${digits}`)
      const json = await res.json()
      if (!res.ok) { setError(json.error); setData(null) }
      else setData(json)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const upcoming = data?.bookings.filter((b: Record<string, unknown>) =>
    ['pending', 'confirmed'].includes(b.status as string) && new Date(b.starts_at as string) > new Date()
  ) ?? []

  const past = data?.bookings.filter((b: Record<string, unknown>) =>
    ['completed', 'cancelled', 'no_show', 'in_progress'].includes(b.status as string) ||
    new Date(b.starts_at as string) < new Date()
  ) ?? []

  const tier = data ? tierConfig[data.client.loyalty_tier] ?? tierConfig.rose : null

  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-[#FDFAF8]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-10">
            <p className="text-[#C89B7B] text-xs tracking-[0.5em] uppercase mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
              Área da Cliente
            </p>
            <h1 className="text-4xl font-light text-[#1E1E1E]" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Meus Agendamentos
            </h1>
          </div>

          {/* Busca */}
          <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6 mb-6">
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Seu número de WhatsApp
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A5C52]/40" />
                    <input
                      value={phone}
                      onChange={e => setPhone(formatPhone(e.target.value))}
                      placeholder="(11) 99999-9999"
                      className="w-full rounded-xl border border-[#EAE0DC] bg-white pl-10 pr-4 py-3 text-sm text-[#1E1E1E] placeholder-[#7A5C52]/40 focus:outline-none focus:ring-2 focus:ring-[#C89B7B]/40 focus:border-[#C89B7B] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || phone.replace(/\D/g, '').length < 10}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                    Buscar
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-[#C62828] text-center" style={{ fontFamily: 'var(--font-poppins)' }}>{error}</p>}
            </form>
          </div>

          {/* Resultado */}
          {data && (
            <div className="space-y-6">
              {/* Card da cliente */}
              <div className="bg-white border border-[#EAE0DC] rounded-2xl p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C89B7B] to-[#7A5C52] flex items-center justify-center shrink-0">
                  <span className="text-white text-xl font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {data.client.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{data.client.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide ${tier?.class}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                      <Star size={8} className="fill-current" />{tier?.label}
                    </span>
                    <span className="text-xs text-[#7A5C52]/60" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {data.client.loyalty_points} pontos
                    </span>
                  </div>
                </div>
                <a
                  href="/agendar"
                  className="text-xs px-4 py-2.5 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white rounded-full hover:opacity-90 transition-opacity shrink-0"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Novo Agendamento
                </a>
              </div>

              {/* Próximos */}
              {upcoming.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[#7A5C52] uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Próximos Agendamentos
                  </h3>
                  <div className="space-y-3">
                    {upcoming.map((b: Record<string, unknown>) => {
                      const service = b.services as { name: string; duration_minutes: number } | null
                      const s = statusConfig[b.status as string] ?? statusConfig.pending
                      const StatusIcon = s.icon
                      return (
                        <div key={b.id as string} className="bg-white border border-[#C89B7B]/30 rounded-2xl p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-[#1E1E1E] mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                                {service?.name ?? '—'}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-[#7A5C52]/70">
                                <span className="flex items-center gap-1"><Calendar size={11} />{fmtDate(b.starts_at as string)}</span>
                                <span className="flex items-center gap-1"><Clock size={11} />{fmtTime(b.starts_at as string)}</span>
                                {service?.duration_minutes && <span>{service.duration_minutes} min</span>}
                              </div>
                            </div>
                            <div className={`flex items-center gap-1 text-xs shrink-0 ${s.color}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                              <StatusIcon size={13} />
                              {s.label}
                            </div>
                          </div>
                          {!!b.notes && (
                            <p className="mt-3 text-xs text-[#7A5C52]/60 bg-[#FDFAF8] rounded-lg px-3 py-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                              {b.notes as string}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Histórico */}
              {past.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[#7A5C52] uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Histórico
                  </h3>
                  <div className="bg-white border border-[#EAE0DC] rounded-2xl divide-y divide-[#EAE0DC]">
                    {past.map((b: Record<string, unknown>) => {
                      const service = b.services as { name: string } | null
                      const s = statusConfig[b.status as string] ?? statusConfig.completed
                      const StatusIcon = s.icon
                      return (
                        <div key={b.id as string} className="px-5 py-4 flex items-center gap-4">
                          <div className="w-9 h-9 rounded-full bg-[#FDFAF8] border border-[#EAE0DC] flex items-center justify-center shrink-0">
                            <Calendar size={13} className="text-[#7A5C52]/50" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{service?.name ?? '—'}</p>
                            <p className="text-xs text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
                              {fmtDate(b.starts_at as string)} · {fmtTime(b.starts_at as string)}
                            </p>
                          </div>
                          <div className={`flex items-center gap-1 text-[11px] shrink-0 ${s.color}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                            <StatusIcon size={12} />
                            {s.label}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {data.bookings.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-sm text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>Nenhum agendamento encontrado.</p>
                  <a href="/agendar" className="mt-4 inline-block text-sm text-[#C89B7B] hover:underline" style={{ fontFamily: 'var(--font-poppins)' }}>Fazer primeiro agendamento →</a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
