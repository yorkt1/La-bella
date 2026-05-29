'use client'

import { useState, useEffect, useCallback } from 'react'
import { Topbar } from '@/components/admin/layout/topbar'
import { Plus, Pencil, Eye, EyeOff, Search, X, Package } from 'lucide-react'

interface Product {
  id: string; name: string; brand: string | null; category: string
  description: string | null; price: number; cost_price: number | null
  stock_quantity: number; is_active: boolean; is_featured: boolean
}

const categories = [
  { value: 'cosmetico',   label: 'Cosmético' },
  { value: 'perfume',     label: 'Perfume' },
  { value: 'suplemento',  label: 'Suplemento' },
  { value: 'roupa',       label: 'Roupa / Lingerie' },
  { value: 'ozontek',     label: 'Ozontek' },
  { value: 'mary_kay',    label: 'Mary Kay' },
  { value: 'outros',      label: 'Outros' },
]

const catLabel = Object.fromEntries(categories.map(c => [c.value, c.label]))

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

const empty = {
  name: '', brand: '', category: 'cosmetico', description: '',
  price: '', cost_price: '', stock_quantity: '0',
  is_active: true, is_featured: false,
}

export default function ProdutosPage() {
  const [products, setProducts]     = useState<Product[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [catFilter, setCatFilter]   = useState('')
  const [modal, setModal]           = useState<'create' | 'edit' | null>(null)
  const [form, setForm]             = useState(empty)
  const [editId, setEditId]         = useState<string | null>(null)
  const [saving, setSaving]         = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchProducts = useCallback(async (s: string, cat: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (s) params.set('search', s)
      if (cat) params.set('category', cat)
      const res = await fetch(`/api/admin/products?${params}`)
      if (res.ok) setProducts(await res.json())
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(search, catFilter), 300)
    return () => clearTimeout(t)
  }, [search, catFilter, fetchProducts])

  function openCreate() { setForm(empty); setEditId(null); setModal('create') }
  function openEdit(p: Product) {
    setForm({
      name: p.name, brand: p.brand ?? '', category: p.category,
      description: p.description ?? '', price: String(p.price),
      cost_price: p.cost_price ? String(p.cost_price) : '',
      stock_quantity: String(p.stock_quantity),
      is_active: p.is_active, is_featured: p.is_featured,
    })
    setEditId(p.id)
    setModal('edit')
  }

  async function handleSave() {
    setSaving(true)
    try {
      const body = {
        name:           form.name,
        brand:          form.brand || null,
        category:       form.category,
        description:    form.description || null,
        price:          parseFloat(form.price as string) || 0,
        cost_price:     form.cost_price ? parseFloat(form.cost_price as string) : null,
        stock_quantity: parseInt(form.stock_quantity as string) || 0,
        is_active:      form.is_active,
        is_featured:    form.is_featured,
      }
      const url    = modal === 'edit' ? `/api/admin/products/${editId}` : '/api/admin/products'
      const method = modal === 'edit' ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { setModal(null); fetchProducts(search, catFilter) }
    } finally { setSaving(false) }
  }

  async function toggleActive(p: Product) {
    setTogglingId(p.id)
    await fetch(`/api/admin/products/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !p.is_active }),
    })
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x))
    setTogglingId(null)
  }

  return (
    <>
      <Topbar title="Produtos" subtitle="Catálogo e estoque" />
      <div className="p-6 space-y-6">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5C52]/40" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar produto..."
                className="pl-9 pr-4 py-2.5 rounded-xl border border-[#EAE0DC] text-sm w-56 focus:outline-none focus:border-[#C89B7B] transition-colors"
                style={{ fontFamily: 'var(--font-poppins)' }}
              />
            </div>
            <select
              value={catFilter} onChange={e => setCatFilter(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-[#EAE0DC] text-sm text-[#7A5C52] focus:outline-none focus:border-[#C89B7B] transition-colors"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              <option value="">Todas as categorias</option>
              {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-sm rounded-full hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            <Plus size={14} /> Novo Produto
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#C89B7B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center">
            <Package size={32} className="mx-auto text-[#7A5C52]/20 mb-3" />
            <p className="text-sm text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
              Nenhum produto encontrado
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(p => (
              <div key={p.id} className={`bg-white border rounded-2xl overflow-hidden ${p.is_active ? 'border-[#EAE0DC]' : 'border-[#EAE0DC] opacity-60'}`}>
                <div className="h-24 bg-gradient-to-br from-[#F6E6E6] to-[#E8D5A3] flex items-center justify-center relative">
                  <span className="text-lg font-light text-[#C89B7B]/40 italic" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {catLabel[p.category] ?? p.category}
                  </span>
                  {p.is_featured && (
                    <span className="absolute top-2 right-2 text-[9px] bg-[#D4AF37] text-white px-2 py-0.5 rounded-full uppercase">Destaque</span>
                  )}
                  {!p.is_active && (
                    <span className="absolute top-2 left-2 text-[9px] bg-[#7A5C52] text-white px-2 py-0.5 rounded-full uppercase">Inativo</span>
                  )}
                </div>
                <div className="p-4">
                  {p.brand && (
                    <p className="text-[10px] text-[#C89B7B] uppercase tracking-wider mb-0.5" style={{ fontFamily: 'var(--font-poppins)' }}>{p.brand}</p>
                  )}
                  <h4 className="text-sm font-medium text-[#1E1E1E] mb-2 leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>{p.name}</h4>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>Estoque: {p.stock_quantity}</span>
                    <span className="text-base font-semibold text-[#7A5C52]" style={{ fontFamily: 'var(--font-playfair)' }}>{fmt(p.price)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-[#EAE0DC] rounded-xl text-xs text-[#7A5C52] hover:border-[#C89B7B] transition-all"
                      style={{ fontFamily: 'var(--font-poppins)' }}>
                      <Pencil size={11} /> Editar
                    </button>
                    <button onClick={() => toggleActive(p)} disabled={togglingId === p.id}
                      className="w-9 h-9 flex items-center justify-center border border-[#EAE0DC] rounded-xl text-[#7A5C52] hover:border-[#C89B7B] transition-all disabled:opacity-50"
                      title={p.is_active ? 'Desativar' : 'Ativar'}>
                      {togglingId === p.id
                        ? <div className="w-3 h-3 border border-[#C89B7B] border-t-transparent rounded-full animate-spin" />
                        : p.is_active ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal criar / editar */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-[#EAE0DC] flex items-center justify-between">
              <h3 className="text-lg text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>
                {modal === 'create' ? 'Novo Produto' : 'Editar Produto'}
              </h3>
              <button onClick={() => setModal(null)} className="text-[#7A5C52]/50 hover:text-[#1E1E1E]"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-4">
              {[
                { label: 'Nome *', key: 'name', type: 'text', placeholder: 'Nome do produto' },
                { label: 'Marca', key: 'brand', type: 'text', placeholder: 'Ex: Ozontek, Mary Kay' },
                { label: 'Preço de venda (R$) *', key: 'price', type: 'number', placeholder: '0.00' },
                { label: 'Custo (R$)', key: 'cost_price', type: 'number', placeholder: '0.00' },
                { label: 'Estoque', key: 'stock_quantity', type: 'number', placeholder: '0' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium uppercase tracking-widest text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>{label}</label>
                  <input
                    type={type} placeholder={placeholder}
                    value={(form as Record<string, unknown>)[key] as string}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="rounded-xl border border-[#EAE0DC] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C89B7B] transition-colors"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium uppercase tracking-widest text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Categoria *</label>
                <select
                  value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="rounded-xl border border-[#EAE0DC] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C89B7B] transition-colors"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium uppercase tracking-widest text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>Descrição</label>
                <textarea
                  rows={3} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Descrição do produto..."
                  className="rounded-xl border border-[#EAE0DC] px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-[#C89B7B] transition-colors"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                />
              </div>

              <div className="flex gap-6">
                {[
                  { key: 'is_active', label: 'Produto ativo' },
                  { key: 'is_featured', label: 'Destaque na loja' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(form as Record<string, unknown>)[key] as boolean}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                      className="w-4 h-4 accent-[#C89B7B]"
                    />
                    <span className="text-sm text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#EAE0DC] flex gap-3 justify-end">
              <button onClick={() => setModal(null)}
                className="px-5 py-2.5 border border-[#EAE0DC] rounded-full text-sm text-[#7A5C52] hover:border-[#C89B7B] transition-colors"
                style={{ fontFamily: 'var(--font-poppins)' }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.price}
                className="px-6 py-2.5 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-sm rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ fontFamily: 'var(--font-poppins)' }}>
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
