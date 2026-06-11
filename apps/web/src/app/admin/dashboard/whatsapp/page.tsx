'use client'

import { useState, useEffect } from 'react'
import { Topbar } from '@/components/admin/layout/topbar'
import { MessageCircle, Send, AlertCircle, Loader2, QrCode } from 'lucide-react'

const templates = [
  { id: 'confirm',     label: 'Confirmação de Agendamento', preview: 'Olá, {nome}! Seu agendamento está confirmado para {data} às {hora} — {serviço}. Aguardamos você!' },
  { id: 'd1',         label: 'Lembrete D-1',               preview: 'Oi, {nome}! Lembrete: amanhã você tem {serviço} às {hora}. Confirme respondendo SIM ou CANCELAR.' },
  { id: 'h2',         label: 'Lembrete H-2',               preview: 'Oi, {nome}! Seu atendimento é daqui a 2 horas ({hora}). Até logo!' },
  { id: 'post',       label: 'Pós-atendimento',            preview: 'Esperamos que tenha amado o resultado, {nome}! Conta pra gente como foi.' },
  { id: 'birthday',   label: 'Aniversário',                preview: 'Feliz aniversário, {nome}! Para comemorar, você ganhou 20% de desconto. Válido por 30 dias.' },
  { id: 'reactivation', label: 'Reativação',               preview: 'Sentimos sua falta, {nome}! Use o cupom VOLTEI e ganhe 15% de desconto. Válido por 7 dias.' },
]

const segments = [
  { value: 'all',      label: 'Todas as clientes' },
  { value: 'vip',      label: 'Clientes VIP (Gold + Platinum)' },
  { value: 'inactive', label: 'Inativas (60+ dias sem visita)' },
  { value: 'birthday', label: 'Aniversariantes do mês' },
]

type ConnectionStatus = 'loading' | 'connected' | 'disconnected' | 'not_configured'

export default function WhatsAppPage() {
  const [status, setStatus] = useState<ConnectionStatus>('loading')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [segment, setSegment] = useState('all')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<string | null>(null)
  const [qr, setQr] = useState<string | null>(null)
  const [pairingCode, setPairingCode] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [connectMsg, setConnectMsg] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/whatsapp/status')
      .then(r => r.json())
      .then(d => {
        if (d.reason === 'not_configured') setStatus('not_configured')
        else setStatus(d.connected ? 'connected' : 'disconnected')
      })
      .catch(() => setStatus('disconnected'))
  }, [])

  // Enquanto o QR está na tela, verifica a cada 4s se já conectou.
  useEffect(() => {
    if (!qr) return
    const t = setInterval(() => {
      fetch('/api/admin/whatsapp/status')
        .then(r => r.json())
        .then(d => { if (d.connected) { setStatus('connected'); setQr(null); setPairingCode(null) } })
        .catch(() => {})
    }, 4000)
    return () => clearInterval(t)
  }, [qr])

  const previewText = templates.find(t => t.id === selectedTemplate)?.preview ?? ''
  const messageText = selectedTemplate ? previewText : customMessage

  async function handleConnect() {
    setConnecting(true)
    setConnectMsg(null)
    setQr(null)
    setPairingCode(null)
    try {
      const res = await fetch('/api/admin/whatsapp/connect')
      const d = await res.json()
      if (d.configured === false) {
        setConnectMsg('Evolution API ainda não configurada. Defina EVOLUTION_API_URL, EVOLUTION_API_KEY e EVOLUTION_INSTANCE para gerar o QR real.')
      } else if (d.qr) {
        setQr(d.qr)
        setPairingCode(d.pairingCode ?? null)
      } else if (d.error) {
        setConnectMsg(d.error)
      } else {
        setConnectMsg('Nenhum QR retornado — a instância pode já estar conectada.')
      }
    } catch {
      setConnectMsg('Erro ao falar com o servidor.')
    } finally {
      setConnecting(false)
    }
  }

  async function handleSend() {
    if (!messageText.trim()) return
    setSending(true)
    setSendResult(null)
    try {
      const res = await fetch('/api/admin/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segment, message: messageText }),
      })
      const data = await res.json()
      if (res.ok) setSendResult(`✓ ${data.sent ?? 0} mensagens enviadas`)
      else setSendResult(`Erro: ${data.error ?? 'Tente novamente'}`)
    } catch {
      setSendResult('Erro de conexão')
    } finally {
      setSending(false)
    }
  }

  const statusBanner = {
    loading: {
      bg: 'bg-[#F6E6E6] border-[#C89B7B]/30',
      dot: 'bg-[#C89B7B] animate-pulse',
      text: 'text-[#7A5C52]',
      label: 'Verificando conexão...',
      sublabel: '',
    },
    connected: {
      bg: 'bg-[#E8F5E9] border-[#2E7D32]/30',
      dot: 'bg-[#2E7D32] animate-pulse',
      text: 'text-[#2E7D32]',
      label: 'Evolution API conectada',
      sublabel: `Instância: ${process.env.NEXT_PUBLIC_EVOLUTION_INSTANCE ?? 'ativa'}`,
    },
    disconnected: {
      bg: 'bg-[#FFF8E1] border-[#E65100]/30',
      dot: 'bg-[#E65100]',
      text: 'text-[#E65100]',
      label: 'WhatsApp desconectado',
      sublabel: 'Verifique a instância no painel da Evolution API',
    },
    not_configured: {
      bg: 'bg-[#F6E6E6] border-[#C62828]/20',
      dot: 'bg-[#C62828]',
      text: 'text-[#C62828]',
      label: 'WhatsApp não configurado',
      sublabel: 'Configure EVOLUTION_API_URL, EVOLUTION_API_KEY e EVOLUTION_INSTANCE no Vercel',
    },
  }[status]

  return (
    <>
      <Topbar title="WhatsApp" subtitle="Automações e campanhas" />
      <div className="p-6 space-y-6">

        {/* Status banner */}
        <div className={`border rounded-2xl px-5 py-4 flex items-center gap-3 ${statusBanner.bg}`}>
          {status === 'loading'
            ? <Loader2 size={14} className={`${statusBanner.text} animate-spin`} />
            : <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusBanner.dot}`} />
          }
          <div className="flex-1">
            <p className={`text-sm font-medium ${statusBanner.text}`} style={{ fontFamily: 'var(--font-poppins)' }}>
              {statusBanner.label}
            </p>
            {statusBanner.sublabel && (
              <p className={`text-xs mt-0.5 opacity-70 ${statusBanner.text}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                {statusBanner.sublabel}
              </p>
            )}
          </div>
          {status === 'not_configured' && (
            <AlertCircle size={16} className="text-[#C62828] shrink-0" />
          )}
        </div>

        {/* Conexão por QR — SaaS: 1 número por salão, vale p/ site e painel */}
        <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-base text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>
                Conexão do WhatsApp
              </h3>
              <p className="text-xs text-[#7A5C52]/70 mt-1 max-w-md" style={{ fontFamily: 'var(--font-poppins)' }}>
                Conecte o número do salão uma única vez. Vale para o site de agendamento (.com.br)
                e para o painel — é o mesmo back.
              </p>
            </div>
            {status !== 'connected' && (
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="flex items-center gap-2 bg-[#25D366] text-white text-xs font-medium tracking-widest uppercase px-5 py-3 rounded-full hover:bg-[#20BD5B] transition-colors disabled:opacity-50"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {connecting ? <Loader2 size={14} className="animate-spin" /> : <QrCode size={14} />}
                {connecting ? 'Gerando...' : qr ? 'Gerar novo QR' : 'Conectar / Gerar QR'}
              </button>
            )}
          </div>

          {status === 'connected' ? (
            <div className="mt-5 flex items-center gap-3 text-[#2E7D32]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-pulse" />
              <p className="text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
                Número conectado e pronto para enviar mensagens.
              </p>
            </div>
          ) : (
            <div className="mt-5 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {/* Área do QR */}
              <div className="w-48 h-48 shrink-0 rounded-2xl border border-dashed border-[#C89B7B]/50 bg-[#FDFAF8] flex items-center justify-center overflow-hidden">
                {qr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qr} alt="QR Code do WhatsApp" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center px-4">
                    <QrCode size={40} className="text-[#C89B7B]/50 mx-auto mb-2" />
                    <p className="text-[10px] text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
                      O QR code aparece aqui
                    </p>
                  </div>
                )}
              </div>

              {/* Instruções */}
              <div className="flex-1 space-y-2">
                <p className="text-[11px] font-medium text-[#7A5C52] uppercase tracking-[0.05em]" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Como conectar
                </p>
                <ol className="text-xs text-[#7A5C52]/80 space-y-1 list-decimal list-inside" style={{ fontFamily: 'var(--font-poppins)' }}>
                  <li>Abra o WhatsApp no celular do salão.</li>
                  <li>Toque em <strong>Aparelhos conectados</strong> → <strong>Conectar aparelho</strong>.</li>
                  <li>Aponte a câmera para o QR code ao lado.</li>
                </ol>
                {pairingCode && (
                  <p className="text-xs text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Ou use o código: <strong className="tracking-widest">{pairingCode}</strong>
                  </p>
                )}
                {qr && (
                  <p className="text-[11px] text-[#C89B7B] flex items-center gap-1.5" style={{ fontFamily: 'var(--font-poppins)' }}>
                    <Loader2 size={11} className="animate-spin" /> Aguardando leitura...
                  </p>
                )}
                {connectMsg && (
                  <p className="text-[11px] text-[#C62828]" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {connectMsg}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Enviar campanha */}
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
                onChange={e => setSegment(e.target.value)}
                className="w-full rounded-xl border border-[#EAE0DC] px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#C89B7B] transition-colors"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {segments.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>
                Template
              </label>
              <select
                value={selectedTemplate}
                onChange={e => setSelectedTemplate(e.target.value)}
                className="w-full rounded-xl border border-[#EAE0DC] px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#C89B7B] transition-colors"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                <option value="">Selecione ou escreva manualmente</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#7A5C52]" style={{ fontFamily: 'var(--font-poppins)' }}>
                Mensagem
              </label>
              <textarea
                rows={5}
                value={messageText}
                onChange={e => { setSelectedTemplate(''); setCustomMessage(e.target.value) }}
                placeholder="Escreva a mensagem ou selecione um template acima..."
                className="w-full rounded-xl border border-[#EAE0DC] px-4 py-3 text-sm text-[#1E1E1E] placeholder-[#7A5C52]/40 focus:outline-none focus:border-[#C89B7B] resize-none transition-colors"
                style={{ fontFamily: 'var(--font-poppins)' }}
              />
              <p className="text-[10px] text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
                Variáveis: &#123;nome&#125;, &#123;data&#125;, &#123;hora&#125;, &#123;serviço&#125;
              </p>
            </div>

            {sendResult && (
              <p className={`text-sm ${sendResult.startsWith('✓') ? 'text-[#2E7D32]' : 'text-[#C62828]'}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                {sendResult}
              </p>
            )}

            <button
              onClick={handleSend}
              disabled={sending || status !== 'connected' || !messageText.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-medium tracking-widest uppercase py-3.5 rounded-full hover:bg-[#20BD5B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {sending ? 'Enviando...' : 'Enviar Campanha'}
            </button>

            {status !== 'connected' && status !== 'loading' && (
              <p className="text-[11px] text-center text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
                Configure a Evolution API para habilitar envios
              </p>
            )}
          </div>

          {/* Templates */}
          <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6">
            <h3 className="text-base text-[#1E1E1E] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Templates Automáticos
            </h3>
            <div className="space-y-3">
              {templates.map(t => (
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

        {/* Aviso de funcionalidades futuras */}
        <div className="bg-[#FDFAF8] border border-[#EAE0DC] rounded-2xl px-5 py-4">
          <p className="text-xs text-[#7A5C52]/60 leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>
            <strong className="text-[#7A5C52]">Automáticos já ativos:</strong> confirmação ao agendar · resposta a SIM/CANCELAR do cliente
            <br />
            <strong className="text-[#7A5C52]">Em breve:</strong> lembretes D-1 e H-2 automáticos · histórico de envios · relatório de campanhas
          </p>
        </div>
      </div>
    </>
  )
}
