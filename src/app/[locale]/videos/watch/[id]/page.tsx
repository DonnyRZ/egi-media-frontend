import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { VideoDetail } from "@/features/videos/components/VideoDetail";
import { VideoPageFrame } from "@/features/videos/components/VideoPageFrame";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string; slug: string }>;
}) {
  const p = await params;
  setRequestLocale(p.locale);
  return (
    <VideoPageFrame>
      <Suspense fallback={<div className="h-60 animate-pulse bg-[#050a16]" />}>
        <VideoDetail id={p.id} />
      </Suspense>
    </VideoPageFrame>
  );
}
