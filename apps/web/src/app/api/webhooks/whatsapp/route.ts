import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json()

  const phone: string = body?.phone ?? body?.from ?? ''
  const text: string = (body?.text?.message ?? body?.body ?? '').trim().toUpperCase()

  if (!phone || !text) return NextResponse.json({ ok: true })

  const normalizedPhone = phone.replace(/\D/g, '').replace(/^55/, '')
  const supabase = await createAdminClient()

  const { data: clientData } = await supabase
    .from('clients')
    .select('id')
    .ilike('phone', `%${normalizedPhone}%`)
    .single()

  if (!clientData) return NextResponse.json({ ok: true })
  const client = clientData as { id: string }

  const { data: bookingData } = await supabase
    .from('bookings')
    .select('id, starts_at, status')
    .eq('client_id', client.id)
    .in('status', ['pending', 'confirmed'])
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(1)
    .single()

  if (!bookingData) return NextResponse.json({ ok: true })
  const booking = bookingData as { id: string; starts_at: string; status: string }

  const hoursUntil = (new Date(booking.starts_at).getTime() - Date.now()) / 1000 / 3600
  const isConfirmation = /^(SIM|CONFIRMAR|S)$/.test(text)
  const isCancellation = /^(NAO|NÃO|CANCELAR|N)$/.test(text)

  if (isConfirmation && booking.status === 'pending') {
    await supabase.from('bookings').update({ status: 'confirmed' } as never).eq('id', booking.id)
  } else if (isCancellation && hoursUntil >= 24) {
    await supabase
      .from('bookings')
      .update({ status: 'cancelled', cancelled_reason: 'Cancelado pelo cliente via WhatsApp' } as never)
      .eq('id', booking.id)
  }

  return NextResponse.json({ ok: true })
}
