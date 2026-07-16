"use client";

import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useHeroNews } from "@/features/homepage/hooks/useHeroNews";
import { HeroFeaturedCard } from "@/features/hero-section/components/HeroFeaturedCard";
import { HeroHeadlineList } from "@/features/hero-section/components/HeroHeadlineList";

function HeroSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
      <div className="space-y-4 rounded-xl border border-neutral-300 bg-white p-5">
        <Skeleton className="h-4 w-32" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2 border-b border-neutral-200 pb-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  const { data, isLoading, isError, error, refetch } = useHeroNews();

  return (
    <Section className="pt-8 lg:pt-12" ariaLabelledby="hero-heading">
      <Container>
        <h1 id="hero-heading" className="sr-only">
          Featured News
        </h1>
        {isLoading ? <HeroSkeleton /> : null}
        {isError ? (
          <ErrorState
            message={error?.message}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError && !data?.featured ? (
          <EmptyState title="No featured story" />
        ) : null}
        {!isLoading && !isError && data?.featured ? (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <HeroFeaturedCard article={data.featured} />
            <HeroHeadlineList articles={data.headlines} />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
