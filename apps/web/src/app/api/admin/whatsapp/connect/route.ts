import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = process.env.EVOLUTION_API_URL
const API_KEY = process.env.EVOLUTION_API_KEY
const INSTANCE = process.env.EVOLUTION_INSTANCE

// Conecta o WhatsApp do salão via QR (Evolution API, 1 instância por salão — SaaS).
// Scaffold: quando a Evolution não está configurada, devolve { configured: false }
// e o front mostra o placeholder/instruções (não quebra).
export async function GET() {
  // Só admin logado.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!BASE_URL || !API_KEY || !INSTANCE) {
    return NextResponse.json({ configured: false })
  }

  try {
    // Garante que a instância do salão existe (cria se for o primeiro acesso).
    // Se já existir, a Evolution responde com erro — que ignoramos de propósito.
    // Obs.: o shape de create/connect pode variar entre versões da Evolution API.
    await fetch(`${BASE_URL}/instance/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: API_KEY },
      body: JSON.stringify({ instanceName: INSTANCE, qrcode: true, integration: 'WHATSAPP-BAILEYS' }),
    }).catch(() => {})

    // Pede o QR de conexão.
    const res = await fetch(`${BASE_URL}/instance/connect/${INSTANCE}`, {
      headers: { apikey: API_KEY },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json(
        { configured: true, error: 'Não foi possível obter o QR code agora. Tente novamente.' },
        { status: 502 },
      )
    }

    const data = await res.json()
    // Evolution devolve algo como { base64, code, pairingCode } — ou já conectado.
    return NextResponse.json({
      configured: true,
      qr: data?.base64 ?? data?.qrcode?.base64 ?? null,
      pairingCode: data?.pairingCode ?? data?.code ?? null,
      instance: INSTANCE,
    })
  } catch {
    return NextResponse.json(
      { configured: true, error: 'Evolution API inacessível.' },
      { status: 502 },
    )
  }
}
