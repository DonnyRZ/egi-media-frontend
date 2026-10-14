"use client";
import { useState } from "react";
import { useLocale } from "next-intl";
import { AdMedia } from "@/features/ads/components/AdMedia";
import { useActiveAd } from "@/features/ads/hooks/useActiveAd";
import { useAdViewability } from "@/features/ads/hooks/useAdViewability";
import { recordAdClick } from "@/shared/repositories/ads.repository";
import { AD_LABELS, type AdPlacement } from "@/shared/types/ads.types";
import { toContentLocale } from "@/shared/utils/locale";
import { cn } from "@/shared/lib/cn";
interface NativeAdSlotProps { placement: AdPlacement; className?: string; }
export function NativeAdSlot({ placement, className }: NativeAdSlotProps) {
  const { data: ad } = useActiveAd(placement);
  const label = AD_LABELS[toContentLocale(useLocale())];
  const [readyUrl, setReadyUrl] = useState<string | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const loaded = Boolean(ad?.imageUrl && readyUrl === ad.imageUrl);
  const ref = useAdViewability(ad?.id, ad?.imageUrl, loaded);
  const validLink = Boolean(ad && failedUrl !== ad.imageUrl && /^https?:\/\//i.test(ad.targetUrl));
  const media = <AdMedia placement={placement} imageUrl={ad?.imageUrl} title={ad?.title}
    imageWidth={ad?.imageWidth} imageHeight={ad?.imageHeight}
    mediaRef={ref} onReady={(ready) => { setReadyUrl(ready ? ad?.imageUrl ?? null : null); setFailedUrl(ready ? null : ad?.imageUrl ?? null); }} />;
  return <aside aria-label={label} data-ad-slot={placement} className={cn("homepage-ad-slot min-w-0 bg-white", className)}>
    {validLink ? <a href={ad?.targetUrl} target="_blank" rel="noopener noreferrer sponsored"
      aria-label={ad?.title || label} tabIndex={loaded ? 0 : -1}
      className={cn("block focus-visible:outline-2 focus-visible:outline-accent", !loaded && "pointer-events-none")}
      onClick={() => { if (ad && loaded) void recordAdClick(ad.id).catch(() => undefined); }}>{media}</a> : media}
    <p className="ad-label mt-1 text-left text-[11px] leading-normal text-neutral-500">{label}</p>
  </aside>;
}
