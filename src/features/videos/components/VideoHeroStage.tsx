"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { VideoEmbed } from "@/features/videos/components/VideoEmbed";
import type { YoutubeVideo } from "@/shared/types/youtube.types";
export function VideoHeroStage({ video }: { video: YoutubeVideo }) {
  const [requested, setRequested] = useState(false);
  const t = useTranslations("editorial");
  return (
    <section className="mb-8 grid items-center gap-6 md:grid-cols-[1fr_2fr]">
      <div>
        <h2 className="text-[28px] font-bold leading-tight lg:text-4xl">
          {video.title}
        </h2>
        {video.description ? (
          <p className="mt-4 line-clamp-3 leading-6 text-neutral-300">
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
      <div className="relative aspect-video">
        <VideoEmbed key={video.id} video={video} autoplay={requested} />
      </div>
    </section>
  );
}
