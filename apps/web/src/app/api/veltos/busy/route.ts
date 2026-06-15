import { NextResponse } from 'next/server'
import { missingSalonResponse, rpcJson, salonId } from '../_utils'

export async function GET(request: Request) {
  const id = salonId()
  if (!id) return missingSalonResponse()

  const { searchParams } = new URL(request.url)
  const prof = searchParams.get('prof')
  const date = searchParams.get('date')

  if (!prof || !date) {
    return NextResponse.json({ error: 'prof e date são obrigatórios.' }, { status: 400 })
  }

  return rpcJson('public_busy', {
    p_salon: id,
    p_prof: prof,
    p_data: date,
  })
}
