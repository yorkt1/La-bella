'use client'

import { useState, useEffect } from 'react'
import type { Service } from '@/types'
import { getVeltosServices } from '@/lib/veltos'

// Catálogo de serviços — lido do Veltos (fonte única). Ver lib/veltos.ts.
export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getVeltosServices()
      .then((s) => {
        if (!active) return
        setServices(s)
        setLoading(false)
      })
      .catch((e) => {
        if (!active) return
        setError(e instanceof Error ? e.message : 'Erro ao carregar serviços')
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { services, loading, error }
}
