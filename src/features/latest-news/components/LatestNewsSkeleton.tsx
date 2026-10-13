import { Skeleton } from "@/shared/components/ui/Skeleton";

export function LatestNewsSkeleton({ mobileCount = 6 }: { mobileCount?: number }) {
  return <>
    <div className="latest-news-mobile divide-y divide-neutral-200">
      {Array.from({ length: mobileCount }).map((_, index) => (
        <div key={index} className="editorial-gutter grid grid-cols-[min(40%,9rem)_minmax(0,1fr)] items-start gap-2.5 bg-white px-4 py-3">
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-2.5 w-4/5" />
          </div>
        </div>
      ))}
    </div>
    <div className="latest-news-desktop">
      <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="editorial-gutter space-y-3 bg-white px-4 py-5 md:p-5">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  </>;
}
