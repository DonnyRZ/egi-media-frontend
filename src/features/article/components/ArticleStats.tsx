"use client";

import { useTranslations } from "next-intl";

import { formatCount } from "@/features/article/utils/article.utils";

interface ArticleStatsProps {
  viewCount: number;
  shareCount: number;
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ShareCountIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M16 6a3 3 0 1 0-2.8-4M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM9.5 10.5l5 2.5M9.5 13.5l5 2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function ArticleStats({ viewCount, shareCount }: ArticleStatsProps) {
  const t = useTranslations("article");

  return (
    <div className="flex flex-wrap items-center gap-5 text-sm text-neutral-500">
      <span className="inline-flex items-center gap-2" title={t("viewsLabel")}>
        <EyeIcon />
        <span className="font-semibold tabular-nums text-neutral-800">
          {formatCount(viewCount)}
        </span>
        <span className="sr-only sm:not-sr-only">{t("viewsLabel")}</span>
      </span>
      <span className="inline-flex items-center gap-2" title={t("sharesLabel")}>
        <ShareCountIcon />
        <span className="font-semibold tabular-nums text-neutral-800">
          {formatCount(shareCount)}
        </span>
        <span className="sr-only sm:not-sr-only">{t("sharesLabel")}</span>
      </span>
    </div>
  );
}
