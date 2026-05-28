'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json()
        setError(body.error ?? 'Credenciais inválidas')
        return
      }
      window.location.href = '/dashboard'
    } catch {
      setError('Erro ao conectar. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <p
            className="text-3xl font-light text-white tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            La Bella
          </p>
          <p
            className="text-sm font-light text-[#D4AF37] tracking-[0.5em] uppercase"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Infiní
          </p>
          <p
            className="text-white/40 text-xs tracking-widest uppercase mt-3"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Painel Administrativo
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col gap-1">
              <label
                className="text-[11px] text-white/50 tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                E-mail
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C89B7B] focus:ring-1 focus:ring-[#C89B7B] transition-colors"
              />
              {errors.email && (
                <p className="text-[11px] text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-[11px] text-white/50 tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Senha
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 pr-11 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C89B7B] focus:ring-1 focus:ring-[#C89B7B] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-400">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <p
                className="text-sm text-red-400 text-center"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white text-xs font-medium tracking-widest uppercase py-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
