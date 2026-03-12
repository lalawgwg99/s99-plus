"use client"

import { GIFTS } from "@/lib/data"
import { Trophy, AlertTriangle, Calendar, MapPin } from "lucide-react"

const AGENTS = [
  { name: "全通代理行", address: "台北市中山區南京東路一段 15 號", hours: "09:00–17:00 週一至週五" },
  { name: "長龍企業", address: "台北市大安區信義路四段 265 號", hours: "09:00–16:30 週一至週五" },
  { name: "聯洲企業", address: "台北市松山區復興北路 128 號", hours: "09:00–12:00, 13:00–17:00" },
]

function roiColor(roi: number): string {
  if (roi > 300) return "text-green-600 dark:text-green-400"
  if (roi > 100) return "text-blue-600 dark:text-blue-400"
  if (roi > 0) return "text-muted-foreground"
  return "text-red-500"
}

export default function GiftsPage() {
  const sorted = [...GIFTS].sort((a, b) => b.roi - a.roi)

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">股東會紀念品 ROI 排行</h1>
        <p className="text-sm text-muted-foreground mt-1">零股領禮品投報率試算 · 代收點地圖 · 截止買進日倒數</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3">
        {sorted.slice(0, 3).map((g, i) => (
          <div key={g.stockId} className={`rounded-2xl p-4 text-center ${
            i === 0 ? "bg-yellow-50 dark:bg-yellow-950/40 border-2 border-yellow-400" :
            i === 1 ? "bg-slate-50 dark:bg-slate-900/40 border border-border" :
                     "bg-orange-50 dark:bg-orange-950/30 border border-border"
          }`}>
            <div className="text-2xl mb-1">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
            <div className="text-xs font-bold truncate">{g.stockName}</div>
            <div className={`text-xl font-black mt-1 ${roiColor(g.roi)}`}>{g.roi}%</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">ROI</div>
          </div>
        ))}
      </div>

      {/* Full List */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">所有紀念品排行</div>
        {sorted.map((g, i) => {
          const daysLeft = Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000)
          return (
            <div key={g.stockId} className="px-5 py-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-2xl font-black text-muted-foreground/40 w-8 shrink-0 text-center pt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold">{g.stockId} {g.stockName}</span>
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">{g.shareHolder}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{g.giftDescription}</div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-xs flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      截止 {g.deadline}
                      {daysLeft > 0 ? (
                        <span className={`ml-1 font-semibold ${daysLeft <= 7 ? "text-red-500" : "text-foreground"}`}>
                          (剩 {daysLeft} 天)
                        </span>
                      ) : (
                        <span className="ml-1 text-muted-foreground">(已截止)</span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-xl font-black ${roiColor(g.roi)}`}>
                    {g.roi > 0 ? "+" : ""}{g.roi}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    成本 NT${(g.price + 20).toLocaleString()}
                    <br />禮品值 NT${g.giftValue.toLocaleString()}
                  </div>
                </div>
              </div>
              {g.roi < 0 && (
                <div className="mt-2 ml-12 flex items-center gap-1.5 text-xs text-red-500">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>此禮品價值低於購買成本，不建議純粹為領禮品買進</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Agent Collection Points */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">紀念品代收點（台北）</h2>
          </div>
        </div>
        {AGENTS.map((a, i) => (
          <div key={i} className="px-5 py-4 border-b border-border last:border-0">
            <div className="font-semibold text-sm">{a.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{a.address}</div>
            <div className="text-xs text-muted-foreground">{a.hours}</div>
          </div>
        ))}
        <div className="px-5 py-3 bg-secondary/30 text-xs text-muted-foreground">
          💡 記得攜帶本人身分證及股東存摺，部分公司需出示電子投票截圖
        </div>
      </div>
    </div>
  )
}
