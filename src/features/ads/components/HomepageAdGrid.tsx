import type { ReactNode } from "react";
import { NativeAdSlot } from "@/features/ads/components/NativeAdSlot";
import type { AdPlacement } from "@/shared/types/ads.types";
interface HomepageAdGridProps<T> { items: T[]; keyForItem: (item: T) => string | number; renderItem: (item: T) => ReactNode; placement: Exclude<AdPlacement, "LEADERBOARD">; }
export function HomepageAdGrid<T>({ items, keyForItem, renderItem, placement }: HomepageAdGridProps<T>) {
  return <div className="homepage-ad-grid" data-cell-count={items.length + 1}>
    {items.map((item) => <div className="homepage-content-cell min-w-0 bg-white" key={keyForItem(item)}>{renderItem(item)}</div>)}
    <div className="homepage-ad-cell min-w-0 bg-white">
      <NativeAdSlot placement={placement} className={placement === "IN_FEED" ? "editorial-gutter px-4 py-5 md:p-5" : "homepage-video-ad"} />
    </div>
  </div>;
}
