import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { VideosHero } from "@/features/videos/components/VideosHero";
import { VideosListing } from "@/features/videos/components/VideosListing";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

interface VideosPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: VideosPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("videosTitle"),
    description: t("videosDescription"),
  };
}

function ListingFallback() {
  return (
    <Section className="pt-8 lg:pt-10">
      <Container>
        <div className="grid overflow-hidden border border-neutral-200 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="hidden space-y-0 lg:block">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex gap-3 border-b border-neutral-200 p-3">
                <Skeleton className="h-[4.25rem] w-[7.5rem] shrink-0 rounded-none" />
                <div className="flex-1 space-y-2 py-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default async function VideosPage({ params }: VideosPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <VideosHero />
      <Suspense fallback={<ListingFallback />}>
        <VideosListing />
      </Suspense>
    </>
  );
}
