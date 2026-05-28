import { Topbar } from '@/components/admin/layout/topbar'
import { ArrowLeft, Phone, Mail, Star, Calendar, AlertTriangle, Edit } from 'lucide-react'
import Link from 'next/link'

const mockClient = {
  id: '1',
  name: 'Ana Carolina Souza',
  phone: '(11) 99999-0001',
  email: 'ana.carolina@email.com',
  birth_date: '15/03/1990',
  skin_type: 'Mista',
  allergies: 'Sensibilidade a produtos com fragância sintética.',
  notes: 'Prefere atendimentos pela manhã. Não gosta de muito movimento. Cliente muito fiel desde 2021.',
  how_found: 'Instagram',
  loyalty_points: 480,
  loyalty_tier: 'platinum',
  visits: 24,
  total_spent: 4320,
  created_at: 'Jan 2021',
  accepts_marketing: true,
}

const history = [
  { id: '1', date: '24/05/2026', service: 'Extensão de Cílios', professional: 'Amanda F.', value: 250, status: 'completed' },
  { id: '2', date: '02/05/2026', service: 'Manutenção de Cílios', professional: 'Amanda F.', value: 130, status: 'completed' },
  { id: '3', date: '14/04/2026', service: 'Limpeza de Pele', professional: 'Gabriela C.', value: 180, status: 'completed' },
  { id: '4', date: '21/03/2026', service: 'Extensão de Cílios', professional: 'Amanda F.', value: 250, status: 'completed' },
]

const tierColors: Record<string, string> = {
  rose: 'bg-[#F6E6E6] text-[#7A5C52]',
  gold: 'bg-[#FFF8E1] text-[#B8860B]',
  platinum: 'bg-[#E3F2FD] text-[#1565C0]',
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

export default async function ClienteFichaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: _id } = await params
  const tier = tierColors[mockClient.loyalty_tier]

  return (
    <>
      <Topbar title="Ficha da Cliente" />
      <div className="p-6 space-y-6">
        <Link
          href="/admin/dashboard/clientes"
          className="inline-flex items-center gap-2 text-sm text-[#7A5C52] hover:text-[#C89B7B] transition-colors"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          <ArrowLeft size={14} />
          Voltar para clientes
        </Link>

        <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6 flex flex-wrap items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C89B7B] to-[#7A5C52] flex items-center justify-center shrink-0">
            <span className="text-white text-2xl font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>
              {mockClient.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="text-xl text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>
                {mockClient.name}
              </h2>
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wide ${tier}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                <Star size={9} className="fill-current" />
                {mockClient.loyalty_tier}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#7A5C52]/70">
              <span className="flex items-center gap-1.5"><Phone size={12} />{mockClient.phone}</span>
              {mockClient.email && <span className="flex items-center gap-1.5"><Mail size={12} />{mockClient.email}</span>}
              <span className="flex items-center gap-1.5"><Calendar size={12} />Cliente desde {mockClient.created_at}</span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-[#EAE0DC] rounded-xl text-sm text-[#7A5C52] hover:border-[#C89B7B] transition-all" style={{ fontFamily: 'var(--font-poppins)' }}>
            <Edit size={14} />
            Editar
          </button>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total de Visitas', value: `${mockClient.visits}x` },
            { label: 'Total Gasto', value: formatCurrency(mockClient.total_spent) },
            { label: 'Pontos', value: `${mockClient.loyalty_points} pts` },
            { label: 'Tipo de Pele', value: mockClient.skin_type },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-[#EAE0DC] rounded-2xl p-4 text-center">
              <p className="text-xs text-[#7A5C52]/60 uppercase tracking-wide mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>{label}</p>
              <p className="text-lg font-semibold text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6 space-y-4">
            <h3 className="text-base text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Dados Clínicos
            </h3>

            {mockClient.allergies && (
              <div className="bg-[#FFF8E1] border border-[#E65100]/20 rounded-xl p-4 flex gap-3">
                <AlertTriangle size={16} className="text-[#E65100] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-[#E65100] uppercase tracking-wide mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Alergias / Contraindicações
                  </p>
                  <p className="text-sm text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {mockClient.allergies}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {[
                { label: 'Data de Nascimento', value: mockClient.birth_date },
                { label: 'Tipo de Pele', value: mockClient.skin_type },
                { label: 'Como Conheceu', value: mockClient.how_found },
                { label: 'Aceita Marketing', value: mockClient.accepts_marketing ? 'Sim' : 'Não' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-[#EAE0DC] last:border-0">
                  <span className="text-xs text-[#7A5C52]/60 uppercase tracking-wide" style={{ fontFamily: 'var(--font-poppins)' }}>{label}</span>
                  <span className="text-sm text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{value}</span>
                </div>
              ))}
            </div>

            {mockClient.notes && (
              <div>
                <p className="text-xs text-[#7A5C52]/60 uppercase tracking-wide mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>Observações</p>
                <p className="text-sm text-[#7A5C52] leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>{mockClient.notes}</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-[#EAE0DC] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#EAE0DC]">
              <h3 className="text-base text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>
                Histórico de Atendimentos
              </h3>
            </div>
            <div className="divide-y divide-[#EAE0DC]">
              {history.map((h) => (
                <div key={h.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                    <Calendar size={14} className="text-[#2E7D32]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{h.service}</p>
                    <p className="text-xs text-[#7A5C52]/60" style={{ fontFamily: 'var(--font-poppins)' }}>{h.date} · {h.professional}</p>
                  </div>
                  <span className="text-sm font-medium text-[#1E1E1E] shrink-0" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {formatCurrency(h.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
