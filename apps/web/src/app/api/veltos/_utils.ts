import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export function salonId() {
  return process.env.NEXT_PUBLIC_SALON_ID ?? ''
}

export function missingSalonResponse() {
  return NextResponse.json({ error: 'NEXT_PUBLIC_SALON_ID não configurado.' }, { status: 500 })
}

export async function rpcData(fn: string, args: Record<string, unknown>) {
  const admin = await createAdminClient()
  const { data, error } = await (admin as unknown as {
    rpc: (name: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message?: string } | null }>
  }).rpc(fn, args)

  return { data, error }
}

export async function rpcJson(fn: string, args: Record<string, unknown>) {
  const { data, error } = await rpcData(fn, args)

  if (error) {
    return NextResponse.json({ error: error.message ?? 'Erro ao consultar o Veltos.' }, { status: 500 })
  }

  return NextResponse.json(data)
}
