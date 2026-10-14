"use client";
import { useState, type Ref } from "react";
import { AD_PLACEMENT_GUIDELINES, type AdPlacement } from "@/shared/types/ads.types";
interface AdMediaProps { placement: AdPlacement; imageUrl?: string; title?: string; onReady?: (ready: boolean) => void; onDimensions?: (width: number, height: number) => void; mediaRef?: Ref<HTMLDivElement>; }
export function AdMedia({ placement, imageUrl, title = "", onReady, onDimensions, mediaRef }: AdMediaProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return <div ref={mediaRef} className="relative w-full overflow-hidden bg-white"
    style={{ aspectRatio: AD_PLACEMENT_GUIDELINES[placement].aspectRatio }} data-ad-media>
    {imageUrl && failedSource !== imageUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img key={imageUrl} src={imageUrl} alt={title} loading="eager" decoding="async"
        className="absolute inset-0 h-full w-full object-contain" onLoad={(event) => { onReady?.(true); onDimensions?.(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight); }}
        onError={() => { setFailedSource(imageUrl); onReady?.(false); }} />
    ) : null}
  </div>;
}
