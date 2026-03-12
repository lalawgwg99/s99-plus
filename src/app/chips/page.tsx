"use client"

import { useState } from "react"
import { CHIP_DATA, STOCKS } from "@/lib/data"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

function heatColor(value: number, max: number): string {
  const ratio = value / max
  if (value > 0) {
    const g = Math.round(34 + ratio * 180)
    return `rgba(52, ${g}, 85, ${0.2 + ratio * 0.6})`
  } else {
    const r = Math.round(200 + Math.abs(ratio) * 55)
    return `rgba(${r}, 60, 60, ${0.2 + Math.abs(ratio) * 0.6})`
  }
}

function chipColor(v: number) {
  if (v > 0) return "text-green-500"
  if (v < 0) return "text-red-500"
  return "text-muted-foreground"
}

function chipIcon(v: number) {
  if (v > 0) return <TrendingUp className="h-3.5 w-3.5" />
  if (v < 0) return <TrendingDown className="h-3.5 w-3.5" />
  return <Minus className="h-3.5 w-3.5" />
}

export default function ChipPage() {
  const [sortKey, setSortKey] = useState<"foreign" | "trust" | "dealer" | "govFunds">("foreign")

  const chips = CHIP_DATA.map(c => ({
    ...c,
    stock: STOCKS.find(s => s.id === c.stockId),
  })).sort((a, b) => Math.abs(b[sortKey]) - Math.abs(a[sortKey]))

  const maxForeign = Math.max(...CHIP_DATA.map(c => Math.abs(c.foreign)))
  const maxTrust = Math.max(...CHIP_DATA.map(c => Math.abs(c.trust)))
  const maxDealer = Math.max(...CHIP_DATA.map(c => Math.abs(c.dealer)))
  const maxGov = Math.max(...CHIP_DATA.map(c => Math.abs(c.govFunds)))

  const COLUMNS = [
    { key: "foreign" as const, label: "外資", max: maxForeign },
    { key: "trust" as const, label: "投信", max: maxTrust },
    { key: "dealer" as const, label: "自營商", max: maxDealer },
    { key: "govFunds" as const, label: "官股行庫", max: maxGov },
  ]

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">籌碼熱力圖</h1>
        <p className="text-sm text-muted-foreground mt-1">三大法人 + 八大官股買賣超 (張) — 綠色為買入、紅色為賣出</p>
      </div>

      {/* Sort Tabs */}
      <div className="flex gap-2 flex-wrap">
        {COLUMNS.map(c => (
          <button
            key={c.key}
            onClick={() => setSortKey(c.key)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              sortKey === c.key ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
            }`}
          >
            依 {c.label} 排序
          </button>
        ))}
      </div>

      {/* Heatmap Table */}
      <div className="rounded-2xl bg-card shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_repeat(4,_140px)_120px] px-5 py-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>個股</span>
          {COLUMNS.map(c => <span key={c.key} className="text-right">{c.label}</span>)}
          <span className="text-right">千張大戶%</span>
        </div>

        {chips.map(row => (
          <div key={row.stockId} className="grid grid-cols-[1fr_repeat(4,_140px)_120px] px-5 py-3.5 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors items-center">
            <div>
              <div className="text-sm font-semibold">{row.stock?.name ?? row.stockId}</div>
              <div className="text-xs text-muted-foreground">{row.stock?.industry}</div>
            </div>
            {COLUMNS.map(col => (
              <div key={col.key} className="flex justify-end">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${chipColor(row[col.key])}`}
                  style={{ backgroundColor: heatColor(row[col.key], col.max) }}
                >
                  {chipIcon(row[col.key])}
                  {Math.abs(row[col.key]).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="text-right">
              <div className="text-sm font-bold">{row.topHolderPct}%</div>
              <div className={`text-xs ${row.topHolderChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                {row.topHolderChange >= 0 ? "+" : ""}{row.topHolderChange}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground px-1">資料來源：台灣證交所 / 富邦 API（模擬資料）｜每日收盤後更新</p>
    </div>
  )
}
