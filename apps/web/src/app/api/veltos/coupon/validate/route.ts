import { NextResponse } from 'next/server'
import { missingSalonResponse, rpcJson, salonId } from '../../_utils'

export async function POST(request: Request) {
  const id = salonId()
  if (!id) return missingSalonResponse()

  const body = (await request.json().catch(() => ({}))) as { code?: string }
  if (!body.code?.trim()) {
    return NextResponse.json({ ok: false, error: 'Informe um cupom.' }, { status: 400 })
  }

  return rpcJson('public_validate_coupon', {
    p_salon: id,
    p_codigo: body.code,
  })
}
