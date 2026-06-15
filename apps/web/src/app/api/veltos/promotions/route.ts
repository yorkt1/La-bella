import { NextResponse } from 'next/server'
import { missingSalonResponse, rpcData, salonId } from '../_utils'

export async function GET() {
  const id = salonId()
  if (!id) return missingSalonResponse()

  const { data, error } = await rpcData('public_promotions', { p_salon: id })
  if (error) {
    const message = error.message ?? ''
    if (message.includes('public.public_promotions') || message.includes('schema cache')) {
      return NextResponse.json([])
    }
    return NextResponse.json({ error: message || 'Erro ao consultar promoções.' }, { status: 500 })
  }

  return NextResponse.json(data)
}
