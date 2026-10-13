"use client";

import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";
import { editorialDate } from "@/shared/utils/editorial-date";

interface ContentMetadataProps {
  author?: string | null;
  authorHref?: string;
  publishedAt?: string | null;
  readingTimeMinutes?: number | null;
  durationLabel?: string | null;
  compact?: boolean;
  className?: string;
}

export function ContentMetadata({ author, authorHref, publishedAt, readingTimeMinutes, durationLabel, compact = false, className }: ContentMetadataProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const date = publishedAt ? new Date(publishedAt) : null;
  const hasDate = date && Number.isFinite(date.getTime());
  const hasReadingTime = typeof readingTimeMinutes === "number" && Number.isFinite(readingTimeMinutes) && readingTimeMinutes > 0;
  if (!author?.trim() && !hasDate && !hasReadingTime && !durationLabel) return null;
  return <div className={cn("editorial-meta metadata-items flex flex-wrap text-xs text-neutral-500", className)}>
    {author?.trim() ? <span className="metadata-item font-medium text-neutral-700">
      {authorHref ? <Link href={authorHref} className="min-w-0 hover:underline">{author}</Link> : <span>{author}</span>}
    </span> : null}
    {hasDate ? <span className="metadata-item"><time dateTime={publishedAt ?? undefined}
      title={editorialDate(date, locale, { year: true, fullMonth: true })}>
      {editorialDate(date, locale, { year: !compact })}
    </time></span> : null}
    {hasReadingTime ? <span className="metadata-item"><span>{t("readingTime", { minutes: readingTimeMinutes })}</span></span> : null}
    {durationLabel ? <span className="metadata-item"><span>{durationLabel}</span></span> : null}
  </div>;
}
