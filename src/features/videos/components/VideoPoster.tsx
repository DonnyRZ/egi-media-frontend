"use client";

import { VideoThumbnail } from "@/features/videos/components/VideoThumbnail";
import type { YoutubeVideo } from "@/shared/types/youtube.types";
import { cn } from "@/shared/lib/cn";

interface VideoPosterProps {
  video: YoutubeVideo;
  label: string;
  onPlay: () => void;
  className?: string;
  sizes?: string;
}

export function VideoPoster({ video, label, onPlay, className, sizes = "(max-width: 767px) 100vw, 480px" }: VideoPosterProps) {
  return <button type="button" aria-label={label}
    className={cn("relative flex h-full w-full items-center justify-center overflow-hidden bg-ink bg-cover bg-center text-white focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white", className)}
    onClick={onPlay}>
    <VideoThumbnail video={video} sizes={sizes} priority />
    <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-black/50" aria-hidden="true">
      <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
    </span>
    {video.durationLabel ? <span className="absolute bottom-3 left-3 bg-black/70 px-2 py-1 text-xs font-semibold">{video.durationLabel}</span> : null}
  </button>;
}
