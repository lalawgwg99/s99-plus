import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StockMoat 護城河",
  description: "台股存股分析 · ETF 重疊 · 股息稅務 · 籌碼 · AI 掃雷",
};

const NAV = [
  { href: "/", label: "總覽", emoji: "📊" },
  { href: "/stocks", label: "個股查詢", emoji: "🔍" },
  { href: "/chips", label: "籌碼熱力圖", emoji: "🌡" },
  { href: "/etf", label: "ETF X-Ray", emoji: "🔬" },
  { href: "/dividends", label: "股息 & 稅務", emoji: "💰" },
  { href: "/dca", label: "定期定額 DRIP", emoji: "📈" },
  { href: "/gifts", label: "紀念品 ROI", emoji: "🎁" },
  { href: "/ai", label: "AI 掃雷", emoji: "🛡" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className={`${inter.className} bg-background text-foreground`}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-card/60 backdrop-blur-xl fixed inset-y-0 left-0 z-30">
            <div className="px-5 py-5 border-b border-border">
              <div className="text-lg font-black tracking-tight">StockMoat</div>
              <div className="text-xs text-muted-foreground mt-0.5">護城河台股分析平台</div>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary active:bg-secondary/80 transition-colors group"
                >
                  <span className="text-base leading-none">{item.emoji}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="px-5 py-4 border-t border-border text-xs text-muted-foreground">
              資料：FinMind / TWSE<br />僅供參考，非投資建議
            </div>
          </aside>

          {/* Mobile Top Bar */}
          <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-4 h-14 flex items-center justify-between">
            <span className="font-black text-base">StockMoat 護城河</span>
          </div>

          {/* Mobile Bottom Nav */}
          <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-card/90 backdrop-blur-xl border-t border-border flex overflow-x-auto">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center px-3 py-2 min-w-[56px] text-[10px] text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <span className="text-xl leading-none mb-0.5">{item.emoji}</span>
                <span className="truncate">{item.label.split(" ")[0]}</span>
              </Link>
            ))}
          </nav>

          {/* Main */}
          <main className="flex-1 md:ml-56 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
