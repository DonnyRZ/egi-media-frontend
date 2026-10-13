"use client";
import { useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { VideoEmbed } from "@/features/videos/components/VideoEmbed";
import type { YoutubeVideo } from "@/shared/types/youtube.types";
export function VideoHeroStage({ video }: { video: YoutubeVideo }) {
  const [requested, setRequested] = useState(false);
  const t = useTranslations("editorial");
  // Keep automatic thumbnails compact even when YouTube supplies an HD variant.
  const posterMax = video.posterLandscape ? 640 : 480;
  return (
    <section
      data-video-hero
      className="video-hero-stage mx-auto mb-6 grid w-full max-w-[calc(var(--hero-poster-max)+28rem)] items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--hero-poster-max))] lg:gap-8"
      style={{ "--hero-poster-max": `${posterMax}px` } as CSSProperties}
    >
      <div className="min-w-0">
        <h2 className="editorial-lead-title text-[28px] font-bold leading-tight lg:text-[32px]">
          {video.title}
        </h2>
        {video.description ? (
          <p className="editorial-summary mt-4 line-clamp-3 leading-6 text-neutral-300">
            {video.description}
          </p>
        ) : null}
        <button
          type="button"
          className="mt-5 inline-flex min-h-11 items-center rounded-full border border-white/50 px-5 font-semibold"
          onClick={() => setRequested(true)}
        >
          ▶ {t("watch")}
        </button>
      </div>
      <div data-video-hero-poster className="relative mx-auto aspect-video w-full max-w-[var(--hero-poster-max)] min-w-0">
        <VideoEmbed key={video.id} video={video} autoplay={requested}
          posterSizes={`(min-width: ${posterMax}px) ${posterMax}px, 100vw`} />
      </div>
    </section>
  );
}

export function VideoHeroSkeleton() {
  return <div aria-busy="true" className="video-hero-stage mx-auto mb-6 grid w-full max-w-[1088px] items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,640px)] lg:gap-8">
    <div className="space-y-3"><div className="h-8 w-4/5 animate-pulse bg-white/10" /><div className="h-8 w-3/5 animate-pulse bg-white/10" /><div className="h-4 w-full animate-pulse bg-white/10" /></div>
    <div className="mx-auto aspect-video w-full max-w-[640px] animate-pulse bg-white/10" />
  </div>;
}
