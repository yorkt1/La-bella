import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
}

export function KpiCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-[#C89B7B]',
  iconBg = 'bg-[#F6E6E6]',
}: KpiCardProps) {
  const changeColors = {
    up: 'text-[#2E7D32]',
    down: 'text-[#C62828]',
    neutral: 'text-[#7A5C52]/60',
  }

  return (
    <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p
          className="text-xs text-[#7A5C52]/60 tracking-wide uppercase mb-1"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          {title}
        </p>
        <p
          className="text-2xl font-semibold text-[#1E1E1E] truncate"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {value}
        </p>
        {change && (
          <p
            className={`text-xs mt-1 ${changeColors[changeType]}`}
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {change}
          </p>
        )}
      </div>
      <div className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
  )
}
