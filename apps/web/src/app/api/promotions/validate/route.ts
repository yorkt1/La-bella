import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')?.toUpperCase()

  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

  const admin = await createAdminClient()
  const now = new Date().toISOString()

  const { data, error } = await admin
    .from('promotions')
    .select('id, title, discount_type, discount_value, max_uses, uses_count')
    .eq('coupon_code', code)
    .eq('is_visible', true)
    .lte('starts_at', now)
    .gte('ends_at', now)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 404 })

  if (data.max_uses !== null && data.uses_count >= data.max_uses) {
    return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 410 })
  }

  return NextResponse.json({
    id: data.id,
    title: data.title,
    discount_type: data.discount_type,
    discount_value: data.discount_value,
  })
}
