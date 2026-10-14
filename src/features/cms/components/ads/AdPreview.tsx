"use client";
import { useState } from "react";
import { AdMedia } from "@/features/ads/components/AdMedia";
import { matchesAdRatio, type AdPlacement } from "@/shared/types/ads.types";
interface AdPreviewProps { placement: AdPlacement; imageUrl: string; title: string; }
export function AdPreview({ placement, imageUrl, title }: AdPreviewProps) {
  const [mobile, setMobile] = useState(false);
  const [dimensions, setDimensions] = useState<{ url: string; width: number; height: number } | null>(null);
  const mismatch = dimensions?.url === imageUrl && !matchesAdRatio(placement, dimensions.width, dimensions.height);
  const banner = placement === "LEADERBOARD";
  return <div className="space-y-2">
    <div className="flex gap-2" role="group" aria-label="Preview viewport">
      {[false, true].map((value) => <button key={String(value)} type="button" aria-pressed={mobile === value}
        onClick={() => setMobile(value)} className="min-h-11 rounded border border-neutral-300 px-3 text-sm dark:border-neutral-700">{value ? "Mobile" : "Desktop"}</button>)}
    </div>
    <div className="mx-auto w-full border border-neutral-200" style={{ maxWidth: mobile ? 360 : banner ? 1034 : 480, background: banner ? "#f6f6f6" : "white", padding: banner ? mobile ? "8px 12px 10px" : "10px 32px 12px" : 0 }}>
      <div className={banner ? "mx-auto flex max-w-[970px] flex-col gap-1.5" : ""}>
        <AdMedia placement={placement} imageUrl={imageUrl} title={title}
          onDimensions={(width, height) => setDimensions({ url: imageUrl, width, height })} />
        <p className={banner ? "order-first text-right text-[10px] uppercase leading-[1.4] tracking-wide text-neutral-500" : "mt-1 text-[11px] text-neutral-500"}>Advertisement</p>
      </div>
    </div>
    {mismatch ? <p role="status" className="text-xs text-amber-700 dark:text-amber-400">Existing image has a different ratio. It remains visible in full; upload a matching image when replacing it.</p> : null}
  </div>;
}
