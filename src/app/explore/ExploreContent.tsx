"use client"

import { useState, useCallback, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { fetchStockInfo, fetchDailyPrice, fetchDividends, fetchChipFlow, nDaysAgo, type StockInfo, type DailyPrice, type DividendRecord, type InstitutionalFlow } from "@/lib/api"
import { Search, TrendingUp, TrendingDown, Loader2, Calendar, BarChart3, Shield } from "lucide-react"
import KLineChart from "@/components/KLineChart"

interface StockDetail {
  info: StockInfo
  prices: DailyPrice[]
  dividends: DividendRecord[]
  chips: InstitutionalFlow[]
}

function priceColor(spread: number) {
  return spread > 0 ? "text-green-500" : spread < 0 ? "text-red-500" : "text-muted-foreground"
}

function calcYield(dividends: DividendRecord[], price: number): number {
  if (!dividends.length || !price) return 0
  const last = dividends.slice(-3).reduce((sum, d) => sum + d.CashEarningsDistribution + d.CashStatutoryDistribution, 0)
  return Math.round((last / price) * 10000) / 100
}

const MOCK_CHIPS = [
  { stockId: "2330", name: "台積電", foreign: 52400, trust: 8200, dealer: 1200, topPct: 58.2, change: 0.8 },
  { stockId: "2317", name: "鴻海", foreign: -12000, trust: -3400, dealer: -500, topPct: 42.1, change: -1.2 },
  { stockId: "2412", name: "中華電", foreign: 1200, trust: 300, dealer: 120, topPct: 65.4, change: 0.2 },
  { stockId: "0056", name: "元大高股息", foreign: 32000, trust: 14000, dealer: 2800, topPct: 45.8, change: 1.4 },
  { stockId: "00878", name: "國泰永續", foreign: 18000, trust: 22000, dealer: 1200, topPct: 38.2, change: 2.1 },
  { stockId: "2886", name: "兆豐金", foreign: 3200, trust: 1800, dealer: 400, topPct: 52.1, change: -0.3 },
]

type ExploreTab = "search" | "chips"

export default function ExploreContent() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<ExploreTab>("search")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [stockList, setStockList] = useState<StockInfo[]>([])
  const [filtered, setFiltered] = useState<StockInfo[]>([])
  const [detail, setDetail] = useState<StockDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasAutoLoaded = useRef(false)

  // Load stock list once
  useEffect(() => {
    setLoading(true)
    fetchStockInfo()
      .then(data => setStockList(data.filter(s => s.type === "twse" || s.type === "tpex")))
      .catch(() => setError("無法取得股票清單"))
      .finally(() => setLoading(false))
  }, [])

  // Auto-load stock from URL param ?stock=2330
  useEffect(() => {
    const stockId = searchParams.get("stock")
    if (stockId && stockList.length > 0 && !hasAutoLoaded.current) {
      hasAutoLoaded.current = true
      const match = stockList.find(s => s.stock_id === stockId)
      if (match) loadDetail(match)
    }
  }, [searchParams, stockList])

  const handleSearch = useCallback((q: string) => {
    setQuery(q)
    if (!q.trim()) { setFiltered([]); return }
    const lower = q.toLowerCase()
    setFiltered(
      stockList
        .filter(s => s.stock_id.includes(q) || s.stock_name.toLowerCase().includes(lower) || s.industry_category?.toLowerCase().includes(lower))
        .slice(0, 20)
    )
  }, [stockList])

  async function loadDetail(stock: StockInfo) {
    setFiltered([])
    setQuery(stock.stock_id + " " + stock.stock_name)
    setDetailLoading(true)
    setDetail(null)
    setError(null)
    try {
      const [prices, dividends, chips] = await Promise.all([
        fetchDailyPrice(stock.stock_id, nDaysAgo(180)).catch(() => []),
        fetchDividends(stock.stock_id).catch(() => []),
        fetchChipFlow(stock.stock_id, nDaysAgo(30)).catch(() => []),
      ])
      setDetail({ info: stock, prices, dividends, chips })
    } catch {
      setError("資料載入失敗")
    } finally {
      setDetailLoading(false)
    }
  }

  const latest = detail?.prices.at(-1)
  const prev = detail?.prices.at(-2)
  const spread = latest && prev ? latest.close - prev.close : 0
  const spreadPct = prev ? (spread / prev.close) * 100 : 0
  const dividendYield = detail ? calcYield(detail.dividends, latest?.close ?? 0) : 0
  const lastChip = detail?.chips.at(-1)
  const maxForeign = Math.max(...MOCK_CHIPS.map(c => Math.abs(c.foreign)))

  return (
    <div className="p-5 space-y-6 max-w-3xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-[28px] font-bold tracking-tight">探索</h1>
        <p className="text-[15px] text-muted-foreground mt-1">搜尋個股 · K線走勢 · 籌碼熱力圖</p>
      </div>

      {/* Tab Switcher — iOS Segmented Control */}
      <div className="flex bg-secondary/60 rounded-xl p-1">
        {(["search", "chips"] as ExploreTab[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); navigator.vibrate?.(10) }}
            className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
              tab === t
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "search" ? "個股查詢" : "籌碼熱力圖"}
          </button>
        ))}
      </div>

      {tab === "search" && (
        <>
          {/* Search Box */}
          <div className="relative">
            <div className="flex items-center gap-3 bg-secondary/40 rounded-2xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-primary/40 transition-all">
              {loading ? <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" /> : <Search className="h-5 w-5 text-muted-foreground shrink-0" />}
              <input
                type="text"
                value={query}
                onChange={e => handleSearch(e.target.value)}
                placeholder="輸入股票代號或名稱（如 2330、台積電）"
                className="bg-transparent border-none outline-none text-[15px] w-full placeholder:text-muted-foreground"
              />
              {query && (
                <button onClick={() => { setQuery(""); setFiltered([]); setDetail(null) }} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
              )}
            </div>
            {filtered.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                {filtered.map(s => (
                  <button key={s.stock_id} onClick={() => loadDetail(s)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 active:bg-secondary/70 transition-colors border-b border-border/50 last:border-0 text-left">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-[13px] font-bold text-primary">{s.stock_id.slice(0,4)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-semibold">{s.stock_name}</div>
                      <div className="text-xs text-muted-foreground">{s.stock_id} · {s.industry_category}</div>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.type === "twse" ? "bg-blue-500/10 text-blue-500" : "bg-orange-500/10 text-orange-500"}`}>
                      {s.type === "twse" ? "上市" : "上櫃"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-[13px] text-red-700 dark:text-red-300">
              ⚠ {error}
            </div>
          )}

          {detailLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-[13px] text-muted-foreground">正在取得即時資料…</p>
            </div>
          )}

          {/* Stock Detail */}
          {detail && !detailLoading && (
            <div className="space-y-5">
              {/* Price Header Card */}
              <div className="bg-card rounded-[20px] shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">{detail.info.stock_id} · {detail.info.industry_category}</div>
                    <h2 className="text-[22px] font-bold mt-1">{detail.info.stock_name}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-[34px] font-bold tracking-tight tabular-nums leading-none">
                      {latest ? latest.close.toLocaleString() : "—"}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">NTD</div>
                    <div className={`flex items-center gap-1 justify-end text-[13px] font-semibold mt-1 ${priceColor(spread)}`}>
                      {spread > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : spread < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : null}
                      {spread > 0 ? "+" : ""}{spread.toFixed(2)} ({spreadPct > 0 ? "+" : ""}{spreadPct.toFixed(2)}%)
                    </div>
                  </div>
                </div>
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[
                    { label: "成交量", val: latest ? (latest.Trading_Volume / 1000).toFixed(0) + " 張" : "—" },
                    { label: "殖利率", val: dividendYield > 0 ? dividendYield + "%" : "—" },
                    { label: "外資買超", val: lastChip ? (lastChip.ForeignInvestors_net > 0 ? "+" : "") + (lastChip.ForeignInvestors_net / 1000).toFixed(1) + "K" : "—" },
                  ].map(({ label, val }) => (
                    <div key={label} className="bg-secondary/40 rounded-2xl p-3.5 text-center">
                      <div className="text-[11px] text-muted-foreground font-medium">{label}</div>
                      <div className="text-[15px] font-bold mt-1 tabular-nums">{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* K-Line Chart */}
              {detail.prices.length > 0 && (
                <div className="bg-card rounded-[20px] shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <h3 className="text-[15px] font-semibold">K線走勢（近6個月）</h3>
                  </div>
                  <KLineChart data={detail.prices} height={320} />
                </div>
              )}

              {/* Dividends */}
              {detail.dividends.length > 0 && (
                <div className="bg-card rounded-[20px] shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h3 className="text-[15px] font-semibold">歷年配息記錄</h3>
                  </div>
                  {detail.dividends.slice(-6).reverse().map(d => {
                    const cash = d.CashEarningsDistribution + d.CashStatutoryDistribution + d.CashCapitalDistribution
                    const isCapWarning = d.CashCapitalDistribution > 0
                    return (
                      <div key={d.year + d.CashExDividendTradingDate} className="px-6 py-4 border-b border-border/50 last:border-0 flex items-center justify-between">
                        <div>
                          <div className="text-[15px] font-semibold">{d.year} 年</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{d.CashExDividendTradingDate}</div>
                          {isCapWarning && <div className="text-[11px] text-orange-500 font-medium mt-1">⚠ 含資本公積 ${d.CashCapitalDistribution}</div>}
                        </div>
                        <div className="text-right">
                          <div className="text-[15px] font-bold">${cash.toFixed(2)}</div>
                          {latest && <div className="text-xs text-muted-foreground mt-0.5">{((cash / latest.close) * 100).toFixed(2)}% yield</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Chip Flow */}
              {detail.chips.length > 0 && (
                <div className="bg-card rounded-[20px] shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <h3 className="text-[15px] font-semibold">三大法人買賣超（張）</h3>
                  </div>
                  {detail.chips.slice(-7).reverse().map(c => (
                    <div key={c.date} className="px-6 py-3.5 border-b border-border/50 last:border-0">
                      <div className="text-xs text-muted-foreground mb-2 font-medium">{c.date}</div>
                      <div className="flex gap-6">
                        {[
                          { label: "外資", val: c.ForeignInvestors_net },
                          { label: "投信", val: c.InvestmentTrust_net },
                          { label: "自營商", val: c.Dealer_net },
                        ].map(({ label, val }) => (
                          <div key={label} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{label}</span>
                            <span className={`text-[13px] font-semibold tabular-nums ${val > 0 ? "text-green-500" : val < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                              {val > 0 ? "+" : ""}{val.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!detail && !detailLoading && !error && (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-15" />
              <p className="text-[15px]">搜尋台灣上市／上櫃股票</p>
              <p className="text-xs mt-2 opacity-60">資料來源：FinMind API</p>
            </div>
          )}
        </>
      )}

      {tab === "chips" && (
        <>
          <div className="bg-card rounded-[20px] shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_repeat(3,_90px)_70px] px-5 py-3.5 border-b border-border text-[11px] font-semibold text-muted-foreground">
              <span>個股</span>
              <span className="text-right">外資</span>
              <span className="text-right">投信</span>
              <span className="text-right">自營商</span>
              <span className="text-right">大戶%</span>
            </div>
            {MOCK_CHIPS.map(row => {
              const heatVal = (v: number) => {
                const ratio = v / maxForeign
                if (v > 0) return `rgba(52,${Math.round(34 + ratio * 180)},85,${0.2 + ratio * 0.6})`
                return `rgba(${Math.round(200 + Math.abs(ratio) * 55)},60,60,${0.2 + Math.abs(ratio) * 0.6})`
              }
              return (
                <div key={row.stockId} className="grid grid-cols-[1fr_repeat(3,_90px)_70px] px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors items-center">
                  <div>
                    <div className="text-[15px] font-semibold">{row.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{row.stockId}</div>
                  </div>
                  {[row.foreign, row.trust, row.dealer].map((v, i) => (
                    <div key={i} className="flex justify-end">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg"
                        style={{ backgroundColor: heatVal(v) }}>
                        {v > 0 ? <TrendingUp className="h-2.5 w-2.5" /> : v < 0 ? <TrendingDown className="h-2.5 w-2.5" /> : null}
                        {(Math.abs(v) / 1000).toFixed(1)}K
                      </span>
                    </div>
                  ))}
                  <div className="text-right">
                    <div className="text-[15px] font-bold tabular-nums">{row.topPct}%</div>
                    <div className={`text-[11px] font-medium ${row.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {row.change >= 0 ? "↑" : "↓"}{Math.abs(row.change)}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground text-center">資料來源：TWSE / FinMind ｜ 每日收盤後更新</p>
        </>
      )}
    </div>
  )
}
