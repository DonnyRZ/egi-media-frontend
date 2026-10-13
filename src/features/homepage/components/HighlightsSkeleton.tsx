import { Skeleton } from "@/shared/components/ui/Skeleton";

function LeadSkeleton() {
  return <div className="space-y-3"><Skeleton className="aspect-video w-full" />
    <Skeleton className="h-5 w-full" /><Skeleton className="h-4 w-3/4" /></div>;
}

export function HighlightsSkeleton() {
  return <div aria-busy="true" aria-label="Loading" className="editorial-gutter py-5">
    <div className="highlights-desktop">
      <div className="mx-auto max-w-[680px]"><LeadSkeleton /></div>
      <div className="highlight-supporting-grid mt-5">
        {Array.from({ length: 8 }, (_, index) => <LeadSkeleton key={index} />)}
      </div>
    </div>
    <div className="highlights-mobile">
      {Array.from({ length: 3 }, (_, index) => <div className="highlight-package" key={index}>
        <LeadSkeleton />
        {Array.from({ length: 3 }, (_, row) => <div className="flex gap-2 py-3" key={row}>
          <Skeleton className="aspect-video w-1/3 shrink-0 self-start" />
          <Skeleton className="h-12 flex-1" />
        </div>)}
      </div>)}
    </div>
  </div>;
}
