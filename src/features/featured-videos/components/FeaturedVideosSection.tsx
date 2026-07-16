"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { FALLBACK_VIDEO_THUMBNAIL } from "@/shared/constants/site.constants";
import { useFeaturedVideos } from "@/features/homepage/hooks/useFeaturedVideos";
import type { YoutubeVideo } from "@/shared/types/youtube.types";

function VideoCard({ video }: { video: YoutubeVideo }) {
  const [thumbnail, setThumbnail] = useState(
    video.thumbnailUrl ?? FALLBACK_VIDEO_THUMBNAIL,
  );

  return (
    <article className="overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm">
      <div className="relative aspect-video overflow-hidden">
        <Image
          alt={video.title}
          className="object-cover"
          fill
          onError={() => setThumbnail(FALLBACK_VIDEO_THUMBNAIL)}
          sizes="(max-width: 768px) 100vw, 33vw"
          src={thumbnail}
        />
        {video.durationLabel ? (
          <span className="absolute bottom-3 right-3 rounded bg-primary-900/90 px-2 py-1 text-xs font-semibold text-white">
            {video.durationLabel}
          </span>
        ) : null}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-neutral-900 hover:text-primary-700">
          <Link href={video.url} rel="noopener noreferrer" target="_blank">
            {video.title}
          </Link>
        </h3>
        {video.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-neutral-700">{video.description}</p>
        ) : null}
      </div>
    </article>
  );
}

export function FeaturedVideosSection() {
  const { data, isLoading, isError, error, refetch } = useFeaturedVideos();

  return (
    <Section ariaLabelledby="videos-heading" className="bg-white">
      <Container>
        <SectionHeading
          id="videos-heading"
          subtitle="Watch our latest video reporting and interviews."
          title="Featured Videos"
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
          <EmptyState message="Videos will appear here once available." />
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
