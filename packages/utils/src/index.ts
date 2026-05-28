import { format, formatDistanceToNow, parseISO, addMinutes } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatDate(date: string | Date, pattern = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern, { locale: ptBR })
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, "dd/MM/yyyy 'às' HH:mm")
}

export function formatTime(date: string | Date): string {
  return formatDate(date, 'HH:mm')
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: ptBR })
}

export function calcEndTime(startsAt: string, durationMinutes: number): string {
  return addMinutes(parseISO(startsAt), durationMinutes).toISOString()
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return phone
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function getLoyaltyTierLabel(tier: string): string {
  const labels: Record<string, string> = {
    rose: 'Rose',
    gold: 'Gold',
    platinum: 'Platinum',
  }
  return labels[tier] ?? tier
}

export function getBookingStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Aguardando',
    confirmed: 'Confirmado',
    in_progress: 'Em Atendimento',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    no_show: 'Não Compareceu',
  }
  return labels[status] ?? status
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}
