import { NextResponse } from 'next/server'
import { missingSalonResponse, rpcJson, salonId } from '../_utils'

export async function POST(request: Request) {
  const id = salonId()
  if (!id) return missingSalonResponse()

  const body = (await request.json().catch(() => ({}))) as {
    profId?: string
    date?: string
    hora?: string
    servicoIds?: string[]
    clienteNome?: string
    clienteTel?: string
    cupomCodigo?: string | null
  }

  if (
    !body.profId ||
    !body.date ||
    !body.hora ||
    !Array.isArray(body.servicoIds) ||
    body.servicoIds.length === 0 ||
    !body.clienteNome ||
    !body.clienteTel
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: 'profId, date, hora, servicoIds, clienteNome e clienteTel são obrigatórios.',
      },
      { status: 400 },
    )
  }

  const args: Record<string, unknown> = {
    p_salon: id,
    p_prof: body.profId,
    p_data: body.date,
    p_hora: body.hora,
    p_servico_ids: body.servicoIds,
    p_cliente_nome: body.clienteNome,
    p_cliente_tel: body.clienteTel,
    p_payment_method_used: null,
    p_payment_receipt_url: null,
    p_payment_id_external: null,
  }

  if (body.cupomCodigo?.trim()) {
    args.p_cupom_codigo = body.cupomCodigo.trim()
  }

  return rpcJson('public_book', args)
}
