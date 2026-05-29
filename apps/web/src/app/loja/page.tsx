import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ShoppingBag } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Loja | La Belle Infiní',
  description: 'Produtos de beleza, cosméticos, perfumes, suplementos e muito mais. Ozontek e Mary Kay à pronta entrega.',
}

const categoryLabels: Record<string, string> = {
  cosmetico: 'Cosmético', perfume: 'Perfume', suplemento: 'Suplemento',
  roupa: 'Roupa & Lingerie', ozontek: 'Ozontek', mary_kay: 'Mary Kay', outros: 'Outros',
}

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

async function getProducts() {
  try {
    const admin = await createAdminClient()
    const { data } = await admin
      .from('products')
      .select('id, name, brand, category, description, price, stock_quantity, is_featured, image_url')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('name')
    return (data || []) as {
      id: string; name: string; brand: string | null; category: string
      description: string | null; price: number; stock_quantity: number
      is_featured: boolean; image_url: string | null
    }[]
  } catch { return [] }
}

export default async function LojaPage() {
  const products = await getProducts()

  const categories = [...new Set(products.map(p => p.category))]

  return (
    <>
      <Header />
      <main className="pt-24">

        {/* Hero */}
        <section className="bg-[#FDFAF8] py-16 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-[#C89B7B] text-xs tracking-[0.5em] uppercase mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
              Pronta Entrega
            </p>
            <h1 className="text-5xl font-light text-[#1E1E1E] mb-5" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Nossa Loja
            </h1>
            <p className="text-[#7A5C52]/70 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>
              Cosméticos, perfumes, suplementos, roupas e linha completa Ozontek e Mary Kay.
              Retire na hora do seu atendimento ou agende uma visita.
            </p>
          </div>
        </section>

        {/* Categorias */}
        {categories.length > 1 && (
          <section className="bg-white border-b border-[#EAE0DC] sticky top-[68px] z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto py-3 scrollbar-none">
              {categories.map(cat => (
                <a
                  key={cat}
                  href={`#cat-${cat}`}
                  className="shrink-0 px-5 py-2 rounded-full border border-[#EAE0DC] text-[#7A5C52] text-xs tracking-widest uppercase hover:border-[#C89B7B] hover:text-[#C89B7B] transition-all"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {categoryLabels[cat] ?? cat}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Produtos por categoria */}
        <section className="py-14 bg-[#FDFAF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag size={48} className="mx-auto text-[#C89B7B]/30 mb-4" />
                <p className="text-[#7A5C52]/50 text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Em breve nossos produtos estarão disponíveis aqui.
                </p>
              </div>
            ) : (
              categories.map(cat => {
                const catProducts = products.filter(p => p.category === cat)
                if (!catProducts.length) return null
                return (
                  <div key={cat} id={`cat-${cat}`}>
                    <h2 className="text-2xl font-light text-[#1E1E1E] mb-6" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      {categoryLabels[cat] ?? cat}
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {catProducts.map(product => (
                        <div key={product.id} className="group bg-white border border-[#EAE0DC] rounded-2xl overflow-hidden hover:border-[#C89B7B] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(122,92,82,0.12)] transition-all duration-300">
                          <div className="h-44 bg-gradient-to-br from-[#F6E6E6] to-[#E8D5A3] flex items-center justify-center relative">
                            {product.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <ShoppingBag size={32} className="text-[#C89B7B]/30" />
                            )}
                            {product.is_featured && (
                              <span className="absolute top-3 right-3 text-[9px] bg-[#D4AF37] text-white px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ fontFamily: 'var(--font-poppins)' }}>
                                Destaque
                              </span>
                            )}
                            {product.stock_quantity === 0 && (
                              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                <span className="text-xs text-[#C62828] font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>Sem estoque</span>
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            {product.brand && (
                              <p className="text-[10px] text-[#C89B7B] uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                                {product.brand}
                              </p>
                            )}
                            <h3 className="text-sm font-medium text-[#1E1E1E] mb-2 leading-tight group-hover:text-[#C89B7B] transition-colors" style={{ fontFamily: 'var(--font-poppins)' }}>
                              {product.name}
                            </h3>
                            {product.description && (
                              <p className="text-xs text-[#7A5C52]/60 leading-relaxed mb-3 line-clamp-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                                {product.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-semibold text-[#7A5C52]" style={{ fontFamily: 'var(--font-playfair)' }}>
                                {fmt(product.price)}
                              </span>
                              <a
                                href="https://wa.me/5548996156188"
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs px-3 py-1.5 bg-[#25D366] text-white rounded-full hover:bg-[#20BD5B] transition-colors"
                                style={{ fontFamily: 'var(--font-poppins)' }}
                              >
                                Pedir
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1E1E1E] py-16 text-center">
          <div className="max-w-xl mx-auto px-4">
            <p className="text-[#D4AF37] text-xs tracking-[0.5em] uppercase mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
              Retire no salão
            </p>
            <h2 className="text-3xl font-light text-white mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Compre e retire na hora do seu atendimento
            </h2>
            <p className="text-white/50 text-sm mb-8" style={{ fontFamily: 'var(--font-poppins)' }}>
              Consulte disponibilidade pelo WhatsApp ou adicione produtos na hora do checkout.
            </p>
            <a
              href="/agendar"
              className="inline-block bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Agendar Horário
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
