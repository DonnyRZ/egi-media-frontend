import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SavedArticlesHero } from "@/features/saved-articles/components/SavedArticlesHero";
import { SavedArticlesView } from "@/features/saved-articles/components/SavedArticlesView";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { PageFrame } from "@/shared/components/layout/PageFrame";
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
    <>
      <FrameModule>
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="space-y-3 bg-white px-4 py-5 md:p-5" key={index}>
              <Skeleton className="aspect-[16/9] w-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </FrameModule>
      <FrameModule>
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="space-y-3 bg-white px-4 py-5 md:p-5" key={index}>
              <Skeleton className="aspect-[16/9] w-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </FrameModule>
    </>
  );
}

export default async function SavedArticlesPage({
  params,
}: SavedArticlesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageFrame>
      <SavedArticlesHero />
      <Suspense fallback={<ViewFallback />}>
        <SavedArticlesView />
      </Suspense>
    </PageFrame>
  );
}
