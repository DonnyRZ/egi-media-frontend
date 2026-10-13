"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { buildShareUrl } from "@/features/article/utils/article.utils";
import { ArticleActionIcon } from "@/features/article/components/ArticleActionIcon";
import { trackColumnShare } from "@/features/columns/repositories/column.repository";
import { cn } from "@/shared/lib/cn";
import type { SharePlatform } from "@/shared/types/article.types";

interface ColumnShareBarProps {
  columnId: string;
  title: string;
  shareUrl: string;
  onShareRecorded: (shareCount: number | ((prev: number) => number)) => void;
  leadingAction?: ReactNode;
}

const SHARE_ACTIONS: Array<{
  platform: SharePlatform;
  labelKey:
    | "shareCopy"
    | "shareWhatsapp"
    | "shareFacebook"
    | "shareX"
    | "shareTelegram";
}> = [
  { platform: "copy_link", labelKey: "shareCopy" },
  { platform: "whatsapp", labelKey: "shareWhatsapp" },
  { platform: "facebook", labelKey: "shareFacebook" },
  { platform: "twitter", labelKey: "shareX" },
  { platform: "telegram", labelKey: "shareTelegram" },
];

export function ColumnShareBar({
  columnId,
  title,
  shareUrl,
  onShareRecorded,
  leadingAction,
}: ColumnShareBarProps) {
  const t = useTranslations("columnsPage");
  const [copied, setCopied] = useState(false);
  const [pending, setPending] = useState<SharePlatform | null>(null);

  async function handleShare(platform: SharePlatform) {
    setPending(platform);

    try {
      if (platform === "copy_link") {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } else {
        const target = buildShareUrl(platform, { url: shareUrl, title });
        window.open(target, "_blank", "noopener,noreferrer");
      }

      const nextCount = await trackColumnShare(columnId, platform);
      if (typeof nextCount === "number") {
        onShareRecorded(nextCount);
      } else {
        onShareRecorded((prev) => prev + 1);
      }
    } catch {
      // Keep UI usable even if tracking fails.
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="editorial-share-group">
      <div className="editorial-share-items flex flex-wrap gap-2" role="group" aria-label={t("shareTitle")}>
        {leadingAction}
        {SHARE_ACTIONS.map((action) => (
          <button
            key={action.platform}
            aria-label={action.platform === "copy_link" && copied ? t("linkCopied") : t(action.labelKey)}
            className={cn(
              "min-h-11 border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-60",
              action.platform === "copy_link" &&
                copied &&
                "border-accent text-accent",
            )}
            disabled={pending === action.platform}
            onClick={() => void handleShare(action.platform)}
            type="button"
          >
            <span className="editorial-mobile-only"><ArticleActionIcon name={action.platform} /></span>
            <span className="editorial-wide-only">{action.platform === "copy_link" && copied
              ? t("linkCopied")
              : t(action.labelKey)}</span>
          </button>
        ))}
      </div>
      <span aria-live="polite" className="sr-only" role="status">{copied ? t("linkCopied") : ""}</span>
    </div>
  );
}
