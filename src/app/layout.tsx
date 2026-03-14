import type { Metadata } from "next"
import "./globals.css"
import TabBar from "@/components/TabBar"
import Header from "@/components/Header"

export const metadata: Metadata = {
  title: "StockMoat 護城河",
  description: "台股存股分析 · ETF 重疊 · 股息稅務 · 籌碼 · AI 掃雷",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="bg-background text-foreground antialiased min-h-screen">
        <Header />
        <main className="pt-14 pb-24 md:pb-20 min-h-screen">
          {children}
        </main>
        <TabBar />
      </body>
    </html>
  )
}
