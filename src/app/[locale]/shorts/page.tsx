import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { VideoHub } from "@/features/videos/components/VideoHub";
import { PageFrame } from "@/shared/components/layout/PageFrame";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string; slug: string }>;
}) {
  const p = await params;
  setRequestLocale(p.locale);
  return (
    <PageFrame>
      <Suspense fallback={<div className="h-60 animate-pulse bg-[#050a16]" />}>
        <VideoHub shorts />
      </Suspense>
    </PageFrame>
  );
}
