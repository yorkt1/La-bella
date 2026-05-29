'use client'

import { useState, useEffect } from 'react'
import { Topbar } from '@/components/admin/layout/topbar'
import { ShoppingBag, Scissors, Receipt } from 'lucide-react'

interface SaleItem { id: string; item_type: string; name: string; quantity: number; unit_price: number; total: number }
interface Sale {
  id: string; subtotal: number; discount_amount: number; total: number
  payment_method: string; notes: string | null; created_at: string
  client: { id: string; name: string; phone: string } | null
  staff: { id: string; name: string } | null
  items: SaleItem[]
}

const methodLabels: Record<string, string> = {
  pix: 'Pix', credit: 'Crédito', debit: 'Débito', cash: 'Dinheiro', transfer: 'Transferência',
}

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

function fmtDT(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function VendasPage() {
  const [sales, setSales]     = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/sales')
      .then(r => r.json())
      .then(d => { setSales(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const totalGeral = sales.reduce((s, v) => s + v.total, 0)

  return (
    <>
      <Topbar title="Vendas" subtitle="Histórico de comandas" />
      <div className="p-6 space-y-6">

        {/* Resumo */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total do período', value: fmt(totalGeral), icon: Receipt, color: 'text-[#2E7D32]', bg: 'bg-[#E8F5E9]' },
            { label: 'Comandas',         value: sales.length,    icon: ShoppingBag, color: 'text-[#1565C0]', bg: 'bg-[#E3F2FD]' },
            { label: 'Ticket médio',     value: fmt(sales.length ? totalGeral / sales.length : 0), icon: Receipt, color: 'text-[#C89B7B]', bg: 'bg-[#F6E6E6]' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-[#EAE0DC] rounded-2xl p-5 flex items-start justify-between">
              <div>
                <p className="text-xs text-[#7A5C52]/60 uppercase tracking-wide mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>{label}</p>
                <p className="text-xl font-semibold text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>{value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={color} />
              </div>
            </div>
          ))}
        </div>

        {/* Lista */}
        <div className="bg-white border border-[#EAE0DC] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#C89B7B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sales.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>Nenhuma venda registrada ainda</p>
            </div>
          ) : (
            <div className="divide-y divide-[#EAE0DC]">
              {sales.map(sale => (
                <div key={sale.id}>
                  <button
                    onClick={() => setExpanded(expanded === sale.id ? null : sale.id)}
                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-[#FDFAF8] transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#F6E6E6] flex items-center justify-center shrink-0">
                      <ShoppingBag size={14} className="text-[#C89B7B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {sale.client?.name ?? 'Cliente avulso'}
                      </p>
                      <p className="text-xs text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {fmtDT(sale.created_at)} · {sale.items.length} item(s) · {methodLabels[sale.payment_method] ?? sale.payment_method}
                      </p>
                    </div>
                    {sale.discount_amount > 0 && (
                      <span className="text-xs text-[#E65100] shrink-0" style={{ fontFamily: 'var(--font-poppins)' }}>
                        -{fmt(sale.discount_amount)}
                      </span>
                    )}
                    <span className="text-base font-semibold text-[#1E1E1E] shrink-0" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {fmt(sale.total)}
                    </span>
                  </button>

                  {expanded === sale.id && (
                    <div className="px-6 pb-4 bg-[#FDFAF8] border-t border-[#EAE0DC]">
                      <div className="pt-3 space-y-2">
                        {sale.items.map(item => (
                          <div key={item.id} className="flex items-center gap-3 text-sm">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                              item.item_type === 'service' ? 'bg-[#E3F2FD]' : 'bg-[#E8F5E9]'
                            }`}>
                              {item.item_type === 'service'
                                ? <Scissors size={11} className="text-[#1565C0]" />
                                : <ShoppingBag size={11} className="text-[#2E7D32]" />
                              }
                            </div>
                            <span className="flex-1 text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>
                              {item.name} {item.quantity > 1 && `×${item.quantity}`}
                            </span>
                            <span className="text-[#7A5C52] font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>
                              {fmt(item.total)}
                            </span>
                          </div>
                        ))}
                        {sale.notes && (
                          <p className="text-xs text-[#7A5C52]/60 pt-2 italic" style={{ fontFamily: 'var(--font-poppins)' }}>
                            {sale.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
