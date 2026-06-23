'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Calendar, Clock, CheckCircle, Loader2, Tag } from 'lucide-react'
import { useServices } from '@/hooks/useServices'
import { useAvailability } from '@/hooks/useAvailability'
import { bookVeltos, validateVeltosCoupon } from '@/lib/veltos'

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

const inputClass = 'w-full min-h-12 rounded-xl border border-[#EAE0DC] bg-white px-4 py-3 text-base sm:text-sm text-[#1E1E1E] placeholder-[#7A5C52]/40 focus:outline-none focus:ring-2 focus:ring-[#C89B7B]/40 focus:border-[#C89B7B] transition-colors disabled:bg-[#F8F2EF] disabled:text-[#7A5C52]/45 disabled:cursor-not-allowed'
const labelClass = 'text-[11px] font-medium uppercase tracking-[0.05em] text-[#7A5C52]'
const errorClass = 'text-[11px] leading-relaxed text-[#C62828]'

export default function AgendarPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [couponStatus, setCouponStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')
  const [couponDiscount, setCouponDiscount] = useState<string | null>(null)

  const { services, loading: loadingServices, error: servicesError } = useServices()

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
  const serviceSelectDisabled = loadingServices || Boolean(servicesError) || services.length === 0
  const submitDisabled = isSubmitting || serviceSelectDisabled
  const phoneField = register('phone')
  const serviceField = register('service_id')
  const dateField = register('date')
  const couponField = register('coupon_code')

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
      const data = await validateVeltosCoupon(code)
      if (data.ok && data.discountType && data.discountValue != null) {
        setCouponStatus('valid')
        setCouponDiscount(
          data.discountType === 'percentual'
            ? `${data.discountValue}% de desconto`
            : `R$ ${data.discountValue.toFixed(2).replace('.', ',')} de desconto`
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
        couponCode: data.coupon_code,
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
        <main className="pt-20 md:pt-24 min-h-screen bg-[#FDFAF8] flex items-center justify-center px-4 py-12">
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
              className="w-full sm:w-auto bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-full"
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
      <main className="pt-20 md:pt-24 bg-[#FDFAF8] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-[#C89B7B] text-xs tracking-[0.5em] uppercase mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
              Reserva Online
            </p>
            <h1 className="text-4xl sm:text-5xl font-light text-[#1E1E1E]" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Agendar Horário
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            {/* Dados pessoais */}
            <div className="bg-white border border-[#EAE0DC] rounded-2xl p-5 sm:p-6 lg:p-8 shadow-[0_18px_50px_rgba(122,92,82,0.05)]">
              <h3 className="text-lg text-[#1E1E1E] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>Dados Pessoais</h3>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="flex flex-col gap-1">
                  <label className={labelClass} style={{ fontFamily: 'var(--font-poppins)' }}>Nome completo *</label>
                  <input {...register('name')} placeholder="Seu nome completo" className={inputClass} />
                  {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className={labelClass} style={{ fontFamily: 'var(--font-poppins)' }}>WhatsApp *</label>
                  <input
                    {...phoneField}
                    placeholder="(11) 99999-9999"
                    onChange={e => {
                      e.target.value = formatPhone(e.target.value)
                      phoneField.onChange(e)
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
            <div className="bg-white border border-[#EAE0DC] rounded-2xl p-5 sm:p-6 lg:p-8 shadow-[0_18px_50px_rgba(122,92,82,0.05)]">
              <h3 className="text-lg text-[#1E1E1E] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>Serviço e Data</h3>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className={labelClass} style={{ fontFamily: 'var(--font-poppins)' }}>Serviço *</label>
                  <select
                    {...serviceField}
                    disabled={serviceSelectDisabled}
                    onChange={e => {
                      serviceField.onChange(e)
                      setValue('starts_at', '')
                    }}
                    className={inputClass}
                  >
                    <option value="">
                      {loadingServices
                        ? 'Carregando serviços...'
                        : servicesError
                          ? 'Serviços indisponíveis'
                          : services.length === 0
                            ? 'Nenhum serviço disponível'
                            : 'Selecione um serviço'}
                    </option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.price)} ({s.duration_minutes} min)
                      </option>
                    ))}
                  </select>
                  {loadingServices && (
                    <p className="text-[11px] text-[#7A5C52]/55" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Carregando serviços da agenda...
                    </p>
                  )}
                  {servicesError && (
                    <p className={errorClass} style={{ fontFamily: 'var(--font-poppins)' }}>
                      Não foi possível carregar os serviços. Atualize a página em instantes.
                    </p>
                  )}
                  {errors.service_id && <p className={errorClass}>{errors.service_id.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className={labelClass} style={{ fontFamily: 'var(--font-poppins)' }}>
                    <Calendar size={10} className="inline mr-1" />Data *
                  </label>
                  <input
                    {...dateField}
                    type="date"
                    min={minDate}
                    max={maxDateStr}
                    onChange={e => {
                      dateField.onChange(e)
                      setValue('starts_at', '')
                    }}
                    className={inputClass}
                  />
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
                    <div className="flex items-center gap-2 py-3 min-h-12">
                      <Loader2 size={16} className="text-[#C89B7B] animate-spin" />
                      <p className="text-xs text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>Buscando horários...</p>
                    </div>
                  ) : slots.length === 0 ? (
                    <p className="text-xs text-[#C62828] py-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Nenhum horário disponível neste dia
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {slots.map(slot => {
                        const time = slot.starts_at.slice(11, 16)
                        return (
                          <button
                            key={slot.starts_at}
                            type="button"
                            onClick={() => setValue('starts_at', slot.starts_at, { shouldValidate: true })}
                            aria-pressed={selectedTime === time}
                            className={`min-h-10 py-2 rounded-lg text-xs font-medium transition-all border ${
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
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      {...couponField}
                      placeholder="Código do cupom (opcional)"
                      onChange={e => {
                        e.target.value = e.target.value.toUpperCase()
                        couponField.onChange(e)
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
                      className="min-h-12 px-4 py-3 border border-[#EAE0DC] rounded-xl text-xs text-[#7A5C52] hover:border-[#C89B7B] transition-all disabled:opacity-40 disabled:cursor-not-allowed sm:min-w-28"
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
              disabled={submitDisabled}
              className="w-full min-h-12 bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-xs font-medium tracking-widest uppercase px-5 py-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {isSubmitting && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {isSubmitting ? 'Aguardando...' : 'Confirmar Agendamento'}
            </button>

            <p className="mx-auto max-w-md text-center text-xs leading-relaxed text-[#7A5C52]/50" style={{ fontFamily: 'var(--font-poppins)' }}>
              Você receberá a confirmação pelo WhatsApp · Cancelamento gratuito até 24h antes
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
