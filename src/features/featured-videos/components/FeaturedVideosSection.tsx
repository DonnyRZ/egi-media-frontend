"use client";

import { useTranslations } from "next-intl";

import { VideoEmbed } from "@/features/videos/components/VideoEmbed";
import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useFeaturedVideos } from "@/features/homepage/hooks/useFeaturedVideos";
import type { YoutubeVideo } from "@/shared/types/youtube.types";

function VideoCard({ video }: { video: YoutubeVideo }) {
  const t = useTranslations("videos");

  return (
    <article className="group">
      <div className="relative aspect-video overflow-hidden bg-ink">
        <VideoEmbed video={video} />
      </div>
      <div className="pt-3">
        <div className="flex items-center gap-2">
          <span className="kicker">{t("kicker")}</span>
          {video.durationLabel ? (
            <span className="text-xs font-medium text-neutral-500">
              {video.durationLabel}
            </span>
          ) : null}
        </div>
        <h3 className="mt-1 font-serif text-lg font-bold leading-snug text-ink group-hover:text-accent">
          <a href={video.url} rel="noopener noreferrer" target="_blank">
            {video.title}
          </a>
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
  const t = useTranslations("videos");

  return (
    <Section ariaLabelledby="videos-heading" className="bg-neutral-50">
      <Container>
        <SectionHeading
          actionHref="/videos"
          id="videos-heading"
          subtitle={t("subtitle")}
          title={t("title")}
        />

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="aspect-video w-full rounded-xl" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && !data?.items.length ? (
          <EmptyState message={t("empty")} />
        ) : null}

        {!isLoading && !isError && data?.items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
