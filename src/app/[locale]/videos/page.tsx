import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { VideoHub } from "@/features/videos/components/VideoHub";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { PageFrame } from "@/shared/components/layout/PageFrame";
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
    <FrameModule>
      <div className="grid overflow-hidden lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Skeleton className="aspect-video w-full rounded-none" />
        <div className="hidden border-l border-neutral-200 lg:block">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="flex gap-3 border-b border-neutral-200 p-3"
              key={index}
            >
              <Skeleton className="h-[4.25rem] w-[7.5rem] shrink-0 rounded-none" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </FrameModule>
  );
}

export default async function VideosPage({ params }: VideosPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageFrame>
      <Suspense fallback={<ListingFallback />}>
        <VideoHub />
      </Suspense>
    </PageFrame>
  );
}
