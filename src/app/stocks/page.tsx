"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { fetchStockInfo, fetchDailyPrice, fetchDividends, fetchChipFlow, nDaysAgo, type StockInfo, type DailyPrice, type DividendRecord, type InstitutionalFlow } from "@/lib/api"
import { Search, TrendingUp, TrendingDown, Loader2, Shield, Calendar, BarChart3 } from "lucide-react"

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

export default function StockSearchPage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [stockList, setStockList] = useState<StockInfo[]>([])
  const [filtered, setFiltered] = useState<StockInfo[]>([])
  const [detail, setDetail] = useState<StockDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load stock list once
  useEffect(() => {
    setLoading(true)
    fetchStockInfo()
      .then(data => {
        // FinMind uses 'twse' (上市) and 'tpex' (上櫃)
        const twOnly = data.filter(s => s.type === "twse" || s.type === "tpex")
        setStockList(twOnly)
      })
      .catch(() => setError("無法取得股票清單，請確認網路連線"))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = useCallback((q: string) => {
    setQuery(q)
    if (!q.trim()) { setFiltered([]); return }
    const lower = q.toLowerCase()
    const res = stockList
      .filter(s => s.stock_id.includes(q) || s.stock_name.toLowerCase().includes(lower) || s.industry_category?.toLowerCase().includes(lower))
      .slice(0, 20)
    setFiltered(res)
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
      setError("資料載入失敗，請稍後再試")
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

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">個股查詢</h1>
        <p className="text-sm text-muted-foreground mt-1">搜尋台灣所有上市/上櫃股票及 ETF — 即時接 FinMind API</p>
      </div>

      {/* Search Box */}
      <div className="relative">
        <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
          {loading ? <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" /> : <Search className="h-5 w-5 text-muted-foreground shrink-0" />}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="輸入股票代號或名稱（如 2330、台積電、ETF）"
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => { setQuery(""); setFiltered([]); setDetail(null) }} className="text-xs text-muted-foreground hover:text-foreground">
              ✕
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {filtered.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
            {filtered.map(s => (
              <button
                key={s.stock_id}
                onClick={() => loadDetail(s)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border last:border-0 text-left"
              >
                <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">{s.stock_id}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{s.stock_name}</div>
                  <div className="text-xs text-muted-foreground">{s.industry_category} · {s.type}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-sm text-red-700 dark:text-red-300">
          ⚠ {error}
        </div>
      )}

      {detailLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">正在從 FinMind 取得即時資料…</p>
        </div>
      )}

      {/* Stock Detail */}
      {detail && !detailLoading && (
        <div className="space-y-4">
          {/* Header */}
          <div className="bg-card rounded-2xl shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold text-muted-foreground">{detail.info.stock_id} · {detail.info.industry_category}</div>
                <h2 className="text-2xl font-bold mt-0.5">{detail.info.stock_name}</h2>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black">
                  {latest ? `NT$${latest.close.toLocaleString()}` : "—"}
                </div>
                <div className={`flex items-center gap-1 justify-end text-sm font-semibold mt-1 ${priceColor(spread)}`}>
                  {spread > 0 ? <TrendingUp className="h-4 w-4" /> : spread < 0 ? <TrendingDown className="h-4 w-4" /> : null}
                  {spread > 0 ? "+" : ""}{spread.toFixed(2)} ({spreadPct > 0 ? "+" : ""}{spreadPct.toFixed(2)}%)
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: "成交量", val: latest ? (latest.Trading_Volume / 1000).toFixed(0) + " 張" : "—" },
                { label: "殖利率(估)", val: dividendYield > 0 ? dividendYield + "%" : "—" },
                { label: "近 30 日外資", val: lastChip ? (lastChip.ForeignInvestors_net > 0 ? "+" : "") + lastChip.ForeignInvestors_net.toLocaleString() : "—" },
              ].map(({ label, val }) => (
                <div key={label} className="bg-secondary/40 rounded-xl p-3 text-center">
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="text-sm font-bold mt-0.5">{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Price Chart (sparkline via CSS bars) */}
          {detail.prices.length > 0 && (
            <div className="bg-card rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">近 6 個月收盤價走勢</h3>
              </div>
              <div className="flex items-end gap-0.5 h-20">
                {detail.prices.slice(-60).map((p, i) => {
                  const closes = detail.prices.slice(-60).map(x => x.close)
                  const minP = Math.min(...closes), maxP = Math.max(...closes)
                  const h = maxP === minP ? 50 : ((p.close - minP) / (maxP - minP)) * 100
                  const isUp = i > 0 && p.close >= detail.prices.slice(-60)[i - 1].close
                  return (
                    <div
                      key={p.date}
                      title={`${p.date}: NT$${p.close}`}
                      className={`flex-1 rounded-t-sm transition-all ${isUp ? "bg-green-400" : "bg-red-400"}`}
                      style={{ height: `${Math.max(4, h * 0.8)}%` }}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{detail.prices.at(-60)?.date?.slice(5) ?? ""}</span>
                <span>{detail.prices.at(-1)?.date?.slice(5) ?? ""}</span>
              </div>
            </div>
          )}

          {/* Dividends */}
          {detail.dividends.length > 0 && (
            <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">歷年配息記錄</h3>
              </div>
              {detail.dividends.slice(-8).reverse().map(d => {
                const cash = d.CashEarningsDistribution + d.CashStatutoryDistribution + d.CashCapitalDistribution
                const isCapWarning = d.CashCapitalDistribution > 0
                return (
                  <div key={d.year + d.CashExDividendTradingDate} className="px-5 py-3 border-b border-border last:border-0 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{d.year} 年</div>
                      <div className="text-xs text-muted-foreground">{d.CashExDividendTradingDate}</div>
                      {isCapWarning && (
                        <div className="text-[10px] text-orange-500 font-medium mt-0.5">⚠ 含資本公積 ${d.CashCapitalDistribution}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">${cash.toFixed(2)}/股</div>
                      {latest && <div className="text-xs text-muted-foreground">{((cash / latest.close) * 100).toFixed(2)}%</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Chip Flow */}
          {detail.chips.length > 0 && (
            <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">近期三大法人買賣超（張）</h3>
              </div>
              {detail.chips.slice(-7).reverse().map(c => (
                <div key={c.date} className="px-5 py-3 border-b border-border last:border-0">
                  <div className="text-xs text-muted-foreground mb-1.5">{c.date}</div>
                  <div className="flex gap-4">
                    {[
                      { label: "外資", val: c.ForeignInvestors_net },
                      { label: "投信", val: c.InvestmentTrust_net },
                      { label: "自營商", val: c.Dealer_net },
                    ].map(({ label, val }) => (
                      <div key={label} className={`text-xs font-semibold ${val > 0 ? "text-green-500" : val < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                        {label} {val > 0 ? "+" : ""}{val.toLocaleString()}
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
          <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">搜尋任意台灣上市/上櫃股票代號或名稱</p>
          <p className="text-xs mt-1 opacity-60">資料來源：FinMind API · TWSE 開放資料</p>
        </div>
      )}
    </div>
  )
}
