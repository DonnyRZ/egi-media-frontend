"use client";
import { useState, type Ref } from "react";
import { AD_PLACEMENT_GUIDELINES, type AdPlacement } from "@/shared/types/ads.types";
interface AdMediaProps { placement: AdPlacement; imageUrl?: string; title?: string; imageWidth?: number | null; imageHeight?: number | null; onReady?: (ready: boolean) => void; onDimensions?: (width: number, height: number) => void; mediaRef?: Ref<HTMLDivElement>; }
export function AdMedia({ placement, imageUrl, title = "", imageWidth, imageHeight, onReady, onDimensions, mediaRef }: AdMediaProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const [intrinsic, setIntrinsic] = useState<{ url: string; width: number; height: number } | null>(null);
  const width = intrinsic && intrinsic.url === imageUrl ? intrinsic.width : imageWidth;
  const height = intrinsic && intrinsic.url === imageUrl ? intrinsic.height : imageHeight;
  const aspectRatio = placement === "LEADERBOARD" && width && height && width > 0 && height > 0
    ? `${width} / ${height}` : AD_PLACEMENT_GUIDELINES[placement].aspectRatio;
  return <div ref={mediaRef} className="relative w-full overflow-hidden bg-white"
    style={{ aspectRatio }} data-ad-media>
    {imageUrl && failedSource !== imageUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img key={imageUrl} src={imageUrl} alt={title} loading="eager" decoding="async"
        className="absolute inset-0 h-full w-full object-contain" onLoad={(event) => {
          const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
          setIntrinsic({ url: imageUrl, width, height }); onReady?.(true); onDimensions?.(width, height);
        }}
        onError={() => { setFailedSource(imageUrl); onReady?.(false); }} />
    ) : null}
  </div>;
}
