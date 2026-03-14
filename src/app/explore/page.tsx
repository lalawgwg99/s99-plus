import { Suspense } from "react"
import { TableSkeleton, ChartSkeleton } from "@/components/Skeleton"
import ExploreContent from "./ExploreContent"

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreSkeleton />}>
      <ExploreContent />
    </Suspense>
  )
}

function ExploreSkeleton() {
  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <div>
        <div className="h-6 w-24 bg-secondary rounded mb-2 animate-pulse" />
        <div className="h-3 w-56 bg-secondary rounded animate-pulse" />
      </div>
      <div className="h-12 bg-secondary rounded-2xl animate-pulse" />
      <ChartSkeleton />
      <TableSkeleton rows={6} />
    </div>
  )
}
