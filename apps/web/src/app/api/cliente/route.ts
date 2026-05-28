import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get('phone')?.replace(/\D/g, '')

  if (!phone || phone.length < 10) {
    return NextResponse.json({ error: 'Telefone inválido' }, { status: 400 })
  }

  const admin = await createAdminClient()

  const { data: client } = await admin
    .from('clients')
    .select('id, name, phone, loyalty_points, loyalty_tier')
    .ilike('phone', `%${phone.slice(-8)}%`)
    .single()

  if (!client) return NextResponse.json({ error: 'Nenhum agendamento encontrado para este número' }, { status: 404 })

  const c = client as { id: string; name: string; phone: string; loyalty_points: number; loyalty_tier: string }

  const { data: bookings } = await admin
    .from('bookings')
    .select('id, starts_at, ends_at, status, notes, services(name, duration_minutes, price), staff:professional_id(name)')
    .eq('client_id', c.id)
    .in('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])
    .order('starts_at', { ascending: false })
    .limit(20)

  return NextResponse.json({ client: c, bookings: bookings || [] })
}
