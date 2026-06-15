'use client'

import { useEffect, useState } from 'react'
import { getVeltosPromotions, type SitePromotion } from '@/lib/veltos'

export function usePromotions() {
  const [promotions, setPromotions] = useState<SitePromotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getVeltosPromotions()
      .then((items) => {
        if (!active) return
        setPromotions(items)
        setLoading(false)
      })
      .catch((e) => {
        if (!active) return
        setError(e instanceof Error ? e.message : 'Erro ao carregar promoções')
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { promotions, loading, error }
}
