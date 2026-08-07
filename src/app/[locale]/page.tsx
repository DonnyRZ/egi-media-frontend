import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";

import { HeroSection } from "@/features/hero-section/components/HeroSection";
import { Container } from "@/shared/components/layout/Container";
import { ContentFrame } from "@/shared/components/layout/ContentFrame";

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

const ForYouSection = dynamic(
  () =>
    import("@/features/for-you/components/ForYouSection").then(
      (module) => module.ForYouSection,
    ),
  { loading: () => null },
);

const CategoryNewsSection = dynamic(
  () =>
    import("@/features/category-news/components/CategoryNewsSection").then(
      (module) => module.CategoryNewsSection,
    ),
  { loading: () => null },
);

const TopicNewsSection = dynamic(
  () =>
    import("@/features/topic-news/components/TopicNewsSection").then(
      (module) => module.TopicNewsSection,
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

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container className="py-0">
      <ContentFrame>
        <HeroSection />
        <EditorsPickSection />
        <BreakingNewsSection />
        <LatestNewsSection />
        <CategoryNewsSection />
        <TopicNewsSection />
        <FeaturedSeriesSection />
        <FeaturedVideosSection />
        <ForYouSection />
      </ContentFrame>
    </Container>
  );
}
