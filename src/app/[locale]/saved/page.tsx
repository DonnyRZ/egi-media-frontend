import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SavedArticlesHero } from "@/features/saved-articles/components/SavedArticlesHero";
import { SavedArticlesView } from "@/features/saved-articles/components/SavedArticlesView";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

interface SavedArticlesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: SavedArticlesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("savedTitle"),
    description: t("savedDescription"),
  };
}

function ViewFallback() {
  return (
    <Section className="pt-8 lg:pt-10">
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-64 w-full" key={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default async function SavedArticlesPage({
  params,
}: SavedArticlesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SavedArticlesHero />
      <Suspense fallback={<ViewFallback />}>
        <SavedArticlesView />
      </Suspense>
    </>
  );
}
