import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({ error: 'date é obrigatório' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await createAdminClient()

  const { data, error } = await admin
    .from('bookings')
    .select(`
      id, starts_at, ends_at, status, notes,
      client:clients(id, name, phone, loyalty_tier),
      service:services(id, name, duration_minutes, price),
      professional:staff(id, name)
    `)
    .gte('starts_at', `${date}T00:00:00`)
    .lte('starts_at', `${date}T23:59:59`)
    .order('starts_at', { ascending: true }) as any

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data || [])
}
