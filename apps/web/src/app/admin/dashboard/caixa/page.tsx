'use client'

import { useState, useEffect, useCallback } from 'react'
import { Topbar } from '@/components/admin/layout/topbar'
import { Search, Plus, Minus, Trash2, CheckCircle, ShoppingBag, Scissors, User } from 'lucide-react'

interface Client { id: string; name: string; phone: string; loyalty_tier: string }
interface Product { id: string; name: string; brand: string | null; category: string; price: number; stock_quantity: number }
interface Booking { id: string; starts_at: string; status: string; service: { id: string; name: string; price: number } | null }

interface CartItem {
  key: string
  item_type: 'service' | 'product'
  booking_id?: string
  product_id?: string
  name: string
  quantity: number
  unit_price: number
  discount_amount: number
  total: number
}

const paymentMethods = [
  { value: 'pix',      label: 'Pix' },
  { value: 'credit',   label: 'Crédito' },
  { value: 'debit',    label: 'Débito' },
  { value: 'cash',     label: 'Dinheiro' },
  { value: 'transfer', label: 'Transferência' },
]

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

export default function CaixaPage() {
  const [clientSearch, setClientSearch]   = useState('')
  const [client, setClient]               = useState<Client | null>(null)
  const [bookings, setBookings]           = useState<Booking[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [products, setProducts]           = useState<Product[]>([])
  const [cart, setCart]                   = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [globalDiscount, setGlobalDiscount] = useState('')
  const [notes, setNotes]                 = useState('')
  const [submitting, setSubmitting]       = useState(false)
  const [done, setDone]                   = useState(false)

  // Busca produtos ao digitar
  const searchProducts = useCallback(async (q: string) => {
    if (!q.trim()) { setProducts([]); return }
    const res = await fetch(`/api/admin/products?search=${encodeURIComponent(q)}&active=true`)
    if (res.ok) setProducts(await res.json())
  }, [])

  useEffect(() => {
    const t = setTimeout(() => searchProducts(productSearch), 350)
    return () => clearTimeout(t)
  }, [productSearch, searchProducts])

  // Busca cliente e seus agendamentos de hoje
  async function searchClient() {
    const q = clientSearch.replace(/\D/g, '')
    if (q.length < 8) return
    const res = await fetch(`/api/admin/clients?search=${q}`)
    if (!res.ok) return
    const list = await res.json()
    if (!list?.length) return
    const c = list[0] as Client
    setClient(c)

    const today = new Date().toISOString().split('T')[0]
    const bRes = await fetch(`/api/admin/agenda?date=${today}`)
    if (bRes.ok) {
      const all: Booking[] = await bRes.json()
      setBookings(all.filter(b => {
        const bc = b as Booking & { client?: { id: string } }
        return bc.client?.id === c.id && ['pending','confirmed','in_progress'].includes(b.status)
      }))
    }
  }

  function addService(b: Booking) {
    if (!b.service) return
    const key = `svc-${b.id}`
    if (cart.find(i => i.key === key)) return
    const item: CartItem = {
      key, item_type: 'service', booking_id: b.id,
      name: b.service.name, quantity: 1,
      unit_price: b.service.price, discount_amount: 0,
      total: b.service.price,
    }
    setCart(prev => [...prev, item])
  }

  function addProduct(p: Product) {
    setCart(prev => {
      const key = `prd-${p.id}`
      const existing = prev.find(i => i.key === key)
      if (existing) {
        return prev.map(i => i.key === key
          ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.unit_price - i.discount_amount }
          : i)
      }
      return [...prev, {
        key, item_type: 'product', product_id: p.id,
        name: p.brand ? `${p.name} (${p.brand})` : p.name,
        quantity: 1, unit_price: p.price, discount_amount: 0, total: p.price,
      }]
    })
    setProductSearch('')
    setProducts([])
  }

  function removeItem(key: string) {
    setCart(prev => prev.filter(i => i.key !== key))
  }

  function changeQty(key: string, delta: number) {
    setCart(prev => prev.map(i => {
      if (i.key !== key) return i
      const qty = Math.max(1, i.quantity + delta)
      return { ...i, quantity: qty, total: qty * i.unit_price - i.discount_amount }
    }))
  }

  function setItemDiscount(key: string, raw: string) {
    const disc = parseFloat(raw) || 0
    setCart(prev => prev.map(i => {
      if (i.key !== key) return i
      return { ...i, discount_amount: disc, total: Math.max(0, i.quantity * i.unit_price - disc) }
    }))
  }

  const subtotal     = cart.reduce((s, i) => s + i.quantity * i.unit_price, 0)
  const itemDiscs    = cart.reduce((s, i) => s + i.discount_amount, 0)
  const globalDisc   = parseFloat(globalDiscount) || 0
  const total        = Math.max(0, subtotal - itemDiscs - globalDisc)

  async function handleCheckout() {
    if (!cart.length) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id:      client?.id,
          subtotal,
          discount_amount: itemDiscs + globalDisc,
          total,
          payment_method: paymentMethod,
          notes: notes || undefined,
          items: cart.map(i => ({
            item_type:      i.item_type,
            booking_id:     i.booking_id,
            product_id:     i.product_id,
            name:           i.name,
            quantity:       i.quantity,
            unit_price:     i.unit_price,
            discount_amount:i.discount_amount,
            total:          i.total,
          })),
        }),
      })
      if (res.ok) setDone(true)
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setCart([]); setClient(null); setClientSearch(''); setBookings([])
    setGlobalDiscount(''); setNotes(''); setPaymentMethod('pix'); setDone(false)
  }

  if (done) {
    return (
      <>
        <Topbar title="Caixa" subtitle="Venda concluída" />
        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center">
            <CheckCircle size={40} className="text-[#2E7D32]" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-light text-[#1E1E1E] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Venda Fechada!
            </h2>
            <p className="text-sm text-[#7A5C52]/70" style={{ fontFamily: 'var(--font-poppins)' }}>
              Total: <strong>{fmt(total)}</strong> via {paymentMethods.find(m => m.value === paymentMethod)?.label}
            </p>
          </div>
          <button
            onClick={reset}
            className="px-8 py-3 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-sm rounded-full hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Nova Venda
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Topbar title="Caixa" subtitle="Registro de vendas e serviços" />
      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Coluna esquerda: cliente + serviços + produtos */}
          <div className="lg:col-span-2 space-y-5">

            {/* Busca cliente */}
            <div className="bg-white border border-[#EAE0DC] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <User size={15} className="text-[#C89B7B]" />
                <h3 className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>Cliente</h3>
              </div>
              {client ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1E1E1E]">{client.name}</p>
                    <p className="text-xs text-[#7A5C52]/60">{client.phone}</p>
                  </div>
                  <button onClick={() => { setClient(null); setBookings([]) }}
                    className="text-xs text-[#C62828] hover:underline" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Trocar
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5C52]/40" />
                    <input
                      value={clientSearch}
                      onChange={e => setClientSearch(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && searchClient()}
                      placeholder="Buscar por nome ou telefone..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#EAE0DC] text-sm focus:outline-none focus:border-[#C89B7B] transition-colors"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    />
                  </div>
                  <button onClick={searchClient}
                    className="px-4 py-2.5 border border-[#EAE0DC] rounded-xl text-sm text-[#7A5C52] hover:border-[#C89B7B] transition-colors"
                    style={{ fontFamily: 'var(--font-poppins)' }}>
                    Buscar
                  </button>
                </div>
              )}
            </div>

            {/* Serviços do dia */}
            {bookings.length > 0 && (
              <div className="bg-white border border-[#EAE0DC] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Scissors size={15} className="text-[#C89B7B]" />
                  <h3 className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>Serviços de Hoje</h3>
                </div>
                <div className="space-y-2">
                  {bookings.map(b => {
                    const inCart = cart.some(i => i.booking_id === b.id)
                    const time = new Date(b.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                    return (
                      <div key={b.id} className="flex items-center justify-between py-2 border-b border-[#EAE0DC] last:border-0">
                        <div>
                          <p className="text-sm text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{b.service?.name}</p>
                          <p className="text-xs text-[#7A5C52]/50">{time} · {fmt(b.service?.price ?? 0)}</p>
                        </div>
                        <button
                          onClick={() => inCart ? removeItem(`svc-${b.id}`) : addService(b)}
                          className={`text-xs px-3 py-1.5 rounded-full transition-all ${inCart
                            ? 'bg-[#E8F5E9] text-[#2E7D32]'
                            : 'border border-[#EAE0DC] text-[#7A5C52] hover:border-[#C89B7B]'
                          }`}
                          style={{ fontFamily: 'var(--font-poppins)' }}
                        >
                          {inCart ? '✓ Adicionado' : '+ Adicionar'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Produtos */}
            <div className="bg-white border border-[#EAE0DC] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={15} className="text-[#C89B7B]" />
                <h3 className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>Adicionar Produto</h3>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5C52]/40" />
                <input
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  placeholder="Buscar produto pelo nome..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#EAE0DC] text-sm focus:outline-none focus:border-[#C89B7B] transition-colors"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                />
              </div>
              {products.length > 0 && (
                <div className="mt-2 border border-[#EAE0DC] rounded-xl overflow-hidden">
                  {products.map(p => (
                    <button
                      key={p.id}
                      onClick={() => addProduct(p)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#FDFAF8] transition-colors border-b border-[#EAE0DC] last:border-0"
                    >
                      <div className="text-left">
                        <p className="text-sm text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{p.name}</p>
                        <p className="text-xs text-[#7A5C52]/50">{p.brand ?? p.category} · Estoque: {p.stock_quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>{fmt(p.price)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coluna direita: carrinho + pagamento */}
          <div className="space-y-5">
            <div className="bg-white border border-[#EAE0DC] rounded-2xl p-5 sticky top-6">
              <h3 className="text-base text-[#1E1E1E] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Comanda</h3>

              {cart.length === 0 ? (
                <p className="text-sm text-[#7A5C52]/40 text-center py-8" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Nenhum item adicionado
                </p>
              ) : (
                <div className="space-y-3 mb-5">
                  {cart.map(item => (
                    <div key={item.key} className="border border-[#EAE0DC] rounded-xl p-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-xs font-medium text-[#1E1E1E] flex-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                          {item.name}
                        </p>
                        <button onClick={() => removeItem(item.key)} className="text-[#C62828]/60 hover:text-[#C62828] shrink-0">
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.item_type === 'product' && (
                          <div className="flex items-center gap-1 border border-[#EAE0DC] rounded-lg">
                            <button onClick={() => changeQty(item.key, -1)} className="p-1 text-[#7A5C52] hover:text-[#1E1E1E]">
                              <Minus size={10} />
                            </button>
                            <span className="text-xs w-5 text-center" style={{ fontFamily: 'var(--font-poppins)' }}>{item.quantity}</span>
                            <button onClick={() => changeQty(item.key, 1)} className="p-1 text-[#7A5C52] hover:text-[#1E1E1E]">
                              <Plus size={10} />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-1 flex-1">
                          <span className="text-[10px] text-[#7A5C52]/50">desc R$</span>
                          <input
                            type="number" min="0" step="0.01"
                            value={item.discount_amount || ''}
                            onChange={e => setItemDiscount(item.key, e.target.value)}
                            placeholder="0"
                            className="w-16 text-xs border border-[#EAE0DC] rounded px-2 py-1 focus:outline-none focus:border-[#C89B7B]"
                          />
                        </div>
                        <span className="text-sm font-medium text-[#7A5C52] shrink-0" style={{ fontFamily: 'var(--font-poppins)' }}>
                          {fmt(item.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Totais */}
              <div className="border-t border-[#EAE0DC] pt-4 space-y-2">
                <div className="flex justify-between text-xs text-[#7A5C52]/60">
                  <span style={{ fontFamily: 'var(--font-poppins)' }}>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#7A5C52]/60" style={{ fontFamily: 'var(--font-poppins)' }}>Desconto geral R$</span>
                  <input
                    type="number" min="0" step="0.01"
                    value={globalDiscount}
                    onChange={e => setGlobalDiscount(e.target.value)}
                    placeholder="0"
                    className="w-20 text-xs border border-[#EAE0DC] rounded px-2 py-1 text-right focus:outline-none focus:border-[#C89B7B]"
                  />
                </div>
                <div className="flex justify-between text-base font-semibold text-[#1E1E1E] pt-2 border-t border-[#EAE0DC]">
                  <span style={{ fontFamily: 'var(--font-poppins)' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-playfair)' }}>{fmt(total)}</span>
                </div>
              </div>

              {/* Pagamento */}
              <div className="mt-4">
                <p className="text-[11px] font-medium uppercase tracking-widest text-[#7A5C52] mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Forma de Pagamento
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map(m => (
                    <button
                      key={m.value}
                      onClick={() => setPaymentMethod(m.value)}
                      className={`py-2 rounded-xl text-xs font-medium transition-all border ${
                        paymentMethod === m.value
                          ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                          : 'border-[#EAE0DC] text-[#7A5C52] hover:border-[#C89B7B]'
                      }`}
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Observações (opcional)"
                rows={2}
                className="w-full mt-3 rounded-xl border border-[#EAE0DC] px-3 py-2 text-xs text-[#1E1E1E] placeholder-[#7A5C52]/40 focus:outline-none focus:border-[#C89B7B] resize-none"
                style={{ fontFamily: 'var(--font-poppins)' }}
              />

              <button
                onClick={handleCheckout}
                disabled={submitting || cart.length === 0}
                className="w-full mt-4 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-sm font-medium py-3.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {submitting ? 'Fechando...' : `Fechar Caixa · ${fmt(total)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
