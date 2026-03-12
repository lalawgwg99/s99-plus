"use client"

import { AI_SIGNALS, STOCKS } from "@/lib/data"
import { AlertTriangle, ShieldAlert, ShieldCheck, ChevronRight } from "lucide-react"
import { useState } from "react"

function RiskBadge({ level }: { level: "high" | "medium" | "low" }) {
  const map = {
    high: { label: "高風險 ⚠", cls: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" },
    medium: { label: "留意", cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400" },
    low: { label: "穩健 ✓", cls: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" },
  }
  const { label, cls } = map[level]
  return <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
}

export default function AIPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const highRisk = AI_SIGNALS.filter(s => s.riskLevel === "high")
  const others = AI_SIGNALS.filter(s => s.riskLevel !== "high")

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">AI 財報掃雷</h1>
        <p className="text-sm text-muted-foreground mt-1">自動偵測法說會與財報中的「毒字眼」風險字詞</p>
      </div>

      {highRisk.length > 0 && (
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-4">
          <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-bold text-red-800 dark:text-red-300">偵測到 {highRisk.length} 檔高風險警訊</div>
            <div className="text-xs text-red-700 dark:text-red-400 mt-0.5">
              {highRisk.map(s => s.stockName).join("、")} 財報出現多個負面關鍵字，請審慎評估持倉
            </div>
          </div>
        </div>
      )}

      {/* Signal Cards */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">最新掃描結果</div>
        {AI_SIGNALS.map(signal => {
          const stock = STOCKS.find(s => s.id === signal.stockId)
          const isExpanded = expanded === signal.stockId

          return (
            <button
              key={signal.stockId}
              onClick={() => setExpanded(isExpanded ? null : signal.stockId)}
              className="w-full text-left border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
            >
              <div className="px-5 py-4 flex items-center gap-4">
                <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                  signal.riskLevel === "high" ? "bg-red-500 animate-pulse" :
                  signal.riskLevel === "medium" ? "bg-yellow-500" : "bg-green-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold">{signal.stockId} {signal.stockName}</span>
                    <RiskBadge level={signal.riskLevel} />
                  </div>
                  {signal.toxicKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {signal.toxicKeywords.map(kw => (
                        <span key={kw} className="text-[10px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-md font-medium">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">{signal.source} · {signal.date}</div>
                </div>
                <ChevronRight className={`h-4 w-4 text-muted-foreground opacity-50 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              </div>

              {isExpanded && (
                <div className="px-5 pb-4 pt-0">
                  <div className="bg-secondary/40 rounded-xl p-4 text-sm text-foreground leading-relaxed border-l-2 border-primary">
                    {signal.summary}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    此摘要由 AI 自動分析生成，僅供參考，不構成投資建議
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
