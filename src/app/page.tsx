import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Bell, Settings, ChevronRight, Activity, PieChart, TrendingUp } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header matching Apple Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex h-14 items-center gap-4 px-4 sm:px-8">
          <div className="flex items-center gap-2 flex-1">
            <span className="font-semibold text-lg tracking-tight">StockMoat</span>
          </div>
          
          <div className="hidden md:flex flex-1 items-center space-x-2 bg-secondary/50 rounded-full px-3 py-1.5 border border-border/50">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search stocks (e.g. 2330, TSMC)" 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground text-foreground"
            />
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary active:scale-95 transition-transform">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary active:scale-95 transition-transform">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content matching iOS Grouped Inset style */}
      <main className="flex-1 container max-w-6xl py-6 px-4 sm:px-8 space-y-8 animate-in fade-in duration-500">
        
        {/* Market Overview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight px-2">Market Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-none shadow-sm bg-card hover:shadow-md transition-shadow cursor-default">
              <CardContent className="p-4 flex flex-col justify-center items-start">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">TAIEX</span>
                <span className="text-2xl font-bold">22,456</span>
                <span className="text-sm text-green-500 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +1.2%
                </span>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-none shadow-sm bg-card hover:shadow-md transition-shadow cursor-default">
              <CardContent className="p-4 flex flex-col justify-center items-start">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">OTC Index</span>
                <span className="text-2xl font-bold">235.8</span>
                <span className="text-sm text-red-500 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 rotate-180" /> -0.3%
                </span>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-none shadow-sm bg-card hover:shadow-md transition-shadow cursor-default">
              <CardContent className="p-4 flex flex-col justify-center items-start">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Volume</span>
                <span className="text-2xl font-bold">3,245B</span>
                <span className="text-sm text-green-500 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +15%
                </span>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-none shadow-sm bg-card hover:shadow-md transition-shadow cursor-default">
              <CardContent className="p-4 flex flex-col justify-center items-start">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Fear/Greed</span>
                <span className="text-2xl font-bold">72</span>
                <span className="text-sm text-muted-foreground font-medium mt-1">Greed</span>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* AI Daily Risk Scanner & Portfolio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold tracking-tight">AI Daily Scanner</h2>
              <Button variant="ghost" size="sm" className="text-primary text-sm font-medium hover:bg-transparent hover:opacity-80 active:opacity-60 transition-opacity">
                See All
              </Button>
            </div>
            <Card className="rounded-2xl border-none shadow-sm bg-card">
              <div className="divide-y divide-border">
                {/* Risk Item High */}
                <div className="p-4 flex items-center gap-4 hover:bg-secondary/40 active:bg-secondary/60 cursor-pointer transition-colors group">
                  <div className="h-3 w-3 rounded-full bg-red-500 shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">2330 TSMC</h4>
                    <p className="text-xs text-muted-foreground truncate">AI inventory correction mentioned in Q3 call</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50" />
                </div>
                {/* Risk Item Medium */}
                <div className="p-4 flex items-center gap-4 hover:bg-secondary/40 active:bg-secondary/60 cursor-pointer transition-colors group">
                  <div className="h-3 w-3 rounded-full bg-yellow-500 shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">2317 Hon Hai</h4>
                    <p className="text-xs text-muted-foreground truncate">Margin slip over 2 quarters</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50" />
                </div>
                {/* Risk Item Ok */}
                <div className="p-4 flex items-center gap-4 hover:bg-secondary/40 active:bg-secondary/60 cursor-pointer transition-colors group">
                  <div className="h-3 w-3 rounded-full bg-green-500 shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">2412 CHT</h4>
                    <p className="text-xs text-muted-foreground truncate">Stable dividend outlook maintained</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50" />
                </div>
              </div>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold tracking-tight">Portfolio Summary</h2>
              <Button variant="ghost" size="sm" className="text-primary text-sm font-medium hover:bg-transparent hover:opacity-80 active:opacity-60 transition-opacity">
                Analyze
              </Button>
            </div>
            <Card className="rounded-2xl border-none shadow-sm bg-card">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="uppercase tracking-wider text-xs font-semibold">Total Value</CardDescription>
                <CardTitle className="text-3xl font-bold">NT$ 2,456,789</CardTitle>
                <div className="text-sm text-green-500 font-medium flex items-center gap-1">
                  Today +12,350 (+0.51%)
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-32 w-full mt-4 bg-secondary/30 rounded-xl flex items-center justify-center border border-border/50">
                  <span className="text-muted-foreground text-sm flex items-center gap-2">
                    <PieChart className="h-4 w-4" /> Chart Visualization Space
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </main>
    </div>
  )
}
