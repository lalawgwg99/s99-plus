"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface Holding {
  name: string
  value: number
  color: string
}

interface Props {
  holdings: Holding[]
}

const COLORS = ["#007aff", "#5856d6", "#ff9500", "#ff3b30", "#34c759", "#af52de", "#ff2d55", "#a2845e"]

export default function PortfolioPie({ holdings }: Props) {
  const data = holdings.map((h, i) => ({
    ...h,
    color: h.color || COLORS[i % COLORS.length],
  }))

  const total = data.reduce((s, h) => s + h.value, 0)

  return (
    <div className="flex items-center gap-4">
      <div className="w-32 h-32 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={56}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => `${((Number(value) / total) * 100).toFixed(1)}%`}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-1.5 min-w-0">
        {data.map((h, i) => {
          const pct = ((h.value / total) * 100).toFixed(1)
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: h.color }}
              />
              <span className="truncate flex-1">{h.name}</span>
              <span className="font-semibold tabular-nums">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
