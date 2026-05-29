import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  name:           z.string().min(2),
  brand:          z.string().optional(),
  category:       z.string().min(1),
  description:    z.string().optional(),
  price:          z.number().positive(),
  cost_price:     z.number().positive().optional(),
  stock_quantity: z.number().int().min(0).default(0),
  is_active:      z.boolean().default(true),
  is_featured:    z.boolean().default(false),
  image_url:      z.string().url().optional(),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search   = searchParams.get('search')
  const active   = searchParams.get('active')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = admin.from('products').select('*').order('name')

  if (category) query = query.eq('category', category)
  if (active === 'true') query = query.eq('is_active', true)
  if (search) query = query.ilike('name', `%${search}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const admin = await createAdminClient()
  const { data, error } = await admin.from('products').insert(parsed.data as never).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
