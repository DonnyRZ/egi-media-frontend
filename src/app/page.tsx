import dynamic from "next/dynamic";

import { HeroSection } from "@/features/hero-section/components/HeroSection";
import { WorldClock } from "@/features/world-clock/components/WorldClock";

const BreakingNewsSection = dynamic(
  () =>
    import("@/features/breaking-news/components/BreakingNewsSection").then(
      (module) => module.BreakingNewsSection,
    ),
  { loading: () => null },
);

const LatestNewsSection = dynamic(
  () =>
    import("@/features/latest-news/components/LatestNewsSection").then(
      (module) => module.LatestNewsSection,
    ),
  { loading: () => null },
);

const NewsletterSection = dynamic(
  () =>
    import("@/features/newsletter/components/NewsletterSection").then(
      (module) => module.NewsletterSection,
    ),
  { loading: () => null },
);

const FeaturedSeriesSection = dynamic(
  () =>
    import("@/features/featured-series/components/FeaturedSeriesSection").then(
      (module) => module.FeaturedSeriesSection,
    ),
  { loading: () => null },
);

const FeaturedVideosSection = dynamic(
  () =>
    import("@/features/featured-videos/components/FeaturedVideosSection").then(
      (module) => module.FeaturedVideosSection,
    ),
  { loading: () => null },
);

const EditorsPickSection = dynamic(
  () =>
    import("@/features/editors-pick/components/EditorsPickSection").then(
      (module) => module.EditorsPickSection,
    ),
  { loading: () => null },
);

export default function HomePage() {
  return (
    <>
      <WorldClock />
      <HeroSection />
      <BreakingNewsSection />
      <LatestNewsSection />
      <NewsletterSection />
      <FeaturedSeriesSection />
      <FeaturedVideosSection />
      <EditorsPickSection />
    </>
  );
}
