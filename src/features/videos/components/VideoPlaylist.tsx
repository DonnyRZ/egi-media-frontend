"use client";

import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";

import { DATE_FORMAT } from "@/shared/constants/format.constants";
import type { YoutubeVideo } from "@/shared/types/youtube.types";
import { cn } from "@/shared/lib/cn";

interface VideoPlaylistProps {
  videos: YoutubeVideo[];
  activeId: string;
  onSelect: (video: YoutubeVideo) => void;
  className?: string;
}

export function VideoPlaylist({
  videos,
  activeId,
  onSelect,
  className,
}: VideoPlaylistProps) {
  const t = useTranslations("videosPage");

  return (
    <aside
      aria-label={t("playlistLabel")}
      className={cn("flex h-full min-h-0 flex-col bg-white", className)}
    >
      <div className="shrink-0 border-b border-neutral-200 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
          {t("playlistLabel")}
        </p>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {videos.map((video) => {
          const isActive = video.id === activeId;

          return (
            <li key={video.id} className="border-b border-neutral-200">
              <button
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex w-full gap-3 px-3 py-3 text-left transition-colors",
                  isActive ? "bg-primary-100" : "hover:bg-neutral-50",
                )}
                type="button"
                onClick={() => onSelect(video)}
              >
                <span className="relative h-[4.25rem] w-[7.5rem] shrink-0 overflow-hidden bg-neutral-100">
                  {video.thumbnailUrl ? (
                    <Image
                      alt=""
                      className="object-cover"
                      fill
                      sizes="120px"
                      src={video.thumbnailUrl}
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center bg-ink/20"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink shadow-sm">
                      <svg className="ml-0.5 h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </span>
                <span className="min-w-0 flex-1 py-0.5">
                  {video.durationLabel ? (
                    <span className="mb-1 flex items-center gap-1 text-[11px] font-medium text-neutral-500">
                      <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      {video.durationLabel}
                    </span>
                  ) : (
                    <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                      {t("watchKicker")}
                    </span>
                  )}
                  <span
                    className={cn(
                      "line-clamp-3 text-sm font-semibold leading-snug",
                      isActive ? "text-primary-900" : "text-ink",
                    )}
                  >
                    {video.title}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export function VideoStageMeta({ video }: { video: YoutubeVideo }) {
  const format = useFormatter();
  const t = useTranslations("videosPage");

  return (
    <div className="py-6 sm:py-8">
      {video.publishedAt ? (
        <time
          className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
          dateTime={video.publishedAt}
        >
          {format.dateTime(new Date(video.publishedAt), DATE_FORMAT)}
        </time>
      ) : null}
      <h2 className="mt-2 max-w-4xl font-serif text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
        {video.title}
      </h2>
      {video.description ? (
        <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-700 sm:text-base">
          {video.description}
        </p>
      ) : null}
      <a
        className="mt-5 inline-flex text-sm font-semibold text-primary-700 transition-colors hover:text-accent"
        href={video.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        {t("watchOnYoutube")}
      </a>
    </div>
  );
}

export function VideoGridCard({ video }: { video: YoutubeVideo }) {
  const format = useFormatter();
  const t = useTranslations("videosPage");

  return (
    <article className="group flex h-full flex-col bg-white">
      <a
        className="relative block aspect-video overflow-hidden bg-neutral-100"
        href={video.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        {video.thumbnailUrl ? (
          <Image
            alt={video.title}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            src={video.thumbnailUrl}
          />
        ) : (
          <span className="flex h-full items-center justify-center bg-ink text-xs font-semibold uppercase tracking-wide text-white">
            {t("watchKicker")}
          </span>
        )}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover:bg-ink/25"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-ink opacity-90 shadow-sm transition-transform group-hover:scale-110">
            <svg className="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </a>
      <div className="flex flex-1 flex-col p-4">
        {video.publishedAt ? (
          <time
            className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
            dateTime={video.publishedAt}
          >
            {format.dateTime(new Date(video.publishedAt), DATE_FORMAT)}
          </time>
        ) : null}
        <h3 className="mt-1.5 line-clamp-2 font-serif text-base font-bold leading-snug text-ink transition-colors group-hover:text-accent sm:text-lg">
          <a href={video.url} rel="noopener noreferrer" target="_blank">
            {video.title}
          </a>
        </h3>
        {video.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-neutral-600">
            {video.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}
