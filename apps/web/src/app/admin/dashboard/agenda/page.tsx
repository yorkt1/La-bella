'use client'

import { useState, useEffect, useCallback } from 'react'
import { Topbar } from '@/components/admin/layout/topbar'
import { ChevronLeft, ChevronRight, Plus, Clock, LayoutList, CalendarDays } from 'lucide-react'
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns'
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

const statusConfig: Record<string, { label: string; classes: string; bar: string; week: string }> = {
  pending:     { label: 'Aguardando',     classes: 'border-[#E65100]/40 bg-[#FFF8E1]',          bar: 'bg-[#E65100]', week: 'bg-[#E65100]' },
  confirmed:   { label: 'Confirmado',     classes: 'border-[#006064]/40 bg-[#E0F4F1]',          bar: 'bg-[#006064]', week: 'bg-[#006064]' },
  in_progress: { label: 'Em Atendimento', classes: 'border-[#1B5E20]/40 bg-[#E8F5E9]',          bar: 'bg-[#1B5E20]', week: 'bg-[#1B5E20]' },
  completed:   { label: 'Concluído',      classes: 'border-[#2E7D32]/40 bg-white opacity-70',   bar: 'bg-[#2E7D32]', week: 'bg-[#2E7D32]' },
  cancelled:   { label: 'Cancelado',      classes: 'border-[#C62828]/40 bg-[#FFEBEE] opacity-60', bar: 'bg-[#C62828]', week: 'bg-[#C62828]' },
  no_show:     { label: 'No-show',        classes: 'border-[#7A5C52]/40 bg-[#F6E6E6] opacity-60', bar: 'bg-[#7A5C52]', week: 'bg-[#7A5C52]' },
}

const nextActions: Record<string, string> = { pending: 'Confirmar', confirmed: 'Iniciar', in_progress: 'Concluir' }
const nextStatus: Record<string, string>  = { pending: 'confirmed', confirmed: 'in_progress', in_progress: 'completed' }

const HOUR_START = 8
const HOUR_END   = 20
const TOTAL_MINS = (HOUR_END - HOUR_START) * 60

export default function AgendaPage() {
  const [view, setView] = useState<'day' | 'week'>('day')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays  = eachDayOfInterval({ start: weekStart, end: endOfWeek(currentDate, { weekStartsOn: 1 }) })
  const hours     = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i)

  const fetchBookings = useCallback(async (date: Date, mode: 'day' | 'week') => {
    setLoading(true)
    try {
      if (mode === 'day') {
        const res = await fetch(`/api/admin/agenda?date=${format(date, 'yyyy-MM-dd')}`)
        if (res.ok) setBookings(await res.json())
      } else {
        const ws = startOfWeek(date, { weekStartsOn: 1 })
        const we = endOfWeek(date, { weekStartsOn: 1 })
        const res = await fetch(`/api/admin/agenda?from=${format(ws, 'yyyy-MM-dd')}&to=${format(we, 'yyyy-MM-dd')}`)
        if (res.ok) setBookings(await res.json())
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBookings(currentDate, view) }, [currentDate, view, fetchBookings])

  async function updateStatus(booking: Booking) {
    const newStatus = nextStatus[booking.status]
    if (!newStatus) return
    setUpdatingId(booking.id)
    try {
      const body: Record<string, unknown> = { status: newStatus }
      if (newStatus === 'completed') { body.payment_method = 'pix'; body.amount_paid = booking.service?.price ?? 0 }
      const res = await fetch(`/api/admin/agenda/${booking.id}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      if (res.ok) await fetchBookings(currentDate, view)
    } finally { setUpdatingId(null) }
  }

  function prev() {
    if (view === 'day') setCurrentDate(d => subDays(d, 1))
    else setCurrentDate(d => subWeeks(d, 1))
  }
  function next() {
    if (view === 'day') setCurrentDate(d => addDays(d, 1))
    else setCurrentDate(d => addWeeks(d, 1))
  }

  const dateLabel = view === 'day'
    ? format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })
    : `${format(weekStart, "dd 'de' MMM", { locale: ptBR })} — ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), "dd 'de' MMM", { locale: ptBR })}`

  function bookingsForDay(day: Date) {
    return bookings.filter(b => isSameDay(new Date(b.starts_at), day))
  }

  function bookingStyle(b: Booking) {
    const start = new Date(b.starts_at)
    const end   = new Date(b.ends_at)
    const startMin = start.getHours() * 60 + start.getMinutes() - HOUR_START * 60
    const duration = (end.getTime() - start.getTime()) / 60000
    const top    = Math.max(0, (startMin / TOTAL_MINS) * 100)
    const height = Math.max(2, (duration / TOTAL_MINS) * 100)
    return { top: `${top}%`, height: `${height}%` }
  }

  return (
    <>
      <Topbar title="Agenda" subtitle={dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)} />
      <div className="p-6 space-y-6">

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={prev} className="w-9 h-9 rounded-full border border-[#EAE0DC] flex items-center justify-center text-[#7A5C52] hover:border-[#C89B7B] transition-all">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 rounded-xl border border-[#EAE0DC] text-xs text-[#7A5C52] hover:border-[#C89B7B] transition-all"
              style={{ fontFamily: 'var(--font-poppins)' }}>
              Hoje
            </button>
            <button onClick={next} className="w-9 h-9 rounded-full border border-[#EAE0DC] flex items-center justify-center text-[#7A5C52] hover:border-[#C89B7B] transition-all">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex border border-[#EAE0DC] rounded-xl overflow-hidden">
              <button onClick={() => setView('day')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs transition-all ${view === 'day' ? 'bg-[#1E1E1E] text-white' : 'text-[#7A5C52] hover:bg-[#F6E6E6]'}`}
                style={{ fontFamily: 'var(--font-poppins)' }}>
                <LayoutList size={13} />Dia
              </button>
              <button onClick={() => setView('week')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs transition-all ${view === 'week' ? 'bg-[#1E1E1E] text-white' : 'text-[#7A5C52] hover:bg-[#F6E6E6]'}`}
                style={{ fontFamily: 'var(--font-poppins)' }}>
                <CalendarDays size={13} />Semana
              </button>
            </div>
            <a href="/agendar" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-sm rounded-full hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-poppins)' }}>
              <Plus size={14} />Novo
            </a>
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#C89B7B] border-t-transparent rounded-full animate-spin" />
          </div>

        ) : view === 'day' ? (
          /* ── DAY VIEW ── */
          bookings.length === 0 ? (
            <div className="py-16 text-center bg-white border border-[#EAE0DC] rounded-2xl">
              <p className="text-sm text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>Nenhum agendamento para este dia</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map(booking => {
                const s = statusConfig[booking.status] ?? statusConfig.pending
                const action = nextActions[booking.status]
                const isUpdating = updatingId === booking.id
                const time = new Date(booking.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                return (
                  <div key={booking.id} className={`bg-white border rounded-2xl p-5 flex items-center gap-5 hover:shadow-md transition-all ${s.classes}`}>
                    <div className={`w-1 self-stretch rounded-full ${s.bar}`} />
                    <div className="w-16 shrink-0">
                      <p className="text-lg font-semibold text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>{time}</p>
                      <div className="flex items-center gap-1 text-[#7A5C52]/50 mt-0.5">
                        <Clock size={10} />
                        <span className="text-[10px]" style={{ fontFamily: 'var(--font-poppins)' }}>{booking.service?.duration_minutes ?? 0}min</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{booking.client?.name ?? '—'}</p>
                      <p className="text-xs text-[#7A5C52]/60 mt-0.5" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {booking.service?.name ?? '—'} · {booking.professional?.name ?? 'Sem profissional'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wide bg-white/70" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {s.label}
                      </span>
                      {action && (
                        <button onClick={() => updateStatus(booking)} disabled={isUpdating}
                          className="text-xs px-4 py-2 rounded-full bg-[#1E1E1E] text-white hover:opacity-80 transition-opacity disabled:opacity-50"
                          style={{ fontFamily: 'var(--font-poppins)' }}>
                          {isUpdating ? '...' : action}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )

        ) : (
          /* ── WEEK VIEW ── */
          <div className="bg-white border border-[#EAE0DC] rounded-2xl overflow-hidden">
            {/* Header dias */}
            <div className="grid border-b border-[#EAE0DC]" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
              <div className="border-r border-[#EAE0DC]" />
              {weekDays.map(day => (
                <div key={day.toISOString()} className={`text-center py-3 border-r border-[#EAE0DC] last:border-r-0 ${isSameDay(day, new Date()) ? 'bg-[#C89B7B]/10' : ''}`}>
                  <p className="text-[10px] text-[#7A5C52]/60 uppercase tracking-wide" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {format(day, 'EEE', { locale: ptBR })}
                  </p>
                  <p className={`text-sm font-semibold mt-0.5 ${isSameDay(day, new Date()) ? 'text-[#C89B7B]' : 'text-[#1E1E1E]'}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                    {format(day, 'dd')}
                  </p>
                </div>
              ))}
            </div>

            {/* Grid de horas */}
            <div className="overflow-y-auto" style={{ maxHeight: '560px' }}>
              <div className="grid relative" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
                {/* Coluna de horas */}
                <div className="border-r border-[#EAE0DC]">
                  {hours.map(h => (
                    <div key={h} className="h-14 flex items-start justify-end pr-2 pt-1 border-b border-[#EAE0DC]">
                      <span className="text-[10px] text-[#7A5C52]/40" style={{ fontFamily: 'var(--font-poppins)' }}>{h}h</span>
                    </div>
                  ))}
                </div>

                {/* Colunas dos dias */}
                {weekDays.map(day => {
                  const dayBookings = bookingsForDay(day)
                  return (
                    <div key={day.toISOString()} className={`relative border-r border-[#EAE0DC] last:border-r-0 ${isSameDay(day, new Date()) ? 'bg-[#C89B7B]/5' : ''}`}>
                      {hours.map(h => (
                        <div key={h} className="h-14 border-b border-[#EAE0DC]" />
                      ))}
                      {dayBookings.map(b => {
                        const s = statusConfig[b.status] ?? statusConfig.pending
                        const style = bookingStyle(b)
                        const time = new Date(b.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                        return (
                          <div
                            key={b.id}
                            style={{ ...style, position: 'absolute', left: '2px', right: '2px' }}
                            className={`rounded-lg px-1.5 py-1 overflow-hidden ${s.week} text-white cursor-default hover:opacity-90 transition-opacity`}
                            title={`${b.client?.name} — ${b.service?.name} (${time})`}
                          >
                            <p className="text-[10px] font-semibold truncate leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                              {time} {b.client?.name}
                            </p>
                            <p className="text-[9px] truncate opacity-80 leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                              {b.service?.name}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
