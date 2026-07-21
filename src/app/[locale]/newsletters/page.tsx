import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { NewslettersHero } from "@/features/newsletters/components/NewslettersHero";
import { NewslettersView } from "@/features/newsletters/components/NewslettersView";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

interface NewslettersPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: NewslettersPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("newslettersTitle"),
    description: t("newslettersDescription"),
  };
}

function ViewFallback() {
  return (
    <Section>
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-40 w-full" key={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default async function NewslettersPage({
  params,
}: NewslettersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <NewslettersHero />
      <Suspense fallback={<ViewFallback />}>
        <NewslettersView />
      </Suspense>
    </>
  );
}
