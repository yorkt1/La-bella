'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Promotion } from '@/types'

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/promotions')
    if (res.ok) setPromotions(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetch_() }, [fetch_])

  async function create(data: Omit<Promotion, 'id' | 'uses_count' | 'created_at'>) {
    const res = await fetch('/api/admin/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) await fetch_()
    return res.ok
  }

  async function toggleVisibility(id: string, isVisible: boolean) {
    const res = await fetch(`/api/admin/promotions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_visible: !isVisible }),
    })
    if (res.ok) setPromotions(prev => prev.map(p => p.id === id ? { ...p, is_visible: !isVisible } : p))
    return res.ok
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' })
    if (res.ok) setPromotions(prev => prev.filter(p => p.id !== id))
    return res.ok
  }

  return { promotions, loading, create, toggleVisibility, remove, refetch: fetch_ }
}
