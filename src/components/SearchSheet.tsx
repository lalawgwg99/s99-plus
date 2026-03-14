"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X, Loader2, TrendingUp, ChevronRight } from "lucide-react"
import { fetchStockInfo, type StockInfo } from "@/lib/api"

interface Props {
  open: boolean
  onClose: () => void
  onSelect?: (stock: StockInfo) => void
}

export default function SearchSheet({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [stockList, setStockList] = useState<StockInfo[]>([])
  const [filtered, setFiltered] = useState<StockInfo[]>([])
  const [sheetY, setSheetY] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const startY = useRef(0)

  useEffect(() => {
    if (open) {
      setQuery("")
      setFiltered([])
      setLoading(true)
      fetchStockInfo()
        .then(data => setStockList(data.filter(s => s.type === "twse" || s.type === "tpex")))
        .catch(() => {})
        .finally(() => setLoading(false))
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  useEffect(() => {
    if (!query.trim()) { setFiltered([]); return }
    const lower = query.toLowerCase()
    setFiltered(
      stockList
        .filter(s =>
          s.stock_id.includes(query) ||
          s.stock_name.toLowerCase().includes(lower) ||
          s.industry_category?.toLowerCase().includes(lower)
        )
        .slice(0, 20)
    )
  }, [query, stockList])

  // Swipe-to-dismiss handlers
  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
  }
  const onTouchMove = (e: React.TouchEvent) => {
    const dy = e.touches[0].clientY - startY.current
    if (dy > 0) setSheetY(dy)
  }
  const onTouchEnd = () => {
    if (sheetY > 120) onClose()
    setSheetY(0)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="absolute inset-x-0 bottom-0 top-12 bg-background rounded-t-3xl shadow-2xl flex flex-col overflow-hidden transition-transform duration-200"
        style={{ transform: `translateY(${sheetY}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 bg-secondary/60 rounded-2xl px-4 py-2.5 border border-border/50">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="搜尋股票代號或名稱…"
              className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-2 pb-8">
          {loading && (
            <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> 載入股票清單…
            </div>
          )}

          {!loading && filtered.length === 0 && query && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              找不到「{query}」相關股票
            </div>
          )}

          {!loading && filtered.length === 0 && !query && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">輸入股票代號或名稱搜尋</p>
              <p className="text-xs mt-1 opacity-60">例如：2330、台積電、中華電</p>
            </div>
          )}

          {filtered.map(s => (
            <button
              key={s.stock_id}
              onClick={() => {
                onSelect?.(s)
                onClose()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/60 active:bg-secondary/80 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{s.stock_name}</div>
                <div className="text-xs text-muted-foreground">{s.stock_id} · {s.industry_category} · {s.type}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
