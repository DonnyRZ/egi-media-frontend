import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ForYouHero } from "@/features/for-you/components/ForYouHero";
import { ForYouListing } from "@/features/for-you/components/ForYouListing";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { PageFrame } from "@/shared/components/layout/PageFrame";
import { Skeleton } from "@/shared/components/ui/Skeleton";

interface ForYouPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ForYouPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("forYouTitle"),
    description: t("forYouDescription"),
  };
}

function ListingFallback() {
  return (
    <FrameModule>
      <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="editorial-gutter space-y-3 bg-white px-4 py-5 md:p-5" key={index}>
            <Skeleton className="aspect-[16/9] w-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </FrameModule>
  );
}

export default async function ForYouPage({ params }: ForYouPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageFrame>
      <ForYouHero />
      <Suspense fallback={<ListingFallback />}>
        <ForYouListing />
      </Suspense>
    </PageFrame>
  );
}
