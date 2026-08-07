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
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { VIDEOS_PAGE_LIMIT } from "@/shared/constants/videos.constants";
import type { YoutubeVideo } from "@/shared/types/youtube.types";

function StageSkeleton() {
  return (
    <Section className="pt-8 lg:pt-10">
      <Container>
        <div className="grid overflow-hidden border border-neutral-200 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="hidden lg:block">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex gap-3 border-b border-neutral-200 p-3">
                <Skeleton className="h-[4.25rem] w-[7.5rem] shrink-0 rounded-none" />
                <div className="flex-1 space-y-2 py-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
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

  return (
    <Section ariaLabelledby="videos-listing-heading" className="pt-8 lg:pt-10">
      <Container>
        <h2 id="videos-listing-heading" className="sr-only">
          {t("listingHeading")}
        </h2>

        <div className="grid overflow-hidden border border-neutral-200 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="relative aspect-video bg-ink">
            <VideoEmbed key={active.id} autoplay={autoplay} video={active} />
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 border-l border-neutral-200">
              <VideoPlaylist
                activeId={active.id}
                videos={videos}
                onSelect={handleSelect}
              />
            </div>
          </div>
        </div>

        <div className="h-[22rem] border border-t-0 border-neutral-200 lg:hidden">
          <VideoPlaylist
            activeId={active.id}
            videos={videos}
            onSelect={handleSelect}
          />
        </div>

        <VideoStageMeta video={active} />

        {moreVideos.length > 0 ? (
          <div className="mt-4 border-t border-neutral-200 pt-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h3 className="text-lg font-bold uppercase tracking-wide text-ink">
                {t("moreVideos")}
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {t("videoCount", { count: total })}
              </p>
            </div>
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {moreVideos.map((video) => (
                <VideoGridCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        ) : null}

        <Pagination
          basePath="/videos"
          className="mt-10"
          currentPage={page}
          itemLabel="videos"
          pageSize={limit || VIDEOS_PAGE_LIMIT}
          totalItems={total}
          totalPages={totalPages}
        />
      </Container>
    </Section>
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
      <Section>
        <Container>
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </Container>
      </Section>
    );
  }

  if (!data?.items.length) {
    return (
      <Section>
        <Container>
          <EmptyState message={t("empty")} />
        </Container>
      </Section>
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
