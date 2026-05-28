import * as React from 'react'

type BadgeVariant =
  | 'pending'
  | 'confirmed'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'vip'
  | 'rose'
  | 'gold'
  | 'platinum'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  pending: 'bg-[#FFF8E1] text-[#E65100]',
  scheduled: 'bg-[#E3F2FD] text-[#1565C0]',
  confirmed: 'bg-[#E0F4F1] text-[#006064]',
  in_progress: 'bg-[#E8F5E9] text-[#1B5E20]',
  completed: 'bg-[#E8F5E9] text-[#2E7D32]',
  cancelled: 'bg-[#FFEBEE] text-[#C62828]',
  vip: 'bg-[#E8D5A3] text-[#7A6000]',
  rose: 'bg-[#F6E6E6] text-[#7A5C52]',
  gold: 'bg-[#FFF8E1] text-[#B8860B]',
  platinum: 'bg-[#E3F2FD] text-[#1565C0]',
}

const labels: Record<BadgeVariant, string> = {
  pending: 'Aguardando',
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  in_progress: 'Em Atendimento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  vip: 'VIP',
  rose: 'Rose',
  gold: 'Gold',
  platinum: 'Platinum',
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children ?? labels[variant]}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    pending: 'pending',
    confirmed: 'confirmed',
    in_progress: 'in_progress',
    completed: 'completed',
    cancelled: 'cancelled',
    no_show: 'cancelled',
  }
  const variant = map[status] ?? 'pending'
  return <Badge variant={variant}>{labels[variant] ?? status}</Badge>
}

export function TierBadge({ tier }: { tier: string }) {
  const map: Record<string, BadgeVariant> = {
    rose: 'rose',
    gold: 'gold',
    platinum: 'platinum',
  }
  const variant = map[tier] ?? 'rose'
  return <Badge variant={variant}>{labels[variant] ?? tier}</Badge>
}
