"use client";

import { useTranslations } from "next-intl";

import { VideoThumbnail } from "@/features/videos/components/VideoThumbnail";
import { ContentMetadata } from "@/shared/components/common/ContentMetadata";
import { HorizontalMediaRow } from "@/shared/components/common/HorizontalMediaRow";
import { cn } from "@/shared/lib/cn";
import type { YoutubeVideo } from "@/shared/types/youtube.types";

interface VideoPlaylistItemProps {
  video: YoutubeVideo;
  isActive: boolean;
  onSelect: (video: YoutubeVideo) => void;
}

export function VideoPlaylistItem({ video, isActive, onSelect }: VideoPlaylistItemProps) {
  const t = useTranslations("videosPage");
  return <li className="border-b border-neutral-200">
    <button type="button" aria-current={isActive ? "true" : undefined} onClick={() => onSelect(video)}
      className={cn("media-row-action w-full px-3 py-3 text-left transition-colors", isActive ? "bg-primary-100" : "hover:bg-neutral-50")}>
      <HorizontalMediaRow
        media={<>
          <VideoThumbnail video={{ ...video, format: "horizontal", posterLandscape: video.posterLandscape || video.posterPortrait }}
            sizes="(max-width: 1023px) 42vw, 152px" />
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-ink/20">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink">
              <svg className="ml-0.5 h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </span>
        </>}
        kicker={t("watchKicker")}
        title={<span className="media-row-heading">{video.title}</span>}
        metadata={<ContentMetadata durationLabel={video.durationLabel} />}
      />
    </button>
  </li>;
}
