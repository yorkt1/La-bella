'use client'

import { useState, useEffect } from 'react'
import type { Service } from '@/types'

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/services')
      .then(r => {
        if (!r.ok) throw new Error('Erro ao carregar serviços')
        return r.json()
      })
      .then(data => { setServices(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  return { services, loading, error }
}
