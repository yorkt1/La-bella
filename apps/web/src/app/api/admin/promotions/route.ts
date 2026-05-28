import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { z } from 'zod'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await createAdminClient()
  const { data, error } = await admin
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

const schema = z.object({
  title: z.string().min(1),
  discount_type: z.enum(['percent', 'fixed']),
  discount_value: z.number().positive(),
  coupon_code: z.string().min(1).toUpperCase(),
  starts_at: z.string().min(1),
  ends_at: z.string().min(1),
  segment: z.enum(['all', 'vip', 'inactive', 'birthday']).default('all'),
  max_uses: z.number().int().positive().optional(),
  is_visible: z.boolean().default(true),
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const admin = await createAdminClient()
  const { data, error } = await admin
    .from('promotions')
    .insert({ ...parsed.data, service_ids: [] } as never)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
