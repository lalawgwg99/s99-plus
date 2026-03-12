"use client"

import { useState } from "react"
import { DIVIDEND_EVENTS, calcNHITax } from "@/lib/data"
import { ShieldAlert, ShieldCheck, ChevronRight } from "lucide-react"

const MONTHS_ZH = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

const BRACKETS = [
  { label: "5% (年收 54萬以下)", val: 5 },
  { label: "12% (年收 108萬以下)", val: 12 },
  { label: "20% (年收 216萬以下)", val: 20 },
  { label: "30% (年收 420萬以下)", val: 30 },
  { label: "40% (年收 420萬以上)", val: 40 },
]

// Build monthly cash flow from events
function buildMonthly(events: typeof DIVIDEND_EVENTS) {
  const months = Array.from({ length: 12 }, (_, i) => ({ month: i, total: 0, events: [] as typeof DIVIDEND_EVENTS }))
  events.forEach(ev => {
    const month = new Date(ev.payDate).getMonth()
    months[month].total += ev.estimatedAmount
    months[month].events.push(ev)
  })
  return months
}

export default function DividendPage() {
  const [bracket, setBracket] = useState(20)
  const [selectedEvent, setSelectedEvent] = useState<typeof DIVIDEND_EVENTS[0] | null>(null)

  const monthly = buildMonthly(DIVIDEND_EVENTS)
  const maxMonth = Math.max(...monthly.map(m => m.total))
  const yearTotal = DIVIDEND_EVENTS.reduce((sum, e) => sum + e.estimatedAmount, 0)

  const taxResult = selectedEvent
    ? calcNHITax(selectedEvent.estimatedAmount, bracket)
    : calcNHITax(yearTotal, bracket)

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">股息日曆 & 稅務優化</h1>
        <p className="text-sm text-muted-foreground mt-1">預估現金流 · 二代健保 · 拆單避稅策略</p>
      </div>

      {/* Tax Bracket Selector */}
      <div className="bg-card rounded-2xl shadow-sm p-5 space-y-3">
        <div className="text-sm font-semibold">選擇您的綜合所得稅級距</div>
        <div className="flex flex-wrap gap-2">
          {BRACKETS.map(b => (
            <button
              key={b.val}
              onClick={() => setBracket(b.val)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                bracket === b.val ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Cash Flow Bar Chart */}
      <div className="bg-card rounded-2xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">未來 12 個月現金流</h2>
          <span className="text-sm font-bold text-primary">合計 NT${yearTotal.toLocaleString()}</span>
        </div>
        <div className="flex items-end gap-1.5 h-28">
          {monthly.map((m, i) => {
            const height = maxMonth > 0 ? (m.total / maxMonth) * 100 : 0
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end" style={{ height: "88px" }}>
                  <div
                    className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-all cursor-default"
                    style={{ height: height > 0 ? `${Math.max(4, height * 0.88)}px` : "2px", opacity: m.total === 0 ? 0.2 : 1 }}
                    title={m.total > 0 ? `NT$${m.total.toLocaleString()}` : "無股息"}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground">{MONTHS_ZH[i]}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Event List */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="flex justify-between px-5 py-4 border-b border-border">
          <span className="text-sm font-semibold">股息明細</span>
          <span className="text-xs text-muted-foreground">點選查看稅務試算</span>
        </div>
        {DIVIDEND_EVENTS.sort((a, b) => a.exDate.localeCompare(b.exDate)).map(ev => (
          <button
            key={ev.stockId + ev.exDate}
            onClick={() => setSelectedEvent(selectedEvent?.stockId === ev.stockId ? null : ev)}
            className={`w-full px-5 py-3.5 flex items-center gap-4 border-b border-border last:border-0 transition-colors text-left ${
              selectedEvent?.stockId === ev.stockId ? "bg-primary/5" : "hover:bg-secondary/30"
            }`}
          >
            {ev.nhiAlert
              ? <ShieldAlert className="h-5 w-5 text-orange-500 shrink-0" />
              : <ShieldCheck className="h-5 w-5 text-green-500 shrink-0" />
            }
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{ev.stockName}</span>
                {ev.nhiAlert && <span className="text-[10px] text-orange-500 font-bold border border-orange-400 px-1.5 rounded-full">⚠ 二代健保</span>}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                除息 {ev.exDate} · 入帳 {ev.payDate}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-bold">NT${ev.estimatedAmount.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">${ev.dividendPerShare}/股</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50" />
          </button>
        ))}
      </div>

      {/* Tax Calculator Result */}
      {selectedEvent && (
        <div className="bg-card rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold">{selectedEvent.stockName} — 稅後試算 (稅率 {bracket}%)</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "股息總額", val: selectedEvent.estimatedAmount, color: "" },
              { label: "二代健保 (2.11%)", val: -taxResult.nhiAmount, color: "text-red-500" },
              { label: "所得稅預扣 ("+bracket+"%)", val: -taxResult.incomeTax, color: "text-orange-500" },
              { label: "實拿金額", val: taxResult.netDividend, color: "text-green-600 font-bold text-lg" },
            ].map(r => (
              <div key={r.label} className="bg-secondary/40 rounded-xl p-3">
                <div className="text-xs text-muted-foreground">{r.label}</div>
                <div className={`text-base font-bold mt-0.5 ${r.color}`}>NT${Math.abs(r.val).toLocaleString()}</div>
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
  )
}
