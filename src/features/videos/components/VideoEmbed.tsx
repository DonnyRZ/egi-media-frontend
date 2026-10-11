"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { VideoPoster } from "@/features/videos/components/VideoPoster";

import { getYoutubeEmbedUrl } from "@/shared/utils/format";
import type { YoutubeVideo } from "@/shared/types/youtube.types";
import { cn } from "@/shared/lib/cn";

interface VideoEmbedProps {
  video: YoutubeVideo;
  title?: string;
  autoplay?: boolean;
  className?: string;
}

export function VideoEmbed({
  video,
  title,
  autoplay = false,
  className,
}: VideoEmbedProps) {
  const t = useTranslations("videos");
  const [playing, setPlaying] = useState(false);
  const baseUrl = getYoutubeEmbedUrl(video.url);

  if (!baseUrl) {
    return (
      <a
        className={cn(
          "flex h-full w-full items-center justify-center bg-black px-4 text-center text-sm font-semibold text-white transition-colors hover:bg-neutral-900",
          className,
        )}
        href={video.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        {t("watchOnYoutube")}
      </a>
    );
  }

  if (!playing && !autoplay) {
    return <VideoPoster video={video} label={`${t("playVideo")}: ${title ?? video.title}`}
      className={className} onPlay={() => setPlaying(true)} />;
  }

  const embedUrl = autoplay || playing
    ? `${baseUrl}?autoplay=1&rel=0`
    : `${baseUrl}?rel=0`;

  return (
    <iframe
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className={cn("h-full w-full border-0", className)}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      src={embedUrl}
      title={title ?? video.title}
    />
  );
}
