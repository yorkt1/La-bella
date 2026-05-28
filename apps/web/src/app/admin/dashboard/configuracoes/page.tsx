'use client'

import { useState } from 'react'
import { Topbar } from '@/components/admin/layout/topbar'
import { Clock, Save, CheckCircle } from 'lucide-react'

const DAYS = [
  { key: 1, label: 'Segunda' },
  { key: 2, label: 'Terça' },
  { key: 3, label: 'Quarta' },
  { key: 4, label: 'Quinta' },
  { key: 5, label: 'Sexta' },
  { key: 6, label: 'Sábado' },
  { key: 0, label: 'Domingo' },
]

const defaultHours: Record<number, { start: string; end: string; active: boolean }> = {
  1: { start: '09:00', end: '19:00', active: true },
  2: { start: '09:00', end: '19:00', active: true },
  3: { start: '09:00', end: '19:00', active: true },
  4: { start: '09:00', end: '19:00', active: true },
  5: { start: '09:00', end: '19:00', active: true },
  6: { start: '09:00', end: '16:00', active: true },
  0: { start: '09:00', end: '13:00', active: false },
}

export default function ConfiguracoesPage() {
  const [hours, setHours] = useState(defaultHours)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputClass = 'rounded-lg border border-[#EAE0DC] px-3 py-2 text-sm text-[#1E1E1E] focus:outline-none focus:border-[#C89B7B] transition-colors w-28'

  return (
    <>
      <Topbar title="Configurações" subtitle="Horários e preferências do sistema" />
      <div className="p-6 space-y-6 max-w-2xl">

        {/* Horário de funcionamento */}
        <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={16} className="text-[#C89B7B]" />
            <h3 className="text-base text-[#1E1E1E]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Horário de Funcionamento
            </h3>
          </div>

          <div className="space-y-3">
            {DAYS.map(({ key, label }) => {
              const day = hours[key]
              return (
                <div key={key} className="flex items-center gap-4">
                  <div className="flex items-center gap-3 w-32 shrink-0">
                    <input
                      type="checkbox"
                      checked={day.active}
                      onChange={e => setHours(h => ({ ...h, [key]: { ...h[key], active: e.target.checked } }))}
                      className="w-4 h-4 accent-[#C89B7B]"
                    />
                    <span className={`text-sm ${day.active ? 'text-[#1E1E1E]' : 'text-[#7A5C52]/40'}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                      {label}
                    </span>
                  </div>
                  {day.active ? (
                    <div className="flex items-center gap-2">
                      <input type="time" value={day.start}
                        onChange={e => setHours(h => ({ ...h, [key]: { ...h[key], start: e.target.value } }))}
                        className={inputClass} />
                      <span className="text-[#7A5C52]/50 text-sm">até</span>
                      <input type="time" value={day.end}
                        onChange={e => setHours(h => ({ ...h, [key]: { ...h[key], end: e.target.value } }))}
                        className={inputClass} />
                    </div>
                  ) : (
                    <span className="text-sm text-[#7A5C52]/40 italic" style={{ fontFamily: 'var(--font-poppins)' }}>Fechado</span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-[#EAE0DC] flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-sm rounded-full hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              <Save size={14} />
              Salvar Horários
            </button>
            {saved && (
              <div className="flex items-center gap-1.5 text-[#2E7D32] text-sm">
                <CheckCircle size={14} />
                <span style={{ fontFamily: 'var(--font-poppins)' }}>Salvo!</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#FDFAF8] border border-[#EAE0DC] rounded-2xl p-5">
          <p className="text-xs text-[#7A5C52]/60 leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>
            <strong className="text-[#7A5C52]">Intervalo entre horários:</strong> 30 minutos ·
            Os horários de disponibilidade são calculados automaticamente com base nas configurações acima.
          </p>
        </div>
      </div>
    </>
  )
}
