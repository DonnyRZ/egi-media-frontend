import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SearchResultsView } from "@/features/search/components/SearchResultsView";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { PageFrame } from "@/shared/components/layout/PageFrame";
import { Skeleton } from "@/shared/components/ui/Skeleton";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("searchTitle"),
    description: t("searchDescription"),
  };
}

function SearchFallback() {
  return (
    <PageFrame>
      <FrameModule>
        <div className="bg-white px-5 py-6 lg:py-8">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-10 w-2/3" />
          <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
        </div>
      </FrameModule>
      <FrameModule>
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3 bg-white p-5">
              <Skeleton className="aspect-[16/10] w-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </FrameModule>
    </PageFrame>
  );
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchResultsView />
    </Suspense>
  );
}
