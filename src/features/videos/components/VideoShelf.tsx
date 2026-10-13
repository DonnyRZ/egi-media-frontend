"use client";
import { Link } from "@/i18n/navigation";
import { ScrollShelf } from "@/features/videos/components/ScrollShelf";
import { VideoThumbnail } from "@/features/videos/components/VideoThumbnail";
import type { YoutubeVideo } from "@/shared/types/youtube.types";
export function VideoShelf({
  title,
  videos,
}: {
  title: string;
  videos: YoutubeVideo[];
}) {
  if (!videos.length) return null;
  return (
    <ScrollShelf title={title}>
      {videos.map((video) => (
        <Link
          key={video.id}
          href={`/videos/watch/${video.id}`}
          className={`w-[82%] shrink-0 snap-start overflow-hidden rounded-lg border border-white/25 sm:w-[45%] ${video.format === "short" ? "lg:w-[23%]" : "lg:w-[31.8%]"}`}
        >
          <div
            className={`relative bg-neutral-900 ${video.format === "short" ? "aspect-[9/16]" : "aspect-video"}`}
          >
            <VideoThumbnail
              alt=""
              video={video}
              sizes="(max-width:767px) 80vw, 440px"
            />
            <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/75 px-3 py-2 text-sm">
              ▶ {video.durationLabel}
            </span>
          </div>
          <h3 className="editorial-list-title p-4 text-lg font-semibold leading-snug">
            {video.title}
          </h3>
        </Link>
      ))}
    </ScrollShelf>
  );
}
