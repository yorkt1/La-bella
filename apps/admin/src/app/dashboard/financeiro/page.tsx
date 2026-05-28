'use client'

import { useState, useEffect } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { Download, TrendingUp, DollarSign, CreditCard, Banknote, Smartphone } from 'lucide-react'

interface FinanceData {
  total: number
  avg_ticket: number
  count: number
  discounts: number
  by_method: Record<string, number>
  by_service: { name: string; total: number; count: number }[]
  daily: { date: string; day: string; total: number }[]
}

const periodLabels: Record<string, string> = {
  today: 'Hoje',
  week: 'Esta semana',
  month: 'Este mês',
  '3months': '3 meses',
}

const methodConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  pix:      { label: 'Pix',              color: 'bg-[#2E7D32]', icon: Smartphone },
  credit:   { label: 'Crédito',          color: 'bg-[#1565C0]', icon: CreditCard },
  debit:    { label: 'Débito',           color: 'bg-[#7A5C52]', icon: CreditCard },
  cash:     { label: 'Dinheiro',         color: 'bg-[#D4AF37]', icon: Banknote },
  transfer: { label: 'Transferência',    color: 'bg-[#006064]', icon: DollarSign },
}

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

export default function FinanceiroPage() {
  const [period, setPeriod] = useState('month')
  const [data, setData] = useState<FinanceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/finance?period=${period}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [period])

  const maxBar = Math.max(...(data?.daily.map(d => d.total) ?? [1]), 1)
  const methodTotal = Object.values(data?.by_method ?? {}).reduce((s, v) => s + v, 0) || 1

  function exportCSV() {
    if (!data) return
    const header = 'Data,Total'
    const rows = data.daily.map(d => `"${d.date}",${d.total}`)
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `financeiro-${period}.csv`
    a.click()
  }

  return (
    <>
      <Topbar title="Financeiro" subtitle="Faturamento e relatórios" />
      <div className="p-6 space-y-6">
        {/* Period selector + export */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 border border-[#EAE0DC] rounded-xl overflow-hidden">
            {Object.entries(periodLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className={`px-4 py-2 text-xs transition-all ${period === key ? 'bg-[#1E1E1E] text-white' : 'text-[#7A5C52] hover:bg-[#F6E6E6]'}`}
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {label}
              </button>
            ))}
          </div>
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-5 py-2.5 border border-[#EAE0DC] rounded-full text-sm text-[#7A5C52] hover:border-[#C89B7B] transition-all"
            style={{ fontFamily: 'var(--font-poppins)' }}>
            <Download size={14} />
            Exportar CSV
          </button>
        </div>

        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#C89B7B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !data ? null : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Faturamento Total', value: fmt(data.total),      icon: DollarSign, iconBg: 'bg-[#E8F5E9]', iconColor: 'text-[#2E7D32]' },
                { label: 'Ticket Médio',       value: fmt(data.avg_ticket), icon: TrendingUp, iconBg: 'bg-[#F6E6E6]', iconColor: 'text-[#C89B7B]' },
                { label: 'Atendimentos',       value: String(data.count),   icon: DollarSign, iconBg: 'bg-[#E3F2FD]', iconColor: 'text-[#1565C0]' },
                { label: 'Descontos Dados',    value: fmt(data.discounts),  icon: DollarSign, iconBg: 'bg-[#FFF8E1]', iconColor: 'text-[#E65100]' },
              ].map(({ label, value, icon: Icon, iconBg, iconColor }) => (
                <div key={label} className="bg-white border border-[#EAE0DC] rounded-2xl p-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#7A5C52]/60 uppercase tracking-wide mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>{label}</p>
                    <p className="text-xl font-semibold text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>{value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={iconColor} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Bar chart */}
              <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6">
                <h3 className="text-base text-[#1E1E1E] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Faturamento — {periodLabels[period]}
                </h3>
                {data.daily.length === 0 ? (
                  <p className="text-sm text-[#7A5C52]/50 py-8 text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Nenhum dado no período
                  </p>
                ) : (
                  <div className="flex items-end gap-2 h-48">
                    {data.daily.map(({ day, total }) => (
                      <div key={day} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                        <span className="text-[10px] font-medium text-[#7A5C52] truncate w-full text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
                          {total > 0 ? fmt(total).replace('R$ ', 'R$') : ''}
                        </span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-[#C89B7B] to-[#D4AF37] transition-all duration-500 min-h-[4px]"
                          style={{ height: `${Math.max((total / maxBar) * 140, total > 0 ? 4 : 0)}px` }}
                        />
                        <span className="text-[10px] text-[#7A5C52]/60 truncate w-full text-center" style={{ fontFamily: 'var(--font-poppins)' }}>{day}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Por forma de pagamento */}
              <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6">
                <h3 className="text-base text-[#1E1E1E] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>Por Forma de Pagamento</h3>
                {Object.keys(data.by_method).length === 0 ? (
                  <p className="text-sm text-[#7A5C52]/50 py-8 text-center" style={{ fontFamily: 'var(--font-poppins)' }}>Nenhum dado no período</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(data.by_method).map(([method, value]) => {
                      const cfg = methodConfig[method] ?? { label: method, color: 'bg-[#7A5C52]', icon: DollarSign }
                      const Icon = cfg.icon
                      const pct = Math.round((value / methodTotal) * 100)
                      return (
                        <div key={method}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <Icon size={13} className="text-[#7A5C52]" />
                              <span className="text-sm text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{cfg.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-[#7A5C52]/60" style={{ fontFamily: 'var(--font-poppins)' }}>{pct}%</span>
                              <span className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{fmt(value)}</span>
                            </div>
                          </div>
                          <div className="h-2 rounded-full bg-[#F6E6E6]">
                            <div className={`h-full rounded-full ${cfg.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Top serviços */}
            {data.by_service.length > 0 && (
              <div className="bg-white border border-[#EAE0DC] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#EAE0DC]">
                  <h3 className="text-base text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>Serviços Mais Lucrativos</h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#EAE0DC] bg-[#FDFAF8]">
                      {['Serviço', 'Atendimentos', 'Faturamento', 'Ticket Médio'].map((h) => (
                        <th key={h} className="text-left px-5 py-3.5 text-[10px] text-[#7A5C52]/60 tracking-widest uppercase" style={{ fontFamily: 'var(--font-poppins)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE0DC]">
                    {data.by_service.map((s) => (
                      <tr key={s.name} className="hover:bg-[#FDFAF8] transition-colors">
                        <td className="px-5 py-4 text-sm text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{s.name}</td>
                        <td className="px-5 py-4 text-sm text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>{s.count}x</td>
                        <td className="px-5 py-4 text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{fmt(s.total)}</td>
                        <td className="px-5 py-4 text-sm text-[#C89B7B]" style={{ fontFamily: 'var(--font-poppins)' }}>{fmt(s.total / s.count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
