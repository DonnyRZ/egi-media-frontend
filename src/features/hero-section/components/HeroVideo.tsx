"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { VideoEmbed } from "@/features/videos/components/VideoEmbed";
import type { YoutubeVideo } from "@/shared/types/youtube.types";

export function HeroVideo({ video }: { video: YoutubeVideo }) {
  const t = useTranslations("videos");
  return <section className="p-4 min-[1200px]:p-5" aria-labelledby="hero-video-heading">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 id="hero-video-heading" className="text-lg font-bold text-ink">{t("title")}</h2>
      <Link href="/videos" className="text-xs font-semibold underline underline-offset-4">{t("viewAll")}</Link>
    </div>
    <div className="aspect-video overflow-hidden bg-ink"><VideoEmbed key={video.id} video={video} /></div>
    <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-ink">
      <a className="headline-link" href={video.url} target="_blank" rel="noopener noreferrer">{video.title}</a>
    </h3>
  </section>;
}
