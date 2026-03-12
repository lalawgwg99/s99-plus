"use client"

import { useState, useMemo } from "react"
import { calcDRIP } from "@/lib/data"
import { TrendingUp } from "lucide-react"

function fmt(n: number) {
  return "NT$" + n.toLocaleString()
}

export default function DCAPage() {
  const [principal, setPrincipal] = useState(300000)
  const [monthly, setMonthly] = useState(5000)
  const [years, setYears] = useState(10)
  const [yield_, setYield] = useState(5.5)
  const [inflation, setInflation] = useState(2.5)

  const withDRIP = useMemo(() => calcDRIP(principal, monthly, years, yield_, true), [principal, monthly, years, yield_])
  const noDRIP = useMemo(() => calcDRIP(principal, monthly, years, yield_, false), [principal, monthly, years, yield_])

  const realValue = Math.round(withDRIP.final / Math.pow(1 + inflation / 100, years))
  const dripDiff = withDRIP.final - noDRIP.final

  const TOTAL_INVESTED = principal + monthly * years * 12
  const bars = [
    { label: "投入成本", value: TOTAL_INVESTED, color: "bg-secondary-foreground/20" },
    { label: "不再投入（領走股息）", value: noDRIP.final, color: "bg-blue-400" },
    { label: "股息再投入 DRIP", value: withDRIP.final, color: "bg-primary" },
    { label: "DRIP 實質購買力", value: realValue, color: "bg-purple-500" },
  ]
  const maxVal = Math.max(...bars.map(b => b.value))

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">定期定額 / DRIP 模擬器</h1>
        <p className="text-sm text-muted-foreground mt-1">試算复利 · 股息再投入差距 · 通膨侵蝕</p>
      </div>

      {/* Sliders */}
      <div className="bg-card rounded-2xl shadow-sm p-5 space-y-5">
        {[
          { label: "本金", value: principal, min: 10000, max: 2000000, step: 10000, setter: setPrincipal, display: fmt(principal) },
          { label: "每月定額", value: monthly, min: 1000, max: 50000, step: 1000, setter: setMonthly, display: fmt(monthly) },
          { label: "投資年數", value: years, min: 1, max: 30, step: 1, setter: setYears, display: `${years} 年` },
          { label: "年化殖利率", value: yield_, min: 1, max: 15, step: 0.5, setter: setYield, display: `${yield_}%` },
          { label: "預估通膨率", value: inflation, min: 0, max: 10, step: 0.5, setter: setInflation, display: `${inflation}%/年` },
        ].map(({ label, value, min, max, step, setter, display }) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{label}</span>
              <span className="font-bold text-primary">{display}</span>
            </div>
            <input
              type="range" min={min} max={max} step={step}
              value={value}
              onChange={e => setter(Number(e.target.value))}
              className="w-full accent-primary h-1.5 rounded-full cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-card rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{years} 年後資產比較</h2>
        {bars.map(b => (
          <div key={b.label} className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">{b.label}</span>
              <span className="font-bold">{fmt(b.value)}</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${b.color}`}
                style={{ width: `${(b.value / maxVal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-400">DRIP 复利優勢</span>
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">{fmt(dripDiff)}</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">比領走股息多賺</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">通膨侵蝕後實質購買力</span>
          </div>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{fmt(realValue)}</div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">以今日幣值計算（通膨 {inflation}%/年）</div>
        </div>
      </div>
    </div>
  )
}
