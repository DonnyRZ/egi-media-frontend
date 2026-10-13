"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { VideoEmbed } from "@/features/videos/components/VideoEmbed";
import type { YoutubeVideo } from "@/shared/types/youtube.types";

export function HeroVideo({ video }: { video: YoutubeVideo }) {
  const t = useTranslations("videos");
  return <section className="editorial-gutter mx-auto p-4 md:max-w-[560px] min-[1200px]:p-5" aria-labelledby="hero-video-heading">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 id="hero-video-heading" className="editorial-section-title text-lg font-bold text-ink">{t("title")}</h2>
      <Link href="/videos" className="text-xs font-semibold underline underline-offset-4">{t("viewAll")}</Link>
    </div>
    <div className="aspect-video overflow-hidden bg-ink"><VideoEmbed key={video.id} video={video} /></div>
    <h3 className="editorial-card-title mt-3 text-lg font-bold leading-snug tracking-tight text-ink">
      <Link className="headline-link" href={`/videos/watch/${video.id}`}>{video.title}</Link>
    </h3>
  </section>;
}
