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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: bookings, error } = await (admin
    .from('bookings')
    .select('amount_paid, discount_amount, payment_method, starts_at, service:services(name)')
    .eq('status', 'completed')
    .gte('starts_at', start.toISOString())
    .lte('starts_at', end.toISOString())
    .not('amount_paid', 'is', null) as any)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bs = (bookings || []) as any[]

  const total = bs.reduce((sum, b) => sum + (b.amount_paid || 0), 0)
  const discounts = bs.reduce((sum, b) => sum + (b.discount_amount || 0), 0)
  const count = bs.length
  const avg_ticket = count > 0 ? total / count : 0

  const by_method: Record<string, number> = {}
  bs.forEach(b => {
    if (b.payment_method) {
      by_method[b.payment_method] = (by_method[b.payment_method] || 0) + (b.amount_paid || 0)
    }
  })

  const serviceMap: Record<string, { total: number; count: number }> = {}
  bs.forEach(b => {
    const name = b.service?.name || 'Outros'
    if (!serviceMap[name]) serviceMap[name] = { total: 0, count: 0 }
    serviceMap[name].total += b.amount_paid || 0
    serviceMap[name].count += 1
  })
  const by_service = Object.entries(serviceMap)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 6)
    .map(([name, v]) => ({ name, ...v }))

  const dailyMap: Record<string, number> = {}
  bs.forEach(b => {
    const day = b.starts_at.split('T')[0]
    dailyMap[day] = (dailyMap[day] || 0) + (b.amount_paid || 0)
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
