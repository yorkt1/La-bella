import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addMinutes, parseISO } from 'date-fns'
import { z } from 'zod'

const createBookingSchema = z.object({
  client_name: z.string().min(3),
  client_phone: z.string().min(10),
  client_email: z.string().email().optional().or(z.literal('')),
  service_id: z.string().uuid(),
  professional_id: z.string().uuid().optional(),
  starts_at: z.string().datetime(),
  notes: z.string().max(500).optional(),
  coupon_code: z.string().optional(),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')

  const supabase = await createClient()

  let query = supabase
    .from('bookings')
    .select(`*, client:clients(id,name,phone,loyalty_tier), service:services(id,name,duration_minutes,price), professional:staff(id,name)`)
    .order('starts_at', { ascending: true })
    .range((page - 1) * limit, page * limit - 1)

  if (date) {
    query = query.gte('starts_at', `${date}T00:00:00`).lte('starts_at', `${date}T23:59:59`)
  }
  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = createBookingSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { client_name, client_phone, client_email, service_id, professional_id, starts_at, notes, coupon_code } = parsed.data

  const supabase = await createClient()

  // Upsert cliente por telefone
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .upsert({ name: client_name, phone: client_phone, email: client_email || null } as never, {
      onConflict: 'phone',
      ignoreDuplicates: false,
    })
    .select('id')
    .single()

  if (clientError || !clientData) {
    return NextResponse.json({ error: 'Erro ao criar/buscar cliente' }, { status: 500 })
  }
  const client = clientData as { id: string }

  // Busca duração e preço do serviço
  const { data: serviceData } = await supabase
    .from('services')
    .select('duration_minutes, price')
    .eq('id', service_id)
    .single()

  if (!serviceData) return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 })
  const service = serviceData as { duration_minutes: number; price: number }

  const ends_at = addMinutes(parseISO(starts_at), service.duration_minutes).toISOString()

  // Valida cupom
  let discountAmount = 0
  if (coupon_code) {
    const { data: promoData } = await supabase
      .from('promotions')
      .select('discount_type, discount_value')
      .eq('coupon_code', coupon_code.toUpperCase())
      .lte('starts_at', new Date().toISOString())
      .gte('ends_at', new Date().toISOString())
      .single()

    if (promoData) {
      const promo = promoData as { discount_type: string; discount_value: number }
      discountAmount = promo.discount_type === 'percent'
        ? service.price * (promo.discount_value / 100)
        : promo.discount_value
    }
  }

  // Cria agendamento
  const { data: bookingData, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      client_id: client.id,
      service_id,
      professional_id: professional_id ?? null,
      starts_at,
      ends_at,
      status: 'pending',
      discount_amount: discountAmount,
      coupon_code: coupon_code?.toUpperCase() ?? null,
      notes: notes ?? null,
    } as never)
    .select('id, starts_at, ends_at, status')
    .single()

  if (bookingError) return NextResponse.json({ error: bookingError.message }, { status: 500 })
  const booking = bookingData as { id: string; starts_at: string; ends_at: string; status: string }

  // Pontos de boas-vindas no primeiro agendamento
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', client.id)

  if (count === 1) {
    await supabase.from('loyalty_transactions').insert({
      client_id: client.id,
      booking_id: booking.id,
      type: 'bonus',
      points: 20,
      description: 'Bônus de boas-vindas — primeiro agendamento',
    } as never)
    await supabase.from('clients').update({ loyalty_points: 20 } as never).eq('id', client.id)
  }

  return NextResponse.json(booking, { status: 201 })
}
