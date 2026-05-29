import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isWhatsAppConfigured } from '@/lib/whatsapp'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!isWhatsAppConfigured()) {
    return NextResponse.json({ connected: false, reason: 'not_configured' })
  }

  try {
    const res = await fetch(
      `${process.env.EVOLUTION_API_URL}/instance/connectionState/${process.env.EVOLUTION_INSTANCE}`,
      { headers: { apikey: process.env.EVOLUTION_API_KEY! }, next: { revalidate: 0 } }
    )
    if (!res.ok) return NextResponse.json({ connected: false, reason: 'api_error' })
    const data = await res.json()
    const connected = data?.instance?.state === 'open'
    return NextResponse.json({ connected, state: data?.instance?.state })
  } catch {
    return NextResponse.json({ connected: false, reason: 'unreachable' })
  }
}
