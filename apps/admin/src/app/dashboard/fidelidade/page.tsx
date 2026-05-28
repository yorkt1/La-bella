import { Topbar } from '@/components/layout/topbar'
import { Star, Gift, TrendingUp } from 'lucide-react'

const tierSummary = [
  { tier: 'Rose', range: '0–99 pts', count: 312, color: 'from-[#F6E6E6] to-[#EAD4C8]', text: 'text-[#7A5C52]' },
  { tier: 'Gold', range: '100–299 pts', count: 148, color: 'from-[#FFF8E1] to-[#F5E6A0]', text: 'text-[#B8860B]' },
  { tier: 'Platinum', range: '300+ pts', count: 64, color: 'from-[#E3F2FD] to-[#BBDEFB]', text: 'text-[#1565C0]' },
]

const topClients = [
  { name: 'Patricia M.', tier: 'platinum', points: 620, initials: 'PM' },
  { name: 'Ana Carolina S.', tier: 'platinum', points: 480, initials: 'AC' },
  { name: 'Renata B.', tier: 'platinum', points: 390, initials: 'RB' },
  { name: 'Mariana P.', tier: 'gold', points: 210, initials: 'MP' },
  { name: 'Fernanda L.', tier: 'gold', points: 155, initials: 'FL' },
]

const rules = [
  { action: 'Cada R$ 10 gastos', points: '+1 ponto' },
  { action: 'Primeiro agendamento', points: '+20 pontos' },
  { action: 'Indicar uma amiga', points: '+30 pontos' },
  { action: 'Aniversário de cadastro', points: '+15 pontos' },
  { action: 'Avaliar atendimento', points: '+5 pontos' },
  { action: 'Agendamento online', points: '+2 pontos bônus' },
]

const tierColors: Record<string, string> = {
  rose: 'bg-[#F6E6E6] text-[#7A5C52]',
  gold: 'bg-[#FFF8E1] text-[#B8860B]',
  platinum: 'bg-[#E3F2FD] text-[#1565C0]',
}

export default function FidelidadePage() {
  return (
    <>
      <Topbar title="Fidelidade" subtitle="Programa de pontos e níveis" />
      <div className="p-6 space-y-6">
        {/* Tier cards */}
        <div className="grid grid-cols-3 gap-4">
          {tierSummary.map(({ tier, range, count, color, text }) => (
            <div key={tier} className={`bg-gradient-to-br ${color} rounded-2xl p-6`}>
              <div className="flex items-center gap-2 mb-3">
                <Star size={14} className={text} />
                <span className={`text-sm font-semibold ${text}`} style={{ fontFamily: 'var(--font-poppins)' }}>{tier}</span>
              </div>
              <p className={`text-3xl font-light ${text}`} style={{ fontFamily: 'var(--font-cormorant)' }}>{count}</p>
              <p className="text-xs text-current/60 mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>{range}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Ranking */}
          <div className="bg-white border border-[#EAE0DC] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#EAE0DC] flex items-center gap-2">
              <TrendingUp size={16} className="text-[#C89B7B]" />
              <h3 className="text-base text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>
                Ranking de Pontos
              </h3>
            </div>
            <div className="divide-y divide-[#EAE0DC]">
              {topClients.map((client, i) => (
                <div key={client.name} className="px-6 py-4 flex items-center gap-4">
                  <span className="w-6 text-center text-sm font-medium text-[#7A5C52]/40" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {i + 1}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C89B7B] to-[#7A5C52] flex items-center justify-center shrink-0">
                    <span className="text-white text-xs" style={{ fontFamily: 'var(--font-poppins)' }}>{client.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>{client.name}</p>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide ${tierColors[client.tier]}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                      <Star size={8} className="fill-current" />
                      {client.tier}
                    </span>
                  </div>
                  <span className="text-base font-semibold text-[#D4AF37]" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {client.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Regras de pontuação */}
          <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Gift size={16} className="text-[#C89B7B]" />
              <h3 className="text-base text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>
                Regras de Pontuação
              </h3>
            </div>
            <div className="space-y-3">
              {rules.map(({ action, points }) => (
                <div key={action} className="flex items-center justify-between py-2.5 border-b border-[#EAE0DC] last:border-0">
                  <span className="text-sm text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>{action}</span>
                  <span className="text-sm font-semibold text-[#2E7D32]" style={{ fontFamily: 'var(--font-poppins)' }}>{points}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-[#EAE0DC] space-y-3">
              <h4 className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>Benefícios por Nível</h4>
              {[
                { tier: 'Rose', text: 'Agendamento online + promoções gerais' },
                { tier: 'Gold', text: '5% desconto + acesso antecipado a promoções' },
                { tier: 'Platinum', text: '10% desconto + prioridade na agenda + brinde no aniversário' },
              ].map(({ tier, text }) => (
                <div key={tier} className="flex items-start gap-3">
                  <span className={`shrink-0 text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide ${tierColors[tier.toLowerCase()]}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                    {tier}
                  </span>
                  <p className="text-xs text-[#7A5C52]/70" style={{ fontFamily: 'var(--font-poppins)' }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
