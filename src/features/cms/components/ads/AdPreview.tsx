"use client";
import { useState } from "react";
import { AdMedia } from "@/features/ads/components/AdMedia";
import { matchesAdRatio, type AdPlacement } from "@/shared/types/ads.types";
interface AdPreviewProps { placement: AdPlacement; imageUrl: string; title: string; }
export function AdPreview({ placement, imageUrl, title }: AdPreviewProps) {
  const [mobile, setMobile] = useState(false);
  const [dimensions, setDimensions] = useState<{ url: string; width: number; height: number } | null>(null);
  const mismatch = dimensions?.url === imageUrl && !matchesAdRatio(placement, dimensions.width, dimensions.height);
  return <div className="space-y-2">
    <div className="flex gap-2" role="group" aria-label="Preview viewport">
      {[false, true].map((value) => <button key={String(value)} type="button" aria-pressed={mobile === value}
        onClick={() => setMobile(value)} className="min-h-11 rounded border border-neutral-300 px-3 text-sm dark:border-neutral-700">{value ? "Mobile" : "Desktop"}</button>)}
    </div>
    <div className="mx-auto w-full border border-neutral-200 bg-white p-3" style={{ maxWidth: mobile ? 360 : placement === "LEADERBOARD" ? 970 : 480 }}>
      <AdMedia placement={placement} imageUrl={imageUrl} title={title}
        onDimensions={(width, height) => setDimensions({ url: imageUrl, width, height })} />
      <p className="mt-1 text-[11px] text-neutral-500">Advertisement</p>
    </div>
    {mismatch ? <p role="status" className="text-xs text-amber-700 dark:text-amber-400">Existing image has a different ratio. It remains visible in full; upload a matching image when replacing it.</p> : null}
  </div>;
}
