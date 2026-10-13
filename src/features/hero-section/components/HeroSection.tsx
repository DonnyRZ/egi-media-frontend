"use client";

import { useTranslations } from "next-intl";
import { useHeroNews } from "@/features/homepage/hooks/useHeroNews";
import { useFeaturedVideos } from "@/features/homepage/hooks/useFeaturedVideos";
import { useBreakingNews } from "@/features/homepage/hooks/useBreakingNews";
import { EditorialLead } from "@/shared/components/common/EditorialLead";
import { HomepageSectionNotice } from "@/features/homepage/components/HomepageSectionNotice";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function HeroSkeleton() {
  return <div className="news-lead-grid" data-layout="full" data-video="true" data-latest="true" aria-hidden="true">
    {(["lead", "latest", "headlines", "video"] as const).map((area) =>
      <div key={area} className={`news-lead-${area} space-y-3 bg-white px-4 py-5 md:p-5`}>
        {area !== "latest" ? <Skeleton className="aspect-video w-full" /> : null}
        <Skeleton className="h-5 w-28" /><Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>)}
  </div>;
}

export function HeroSection() {
  const { data, isLoading, isError, error, refetch, sectionFailed } = useHeroNews();
  const videos = useFeaturedVideos();
  const trending = useBreakingNews();
  const t = useTranslations("hero");
  const trendingText = useTranslations("breaking");
  const headlines = data?.headlines ?? [];
  const latest = trending.data?.items ?? [];
  const video = videos.data?.items[0];


  return <FrameModule ariaLabelledby="hero-heading" className="homepage-lead">
    <h1 id="hero-heading" className="sr-only">{t("srHeading")}</h1>
    {isLoading ? <HeroSkeleton /> : null}
    {isError ? <div className="editorial-gutter px-4 py-5 md:p-5"><ErrorState message={error?.message} onRetry={() => void refetch()} /></div> : null}
    <HomepageSectionNotice section="hero" />
    {!isLoading && !isError && !sectionFailed && !data?.featured ? <div className="editorial-gutter px-4 py-5 md:p-5"><EmptyState title={t("noFeatured")} /></div> : null}
    {!isLoading && !isError && data?.featured ? <EditorialLead lead={data.featured} supporting={headlines} latest={latest} latestTitle={trendingText("title")} latestHeadingId="hero-trending-heading" latestHref={null} video={video?.format !== "short" ? video : undefined} /> : null}
  </FrameModule>;
}
