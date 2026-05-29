import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import {
  startOfDay, endOfDay, startOfMonth, endOfMonth,
  subMonths, startOfWeek, endOfWeek, format, eachDayOfInterval,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

function getDateRange(period: string) {
  const now = new Date()
  switch (period) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) }
    case 'week':
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
    case '3months':
      return { start: startOfDay(subMonths(now, 3)), end: endOfDay(now) }
    default:
      return { start: startOfMonth(now), end: endOfMonth(now) }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'month'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await createAdminClient()
  const { start, end } = getDateRange(period)

  // Agendamentos concluídos (serviços)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: bookings, error } = await (admin
    .from('bookings')
    .select('amount_paid, discount_amount, payment_method, starts_at, service:services(name)')
    .eq('status', 'completed')
    .gte('starts_at', start.toISOString())
    .lte('starts_at', end.toISOString())
    .not('amount_paid', 'is', null) as any)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Vendas do caixa (serviços + produtos vendidos via comanda)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: salesData } = await (admin
    .from('sales')
    .select('total, discount_amount, payment_method, created_at, items:sale_items(item_type, name, total)')
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString()) as any)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bs = (bookings || []) as any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ss = (salesData || []) as any[]

  // IDs de bookings já contabilizados pelas sales (evita dupla contagem)
  const { data: saleBookingIds } = await admin
    .from('sale_items')
    .select('booking_id')
    .not('booking_id', 'is', null)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString())

  const coveredBookings = new Set((saleBookingIds || []).map((r: { booking_id: string }) => r.booking_id))

  // Bookings não cobertos por uma sale (registros antigos / diretos)
  const uncoveredBookings = bs.filter((b: { id?: string }) => !coveredBookings.has(b.id ?? ''))

  const totalServices = uncoveredBookings.reduce((sum: number, b: { amount_paid?: number }) => sum + (b.amount_paid || 0), 0)
  const totalSales    = ss.reduce((sum: number, s: { total?: number }) => sum + (s.total || 0), 0)
  const total         = totalServices + totalSales

  const discounts = [
    ...uncoveredBookings.map((b: { discount_amount?: number }) => b.discount_amount || 0),
    ...ss.map((s: { discount_amount?: number }) => s.discount_amount || 0),
  ].reduce((a, b) => a + b, 0)

  const count = uncoveredBookings.length + ss.length
  const avg_ticket = count > 0 ? total / count : 0

  const by_method: Record<string, number> = {}
  uncoveredBookings.forEach((b: { payment_method?: string; amount_paid?: number }) => {
    if (b.payment_method) by_method[b.payment_method] = (by_method[b.payment_method] || 0) + (b.amount_paid || 0)
  })
  ss.forEach((s: { payment_method?: string; total?: number }) => {
    if (s.payment_method) by_method[s.payment_method] = (by_method[s.payment_method] || 0) + (s.total || 0)
  })

  const serviceMap: Record<string, { total: number; count: number }> = {}
  uncoveredBookings.forEach((b: { service?: { name?: string }; amount_paid?: number }) => {
    const name = b.service?.name || 'Serviço'
    if (!serviceMap[name]) serviceMap[name] = { total: 0, count: 0 }
    serviceMap[name].total += b.amount_paid || 0
    serviceMap[name].count += 1
  })
  ss.forEach((s: { items?: { item_type: string; name: string; total: number }[] }) => {
    (s.items || []).forEach((item: { item_type: string; name: string; total: number }) => {
      const name = item.name || (item.item_type === 'product' ? 'Produto' : 'Serviço')
      if (!serviceMap[name]) serviceMap[name] = { total: 0, count: 0 }
      serviceMap[name].total += item.total || 0
      serviceMap[name].count += 1
    })
  })
  const by_service = Object.entries(serviceMap)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 6)
    .map(([name, v]) => ({ name, ...v }))

  const dailyMap: Record<string, number> = {}
  uncoveredBookings.forEach((b: { starts_at?: string; amount_paid?: number }) => {
    const day = (b.starts_at || '').split('T')[0]
    if (day) dailyMap[day] = (dailyMap[day] || 0) + (b.amount_paid || 0)
  })
  ss.forEach((s: { created_at?: string; total?: number }) => {
    const day = (s.created_at || '').split('T')[0]
    if (day) dailyMap[day] = (dailyMap[day] || 0) + (s.total || 0)
  })

  let daily: { date: string; day: string; total: number }[]

  if (period === 'week' || period === 'today') {
    daily = eachDayOfInterval({ start, end }).map(d => {
      const key = format(d, 'yyyy-MM-dd')
      return { date: key, day: format(d, 'EEE', { locale: ptBR }), total: dailyMap[key] || 0 }
    })
  } else {
    daily = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, total]) => ({
        date,
        day: format(new Date(date + 'T12:00:00'), 'dd/MM', { locale: ptBR }),
        total,
      }))
  }

  return NextResponse.json({ total, avg_ticket, count, discounts, by_method, by_service, daily })
}
