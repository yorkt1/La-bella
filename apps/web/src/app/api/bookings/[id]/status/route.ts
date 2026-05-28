import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  status: z.enum(['confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']),
  cancelled_reason: z.string().optional(),
  payment_method: z.enum(['pix', 'credit', 'debit', 'cash', 'transfer']).optional(),
  amount_paid: z.number().positive().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()
  const update: Record<string, unknown> = { status: parsed.data.status }
  if (parsed.data.cancelled_reason) update.cancelled_reason = parsed.data.cancelled_reason
  if (parsed.data.payment_method) update.payment_method = parsed.data.payment_method
  if (parsed.data.amount_paid) update.amount_paid = parsed.data.amount_paid

  const { data: bookingData, error } = await supabase
    .from('bookings')
    .update(update as never)
    .eq('id', id)
    .select('id, status, client_id, amount_paid')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const booking = bookingData as { id: string; status: string; client_id: string; amount_paid: number | null }

  // Credita pontos quando concluído com pagamento
  if (parsed.data.status === 'completed' && parsed.data.amount_paid) {
    const pointsEarned = Math.floor(parsed.data.amount_paid / 10)
    if (pointsEarned > 0) {
      await supabase.from('loyalty_transactions').insert({
        client_id: booking.client_id,
        booking_id: booking.id,
        type: 'earn',
        points: pointsEarned,
        description: `Atendimento concluído — R$ ${parsed.data.amount_paid}`,
      } as never)

      const { data: clientData } = await supabase
        .from('clients')
        .select('loyalty_points')
        .eq('id', booking.client_id)
        .single()

      if (clientData) {
        const c = clientData as { loyalty_points: number }
        const newPoints = c.loyalty_points + pointsEarned
        const newTier = newPoints >= 300 ? 'platinum' : newPoints >= 100 ? 'gold' : 'rose'
        await supabase
          .from('clients')
          .update({ loyalty_points: newPoints, loyalty_tier: newTier } as never)
          .eq('id', booking.client_id)
      }
    }
  }

  return NextResponse.json(booking)
}
