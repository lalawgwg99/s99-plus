"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, ChevronRight, Newspaper } from "lucide-react"
import PortfolioPie from "@/components/PortfolioPie"

const MARKET_DATA = [
  { label: "加權指數", value: "22,456.82", change: "+1.23%", up: true, sub: "▲ 273.5" },
  { label: "櫃買指數", value: "235.81", change: "-0.31%", up: false, sub: "▼ 0.73" },
  { label: "成交金額", value: "3,245億", change: "+15.2%", up: true, sub: "量能放大" },
  { label: "貪婪指數", value: "72", change: "貪婪", up: true, sub: "偏多情緒" },
]

const AI_SIGNALS = [
  { stock: "2330 台積電", risk: "high" as const, msg: "法說會提及 CoWoS 供給 Q3 瓶頸，庫存去化低於預期", source: "Q3 法說會" },
  { stock: "2317 鴻海", risk: "medium" as const, msg: "連續兩季毛利率下修至 5.8%，匯損擴大", source: "Q2 財報" },
  { stock: "2412 中華電", risk: "low" as const, msg: "財報穩健，現金流充沛，股利發放穩定逾 20 年", source: "H1 財報" },
]

const PORTFOLIO = [
  { name: "2330 台積電", value: 450000, color: "#007AFF" },
  { name: "2412 中華電", value: 320000, color: "#5856D6" },
  { name: "0056 元大高股息", value: 280000, color: "#FF9500" },
  { name: "00878 國泰永續", value: 210000, color: "#34C759" },
  { name: "2886 兆豐金", value: 140000, color: "#AF52DE" },
]

const riskStyle = {
  high: { dot: "bg-red-500 animate-pulse", label: "高風險", badge: "bg-red-500/10 text-red-500" },
  medium: { dot: "bg-amber-500", label: "注意", badge: "bg-amber-500/10 text-amber-600" },
  low: { dot: "bg-emerald-500", label: "穩定", badge: "bg-emerald-500/10 text-emerald-600" },
}

export default function HomeContent() {
  const totalValue = PORTFOLIO.reduce((s, p) => s + p.value, 0)

  return (
    <div className="p-5 space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold tracking-tight">市場總覽</h1>
        <p className="text-[15px] text-muted-foreground mt-1">台股即時數據 · AI 風險掃描 · 持股概覽</p>
      </div>

      {/* Market Overview — iOS Large Cards */}
      <div className="grid grid-cols-2 gap-3">
        {MARKET_DATA.map(m => (
          <div
            key={m.label}
            className="rounded-[20px] bg-card shadow-sm p-5 hover:shadow-md active:scale-[0.98] transition-all duration-150 cursor-default"
            onClick={() => navigator.vibrate?.(5)}
          >
            <span className="text-[11px] font-semibold text-muted-foreground tracking-wide">{m.label}</span>
            <div className="text-[26px] font-bold mt-2 tabular-nums tracking-tight leading-none">{m.value}</div>
            <div className={`text-[13px] font-semibold mt-2 flex items-center gap-1 ${m.up ? "text-green-500" : "text-red-500"}`}>
              {m.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {m.change}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* AI Scanner */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Newspaper className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-[20px] font-bold">AI 每日掃描</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-primary text-[13px] font-medium h-8 px-3">
            全部
          </Button>
        </div>
        <div className="rounded-[20px] bg-card shadow-sm overflow-hidden divide-y divide-border/50">
          {AI_SIGNALS.map((s, i) => {
            const style = riskStyle[s.risk]
            return (
              <div
                key={i}
                className="p-5 flex items-center gap-4 active:bg-secondary/50 cursor-pointer transition-colors"
                onClick={() => navigator.vibrate?.(10)}
              >
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold">{s.stock}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${style.badge}`}>{style.label}</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground mt-1 line-clamp-2">{s.msg}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">{s.source}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/30 shrink-0" />
              </div>
            )
          })}
        </div>
      </section>

      {/* Portfolio */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[20px] font-bold">持股概覽</h2>
          <Button variant="ghost" size="sm" className="text-primary text-[13px] font-medium h-8 px-3">
            分析
          </Button>
        </div>
        <div className="rounded-[20px] bg-card shadow-sm p-6">
          <span className="text-[11px] font-semibold text-muted-foreground tracking-wide">總市值</span>
          <div className="text-[34px] font-bold mt-1 tabular-nums tracking-tight">
            NT$ {totalValue.toLocaleString()}
          </div>
          <div className="text-[13px] text-green-500 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="h-3.5 w-3.5" /> 今日 +12,350 (+0.89%)
          </div>
          <div className="mt-6">
            <PortfolioPie holdings={PORTFOLIO} />
          </div>
        </div>
      </section>
    </div>
  )
}
