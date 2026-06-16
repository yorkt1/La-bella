import type { Service, Slot } from '@/types'

interface VeltosService {
  id: string
  nome: string
  categoria: string | null
  duracao: number
  preco: number
}

interface VeltosPro {
  id: string
  nome: string
  horarios?: Record<string, { aberto: boolean; abre: string; fecha: string }>
}

interface VeltosSalon {
  id: string
  nome: string
  telefone?: string
  endereco?: string
  horarios: Record<string, { aberto: boolean; abre: string; fecha: string }>
  servicos: VeltosService[]
  profissionais: VeltosPro[]
}

interface VeltosPromotion {
  id: string
  titulo: string
  descricao: string
  codigo: string | null
  tipo_desconto: 'percentual' | 'fixo'
  valor_desconto: number
  fim: string | null
}

export interface SitePromotion {
  id: string
  title: string
  description: string
  coupon: string | null
  discountType: 'percentual' | 'fixo'
  discountValue: number
  expires: string | null
}

const WD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
const VELTOS_API_ORIGIN = (
  process.env.NEXT_PUBLIC_VELTOS_API_ORIGIN ?? 'https://www.veltos.com.br'
).replace(/\/$/, '')
const SALON_ID = process.env.NEXT_PUBLIC_SALON_ID ?? ''
const toMin = (hhmm: string) => Number(hhmm.split(':')[0]) * 60 + Number(hhmm.split(':')[1])
const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

function veltosUrl(path: string): string {
  const separator = path.includes('?') ? '&' : '?'
  const salonQuery = SALON_ID ? `${separator}salonId=${encodeURIComponent(SALON_ID)}` : ''
  return `${VELTOS_API_ORIGIN}${path}${salonQuery}`
}

function mapService(s: VeltosService, i: number): Service {
  return {
    id: s.id,
    name: s.nome,
    slug: s.id,
    description: null,
    category: (s.categoria?.toLowerCase() as Service['category']) ?? 'outros',
    price: s.preco,
    duration_minutes: s.duracao,
    image_url: null,
    is_active: true,
    is_featured: false,
    sort_order: i,
  }
}

async function apiGet<T>(path: string): Promise<T | null> {
  const res = await fetch(veltosUrl(path), { cache: 'no-store' })
  if (!res.ok) return null
  return (await res.json()) as T
}

async function apiPost<T extends { ok?: boolean; error?: string }>(
  path: string,
  body: unknown,
): Promise<T> {
  const res = await fetch(veltosUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const payload = (await res.json().catch(() => null)) as T | null
  if (!res.ok) {
    return { ok: false, error: payload?.error ?? 'Erro de conexão.' } as T
  }
  return (payload ?? ({ ok: false, error: 'Resposta inválida.' } as T))
}

let salonCache: VeltosSalon | null = null

export async function getVeltosSalon(): Promise<VeltosSalon | null> {
  if (salonCache) return salonCache
  const data = await apiGet<VeltosSalon | { ok?: boolean; salon?: VeltosSalon }>(
    '/api/veltos/salon',
  )
  salonCache =
    data && typeof data === 'object' && 'salon' in data
      ? (data.salon ?? null)
      : (data as VeltosSalon | null)
  return salonCache
}

export async function getVeltosServices(): Promise<Service[]> {
  const salon = await getVeltosSalon()
  if (!salon) return []
  return (salon.servicos ?? []).map(mapService)
}

export async function getVeltosPromotions(): Promise<SitePromotion[]> {
  const response = await apiGet<
    VeltosPromotion[] | { ok?: boolean; promotions?: VeltosPromotion[] }
  >('/api/veltos/promotions')
  if (!response) return []
  let data: VeltosPromotion[] | undefined
  if (Array.isArray(response)) {
    data = response
  } else {
    data = response.promotions
  }
  if (!data) return []
  return data.map((p: VeltosPromotion) => ({
    id: p.id,
    title: p.titulo,
    description: p.descricao,
    coupon: p.codigo,
    discountType: p.tipo_desconto,
    discountValue: p.valor_desconto,
    expires: p.fim,
  }))
}

export async function validateVeltosCoupon(code: string): Promise<{
  ok: boolean
  error?: string
  discountType?: 'percentual' | 'fixo'
  discountValue?: number
}> {
  const res = await apiPost<{
    ok?: boolean
    error?: string
    tipo_desconto?: 'percentual' | 'fixo'
    valor_desconto?: number
  }>('/api/veltos/coupon/validate', { code })

  if (!res.ok) return { ok: false, error: res.error ?? 'Cupom inválido ou expirado.' }
  return {
    ok: true,
    discountType: res.tipo_desconto,
    discountValue: res.valor_desconto,
  }
}

export async function getVeltosSlots(serviceId: string, date: string): Promise<Slot[]> {
  const salon = await getVeltosSalon()
  if (!salon) return []
  const service = salon.servicos.find((s) => s.id === serviceId)
  const pro = salon.profissionais?.[0]
  if (!service || !pro) return []

  const wd = WD[new Date(`${date}T00:00:00`).getDay()]
  const day = pro.horarios?.[wd] ?? salon.horarios?.[wd]
  if (!day || !day.aberto) return []

  const data =
    (await apiGet<
      | { hora_inicio: string; duracao: number }[]
      | { ok?: boolean; busy?: { hora_inicio: string; duracao: number }[] }
    >(
      `/api/veltos/busy?prof=${encodeURIComponent(pro.id)}&date=${encodeURIComponent(date)}`,
    )) ?? []
  const busyRows = Array.isArray(data) ? data : (data.busy ?? [])
  const busy = busyRows.map((r) => ({
    start: toMin(r.hora_inicio),
    end: toMin(r.hora_inicio) + r.duracao,
  }))

  const open = toMin(day.abre)
  const close = toMin(day.fecha)
  const dur = service.duracao
  const slots: Slot[] = []
  for (let t = open; t + dur <= close; t += 15) {
    const free = !busy.some((b) => t < b.end && t + dur > b.start)
    if (free) {
      slots.push({
        starts_at: `${date}T${fmt(t)}:00`,
        ends_at: `${date}T${fmt(t + dur)}:00`,
        available: true,
      })
    }
  }
  return slots
}

export async function bookVeltos(input: {
  serviceId: string
  startsAt: string
  name: string
  phone: string
  couponCode?: string
}): Promise<{ ok: boolean; error?: string }> {
  const salon = await getVeltosSalon()
  const pro = salon?.profissionais?.[0]
  if (!salon || !pro) return { ok: false, error: 'Salão indisponível no momento.' }

  return await apiPost<{ ok: boolean; error?: string }>('/api/veltos/bookings', {
    profId: pro.id,
    date: input.startsAt.slice(0, 10),
    hora: input.startsAt.slice(11, 16),
    servicoIds: [input.serviceId],
    clienteNome: input.name,
    clienteTel: input.phone.replace(/\D/g, ''),
    cupomCodigo: input.couponCode?.trim() || null,
  })
}
