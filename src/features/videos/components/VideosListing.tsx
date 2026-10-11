"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { VideoEmbed } from "@/features/videos/components/VideoEmbed";
import {
  VideoGridCard,
  VideoPlaylist,
  VideoStageMeta,
} from "@/features/videos/components/VideoPlaylist";
import { useVideosPage } from "@/features/videos/hooks/useVideosPage";
import { AdaptiveCardGrid } from "@/shared/components/common/AdaptiveCardGrid";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { VIDEOS_PAGE_LIMIT } from "@/shared/constants/videos.constants";
import { cn } from "@/shared/lib/cn";
import type { YoutubeVideo } from "@/shared/types/youtube.types";

function StageSkeleton() {
  return (
    <FrameModule>
      <div className="grid overflow-hidden lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Skeleton className="aspect-video w-full rounded-none" />
        <div className="hidden border-l border-neutral-200 lg:block">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              className="flex gap-3 border-b border-neutral-200 p-3"
              key={index}
            >
              <Skeleton className="aspect-video w-[7.5rem] shrink-0 self-start rounded-none" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </FrameModule>
  );
}

function VideoStage({
  videos,
  page,
  total,
  totalPages,
  limit,
}: {
  videos: YoutubeVideo[];
  page: number;
  total: number;
  totalPages: number;
  limit: number;
}) {
  const [active, setActive] = useState(videos[0]);
  const [autoplay, setAutoplay] = useState(false);
  const t = useTranslations("videosPage");

  useEffect(() => {
    setActive(videos[0]);
    setAutoplay(false);
  }, [videos]);

  function handleSelect(video: YoutubeVideo) {
    setActive(video);
    setAutoplay(true);
  }

  const moreVideos = videos.filter((video) => video.id !== active.id);
  const hasPlaylist = videos.length > 1;

  return (
    <FrameModule ariaLabelledby="videos-listing-heading">
      <h2 className="sr-only" id="videos-listing-heading">
        {t("listingHeading")}
      </h2>

      <div
        className={cn(
          "grid overflow-hidden",
          hasPlaylist && "lg:grid-cols-[minmax(0,1fr)_22rem]",
        )}
      >
        <div className="relative aspect-video bg-ink">
          <VideoEmbed key={active.id} autoplay={autoplay} video={active} />
        </div>

        {hasPlaylist ? (
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 border-l border-neutral-200">
              <VideoPlaylist
                activeId={active.id}
                videos={videos}
                onSelect={handleSelect}
              />
            </div>
          </div>
        ) : null}
      </div>

      {hasPlaylist ? (
        <div className="h-[22rem] border-t border-neutral-200 lg:hidden">
          <VideoPlaylist
            activeId={active.id}
            videos={videos}
            onSelect={handleSelect}
          />
        </div>
      ) : null}

      <div className="border-t border-neutral-200 bg-white px-5">
        <VideoStageMeta video={active} />
      </div>

      {moreVideos.length > 0 ? (
        <>
          <FrameHeading
            id="videos-more-heading"
            subtitle={t("videoCount", { count: total })}
            title={t("moreVideos")}
          />
          <AdaptiveCardGrid
            items={moreVideos}
            keyForItem={(video) => video.id}
            renderItem={(video) => <VideoGridCard video={video} />}
          />
        </>
      ) : null}

      {totalPages > 1 ? (
        <div className="bg-white p-5">
          <Pagination
            basePath="/videos"
            currentPage={page}
            itemLabel="videos"
            pageSize={limit || VIDEOS_PAGE_LIMIT}
            totalItems={total}
            totalPages={totalPages}
          />
        </div>
      ) : null}
    </FrameModule>
  );
}

export function VideosListing() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const { data, isLoading, isError, error, refetch } = useVideosPage(page);
  const t = useTranslations("videosPage");

  if (isLoading) return <StageSkeleton />;

  if (isError) {
    return (
      <FrameModule>
        <div className="bg-white p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      </FrameModule>
    );
  }

  if (!data?.items.length) {
    return (
      <FrameModule>
        <div className="bg-white p-5">
          <EmptyState message={t("empty")} />
        </div>
      </FrameModule>
    );
  }

  return (
    <VideoStage
      limit={data.limit}
      page={data.page}
      total={data.total}
      totalPages={data.totalPages}
      videos={data.items}
    />
  );
}
