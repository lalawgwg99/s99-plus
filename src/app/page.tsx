import { Suspense } from "react"
import { CardSkeleton, ChartSkeleton } from "@/components/Skeleton"
import HomeContent from "./HomeContent"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
    </div>
  )
}

function HomeSkeleton() {
  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <div>
        <div className="h-6 w-32 bg-secondary rounded mb-2 animate-pulse" />
        <div className="h-3 w-48 bg-secondary rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0,1,2,3].map(i => <CardSkeleton key={i} />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  )
}
