'use client'

import { useState, useEffect, useCallback } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react'
import { format, addDays, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Booking {
  id: string
  starts_at: string
  ends_at: string
  status: string
  notes: string | null
  client: { id: string; name: string; phone: string; loyalty_tier: string } | null
  service: { id: string; name: string; duration_minutes: number; price: number } | null
  professional: { id: string; name: string } | null
}

const statusConfig: Record<string, { label: string; classes: string; bar: string }> = {
  pending:     { label: 'Aguardando',     classes: 'border-[#E65100]/40 bg-[#FFF8E1]',   bar: 'bg-[#E65100]' },
  confirmed:   { label: 'Confirmado',     classes: 'border-[#006064]/40 bg-[#E0F4F1]',   bar: 'bg-[#006064]' },
  in_progress: { label: 'Em Atendimento', classes: 'border-[#1B5E20]/40 bg-[#E8F5E9]',   bar: 'bg-[#1B5E20]' },
  completed:   { label: 'Concluído',      classes: 'border-[#2E7D32]/40 bg-white',        bar: 'bg-[#2E7D32]' },
  cancelled:   { label: 'Cancelado',      classes: 'border-[#C62828]/40 bg-[#FFEBEE] opacity-60', bar: 'bg-[#C62828]' },
  no_show:     { label: 'No-show',        classes: 'border-[#7A5C52]/40 bg-[#F6E6E6] opacity-60', bar: 'bg-[#7A5C52]' },
}

const nextActions: Record<string, string> = {
  pending:     'Confirmar',
  confirmed:   'Iniciar',
  in_progress: 'Concluir',
}

const nextStatus: Record<string, string> = {
  pending:     'confirmed',
  confirmed:   'in_progress',
  in_progress: 'completed',
}

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchBookings = useCallback(async (date: Date) => {
    setLoading(true)
    try {
      const dateStr = format(date, 'yyyy-MM-dd')
      const res = await fetch(`/api/agenda?date=${dateStr}`)
      if (res.ok) setBookings(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings(currentDate)
  }, [currentDate, fetchBookings])

  async function updateStatus(booking: Booking) {
    const newStatus = nextStatus[booking.status]
    if (!newStatus) return
    setUpdatingId(booking.id)
    try {
      const body: Record<string, unknown> = { status: newStatus }
      // Se concluindo, pede forma de pagamento (simplificado: define pix como padrão)
      if (newStatus === 'completed') {
        body.payment_method = 'pix'
        body.amount_paid = booking.service?.price ?? 0
      }
      const res = await fetch(`/api/agenda/${booking.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) await fetchBookings(currentDate)
    } finally {
      setUpdatingId(null)
    }
  }

  const dateLabel = format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })
  const dateCapitalized = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)

  return (
    <>
      <Topbar title="Agenda" subtitle={dateCapitalized} />
      <div className="p-6 space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentDate(subDays(currentDate, 1))}
              className="w-9 h-9 rounded-full border border-[#EAE0DC] flex items-center justify-center text-[#7A5C52] hover:border-[#C89B7B] transition-all">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 rounded-xl border border-[#EAE0DC] text-xs text-[#7A5C52] hover:border-[#C89B7B] transition-all"
              style={{ fontFamily: 'var(--font-poppins)' }}>
              Hoje
            </button>
            <button onClick={() => setCurrentDate(addDays(currentDate, 1))}
              className="w-9 h-9 rounded-full border border-[#EAE0DC] flex items-center justify-center text-[#7A5C52] hover:border-[#C89B7B] transition-all">
              <ChevronRight size={16} />
            </button>
          </div>

          <a
            href="http://localhost:3000/agendar"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-sm rounded-full hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            <Plus size={14} />
            Novo Agendamento
          </a>
        </div>

        {/* Booking cards */}
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#C89B7B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center bg-white border border-[#EAE0DC] rounded-2xl">
            <p className="text-sm text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
              Nenhum agendamento para este dia
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const s = statusConfig[booking.status] ?? statusConfig.pending
              const action = nextActions[booking.status]
              const isUpdating = updatingId === booking.id
              const duration = booking.service?.duration_minutes ?? 0
              const time = new Date(booking.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

              return (
                <div key={booking.id}
                  className={`bg-white border rounded-2xl p-5 flex items-center gap-5 hover:shadow-md transition-all ${s.classes}`}>
                  <div className={`w-1 self-stretch rounded-full ${s.bar}`} />

                  <div className="w-16 shrink-0">
                    <p className="text-lg font-semibold text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {time}
                    </p>
                    <div className="flex items-center gap-1 text-[#7A5C52]/50 mt-0.5">
                      <Clock size={10} />
                      <span className="text-[10px]" style={{ fontFamily: 'var(--font-poppins)' }}>{duration}min</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {booking.client?.name ?? '—'}
                    </p>
                    <p className="text-xs text-[#7A5C52]/60 mt-0.5" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {booking.service?.name ?? '—'} · {booking.professional?.name ?? 'Sem profissional'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wide bg-white/70 text-current"
                      style={{ fontFamily: 'var(--font-poppins)' }}>
                      {s.label}
                    </span>
                    {action && (
                      <button
                        onClick={() => updateStatus(booking)}
                        disabled={isUpdating}
                        className="text-xs px-4 py-2 rounded-full bg-[#1E1E1E] text-white hover:opacity-80 transition-opacity disabled:opacity-50"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        {isUpdating ? '...' : action}
                      </button>
                    )}
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
