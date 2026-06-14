// Integração do front (vitrine La Belle) com o sistema Veltos.
// O front é só a casca — serviços, horários e agendamento vêm do Veltos via RPCs públicas
// (anon key). Ver vault: "08 - Plano Adicional - Site .com.br".
import { createClient } from '@/lib/supabase/client'
import type { Service, Slot } from '@/types'

export const SALON_ID = process.env.NEXT_PUBLIC_SALON_ID ?? ''

// Cliente Supabase com rpc destipado (as RPCs do Veltos não estão no Database do front).
type RpcClient = {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>
}
const rpc = () => createClient() as unknown as RpcClient

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

const WD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
const toMin = (hhmm: string) => Number(hhmm.split(':')[0]) * 60 + Number(hhmm.split(':')[1])
const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

/** Mapeia o serviço do Veltos para o tipo Service do front. */
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

let _salonCache: VeltosSalon | null = null
/** Busca o salão (catálogo + horários + profissionais) do Veltos. Cacheado na sessão. */
export async function getVeltosSalon(): Promise<VeltosSalon | null> {
  if (_salonCache) return _salonCache
  if (!SALON_ID) return null
  const { data, error } = await rpc().rpc('public_salon', { p_salon: SALON_ID })
  if (error || !data) return null
  _salonCache = data as VeltosSalon
  return _salonCache
}

/** Lista de serviços reais do salão (do Veltos), no formato do front. */
export async function getVeltosServices(): Promise<Service[]> {
  const salon = await getVeltosSalon()
  if (!salon) return []
  return (salon.servicos ?? []).map(mapService)
}

/** Calcula os horários livres (slots) para um serviço numa data, lendo do Veltos. */
export async function getVeltosSlots(serviceId: string, date: string): Promise<Slot[]> {
  const salon = await getVeltosSalon()
  if (!salon) return []
  const service = salon.servicos.find((s) => s.id === serviceId)
  const pro = salon.profissionais?.[0]
  if (!service || !pro) return []

  const wd = WD[new Date(`${date}T00:00:00`).getDay()]
  const day = pro.horarios?.[wd] ?? salon.horarios?.[wd]
  if (!day || !day.aberto) return []

  // Horários ocupados do profissional na data.
  const { data } = await rpc().rpc('public_busy', {
    p_salon: SALON_ID,
    p_prof: pro.id,
    p_data: date,
  })
  const busy = ((data as { hora_inicio: string; duracao: number }[] | null) ?? []).map((r) => ({
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
      slots.push({ starts_at: `${date}T${fmt(t)}:00`, ends_at: `${date}T${fmt(t + dur)}:00`, available: true })
    }
  }
  return slots
}

/** Cria o agendamento no Veltos (grava no banco do sistema). */
export async function bookVeltos(input: {
  serviceId: string
  startsAt: string // "yyyy-MM-ddTHH:mm:00"
  name: string
  phone: string
}): Promise<{ ok: boolean; error?: string }> {
  const salon = await getVeltosSalon()
  const pro = salon?.profissionais?.[0]
  if (!salon || !pro) return { ok: false, error: 'Salão indisponível no momento.' }

  const date = input.startsAt.slice(0, 10)
  const hora = input.startsAt.slice(11, 16)
  const { data, error } = await rpc().rpc('public_book', {
    p_salon: SALON_ID,
    p_prof: pro.id,
    p_data: date,
    p_hora: hora,
    p_servico_ids: [input.serviceId],
    p_cliente_nome: input.name,
    p_cliente_tel: input.phone.replace(/\D/g, ''),
  })
  if (error) return { ok: false, error: (error as { message?: string }).message ?? 'Erro ao agendar.' }
  const res = data as { ok: boolean; error?: string } | null
  if (!res?.ok) return { ok: false, error: res?.error ?? 'Não foi possível agendar.' }
  return { ok: true }
}
