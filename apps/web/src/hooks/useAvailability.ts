'use client'

import { useState, useEffect } from 'react'
import type { Slot } from '@/types'

export function useAvailability(serviceId: string, date: string) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!serviceId || !date) {
      setSlots([])
      return
    }
    setLoading(true)
    fetch(`/api/bookings/availability?serviceId=${serviceId}&date=${date}`)
      .then(r => r.json())
      .then(data => { setSlots(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [serviceId, date])

  const available = slots.filter(s => s.available)
  return { slots: available, loading }
}
