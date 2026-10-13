"use client";

import { HeroFeaturedCard } from "@/features/hero-section/components/HeroFeaturedCard";
import { HeroHeadlineList } from "@/features/hero-section/components/HeroHeadlineList";
import { HeroLatestList } from "@/features/hero-section/components/HeroLatestList";
import { HeroVideo } from "@/features/hero-section/components/HeroVideo";
import type { Article } from "@/shared/types/article.types";
import type { YoutubeVideo } from "@/shared/types/youtube.types";

interface EditorialLeadProps {
  lead: Article;
  supporting: Article[];
  latest?: Article[];
  video?: YoutubeVideo;
  latestHref?: string | null;
  latestTitle?: string;
  latestHeadingId?: string;
}
export function EditorialLead({
  lead,
  supporting,
  latest = [],
  video,
  latestHref,
  latestTitle,
  latestHeadingId,
}: EditorialLeadProps) {
  const full = supporting.length >= 2 && (Boolean(video) || latest.length >= 3);
  const hasSidebar = Boolean(video) || latest.length > 0;
  const layout = full ? "full" : supporting.length ? "support" : hasSidebar ? "sidebar" : "single";
  return (
    <>
      <div
        className="news-lead-grid"
        data-layout={layout}
        data-video={Boolean(video)}
        data-latest={latest.length > 0}
        data-sidebar={hasSidebar}
      >
        <div className="news-lead-lead min-w-0 bg-white">
          <HeroFeaturedCard article={lead} />
        </div>
        {supporting.length ? (
          <div className="news-lead-headlines min-w-0 bg-white">
            <HeroHeadlineList articles={supporting} />
          </div>
        ) : null}
        {hasSidebar ? (
          <div className="news-lead-sidebar min-w-0 bg-white">
            {video ? <div className="news-lead-video min-w-0">
              <HeroVideo video={video} />
            </div> : null}
            {latest.length ? <div className="news-lead-latest min-w-0">
              <HeroLatestList articles={latest} allHref={latestHref} title={latestTitle} headingId={latestHeadingId} />
            </div> : null}
          </div>
        ) : null}
      </div>
    </>
  );
}
