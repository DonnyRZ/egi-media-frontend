"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { useActiveAd } from "@/features/ads/hooks/useActiveAd";
import type { AdPlacement } from "@/shared/types/ads.types";
import {
  recordAdClick,
  recordAdImpression,
} from "@/shared/repositories/ads.repository";
import { cn } from "@/shared/lib/cn";

interface NativeAdSlotProps {
  placement: AdPlacement;
  className?: string;
  label?: "ADVERTISEMENT" | "SPONSOR";
}

const COVER_IMAGE_CLASS =
  "h-full w-full object-cover object-center transition duration-500 group-hover:opacity-95";

export function NativeAdSlot({
  placement,
  className,
  label = "ADVERTISEMENT",
}: NativeAdSlotProps) {
  const { data: ad } = useActiveAd(placement);
  const impressed = useRef(false);

  useEffect(() => {
    if (!ad || impressed.current) return;
    impressed.current = true;
    void recordAdImpression(ad.id).catch(() => undefined);
  }, [ad]);

  if (!ad) return null;

  const currentAd = ad;

  function handleClick() {
    void recordAdClick(currentAd.id).catch(() => undefined);
  }

  if (placement === "LEADERBOARD") {
    return (
      <aside
        aria-label={label}
        className={cn(
          "w-full border-b border-neutral-200 bg-neutral-50",
          className,
        )}
      >
        <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center px-4 py-2">
          <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
            {label}
          </p>
          <a
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group relative mx-auto block h-24 w-full max-w-[970px] overflow-hidden bg-neutral-100 outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            onClick={handleClick}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={ad.title}
              className={COVER_IMAGE_CLASS}
              src={ad.imageUrl}
            />
          </a>
        </div>
      </aside>
    );
  }

  if (placement === "SIDEBAR_RECTANGLE") {
    return (
      <aside
        aria-label={label}
        className={cn("w-full border-t border-neutral-200 pt-5", className)}
      >
        <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
          {label}
        </p>
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group relative block h-[250px] w-full overflow-hidden bg-neutral-100 outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          onClick={handleClick}
        >
          <Image
            alt={ad.title}
            className={COVER_IMAGE_CLASS}
            fill
            sizes="(max-width: 1024px) 100vw, 360px"
            src={ad.imageUrl}
            unoptimized={ad.imageUrl.startsWith("http")}
          />
        </a>
      </aside>
    );
  }

  return (
    <aside
      aria-label={label}
      className={cn(
        "flex h-full flex-col border border-neutral-200 bg-white p-5",
        className,
      )}
    >
      <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
        {placement === "IN_FEED" ? label : "SPONSOR"}
      </p>
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group flex min-h-0 flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        onClick={handleClick}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
          <Image
            alt={ad.title}
            className={COVER_IMAGE_CLASS}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={ad.imageUrl}
            unoptimized={ad.imageUrl.startsWith("http")}
          />
        </div>
        <p className="mt-2 truncate text-sm font-medium text-neutral-700 group-hover:text-ink">
          {ad.title}
        </p>
      </a>
    </aside>
  );
}
