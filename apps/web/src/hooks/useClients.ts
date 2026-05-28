'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Client } from '@/types'

export function useClients(search = '', filter = 'all') {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filter !== 'all') params.set('filter', filter)
    const res = await fetch(`/api/admin/clients?${params}`)
    if (res.ok) setClients(await res.json())
    setLoading(false)
  }, [search, filter])

  useEffect(() => { fetch_() }, [fetch_])

  return { clients, loading, refetch: fetch_ }
}
