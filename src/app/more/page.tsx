import { Suspense } from "react"
import { CardSkeleton } from "@/components/Skeleton"
import MoreContent from "./MoreContent"

export default function MorePage() {
  return (
    <Suspense fallback={<MoreSkeleton />}>
      <MoreContent />
    </Suspense>
  )
}

function MoreSkeleton() {
  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <div>
        <div className="h-6 w-20 bg-secondary rounded mb-2 animate-pulse" />
        <div className="h-3 w-40 bg-secondary rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[0,1,2,3].map(i => <CardSkeleton key={i} />)}
      </div>
    </div>
  )
}
