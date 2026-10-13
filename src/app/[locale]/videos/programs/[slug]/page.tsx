import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { VideoProgram } from "@/features/videos/components/VideoProgram";
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
        <VideoProgram slug={p.slug} />
      </Suspense>
    </VideoPageFrame>
  );
}
