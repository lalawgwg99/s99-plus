"use client"

import { useState } from "react"
import { Trophy, AlertTriangle, Calendar, MapPin, ShieldAlert, ShieldCheck, ChevronRight } from "lucide-react"
import { useDarkMode } from "@/hooks/useDarkMode"
import { AI_SIGNALS } from "@/lib/signals"

// MOCK_DATA — TODO: connect to real AGM gift API or database
const GIFTS = [
  { stockId: "2881", stockName: "富邦金", price: 98, giftValue: 500, giftDescription: "7-ELEVEN 禮品卡 $500", deadline: "2026-03-28", roi: 410, shareHolder: "1股" },
  { stockId: "2884", stockName: "玉山金", price: 35, giftValue: 200, giftDescription: "悠遊卡儲值 $200", deadline: "2026-04-01", roi: 471, shareHolder: "1股" },
  { stockId: "1216", stockName: "統一", price: 68, giftValue: 400, giftDescription: "統一商品卡 $400", deadline: "2026-04-10", roi: 488, shareHolder: "1股" },
  { stockId: "2912", stockName: "統一超", price: 290, giftValue: 300, giftDescription: "7-ELEVEN 購物金 $300", deadline: "2026-04-15", roi: -3, shareHolder: "1張" },
  { stockId: "2207", stockName: "和泰車", price: 850, giftValue: 1600, giftDescription: "Gogoro 換電序號 3個月", deadline: "2026-04-20", roi: 88, shareHolder: "1張" },
]

const AGENTS = [
  { name: "全通代理行", address: "台北市中山區南京東路一段 15 號", hours: "09:00–17:00 週一至週五" },
  { name: "長龍企業", address: "台北市大安區信義路四段 265 號", hours: "09:00–16:30 週一至週五" },
]

type MoreTab = "gifts" | "ai" | "settings"

function roiColor(roi: number) {
  if (roi > 300) return "text-green-600 dark:text-green-400"
  if (roi > 100) return "text-blue-600 dark:text-blue-400"
  if (roi > 0) return "text-muted-foreground"
  return "text-red-500"
}

export default function MoreContent() {
  const [tab, setTab] = useState<MoreTab>("gifts")
  const [expanded, setExpanded] = useState<string | null>(null)
  const { isDark, toggle } = useDarkMode()

  const sorted = [...GIFTS].sort((a, b) => b.roi - a.roi)
  const highRisk = AI_SIGNALS.filter(s => s.riskLevel === "high")

  return (
    <div className="p-5 space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight">更多</h1>
        <p className="text-[15px] text-muted-foreground mt-1">紀念品 ROI · AI 掃雷 · 設定</p>
      </div>

      {/* Tab Switcher — iOS Segmented Control */}
      <div className="flex bg-secondary/60 rounded-xl p-1">
        {(["gifts", "ai", "settings"] as MoreTab[]).map(t => (
          <button key={t} onClick={() => { setTab(t); navigator.vibrate?.(10) }}
            className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
              tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}>
            {t === "gifts" ? "紀念品" : t === "ai" ? "AI 掃雷" : "設定"}
          </button>
        ))}
      </div>

      {/* AGM Gifts */}
      {tab === "gifts" && (
        <div className="space-y-4">
          {/* Top 3 */}
          <div className="grid grid-cols-3 gap-3">
            {sorted.slice(0, 3).map((g, i) => (
              <div key={g.stockId} className={`rounded-[20px] p-4 text-center transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                i === 0 ? "bg-yellow-50 dark:bg-yellow-950/40 border-2 border-yellow-400" :
                i === 1 ? "bg-slate-50 dark:bg-slate-900/40 border border-border" :
                         "bg-orange-50 dark:bg-orange-950/30 border border-border"
              }`}>
                <div className="text-2xl mb-1">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
                <div className="text-xs font-bold truncate">{g.stockName}</div>
                <div className={`text-xl font-black mt-1 tabular-nums ${roiColor(g.roi)}`}>{g.roi}%</div>
                <div className="text-[10px] text-muted-foreground">ROI</div>
              </div>
            ))}
          </div>

          {/* Full List */}
          <div className="bg-card rounded-[20px] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">所有紀念品</div>
            {sorted.map((g, i) => {
              const daysLeft = Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000)
              return (
                <div key={g.stockId} className="px-5 py-4 border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl font-black text-muted-foreground/30 w-8 shrink-0 text-center pt-0.5">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] font-bold">{g.stockId} {g.stockName}</span>
                        <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">{g.shareHolder}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{g.giftDescription}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          截止 {g.deadline}
                          {daysLeft > 0 ? (
                            <span className={`ml-1 font-semibold ${daysLeft <= 7 ? "text-red-500" : "text-foreground"}`}>(剩 {daysLeft} 天)</span>
                          ) : <span className="ml-1 text-red-500">(已截止)</span>}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-xl font-black tabular-nums ${roiColor(g.roi)}`}>{g.roi > 0 ? "+" : ""}{g.roi}%</div>
                      <div className="text-xs text-muted-foreground mt-0.5">成本 ${(g.price + 20).toLocaleString()}<br/>禮品 ${g.giftValue.toLocaleString()}</div>
                    </div>
                  </div>
                  {g.roi < 0 && (
                    <div className="mt-2 ml-12 flex items-center gap-1.5 text-xs text-red-500">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>禮品價值低於購買成本，不建議純粹為領禮品買進</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Agent Points */}
          <div className="bg-card rounded-[20px] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-[15px] font-semibold">紀念品代收點（台北）</span>
            </div>
            {AGENTS.map((a, i) => (
              <div key={i} className="px-5 py-4 border-b border-border/50 last:border-0">
                <div className="font-semibold text-[15px]">{a.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{a.address}</div>
                <div className="text-xs text-muted-foreground">{a.hours}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Scanner */}
      {tab === "ai" && (
        <div className="space-y-4">
          {highRisk.length > 0 && (
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-[20px] p-4">
              <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-[15px] font-bold text-red-800 dark:text-red-300">偵測到 {highRisk.length} 檔高風險警訊</div>
                <div className="text-xs text-red-700 dark:text-red-400 mt-0.5">{highRisk.map(s => s.stockName).join("、")} 請審慎評估</div>
              </div>
            </div>
          )}

          <div className="bg-card rounded-[20px] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">最新掃描結果</div>
            {AI_SIGNALS.map(signal => {
              const isExpanded = expanded === signal.stockId
              return (
                <button key={signal.stockId}
                  onClick={() => setExpanded(isExpanded ? null : signal.stockId)}
                  className="w-full text-left border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <div className="px-5 py-4 flex items-center gap-4">
                    <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                      signal.riskLevel === "high" ? "bg-red-500 animate-pulse" :
                      signal.riskLevel === "medium" ? "bg-yellow-500" : "bg-green-500"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] font-bold">{signal.stockId} {signal.stockName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          signal.riskLevel === "high" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" :
                          signal.riskLevel === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400" :
                          "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                        }`}>
                          {signal.riskLevel === "high" ? "高風險 ⚠" : signal.riskLevel === "medium" ? "留意" : "穩健 ✓"}
                        </span>
                      </div>
                      {signal.toxicKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {signal.toxicKeywords.map(kw => (
                            <span key={kw} className="text-[10px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-md font-medium">{kw}</span>
                          ))}
                        </div>
                      )}
                      <div className="text-[11px] text-muted-foreground mt-1">{signal.source} · {signal.date}</div>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-muted-foreground/40 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                  {isExpanded && (
                    <div className="px-5 pb-4 pt-0">
                      <div className="bg-secondary/40 rounded-xl p-4 text-[13px] leading-relaxed border-l-2 border-primary">{signal.summary}</div>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                        <AlertTriangle className="h-3 w-3" /> AI 自動分析，僅供參考
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Settings */}
      {tab === "settings" && (
        <div className="space-y-4">
          <div className="bg-card rounded-[20px] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">顯示設定</div>
            <div className="px-5 py-4 flex items-center justify-between border-b border-border/50">
              <div>
                <div className="text-[15px] font-semibold">深色模式</div>
                <div className="text-xs text-muted-foreground mt-0.5">自動跟隨系統或手動切換</div>
              </div>
              <button onClick={() => { toggle(); navigator.vibrate?.(10) }}
                className={`w-12 h-7 rounded-full transition-colors duration-200 relative ${isDark ? "bg-primary" : "bg-secondary"}`}>
                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  isDark ? "translate-x-5" : "translate-x-0.5"
                }`} />
              </button>
            </div>
          </div>

          <div className="bg-card rounded-[20px] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">關於</div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex justify-between text-[15px]">
                <span className="text-muted-foreground">版本</span>
                <span className="font-semibold">v2.0.0</span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span className="text-muted-foreground">資料來源</span>
                <span className="font-semibold">FinMind / TWSE</span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span className="text-muted-foreground">免責聲明</span>
                <span className="text-xs text-muted-foreground text-right max-w-[180px]">僅供參考，非投資建議</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
