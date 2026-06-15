import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

const SALON_ID = process.env.NEXT_PUBLIC_SALON_ID ?? ''

export async function GET(request: Request) {
  if (!SALON_ID) return NextResponse.json([])

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  const admin = await createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = admin
    .from('products')
    .select('id, nome, marca, categoria, preco, estoque')
    .eq('salon_id', SALON_ID)
    .eq('ativo', true)
    .order('nome')

  if (category) query = query.eq('categoria', category)
  if (featured === 'true') return NextResponse.json([])

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(
    ((data || []) as {
      id: string
      nome: string
      marca: string | null
      categoria: string | null
      preco: number
      estoque: number
    }[]).map((p) => ({
      id: p.id,
      name: p.nome,
      brand: p.marca,
      category: p.categoria ?? 'outros',
      description: null,
      price: p.preco,
      stock_quantity: p.estoque,
      is_featured: false,
      image_url: null,
    })),
  )
}
