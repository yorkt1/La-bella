'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { MessageCircle, Send, Users, CheckCheck, Clock, AlertCircle } from 'lucide-react'

const templates = [
  { id: 'confirm', label: 'Confirmação de Agendamento', preview: 'Olá, {nome}! Seu agendamento está confirmado para {data} às {hora} — {serviço}. Aguardamos você!' },
  { id: 'd1', label: 'Lembrete D-1', preview: 'Oi, {nome}! Lembrete: amanhã você tem {serviço} às {hora}. Confirme respondendo SIM ou CANCELAR.' },
  { id: 'h2', label: 'Lembrete H-2', preview: 'Oi, {nome}! Seu atendimento é daqui a 2 horas ({hora}). Endereço: {endereço}. Até logo!' },
  { id: 'post', label: 'Pós-atendimento', preview: 'Esperamos que tenha amado o resultado, {nome}! Conta pra gente como foi: {link}.' },
  { id: 'birthday', label: 'Aniversário', preview: 'Feliz aniversário, {nome}! Para comemorar, você ganhou 20% de desconto. Valido por 30 dias.' },
  { id: 'reactivation', label: 'Reativação', preview: 'Sentimos sua falta, {nome}! Use o cupom VOLTEI e ganhe 15% de desconto. Válido por 7 dias.' },
]

const recentSends = [
  { id: '1', template: 'Lembrete D-1', segment: 'Agendamentos amanhã', sent: 12, delivered: 12, read: 9, errors: 0, date: '26/05/2026 09:00' },
  { id: '2', template: 'Reativação', segment: 'Clientes inativas 60d', sent: 28, delivered: 27, read: 15, errors: 1, date: '25/05/2026 10:00' },
  { id: '3', template: 'Aniversário', segment: 'Aniversariantes do dia', sent: 3, delivered: 3, read: 3, errors: 0, date: '26/05/2026 09:00' },
]

const segments = [
  { value: 'all', label: 'Todas as clientes' },
  { value: 'vip', label: 'Clientes VIP (Gold + Platinum)' },
  { value: 'inactive', label: 'Inativas (60+ dias sem visita)' },
  { value: 'birthday', label: 'Aniversariantes do mês' },
]

export default function WhatsAppPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [segment, setSegment] = useState('all')

  const previewText = templates.find((t) => t.id === selectedTemplate)?.preview ?? ''

  return (
    <>
      <Topbar title="WhatsApp" subtitle="Automações e campanhas" />
      <div className="p-6 space-y-6">
        {/* Status da conexão */}
        <div className="bg-[#E8F5E9] border border-[#2E7D32]/30 rounded-2xl px-5 py-4 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-pulse" />
          <p className="text-sm text-[#2E7D32] font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>
            Z-API conectado · Instância ativa
          </p>
          <span className="ml-auto text-xs text-[#2E7D32]/70" style={{ fontFamily: 'var(--font-poppins)' }}>
            Último ping: agora
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Campanha manual */}
          <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6 space-y-5">
            <h3 className="text-base text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Enviar Campanha
            </h3>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>
                Segmento
              </label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="w-full rounded-xl border border-[#EAE0DC] px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#C89B7B] transition-colors"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {segments.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>
                Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full rounded-xl border border-[#EAE0DC] px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#C89B7B] transition-colors"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                <option value="">Selecione ou escreva manualmente</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>
                Mensagem
              </label>
              <textarea
                rows={5}
                value={selectedTemplate ? previewText : customMessage}
                onChange={(e) => { setSelectedTemplate(''); setCustomMessage(e.target.value) }}
                placeholder="Escreva a mensagem ou selecione um template acima..."
                className="w-full rounded-xl border border-[#EAE0DC] px-4 py-3 text-sm text-[#1E1E1E] placeholder-[#7A5C52]/40 focus:outline-none focus:border-[#C89B7B] resize-none transition-colors"
                style={{ fontFamily: 'var(--font-poppins)' }}
              />
              <p className="text-[10px] text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
                Variáveis: &#123;nome&#125;, &#123;data&#125;, &#123;hora&#125;, &#123;serviço&#125;, &#123;link&#125;
              </p>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-medium tracking-widest uppercase py-3.5 rounded-full hover:bg-[#20BD5B] transition-colors" style={{ fontFamily: 'var(--font-poppins)' }}>
              <Send size={14} />
              Enviar Campanha
            </button>
          </div>

          {/* Templates */}
          <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6">
            <h3 className="text-base text-[#1E1E1E] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Templates Automáticos
            </h3>
            <div className="space-y-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    selectedTemplate === t.id
                      ? 'border-[#25D366] bg-[#E8F5E9]'
                      : 'border-[#EAE0DC] hover:border-[#C89B7B]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle size={12} className={selectedTemplate === t.id ? 'text-[#25D366]' : 'text-[#C89B7B]'} />
                    <span className="text-xs font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {t.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#7A5C52]/60 line-clamp-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {t.preview}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Histórico */}
        <div className="bg-white border border-[#EAE0DC] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EAE0DC]">
            <h3 className="text-base text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Histórico de Envios
            </h3>
          </div>
          <div className="divide-y divide-[#EAE0DC]">
            {recentSends.map((send) => (
              <div key={send.id} className="px-6 py-4 flex items-center gap-5">
                <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                  <MessageCircle size={14} className="text-[#25D366]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1E1E1E]" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {send.template}
                  </p>
                  <p className="text-xs text-[#7A5C52]/60" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {send.segment} · {send.date}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-5 text-xs shrink-0">
                  <div className="flex items-center gap-1.5 text-[#7A5C52]/60">
                    <Users size={12} />
                    <span style={{ fontFamily: 'var(--font-poppins)' }}>{send.sent}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#2E7D32]">
                    <CheckCheck size={12} />
                    <span style={{ fontFamily: 'var(--font-poppins)' }}>{send.delivered}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#1565C0]">
                    <Clock size={12} />
                    <span style={{ fontFamily: 'var(--font-poppins)' }}>{send.read} leram</span>
                  </div>
                  {send.errors > 0 && (
                    <div className="flex items-center gap-1.5 text-[#C62828]">
                      <AlertCircle size={12} />
                      <span style={{ fontFamily: 'var(--font-poppins)' }}>{send.errors} erros</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
