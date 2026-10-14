import { HomepageAdGrid } from "@/features/ads/components/HomepageAdGrid";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import type { AdPlacement } from "@/shared/types/ads.types";
const placeholders = [0, 1, 2, 3, 4];
function NewsPlaceholder() {
  return <>
    <div className="latest-news-desktop editorial-gutter space-y-3 px-4 py-5 md:p-5"><Skeleton className="aspect-video w-full" /><Skeleton className="h-16 w-full" /></div>
    <div className="latest-news-mobile editorial-gutter px-4 py-3"><div className="flex gap-2.5"><Skeleton className="aspect-video w-28 shrink-0" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-12 w-full" /></div></div></div>
  </>;
}
export function HomepageAdSkeleton({ placement }: { placement: Exclude<AdPlacement, "LEADERBOARD"> }) {
  return <HomepageAdGrid placement={placement} items={placeholders} keyForItem={(index) => index}
    renderItem={() => placement === "IN_FEED" ? <NewsPlaceholder /> : <div className="space-y-3 bg-white pb-4"><Skeleton className="aspect-video w-full" /><Skeleton className="mx-4 h-12" /></div>} />;
}
