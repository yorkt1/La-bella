import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await createAdminClient()

  const [{ data: client }, { data: bookings }] = await Promise.all([
    admin.from('clients').select('*').eq('id', id).single(),
    admin
      .from('bookings')
      .select('id, starts_at, amount_paid, status, services(name), staff:professional_id(name)')
      .eq('client_id', id)
      .in('status', ['completed', 'cancelled', 'no_show'])
      .order('starts_at', { ascending: false })
      .limit(30),
  ])

  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const completed = (bookings || []).filter((b: { status: string }) => b.status === 'completed')
  const visits = completed.length
  const total_spent = completed.reduce((s: number, b: { amount_paid: number | null }) => s + (b.amount_paid || 0), 0)

  return NextResponse.json({ client, bookings: bookings || [], visits, total_spent })
}
