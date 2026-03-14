"use client"

import { useState } from "react"
import { Search, Sun, Moon } from "lucide-react"
import { useDarkMode } from "@/hooks/useDarkMode"
import SearchSheet from "@/components/SearchSheet"

export default function Header() {
  const { isDark, toggle } = useDarkMode()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 h-14 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between h-full px-4 max-w-2xl mx-auto">
          <span className="font-black text-base tracking-tight">StockMoat</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary active:scale-95 transition-all"
              aria-label="搜尋"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button
              onClick={() => { toggle(); navigator.vibrate?.(10) }}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary active:scale-95 transition-all"
              aria-label={isDark ? "切換淺色模式" : "切換深色模式"}
            >
              {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>
      </header>
      <SearchSheet open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
