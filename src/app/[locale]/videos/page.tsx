import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { VideoHub } from "@/features/videos/components/VideoHub";
import { VideoHeroSkeleton } from "@/features/videos/components/VideoHeroStage";
import { VideoPageFrame } from "@/features/videos/components/VideoPageFrame";


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
  return <div className="editorial-gutter px-4 py-6 md:px-6 lg:px-8">
    <div className="mb-6 h-8 w-28 animate-pulse bg-white/10" />
    <VideoHeroSkeleton />
  </div>;
}

export default async function VideosPage({ params }: VideosPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <VideoPageFrame>
      <Suspense fallback={<ListingFallback />}>
        <VideoHub />
      </Suspense>
    </VideoPageFrame>
  );
}
