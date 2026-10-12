"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { VideoEmbed } from "@/features/videos/components/VideoEmbed";
import { GridFillers } from "@/shared/components/common/GridFillers";
import { AdaptiveCardGrid } from "@/shared/components/common/AdaptiveCardGrid";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useFeaturedVideos } from "@/features/homepage/hooks/useFeaturedVideos";
import { useHeroNews } from "@/features/homepage/hooks/useHeroNews";
import type { YoutubeVideo } from "@/shared/types/youtube.types";

function VideoCard({ video }: { video: YoutubeVideo }) {
  const t = useTranslations("videos");

  return (
    <article className="group flex h-full flex-col bg-white">
      <div className="relative aspect-video overflow-hidden bg-ink">
        <VideoEmbed video={video} />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="kicker">{t("kicker")}</span>
          {video.durationLabel ? (
            <span className="text-xs font-medium text-neutral-500">
              {video.durationLabel}
            </span>
          ) : null}
        </div>
        <h3 className="mt-1 font-sans text-lg font-bold leading-snug text-ink group-hover:text-accent">
          <Link href={`/videos/watch/${video.id}`}>
            {video.title}
          </Link>
        </h3>
        {video.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{video.description}</p>
        ) : null}
      </div>
    </article>
  );
}

export function FeaturedVideosSection() {
  const { data, isLoading, isError, error, refetch } = useFeaturedVideos();
  const hero = useHeroNews();
  const remaining = data ? { ...data, items: data.items.slice(hero.data?.featured ? 1 : 0) } : undefined;
  const t = useTranslations("videos");

  if (!isLoading && !isError && !remaining?.items.length) {
    return null;
  }

  return (
    <FrameModule ariaLabelledby="videos-heading">
      <FrameHeading
        actionHref="/videos"
        id="videos-heading"
        subtitle={t("subtitle")}
        title={t("title")}
      />

      {isLoading ? (
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="bg-white" key={index}>
              <Skeleton className="aspect-video w-full" />
            </div>
          ))}
          <GridFillers count={3} />
        </div>
      ) : null}

      {isError ? (
        <div className="bg-white p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      ) : null}

      {!isLoading && !isError && remaining?.items.length ? (
        <AdaptiveCardGrid items={remaining.items} keyForItem={(video) => video.id}
          renderItem={(video) => <VideoCard video={video} />} />
      ) : null}
    </FrameModule>
  );
}
