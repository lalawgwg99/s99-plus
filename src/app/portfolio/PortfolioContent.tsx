"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, ChevronRight, ShieldAlert, ShieldCheck, TrendingUp } from "lucide-react"
import PortfolioPie from "@/components/PortfolioPie"

// ── DCA Calculator (from old dca/page.tsx) ──
function calcDRIP(principal: number, monthlyInvest: number, years: number, annualYield: number, drip: boolean) {
  let holdings = principal
  let totalInvested = principal
  const monthlyRate = annualYield / 12 / 100
  let dividendEarned = 0
  for (let m = 0; m < years * 12; m++) {
    totalInvested += monthlyInvest
    holdings += monthlyInvest
    const monthlyDiv = holdings * monthlyRate
    dividendEarned += monthlyDiv
    if (drip) holdings += monthlyDiv
  }
  return { final: Math.round(holdings), totalInvested: Math.round(totalInvested), dividendEarned: Math.round(dividendEarned) }
}

function calcNHITax(dividendAmount: number, taxBracket: number) {
  const NHI_RATE = 0.0211
  const NHI_THRESHOLD = 20000
  let nhiAmount = 0
  if (dividendAmount >= NHI_THRESHOLD) nhiAmount = dividendAmount * NHI_RATE
  const incomeTax = dividendAmount * (taxBracket / 100)
  return {
    nhiAmount: Math.round(nhiAmount),
    incomeTax: Math.round(incomeTax),
    netDividend: Math.round(dividendAmount - nhiAmount - incomeTax),
    splitStrategy: dividendAmount >= NHI_THRESHOLD
      ? `建議拆分持股使每次領息 < NT$20,000，可省 NT$${Math.round(nhiAmount).toLocaleString()} 二代健保`
      : "未超過二代健保門檻"
  }
}

// ── ETF Overlap Data ──
const ETF_HOLDINGS = [
  { etfId: "0056", stockId: "2330", name: "台積電", weight: 12.8 },
  { etfId: "0056", stockId: "2317", name: "鴻海", weight: 8.4 },
  { etfId: "0056", stockId: "2412", name: "中華電", weight: 6.1 },
  { etfId: "0056", stockId: "2886", name: "兆豐金", weight: 5.5 },
  { etfId: "00878", stockId: "2330", name: "台積電", weight: 15.2 },
  { etfId: "00878", stockId: "2412", name: "中華電", weight: 7.8 },
  { etfId: "00878", stockId: "2886", name: "兆豐金", weight: 6.3 },
  { etfId: "00878", stockId: "2317", name: "鴻海", weight: 5.1 },
  { etfId: "00919", stockId: "2330", name: "台積電", weight: 18.5 },
  { etfId: "00919", stockId: "2317", name: "鴻海", weight: 9.2 },
  { etfId: "00919", stockId: "2886", name: "兆豐金", weight: 7.4 },
]

const DIVIDEND_EVENTS = [
  { stockId: "00919", stockName: "群益台灣精選高息", exDate: "2025-03-20", payDate: "2025-04-10", amount: 2500, perShare: 0.5, nhi: false },
  { stockId: "00878", stockName: "國泰永續高股息", exDate: "2025-03-23", payDate: "2025-04-17", amount: 4500, perShare: 0.45, nhi: false },
  { stockId: "2886", stockName: "兆豐金", exDate: "2025-07-08", payDate: "2025-07-30", amount: 26000, perShare: 2.6, nhi: true },
  { stockId: "2412", stockName: "中華電", exDate: "2025-07-03", payDate: "2025-07-28", amount: 12000, perShare: 6.0, nhi: false },
  { stockId: "2330", stockName: "台積電", exDate: "2025-07-17", payDate: "2025-08-05", amount: 42500, perShare: 4.25, nhi: true },
]

const ETF_IDS = ["0056", "00878", "00919"]
const ETF_NAMES: Record<string, string> = { "0056": "元大高股息", "00878": "國泰永續高股息", "00919": "群益台灣精選高息" }

type PortTab = "etf" | "dca" | "tax"

export default function PortfolioContent() {
  const [tab, setTab] = useState<PortTab>("etf")
  const [selectedETFs, setSelectedETFs] = useState<string[]>(["0056", "00878"])
  const [bracket, setBracket] = useState(20)
  const [selectedEvent, setSelectedEvent] = useState<typeof DIVIDEND_EVENTS[0] | null>(null)

  // DCA state
  const [principal, setPrincipal] = useState(300000)
  const [monthly, setMonthly] = useState(5000)
  const [years, setYears] = useState(10)
  const [yieldRate, setYieldRate] = useState(5.5)
  const [inflation, setInflation] = useState(2.5)

  const withDRIP = useMemo(() => calcDRIP(principal, monthly, years, yieldRate, true), [principal, monthly, years, yieldRate])
  const noDRIP = useMemo(() => calcDRIP(principal, monthly, years, yieldRate, false), [principal, monthly, years, yieldRate])
  const realValue = Math.round(withDRIP.final / Math.pow(1 + inflation / 100, years))
  const dripDiff = withDRIP.final - noDRIP.final

  // ETF overlap
  const overlap = useMemo(() => {
    const stockWeights: Record<string, { total: number; etfs: string[]; name: string }> = {}
    ETF_HOLDINGS.forEach(h => {
      if (!selectedETFs.includes(h.etfId)) return
      if (!stockWeights[h.stockId]) stockWeights[h.stockId] = { total: 0, etfs: [], name: h.name }
      stockWeights[h.stockId].total += h.weight
      stockWeights[h.stockId].etfs.push(h.etfId)
    })
    return Object.entries(stockWeights)
      .map(([id, d]) => ({ id, name: d.name, weight: d.total, etfs: d.etfs, duplicated: d.etfs.length > 1 }))
      .sort((a, b) => b.weight - a.weight)
  }, [selectedETFs])

  const dupStocks = overlap.filter(s => s.duplicated)
  const totalWeight = overlap.reduce((s, x) => s + x.weight, 0)

  // Tax
  const yearTotal = DIVIDEND_EVENTS.reduce((s, e) => s + e.amount, 0)
  const taxResult = selectedEvent
    ? calcNHITax(selectedEvent.amount, bracket)
    : calcNHITax(yearTotal, bracket)

  const fmt = (n: number) => "NT$" + n.toLocaleString()

  const BRACKETS = [5, 12, 20, 30, 40]

  return (
    <div className="p-4 space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">投資工具</h1>
        <p className="text-sm text-muted-foreground mt-0.5">ETF 重疊 · 定期定額 DRIP · 股息稅務</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 flex-wrap">
        {(["etf", "dca", "tax"] as PortTab[]).map(t => (
          <button key={t} onClick={() => { setTab(t); navigator.vibrate?.(10) }}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
              tab === t ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/50"
            }`}>
            {t === "etf" ? "🔬 ETF X-Ray" : t === "dca" ? "📈 DRIP 模擬" : "💰 股息稅務"}
          </button>
        ))}
      </div>

      {/* ETF X-Ray */}
      {tab === "etf" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {ETF_IDS.map(id => (
              <button key={id} onClick={() => setSelectedETFs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedETFs.includes(id) ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
                }`}>
                {id} {ETF_NAMES[id]}
              </button>
            ))}
          </div>

          {dupStocks.length > 0 && (
            <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">發現 {dupStocks.length} 檔重複持股</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-0.5">
                  {dupStocks.map(s => s.name).join("、")} 等實際集中度遠超表面比例
                </p>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex justify-between items-center">
              <span className="font-semibold text-sm">成分股合計曝險</span>
              <span className={`text-sm font-bold ${totalWeight > 80 ? "text-red-500" : totalWeight > 50 ? "text-yellow-500" : "text-green-500"}`}>
                集中度 {totalWeight.toFixed(1)}%
              </span>
            </div>
            {overlap.map(stock => (
              <div key={stock.id} className="px-5 py-3 flex items-center gap-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{stock.name}</span>
                    {stock.duplicated && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600">重複</span>}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {stock.etfs.map(e => <span key={e} className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{e}</span>)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold tabular-nums">{stock.weight.toFixed(1)}%</div>
                  <div className="w-20 h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${stock.duplicated ? "bg-red-500" : "bg-primary"}`}
                      style={{ width: `${Math.min(100, (stock.weight / (overlap[0]?.weight || 1)) * 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DCA Calculator */}
      {tab === "dca" && (
        <div className="space-y-5">
          <div className="bg-card rounded-2xl shadow-sm p-5 space-y-5">
            {[
              { label: "本金", value: principal, min: 10000, max: 2000000, step: 10000, setter: setPrincipal, display: fmt(principal) },
              { label: "每月定額", value: monthly, min: 1000, max: 50000, step: 1000, setter: setMonthly, display: fmt(monthly) },
              { label: "投資年數", value: years, min: 1, max: 30, step: 1, setter: setYears, display: `${years} 年` },
              { label: "年化殖利率", value: yieldRate, min: 1, max: 15, step: 0.5, setter: setYieldRate, display: `${yieldRate}%` },
              { label: "預估通膨率", value: inflation, min: 0, max: 10, step: 0.5, setter: setInflation, display: `${inflation}%/年` },
            ].map(({ label, value, min, max, step, setter, display }) => (
              <div key={label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="font-bold text-primary">{display}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={value}
                  onChange={e => setter(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 rounded-full cursor-pointer" />
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="bg-card rounded-2xl shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{years} 年後資產比較</h2>
            {[
              { label: "投入成本", value: principal + monthly * years * 12, color: "bg-secondary-foreground/20" },
              { label: "領走股息", value: noDRIP.final, color: "bg-blue-400" },
              { label: "DRIP 再投入", value: withDRIP.final, color: "bg-primary" },
              { label: "DRIP 實質購買力", value: realValue, color: "bg-purple-500" },
            ].map(b => {
              const maxVal = Math.max(principal + monthly * years * 12, noDRIP.final, withDRIP.final, realValue)
              return (
                <div key={b.label} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span>{b.label}</span>
                    <span className="font-bold tabular-nums">{fmt(b.value)}</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${b.color}`}
                      style={{ width: `${(b.value / maxVal) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs font-semibold text-green-700 dark:text-green-400">DRIP 复利優勢</span>
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300 tabular-nums">{fmt(dripDiff)}</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">比領走股息多賺</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl p-4">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">通膨後實質購買力</span>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 tabular-nums mt-1">{fmt(realValue)}</div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">以今日幣值計算</div>
            </div>
          </div>
        </div>
      )}

      {/* Tax Calculator */}
      {tab === "tax" && (
        <div className="space-y-4">
          <div className="bg-card rounded-2xl shadow-sm p-5 space-y-3">
            <div className="text-sm font-semibold">綜合所得稅級距</div>
            <div className="flex flex-wrap gap-2">
              {BRACKETS.map(b => (
                <button key={b} onClick={() => setBracket(b)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    bracket === b ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
                  }`}>
                  {b}%
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
            <div className="flex justify-between px-5 py-4 border-b border-border">
              <span className="text-sm font-semibold">股息明細</span>
              <span className="text-xs text-muted-foreground">合計 {fmt(yearTotal)}</span>
            </div>
            {DIVIDEND_EVENTS.map(ev => (
              <button key={ev.stockId + ev.exDate}
                onClick={() => setSelectedEvent(selectedEvent?.stockId === ev.stockId ? null : ev)}
                className={`w-full px-5 py-3.5 flex items-center gap-4 border-b border-border last:border-0 transition-colors text-left ${
                  selectedEvent?.stockId === ev.stockId ? "bg-primary/5" : "hover:bg-secondary/30"
                }`}>
                {ev.nhi ? <ShieldAlert className="h-5 w-5 text-orange-500 shrink-0" /> : <ShieldCheck className="h-5 w-5 text-green-500 shrink-0" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{ev.stockName}</span>
                    {ev.nhi && <span className="text-[10px] text-orange-500 font-bold border border-orange-400 px-1.5 rounded-full">⚠ 二代健保</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">除息 {ev.exDate} · 入帳 {ev.payDate}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold">{fmt(ev.amount)}</div>
                  <div className="text-xs text-muted-foreground">${ev.perShare}/股</div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50" />
              </button>
            ))}
          </div>

          {selectedEvent && (
            <div className="bg-card rounded-2xl shadow-sm p-5 space-y-4">
              <h2 className="text-sm font-semibold">{selectedEvent.stockName} — 稅後試算 (稅率 {bracket}%)</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "股息總額", val: selectedEvent.amount, color: "" },
                  { label: "二代健保 (2.11%)", val: -taxResult.nhiAmount, color: "text-red-500" },
                  { label: "所得稅預扣", val: -taxResult.incomeTax, color: "text-orange-500" },
                  { label: "實拿金額", val: taxResult.netDividend, color: "text-green-600 font-bold text-lg" },
                ].map(r => (
                  <div key={r.label} className="bg-secondary/40 rounded-xl p-3">
                    <div className="text-[10px] text-muted-foreground">{r.label}</div>
                    <div className={`text-base font-bold mt-0.5 tabular-nums ${r.color}`}>{fmt(Math.abs(r.val))}</div>
                  </div>
                ))}
              </div>
              {taxResult.nhiAmount > 0 && (
                <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-xl p-3 text-xs text-orange-800 dark:text-orange-300">
                  💡 {taxResult.splitStrategy}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
