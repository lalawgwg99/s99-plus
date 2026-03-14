"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchDailyPrice, nDaysAgo, type DailyPrice } from "@/lib/api"

export function useStock(stockId: string | null) {
  const [prices, setPrices] = useState<DailyPrice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchDailyPrice(id, nDaysAgo(180))
      setPrices(data)
    } catch (e: any) {
      setError(e.message ?? "載入失敗")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (stockId) load(stockId)
  }, [stockId, load])

  return { prices, loading, error, reload: () => stockId && load(stockId) }
}
