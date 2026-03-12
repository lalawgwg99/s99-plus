"use client"

import { useState, useMemo } from "react"
import { ETF_HOLDINGS, STOCKS } from "@/lib/data"
import { AlertTriangle, CheckCircle, Info } from "lucide-react"

const ETF_IDS = ["0056", "00878", "00919"]
const ETF_NAMES: Record<string, string> = {
  "0056": "元大高股息",
  "00878": "國泰永續高股息",
  "00919": "群益台灣精選高息",
}

export default function ETFOverlapPage() {
  const [selected, setSelected] = useState<string[]>(["0056", "00878"])

  const overlap = useMemo(() => {
    const stockWeights: Record<string, { total: number; etfs: string[] }> = {}
    ETF_HOLDINGS.forEach(h => {
      if (!selected.includes(h.etfId)) return
      if (!stockWeights[h.stockId]) stockWeights[h.stockId] = { total: 0, etfs: [] }
      stockWeights[h.stockId].total += h.weight
      stockWeights[h.stockId].etfs.push(h.etfId)
    })
    return Object.entries(stockWeights)
      .map(([id, d]) => ({
        id,
        name: STOCKS.find(s => s.id === id)?.name ?? id,
        weight: d.total,
        etfs: d.etfs,
        duplicated: d.etfs.length > 1,
      }))
      .sort((a, b) => b.weight - a.weight)
  }, [selected])

  const topStock = overlap[0]
  const dupStocks = overlap.filter(s => s.duplicated)
  const totalWeight = overlap.reduce((sum, s) => sum + s.weight, 0)

  const riskColor = totalWeight > 80 ? "text-red-500" : totalWeight > 50 ? "text-yellow-500" : "text-green-500"

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">ETF X-Ray 持股重疊分析</h1>
        <p className="text-sm text-muted-foreground mt-1">選擇您持有的 ETF，系統自動計算成分股重疊與集中風險</p>
      </div>

      {/* ETF Selector */}
      <div className="flex flex-wrap gap-3">
        {ETF_IDS.map(id => (
          <button
            key={id}
            onClick={() => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              selected.includes(id)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary"
            }`}
          >
            {id} {ETF_NAMES[id]}
          </button>
        ))}
      </div>

      {/* Risk Banner */}
      {dupStocks.length > 0 && (
        <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
              發現 {dupStocks.length} 檔重複持股
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-0.5">
              您同時透過多檔 ETF 持有 {dupStocks.map(s => s.name.split(" ")[0]).join("、")} 等股票，實際集中度遠超表面比例
            </p>
          </div>
        </div>
      )}

      {/* Overlap Table */}
      <div className="rounded-2xl bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <span className="font-semibold text-sm">成分股合計曝險</span>
          <span className={`text-sm font-bold ${riskColor}`}>集中度 {totalWeight.toFixed(1)}%</span>
        </div>
        <div className="divide-y divide-border">
          {overlap.map(stock => (
            <div key={stock.id} className="px-5 py-3 flex items-center gap-4 hover:bg-secondary/30 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{stock.name}</span>
                  {stock.duplicated && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600">重複</span>
                  )}
                </div>
                <div className="flex gap-1 mt-1">
                  {stock.etfs.map(e => (
                    <span key={e} className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{e}</span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{stock.weight.toFixed(1)}%</div>
                <div className="w-24 h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${stock.duplicated ? "bg-red-500" : "bg-primary"}`}
                    style={{ width: `${Math.min(100, (stock.weight / (overlap[0]?.weight || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestion */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
        <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-blue-800 dark:text-blue-300">
          {topStock ? `您在 ${selected.length} 檔 ETF 中累積了 ${topStock.name.split(" ")[0]} 共 ${topStock.weight.toFixed(1)}% 的曝險。建議考慮加入產業相關性低的 ETF（如債券型或全市場型）來平衡集中風險。` : "請選擇至少一檔 ETF 進行分析。"}
        </p>
      </div>
    </div>
  )
}
