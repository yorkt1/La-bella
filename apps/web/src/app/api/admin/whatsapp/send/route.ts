import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { sendWhatsApp, isWhatsAppConfigured } from '@/lib/whatsapp'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!isWhatsAppConfigured()) {
    return NextResponse.json({ error: 'WhatsApp não configurado' }, { status: 503 })
  }

  const { segment, message } = await request.json()
  if (!message?.trim()) return NextResponse.json({ error: 'Mensagem obrigatória' }, { status: 400 })

  const admin = await createAdminClient()

  let query = admin.from('clients').select('name, phone').eq('status', 'active')

  if (segment === 'vip') {
    query = query.in('loyalty_tier', ['gold', 'platinum'])
  } else if (segment === 'inactive') {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 60)
    query = query.lt('last_visit_at', cutoff.toISOString())
  } else if (segment === 'birthday') {
    const today = new Date()
    const mmdd = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    query = query.like('birth_date', `%-${mmdd}`)
  }

  const { data: clients } = await query
  if (!clients?.length) return NextResponse.json({ sent: 0 })

  let sent = 0
  for (const client of clients as { name: string; phone: string }[]) {
    const text = message
      .replace(/\{nome\}/g, client.name.split(' ')[0])
    const ok = await sendWhatsApp(client.phone, text)
    if (ok) sent++
    await new Promise(r => setTimeout(r, 300))
  }

  return NextResponse.json({ sent, total: clients.length })
}
