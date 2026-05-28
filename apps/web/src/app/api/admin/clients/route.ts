import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const tier = searchParams.get('tier') || ''

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = admin
    .from('clients')
    .select('id, name, phone, loyalty_tier, loyalty_points, status, created_at, bookings(starts_at, status)')
    .order('created_at', { ascending: false })
    .limit(100) as any

  if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`)
  if (tier) query = query.eq('loyalty_tier', tier)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clients = (data || []).map((client: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const completedBookings = (client.bookings || []).filter((b: any) => b.status === 'completed')
    const lastVisitRaw = completedBookings.length > 0
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? completedBookings.reduce((max: string, b: any) => b.starts_at > max ? b.starts_at : max, '')
      : null

    return {
      id: client.id,
      name: client.name,
      phone: client.phone,
      tier: client.loyalty_tier,
      points: client.loyalty_points,
      status: client.status,
      visits: completedBookings.length,
      last_visit: lastVisitRaw
        ? format(new Date(lastVisitRaw), 'dd/MM/yyyy', { locale: ptBR })
        : '—',
    }
  })

  return NextResponse.json(clients)
}
