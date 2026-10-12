"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { YoutubeVideo } from "@/shared/types/youtube.types";
export function VideoSequenceNav({
  currentId,
  videos,
}: {
  currentId: string;
  videos: YoutubeVideo[];
}) {
  const t = useTranslations("editorial");
  const index = videos.findIndex((v) => v.id === currentId);
  const previous = index > 0 ? videos[index - 1] : undefined;
  const next = videos[index + 1];
  return (
    <nav
      aria-label="Shorts"
      className="mx-auto mt-4 flex max-w-[360px] justify-between gap-4"
    >
      {previous ? (
        <Link
          className="inline-flex min-h-11 items-center rounded-full border border-white/40 px-4"
          href={`/videos/watch/${previous.id}`}
        >
          ← {t("previous")}
        </Link>
      ) : (
        <span />
      )}
      {next && next.id !== currentId ? (
        <Link
          className="inline-flex min-h-11 items-center rounded-full border border-white/40 px-4"
          href={`/videos/watch/${next.id}`}
        >
          {t("next")} →
        </Link>
      ) : null}
    </nav>
  );
}
