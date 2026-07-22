"use client";

import { useTranslations } from "next-intl";

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
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <Skeleton className="aspect-[16/9] w-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="space-y-4 lg:border-l lg:border-neutral-200 lg:pl-6">
        <Skeleton className="h-5 w-40" />
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
  const t = useTranslations("hero");

  const featured = data?.featured ?? null;
  const headlines = data?.headlines ?? [];
  const hasContent = Boolean(featured) || headlines.length > 0;

  return (
    <Section className="pt-8 lg:pt-12" ariaLabelledby="hero-heading">
      <Container>
        <h1 id="hero-heading" className="sr-only">
          {t("srHeading")}
        </h1>
        {isLoading ? <HeroSkeleton /> : null}
        {isError ? (
          <ErrorState
            message={error?.message}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError && !hasContent ? (
          <EmptyState title={t("noFeatured")} />
        ) : null}
        {!isLoading && !isError && hasContent ? (
          <div
            className={
              featured && headlines.length > 0
                ? "grid gap-8 lg:grid-cols-[2fr_1fr]"
                : "grid gap-8"
            }
          >
            {featured ? <HeroFeaturedCard article={featured} /> : null}
            {headlines.length > 0 ? (
              <HeroHeadlineList articles={headlines} />
            ) : null}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
