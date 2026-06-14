'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Calendar, Clock, CheckCircle, Tag } from 'lucide-react'
import { useServices } from '@/hooks/useServices'
import { useAvailability } from '@/hooks/useAvailability'
import { bookVeltos } from '@/lib/veltos'

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato: (11) 99999-9999'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  service_id: z.string().min(1, 'Selecione um serviço'),
  date: z.string().min(1, 'Selecione uma data'),
  starts_at: z.string().min(1, 'Selecione um horário'),
  coupon_code: z.string().optional(),
  notes: z.string().max(500).optional(),
})

type FormData = z.infer<typeof schema>

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

const inputClass = 'w-full rounded-xl border border-[#EAE0DC] bg-white px-4 py-3 text-sm text-[#1E1E1E] placeholder-[#7A5C52]/40 focus:outline-none focus:ring-2 focus:ring-[#C89B7B]/40 focus:border-[#C89B7B] transition-colors'
const labelClass = 'text-[11px] font-medium uppercase tracking-[0.05em] text-[#7A5C52]'
const errorClass = 'text-[11px] text-[#C62828]'

export default function AgendarPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [couponStatus, setCouponStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')
  const [couponDiscount, setCouponDiscount] = useState<string | null>(null)

  const { services } = useServices()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const selectedServiceId = watch('service_id')
  const selectedDate = watch('date')
  const selectedStartsAt = watch('starts_at')
  const couponValue = watch('coupon_code')
  const selectedTime = selectedStartsAt ? selectedStartsAt.slice(11, 16) : ''

  const { slots, loading: loadingSlots } = useAvailability(selectedServiceId, selectedDate)

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 60)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  async function checkCoupon() {
    const code = couponValue?.trim().toUpperCase()
    if (!code) return
    setCouponStatus('checking')
    setCouponDiscount(null)
    try {
      const res = await fetch(`/api/promotions/validate?code=${encodeURIComponent(code)}`)
      if (res.ok) {
        const data = await res.json()
        setCouponStatus('valid')
        setCouponDiscount(
          data.discount_type === 'percent'
            ? `${data.discount_value}% de desconto`
            : `R$ ${data.discount_value.toFixed(2).replace('.', ',')} de desconto`
        )
      } else {
        setCouponStatus('invalid')
      }
    } catch {
      setCouponStatus('invalid')
    }
  }

  async function onSubmit(data: FormData) {
    setSubmitError(null)
    try {
      // Grava direto no Veltos (fonte única) via RPC pública. O agendamento cai na
      // agenda da dona no painel Veltos. Ver lib/veltos.ts.
      const res = await bookVeltos({
        serviceId: data.service_id,
        startsAt: data.starts_at,
        name: data.name,
        phone: data.phone,
      })
      if (!res.ok) {
        setSubmitError(res.error ?? 'Erro ao realizar agendamento. Tente novamente.')
        return
      }
      setSubmitted(true)
    } catch {
      setSubmitError('Erro de conexão. Tente novamente.')
    }
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="pt-24 min-h-screen bg-[#FDFAF8] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#E0F4F1] flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-[#006064]" />
            </div>
            <h2 className="text-3xl font-light text-[#1E1E1E] mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Agendamento Solicitado!
            </h2>
            <p className="text-[#7A5C52]/70 text-sm leading-relaxed mb-8" style={{ fontFamily: 'var(--font-poppins)' }}>
              Você receberá uma confirmação pelo WhatsApp em breve. Aguarde nosso contato.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-full"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Novo Agendamento
            </button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-24 bg-[#FDFAF8] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-12">
            <p className="text-[#C89B7B] text-xs tracking-[0.5em] uppercase mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
              Reserva Online
            </p>
            <h1 className="text-4xl lg:text-5xl font-light text-[#1E1E1E]" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Agendar Horário
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Dados pessoais */}
            <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6 lg:p-8">
              <h3 className="text-lg text-[#1E1E1E] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>Dados Pessoais</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                  <label className={labelClass} style={{ fontFamily: 'var(--font-poppins)' }}>Nome completo *</label>
                  <input {...register('name')} placeholder="Seu nome completo" className={inputClass} />
                  {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className={labelClass} style={{ fontFamily: 'var(--font-poppins)' }}>WhatsApp *</label>
                  <input
                    {...register('phone')}
                    placeholder="(11) 99999-9999"
                    onChange={e => {
                      e.target.value = formatPhone(e.target.value)
                      register('phone').onChange(e)
                    }}
                    className={inputClass}
                  />
                  {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className={labelClass} style={{ fontFamily: 'var(--font-poppins)' }}>E-mail</label>
                  <input {...register('email')} type="email" placeholder="seu@email.com (opcional)" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Serviço e data */}
            <div className="bg-white border border-[#EAE0DC] rounded-2xl p-6 lg:p-8">
              <h3 className="text-lg text-[#1E1E1E] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>Serviço e Data</h3>
              <div className="grid sm:grid-cols-2 gap-5">

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className={labelClass} style={{ fontFamily: 'var(--font-poppins)' }}>Serviço *</label>
                  <select {...register('service_id')} className={inputClass}>
                    <option value="">Selecione um serviço</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.price)} ({s.duration_minutes} min)
                      </option>
                    ))}
                  </select>
                  {errors.service_id && <p className={errorClass}>{errors.service_id.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className={labelClass} style={{ fontFamily: 'var(--font-poppins)' }}>
                    <Calendar size={10} className="inline mr-1" />Data *
                  </label>
                  <input {...register('date')} type="date" min={minDate} max={maxDateStr} className={inputClass} />
                  {errors.date && <p className={errorClass}>{errors.date.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className={labelClass} style={{ fontFamily: 'var(--font-poppins)' }}>
                    <Clock size={10} className="inline mr-1" />Horário *
                  </label>
                  {!selectedServiceId || !selectedDate ? (
                    <p className="text-xs text-[#7A5C52]/50 py-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Selecione o serviço e a data primeiro
                    </p>
                  ) : loadingSlots ? (
                    <div className="flex items-center gap-2 py-3">
                      <div className="w-4 h-4 border-2 border-[#C89B7B] border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>Buscando horários...</p>
                    </div>
                  ) : slots.length === 0 ? (
                    <p className="text-xs text-[#C62828] py-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Nenhum horário disponível neste dia
                    </p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {slots.map(slot => {
                        const time = slot.starts_at.slice(11, 16)
                        return (
                          <button
                            key={slot.starts_at}
                            type="button"
                            onClick={() => setValue('starts_at', slot.starts_at, { shouldValidate: true })}
                            className={`py-2 rounded-lg text-xs font-medium transition-all border ${
                              selectedTime === time
                                ? 'bg-[#C89B7B] text-white border-[#C89B7B]'
                                : 'border-[#EAE0DC] text-[#7A5C52] hover:border-[#C89B7B] hover:text-[#C89B7B]'
                            }`}
                            style={{ fontFamily: 'var(--font-poppins)' }}
                          >
                            {time}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {errors.starts_at && <p className={errorClass}>{errors.starts_at.message}</p>}
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className={labelClass} style={{ fontFamily: 'var(--font-poppins)' }}>
                    <Tag size={10} className="inline mr-1" />Cupom de desconto
                  </label>
                  <div className="flex gap-2">
                    <input
                      {...register('coupon_code')}
                      placeholder="Código do cupom (opcional)"
                      onChange={e => {
                        e.target.value = e.target.value.toUpperCase()
                        register('coupon_code').onChange(e)
                        setCouponStatus('idle')
                        setCouponDiscount(null)
                      }}
                      className={`${inputClass} flex-1 uppercase`}
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    />
                    <button
                      type="button"
                      onClick={checkCoupon}
                      disabled={!couponValue?.trim() || couponStatus === 'checking'}
                      className="px-4 py-3 border border-[#EAE0DC] rounded-xl text-xs text-[#7A5C52] hover:border-[#C89B7B] transition-all disabled:opacity-40"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                      {couponStatus === 'checking' ? '...' : 'Aplicar'}
                    </button>
                  </div>
                  {couponStatus === 'valid' && couponDiscount && (
                    <p className="text-[11px] text-[#2E7D32]" style={{ fontFamily: 'var(--font-poppins)' }}>✓ Cupom válido — {couponDiscount}</p>
                  )}
                  {couponStatus === 'invalid' && (
                    <p className={errorClass} style={{ fontFamily: 'var(--font-poppins)' }}>Cupom inválido ou expirado</p>
                  )}
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className={labelClass} style={{ fontFamily: 'var(--font-poppins)' }}>Observações</label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="Alergias, preferências ou outras informações importantes (opcional)"
                    className={`${inputClass} resize-none`}
                  />
                  {errors.notes && <p className={errorClass}>{errors.notes.message}</p>}
                </div>
              </div>
            </div>

            {submitError && (
              <p className="text-sm text-[#C62828] text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-xs font-medium tracking-widest uppercase py-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isSubmitting ? 'Aguardando...' : 'Confirmar Agendamento'}
            </button>

            <p className="text-center text-xs text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
              Você receberá a confirmação pelo WhatsApp · Cancelamento gratuito até 24h antes
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
