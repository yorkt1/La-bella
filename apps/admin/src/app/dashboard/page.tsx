import { Topbar } from '@/components/layout/topbar'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { createAdminClient } from '@/lib/supabase/server'
import { startOfDay, endOfDay, startOfMonth } from 'date-fns'
import {
  Calendar, DollarSign, Users, Clock,
  TrendingUp, UserCheck, UserPlus, AlertCircle,
} from 'lucide-react'

async function getDashboardData() {
  try {
    const supabase = await createAdminClient()
    const now = new Date()
    const todayStart = startOfDay(now).toISOString()
    const todayEnd = endOfDay(now).toISOString()
    const monthStart = startOfMonth(now).toISOString()

    const [
      { count: bookingsToday },
      { data: revenueTodayData },
      { count: totalClients },
      { count: pendingBookings },
      { data: monthBookingsData },
      { count: newClientsMonth },
      { count: noShowsMonth },
      { data: todayBookings },
      { data: topServicesRaw },
    ] = await Promise.all([
      supabase.from('bookings').select('*', { count: 'exact', head: true })
        .gte('starts_at', todayStart).lte('starts_at', todayEnd).neq('status', 'cancelled'),
      supabase.from('bookings').select('amount_paid')
        .eq('status', 'completed').gte('starts_at', todayStart).lte('starts_at', todayEnd),
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('bookings').select('amount_paid').eq('status', 'completed').gte('starts_at', monthStart),
      supabase.from('clients').select('*', { count: 'exact', head: true }).gte('created_at', monthStart),
      supabase.from('bookings').select('*', { count: 'exact', head: true })
        .eq('status', 'no_show').gte('starts_at', monthStart),
      supabase.from('bookings')
        .select('id, starts_at, status, client:clients(name), service:services(name), professional:staff(name)')
        .gte('starts_at', todayStart).lte('starts_at', todayEnd)
        .neq('status', 'cancelled').order('starts_at', { ascending: true }),
      supabase.from('bookings').select('service:services(name)')
        .eq('status', 'completed').gte('starts_at', monthStart),
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const revenueToday = (revenueTodayData || []).reduce((sum, b: any) => sum + (b.amount_paid || 0), 0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const monthRevenue = (monthBookingsData || []).reduce((sum, b: any) => sum + (b.amount_paid || 0), 0)
    const avgTicket = (monthBookingsData?.length ?? 0) > 0 ? monthRevenue / (monthBookingsData?.length ?? 1) : 0

    const serviceCounts: Record<string, number> = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const b of (topServicesRaw || []) as any[]) {
      const name = b.service?.name || 'Outros'
      serviceCounts[name] = (serviceCounts[name] || 0) + 1
    }
    const topServices = Object.entries(serviceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([name, count]) => ({ name, count }))
    const maxCount = topServices[0]?.count || 1

    return {
      bookingsToday: bookingsToday || 0,
      revenueToday,
      totalClients: totalClients || 0,
      pendingBookings: pendingBookings || 0,
      avgTicket,
      newClientsMonth: newClientsMonth || 0,
      noShowsMonth: noShowsMonth || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      todayBookings: (todayBookings || []) as any[],
      topServices,
      maxCount,
    }
  } catch {
    return {
      bookingsToday: 0, revenueToday: 0, totalClients: 0, pendingBookings: 0,
      avgTicket: 0, newClientsMonth: 0, noShowsMonth: 0,
      todayBookings: [], topServices: [], maxCount: 1,
    }
  }
}

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  pending:     { label: 'Aguardando',      classes: 'bg-[#FFF8E1] text-[#E65100]' },
  confirmed:   { label: 'Confirmado',      classes: 'bg-[#E0F4F1] text-[#006064]' },
  in_progress: { label: 'Em Atendimento',  classes: 'bg-[#E8F5E9] text-[#1B5E20]' },
  completed:   { label: 'Concluído',       classes: 'bg-[#E8F5E9] text-[#2E7D32]' },
  cancelled:   { label: 'Cancelado',       classes: 'bg-[#FFEBEE] text-[#C62828]' },
}

const dotColors: Record<string, string> = {
  confirmed: 'bg-[#006064]', in_progress: 'bg-[#1B5E20]',
  pending: 'bg-[#E65100]', completed: 'bg-[#2E7D32]', cancelled: 'bg-[#C62828]',
}

export default async function DashboardPage() {
  const d = await getDashboardData()
  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date())

  const kpis = [
    { title: 'Atendimentos Hoje',       value: d.bookingsToday,            change: 'Agendamentos do dia',       changeType: 'neutral' as const, icon: Calendar,    iconColor: 'text-[#1565C0]', iconBg: 'bg-[#E3F2FD]' },
    { title: 'Faturamento do Dia',      value: fmt(d.revenueToday),        change: 'Serviços concluídos hoje',  changeType: 'neutral' as const, icon: DollarSign,  iconColor: 'text-[#2E7D32]', iconBg: 'bg-[#E8F5E9]' },
    { title: 'Total de Clientes',       value: d.totalClients,             change: `+${d.newClientsMonth} este mês`, changeType: 'up' as const, icon: Users,   iconColor: 'text-[#C89B7B]', iconBg: 'bg-[#F6E6E6]' },
    { title: 'Pendentes',               value: d.pendingBookings,          change: 'Aguardando confirmação',    changeType: 'neutral' as const, icon: Clock,       iconColor: 'text-[#E65100]', iconBg: 'bg-[#FFF8E1]' },
    { title: 'Ticket Médio',            value: fmt(d.avgTicket),           change: 'Serviços concluídos/mês',   changeType: 'neutral' as const, icon: TrendingUp,  iconColor: 'text-[#7A5C52]', iconBg: 'bg-[#F6E6E6]' },
    { title: 'Taxa de Retorno',         value: '—',                        change: 'Em breve',                  changeType: 'neutral' as const, icon: UserCheck,   iconColor: 'text-[#006064]', iconBg: 'bg-[#E0F4F1]' },
    { title: 'Novos Clientes',          value: d.newClientsMonth,          change: 'Este mês',                  changeType: 'neutral' as const, icon: UserPlus,    iconColor: 'text-[#1565C0]', iconBg: 'bg-[#E3F2FD]' },
    { title: 'No-shows',                value: d.noShowsMonth,             change: 'Neste mês',                 changeType: d.noShowsMonth > 0 ? 'down' as const : 'neutral' as const, icon: AlertCircle, iconColor: 'text-[#C62828]', iconBg: 'bg-[#FFEBEE]' },
  ]

  return (
    <>
      <Topbar title="Dashboard" subtitle={today} />
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => <KpiCard key={kpi.title} {...kpi} />)}
        </div>

        {/* Agenda do Dia */}
        <div className="bg-white border border-[#EAE0DC] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EAE0DC] flex items-center justify-between">
            <h2 className="text-lg text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Agenda de Hoje
            </h2>
            <a href="/dashboard/agenda" className="text-xs text-[#C89B7B] hover:text-[#7A5C52] transition-colors tracking-wide" style={{ fontFamily: 'var(--font-poppins)' }}>
              Ver completa →
            </a>
          </div>

          {d.todayBookings.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
                Nenhum agendamento para hoje
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#EAE0DC]">
              {d.todayBookings.map((booking) => {
                const status = statusConfig[booking.status] ?? statusConfig.pending
                const time = new Date(booking.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                return (
                  <div key={booking.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[#FDFAF8] transition-colors">
                    <div className="w-14 shrink-0 text-center">
                      <p className="text-base font-semibold text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {time}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1E1E1E] truncate" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {booking.client?.name ?? '—'}
                      </p>
                      <p className="text-xs text-[#7A5C52]/60 truncate" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {booking.service?.name ?? '—'} · {booking.professional?.name ?? 'Sem profissional'}
                      </p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wide ${status.classes}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                      {status.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Top serviços */}
          <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6">
            <h3 className="text-base text-[#1E1E1E] mb-5" style={{ fontFamily: 'var(--font-playfair)' }}>
              Serviços Mais Procurados
            </h3>
            {d.topServices.length === 0 ? (
              <p className="text-sm text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
                Nenhum dado disponível ainda
              </p>
            ) : (
              <div className="space-y-3">
                {d.topServices.map(({ name, count }) => (
                  <div key={name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{name}</span>
                      <span className="text-xs text-[#7A5C52]/60" style={{ fontFamily: 'var(--font-poppins)' }}>{count}x</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#F6E6E6]">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#C89B7B] to-[#7A5C52]"
                        style={{ width: `${Math.round((count / d.maxCount) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Atividades recentes */}
          <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6">
            <h3 className="text-base text-[#1E1E1E] mb-5" style={{ fontFamily: 'var(--font-playfair)' }}>
              Hoje — Linha do Tempo
            </h3>
            {d.todayBookings.length === 0 ? (
              <p className="text-sm text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
                Sem agendamentos hoje
              </p>
            ) : (
              <div className="space-y-4">
                {d.todayBookings.slice(0, 5).map((booking) => {
                  const time = new Date(booking.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                  return (
                    <div key={booking.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColors[booking.status] ?? 'bg-[#C89B7B]'}`} />
                      <div>
                        <p className="text-xs text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>
                          {booking.client?.name ?? '—'} — {booking.service?.name ?? '—'}
                        </p>
                        <p className="text-[10px] text-[#7A5C52]/50 mt-0.5" style={{ fontFamily: 'var(--font-poppins)' }}>
                          {time}
                        </p>
                      </div>
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
