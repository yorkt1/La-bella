import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const from = searchParams.get('from')
  const to   = searchParams.get('to')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await createAdminClient()

  const startAt = date ? `${date}T00:00:00` : from ? `${from}T00:00:00` : null
  const endAt   = date ? `${date}T23:59:59` : to   ? `${to}T23:59:59`  : null

  if (!startAt || !endAt) return NextResponse.json({ error: 'date ou from+to obrigatório' }, { status: 400 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin
    .from('bookings')
    .select(`
      id, starts_at, ends_at, status, notes,
      client:clients(id, name, phone, loyalty_tier),
      service:services(id, name, duration_minutes, price),
      professional:staff(id, name)
    `)
    .gte('starts_at', startAt)
    .lte('starts_at', endAt)
    .order('starts_at', { ascending: true }) as any)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data || [])
}
