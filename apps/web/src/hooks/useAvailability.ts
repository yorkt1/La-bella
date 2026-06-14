'use client'

import { useState, useEffect } from 'react'
import type { Slot } from '@/types'
import { getVeltosSlots } from '@/lib/veltos'

// Horários livres — calculados a partir da agenda do Veltos. Ver lib/veltos.ts.
export function useAvailability(serviceId: string, date: string) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!serviceId || !date) {
      setSlots([])
      return
    }
    let active = true
    setLoading(true)
    getVeltosSlots(serviceId, date)
      .then((s) => {
        if (!active) return
        setSlots(s)
        setLoading(false)
      })
      .catch(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [serviceId, date])

  return { slots, loading }
}
