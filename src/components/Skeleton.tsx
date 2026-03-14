export function StockCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card shadow-sm p-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-secondary rounded" />
          <div className="h-5 w-32 bg-secondary rounded" />
        </div>
        <div className="space-y-2 text-right">
          <div className="h-6 w-24 bg-secondary rounded ml-auto" />
          <div className="h-3 w-16 bg-secondary rounded ml-auto" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[0, 1, 2].map(i => (
          <div key={i} className="bg-secondary/40 rounded-xl p-3 space-y-1.5">
            <div className="h-2 w-12 bg-secondary rounded mx-auto" />
            <div className="h-3 w-16 bg-secondary rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl bg-card shadow-sm p-5 animate-pulse space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-secondary rounded" />
        <div className="h-4 w-32 bg-secondary rounded" />
      </div>
      <div className="h-48 bg-secondary/40 rounded-xl" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl bg-card shadow-sm overflow-hidden animate-pulse">
      <div className="px-5 py-3 border-b border-border">
        <div className="h-3 w-24 bg-secondary rounded" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-5 py-3.5 border-b border-border last:border-0 flex items-center gap-4">
          <div className="h-2.5 w-2.5 rounded-full bg-secondary" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-28 bg-secondary rounded" />
            <div className="h-2.5 w-40 bg-secondary rounded" />
          </div>
          <div className="h-4 w-16 bg-secondary rounded" />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-card shadow-sm p-4 animate-pulse">
      <div className="h-2.5 w-16 bg-secondary rounded mb-2" />
      <div className="h-6 w-24 bg-secondary rounded" />
      <div className="h-3 w-14 bg-secondary rounded mt-1.5" />
    </div>
  )
}
