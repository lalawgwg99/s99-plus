"use client"

import { useEffect, useRef } from "react"
import { createChart, ColorType, CandlestickSeries, HistogramSeries, LineSeries } from "lightweight-charts"
import type { DailyPrice } from "@/lib/api"

interface Props {
  data: DailyPrice[]
  height?: number
}

export default function KLineChart({ data, height = 320 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !data.length) return

    const isDark = document.documentElement.classList.contains("dark")

    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: isDark ? "#9ca3af" : "#6b7280",
        fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, sans-serif",
      },
      grid: {
        vertLines: { color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" },
        horzLines: { color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" },
      },
      rightPriceScale: { borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" },
      timeScale: {
        borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
        vertLine: { width: 1, color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)", style: 2 },
        horzLine: { width: 1, color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)", style: 2 },
      },
    })

    // Candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    })

    const candles = data.map(d => ({
      time: d.date as any,
      open: d.open,
      high: d.max,
      low: d.min,
      close: d.close,
    }))
    candleSeries.setData(candles)

    // Volume bars
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    })
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    })

    const volumeData = data.map(d => ({
      time: d.date as any,
      value: d.Trading_Volume,
      color: d.close >= d.open
        ? "rgba(34,197,94,0.3)"
        : "rgba(239,68,68,0.3)",
    }))
    volumeSeries.setData(volumeData)

    // 20-day MA line
    const maSeries = chart.addSeries(LineSeries, {
      color: isDark ? "#60a5fa" : "#3b82f6",
      lineWidth: 2,
      priceScaleId: "right",
    })

    const maData: { time: any; value: number }[] = []
    for (let i = 19; i < data.length; i++) {
      const avg = data.slice(i - 19, i + 1).reduce((s, d) => s + d.close, 0) / 20
      maData.push({ time: data[i].date as any, value: avg })
    }
    maSeries.setData(maData)

    // Fit content
    chart.timeScale().fitContent()

    // Resize observer
    const ro = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect
      chart.applyOptions({ width })
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      chart.remove()
    }
  }, [data, height])

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden"
      style={{ height }}
    />
  )
}
