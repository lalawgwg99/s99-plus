"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, PieChart, MoreHorizontal } from "lucide-react"

const TABS = [
  { href: "/", label: "首頁", icon: Home },
  { href: "/explore", label: "探索", icon: Compass },
  { href: "/portfolio", label: "投資", icon: PieChart },
  { href: "/more", label: "更多", icon: MoreHorizontal },
]

export default function TabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16 pb-[env(safe-area-inset-bottom)]">
        {TABS.map(tab => {
          const isActive = pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href))
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => navigator.vibrate?.(10)}
              className={`relative flex flex-col items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl transition-all duration-200 min-w-[64px] ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:scale-95"
              }`}
            >
              <Icon
                className={`h-[22px] w-[22px] transition-all duration-200 ${
                  isActive ? "scale-110" : ""
                }`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={`text-[10px] font-medium leading-none ${
                isActive ? "font-semibold" : ""
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0 w-5 h-[3px] bg-primary rounded-full transition-all duration-300" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
