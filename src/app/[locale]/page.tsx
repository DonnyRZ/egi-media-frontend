import { setRequestLocale } from "next-intl/server";

import { HeroSection } from "@/features/hero-section/components/HeroSection";
import { Container } from "@/shared/components/layout/Container";
import { ContentFrame } from "@/shared/components/layout/ContentFrame";

import { BreakingNewsSection } from "@/features/breaking-news/components/BreakingNewsSection";

import { LatestNewsSection } from "@/features/latest-news/components/LatestNewsSection";

import { ForYouSection } from "@/features/for-you/components/ForYouSection";

import { CategoryNewsSection } from "@/features/category-news/components/CategoryNewsSection";

import { TopicNewsSection } from "@/features/topic-news/components/TopicNewsSection";

import { FeaturedSeriesSection } from "@/features/featured-series/components/FeaturedSeriesSection";

import { FeaturedVideosSection } from "@/features/featured-videos/components/FeaturedVideosSection";

import { EditorsPickSection } from "@/features/editors-pick/components/EditorsPickSection";

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
        <BreakingNewsSection />
        <LatestNewsSection />
        <EditorsPickSection />
        <CategoryNewsSection />
        <TopicNewsSection />
        <FeaturedSeriesSection />
        <FeaturedVideosSection />
        <ForYouSection />
      </ContentFrame>
    </Container>
  );
}
