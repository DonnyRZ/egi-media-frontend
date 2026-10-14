"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { VideoEmbed } from "@/features/videos/components/VideoEmbed";
import { HomepageAdSkeleton } from "@/features/ads/components/HomepageAdSkeleton";
import { HomepageAdGrid } from "@/features/ads/components/HomepageAdGrid";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { useFeaturedVideos } from "@/features/homepage/hooks/useFeaturedVideos";
import { useHeroNews } from "@/features/homepage/hooks/useHeroNews";
import { HOMEPAGE_LIMITS } from "@/shared/constants/homepage.constants";
import type { YoutubeVideo } from "@/shared/types/youtube.types";

function VideoCard({ video }: { video: YoutubeVideo }) {
  const t = useTranslations("videos");

  return (
    <article className="homepage-video-content group flex h-full flex-col bg-white">
      <div className="relative aspect-video overflow-hidden bg-ink">
        <VideoEmbed video={video} />
      </div>
      <div className="homepage-video-copy p-4">
        <div className="flex items-center gap-2">
          <span className="kicker">{t("kicker")}</span>
          {video.durationLabel ? (
            <span className="text-xs font-medium text-neutral-500">
              {video.durationLabel}
            </span>
          ) : null}
        </div>
        <h3 className="editorial-card-title mt-1 font-sans text-lg font-bold leading-snug text-ink group-hover:text-accent">
          <Link href={`/videos/watch/${video.id}`}>
            {video.title}
          </Link>
        </h3>
        {video.description ? (
          <p className="editorial-summary mt-2 line-clamp-2 text-sm text-neutral-600">{video.description}</p>
        ) : null}
      </div>
    </article>
  );
}

export function FeaturedVideosSection() {
  const { data, isLoading, isError, error, refetch } = useFeaturedVideos();
  const hero = useHeroNews();
  const heroVideoId = hero.data?.featured ? data?.items[0]?.id : undefined;
  const remaining = data
    ? {
        ...data,
        items: data.items
          .filter((video) => video.id !== heroVideoId)
          .slice(0, HOMEPAGE_LIMITS.latestVideos),
      }
    : undefined;
  const t = useTranslations("videos");


  return (
    <FrameModule ariaLabelledby="videos-heading" className="homepage-latest-videos">
      <FrameHeading
        actionHref="/videos"
        id="videos-heading"
        subtitle={t("subtitle")}
        title={t("latestTitle")}
      />

      {isError ? (
        <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      ) : null}

      {isLoading ? <HomepageAdSkeleton placement="LATEST_VIDEOS" /> : <HomepageAdGrid placement="LATEST_VIDEOS" items={remaining?.items ?? []} keyForItem={(video) => video.id}
        renderItem={(video) => <VideoCard video={video} />} />}
    </FrameModule>
  );
}
