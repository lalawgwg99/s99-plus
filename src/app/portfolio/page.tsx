import { Suspense } from "react"
import { TableSkeleton, ChartSkeleton } from "@/components/Skeleton"
import PortfolioContent from "./PortfolioContent"

export default function PortfolioPage() {
  return (
    <Suspense fallback={<PortfolioSkeleton />}>
      <PortfolioContent />
    </Suspense>
  )
}

function PortfolioSkeleton() {
  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <div>
        <div className="h-6 w-32 bg-secondary rounded mb-2 animate-pulse" />
        <div className="h-3 w-48 bg-secondary rounded animate-pulse" />
      </div>
      <ChartSkeleton />
      <TableSkeleton rows={4} />
    </div>
  )
}
