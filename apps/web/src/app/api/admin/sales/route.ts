import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { z } from 'zod'

const saleItemSchema = z.object({
  item_type:      z.enum(['service', 'product']),
  booking_id:     z.string().uuid().optional(),
  product_id:     z.string().uuid().optional(),
  name:           z.string(),
  quantity:       z.number().int().positive().default(1),
  unit_price:     z.number().nonnegative(),
  discount_amount:z.number().nonnegative().default(0),
  total:          z.number().nonnegative(),
})

const saleSchema = z.object({
  client_id:      z.string().uuid().optional(),
  staff_id:       z.string().uuid().optional(),
  subtotal:       z.number().nonnegative(),
  discount_amount:z.number().nonnegative().default(0),
  total:          z.number().nonnegative(),
  payment_method: z.enum(['pix', 'credit', 'debit', 'cash', 'transfer']),
  notes:          z.string().optional(),
  items:          z.array(saleItemSchema).min(1),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page  = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '30')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await createAdminClient()
  const { data, error } = await admin
    .from('sales')
    .select(`
      id, subtotal, discount_amount, total, payment_method, notes, created_at,
      client:clients(id, name, phone),
      staff:staff(id, name),
      items:sale_items(id, item_type, name, quantity, unit_price, total)
    `)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = saleSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { items, ...saleData } = parsed.data
  const admin = await createAdminClient()

  // Cria a venda
  const { data: sale, error: saleError } = await admin
    .from('sales')
    .insert(saleData as never)
    .select('id')
    .single()

  if (saleError || !sale) return NextResponse.json({ error: saleError?.message }, { status: 500 })
  const { id: sale_id } = sale as { id: string }

  // Insere os itens
  const itemsToInsert = items.map(item => ({ ...item, sale_id }))
  const { error: itemsError } = await admin.from('sale_items').insert(itemsToInsert as never)
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 })

  // Baixa estoque dos produtos vendidos
  for (const item of items) {
    if (item.item_type === 'product' && item.product_id) {
      const { data: pd } = await admin.from('products').select('stock_quantity').eq('id', item.product_id).single()
      if (pd) {
        const p = pd as { stock_quantity: number }
        await admin.from('products')
          .update({ stock_quantity: Math.max(0, p.stock_quantity - item.quantity) } as never)
          .eq('id', item.product_id)
      }
    }
  }

  // Marca bookings como concluídos e atualiza pontos de fidelidade
  for (const item of items) {
    if (item.item_type === 'service' && item.booking_id) {
      await admin
        .from('bookings')
        .update({
          status: 'completed',
          payment_method: saleData.payment_method,
          amount_paid: item.total,
        } as never)
        .eq('id', item.booking_id)

      // Pontos de fidelidade: R$10 = 1 ponto
      if (saleData.client_id) {
        const points = Math.floor(item.total / 10)
        if (points > 0) {
          await admin.from('loyalty_transactions').insert({
            client_id: saleData.client_id,
            booking_id: item.booking_id,
            type: 'earn',
            points,
            description: `Atendimento — ${item.name}`,
          } as never)

          const { data: clientData } = await admin
            .from('clients')
            .select('loyalty_points')
            .eq('id', saleData.client_id)
            .single()

          if (clientData) {
            const c = clientData as { loyalty_points: number }
            const newPoints = c.loyalty_points + points
            const newTier = newPoints >= 300 ? 'platinum' : newPoints >= 100 ? 'gold' : 'rose'
            await admin
              .from('clients')
              .update({ loyalty_points: newPoints, loyalty_tier: newTier } as never)
              .eq('id', saleData.client_id)
          }
        }
      }
    }
  }

  return NextResponse.json({ id: sale_id }, { status: 201 })
}
