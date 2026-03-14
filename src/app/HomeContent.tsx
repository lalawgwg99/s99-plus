"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, ChevronRight, Activity } from "lucide-react"
import PortfolioPie from "@/components/PortfolioPie"
import SearchSheet from "@/components/SearchSheet"

const MARKET_DATA = [
  { label: "TAIEX", value: "22,456", change: "+1.2%", up: true },
  { label: "OTC", value: "235.8", change: "-0.3%", up: false },
  { label: "Volume", value: "3,245B", change: "+15%", up: true },
  { label: "Fear/Greed", value: "72", change: "Greed", up: true },
]

const AI_SIGNALS = [
  { stock: "2330 TSMC", risk: "high", msg: "AI inventory correction mentioned in Q3 call" },
  { stock: "2317 Hon Hai", risk: "medium", msg: "Margin slip over 2 quarters" },
  { stock: "2412 CHT", risk: "low", msg: "Stable dividend outlook maintained" },
]

const PORTFOLIO = [
  { name: "2330 台積電", value: 450000, color: "#007aff" },
  { name: "2412 中華電", value: 320000, color: "#5856d6" },
  { name: "0056 元大高股息", value: 280000, color: "#ff9500" },
  { name: "00878 國泰永續", value: 210000, color: "#34c759" },
  { name: "2886 兆豐金", value: 140000, color: "#af52de" },
]

export default function HomeContent() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">市場總覽</h1>
        <p className="text-sm text-muted-foreground mt-0.5">台股即時數據 · AI 風險掃描 · 持股概覽</p>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MARKET_DATA.map(m => (
          <div
            key={m.label}
            className="rounded-2xl bg-card shadow-sm p-4 hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-default"
            onClick={() => navigator.vibrate?.(5)}
          >
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</span>
            <div className="text-xl font-bold mt-1 tabular-nums">{m.value}</div>
            <div className={`text-xs font-medium mt-0.5 flex items-center gap-0.5 ${
              m.up ? "text-green-500" : "text-red-500"
            }`}>
              {m.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* AI Scanner & Portfolio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Daily Scanner */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">AI 每日掃描</h2>
            <Button variant="ghost" size="sm" className="text-primary text-xs font-medium hover:bg-transparent hover:opacity-80 active:opacity-60 transition-opacity">
              全部
            </Button>
          </div>
          <div className="rounded-2xl bg-card shadow-sm overflow-hidden">
            {AI_SIGNALS.map((s, i) => (
              <div
                key={i}
                className="p-4 flex items-center gap-3 border-b border-border last:border-0 hover:bg-secondary/40 active:bg-secondary/60 cursor-pointer transition-colors group"
                onClick={() => navigator.vibrate?.(10)}
              >
                <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                  s.risk === "high" ? "bg-red-500 animate-pulse" :
                  s.risk === "medium" ? "bg-yellow-500" : "bg-green-500"
                }`} />
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{s.stock}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.msg}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
              </div>
            ))}
          </div>
        </section>

        {/* Portfolio Summary */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">持股概覽</h2>
            <Button variant="ghost" size="sm" className="text-primary text-xs font-medium hover:bg-transparent hover:opacity-80 active:opacity-60 transition-opacity">
              分析
            </Button>
          </div>
          <div className="rounded-2xl bg-card shadow-sm p-4">
            <div className="mb-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">總市值</span>
              <div className="text-2xl font-bold mt-0.5">NT$ 1,400,000</div>
              <div className="text-xs text-green-500 font-medium flex items-center gap-1 mt-0.5">
                <TrendingUp className="h-3 w-3" /> 今日 +12,350 (+0.89%)
              </div>
            </div>
            <div className="mt-4">
              <PortfolioPie holdings={PORTFOLIO} />
            </div>
          </div>
        </section>
      </div>

      <SearchSheet open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
