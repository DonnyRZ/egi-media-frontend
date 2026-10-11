"use client";

import { useTranslations } from "next-intl";
import { useHeroNews } from "@/features/homepage/hooks/useHeroNews";
import { useFeaturedVideos } from "@/features/homepage/hooks/useFeaturedVideos";
import { HeroFeaturedCard } from "@/features/hero-section/components/HeroFeaturedCard";
import { HeroHeadlineList } from "@/features/hero-section/components/HeroHeadlineList";
import { HeroLatestList } from "@/features/hero-section/components/HeroLatestList";
import { HeroVideo } from "@/features/hero-section/components/HeroVideo";
import { HomepageSectionNotice } from "@/features/homepage/components/HomepageSectionNotice";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function HeroSkeleton() {
  return <div className="news-lead-grid" aria-hidden="true">
    {(["lead", "latest", "headlines", "video"] as const).map((area) =>
      <div key={area} className={`news-lead-${area} space-y-3 bg-white p-5`}>
        {area !== "latest" ? <Skeleton className="aspect-video w-full" /> : null}
        <Skeleton className="h-5 w-28" /><Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>)}
  </div>;
}

export function HeroSection() {
  const { data, isLoading, isError, error, refetch, sectionFailed } = useHeroNews();
  const videos = useFeaturedVideos();
  const t = useTranslations("hero");
  const headlines = data?.headlines ?? [];
  const latest = data?.latest ?? [];
  const video = videos.data?.items[0];
  const hasRight = latest.length > 0 || Boolean(video) || videos.isError;
  const layout = headlines.length > 0 && hasRight ? "full"
    : headlines.length > 0 ? "support" : hasRight ? "sidebar" : "single";

  return <FrameModule ariaLabelledby="hero-heading">
    <h1 id="hero-heading" className="sr-only">{t("srHeading")}</h1>
    {isLoading ? <HeroSkeleton /> : null}
    {isError ? <div className="p-5"><ErrorState message={error?.message} onRetry={() => void refetch()} /></div> : null}
    <HomepageSectionNotice section="hero" />
    {!isLoading && !isError && !sectionFailed && !data?.featured ? <div className="p-5"><EmptyState title={t("noFeatured")} /></div> : null}
    {!isLoading && !isError && data?.featured ? <div className="news-lead-grid" data-layout={layout}
      data-video={Boolean(video) || videos.isError} data-latest={latest.length > 0}>
      <div className="news-lead-lead min-w-0 bg-white"><HeroFeaturedCard article={data.featured} /></div>
      {latest.length > 0 ? <div className="news-lead-latest min-w-0 bg-white"><HeroLatestList articles={latest} /></div> : null}
      {headlines.length > 0 ? <div className="news-lead-headlines min-w-0 bg-white"><HeroHeadlineList articles={headlines} /></div> : null}
      {video || videos.isError ? <div className="news-lead-video min-w-0 bg-white">
        {videos.isError ? <div className="p-5"><ErrorState onRetry={() => void videos.refetch()} /></div> : <HeroVideo video={video!} />}
      </div> : null}
    </div> : null}
  </FrameModule>;
}
