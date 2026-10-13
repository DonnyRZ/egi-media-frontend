"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { ArticleActionIcon } from "@/features/article/components/ArticleActionIcon";
import { trackArticleShare } from "@/shared/repositories/article.repository";
import { cn } from "@/shared/lib/cn";
import type { SharePlatform } from "@/shared/types/article.types";
import { buildShareUrl } from "@/features/article/utils/article.utils";

interface ArticleShareBarProps {
  articleId: string;
  title: string;
  shareUrl: string;
  onShareRecorded: (shareCount: number | ((prev: number) => number)) => void;
  leadingAction?: ReactNode;
}

const SHARE_ACTIONS: Array<{
  platform: SharePlatform;
  labelKey: "shareCopy" | "shareWhatsapp" | "shareFacebook" | "shareX" | "shareTelegram";
}> = [
  { platform: "copy_link", labelKey: "shareCopy" },
  { platform: "whatsapp", labelKey: "shareWhatsapp" },
  { platform: "facebook", labelKey: "shareFacebook" },
  { platform: "twitter", labelKey: "shareX" },
  { platform: "telegram", labelKey: "shareTelegram" },
];

export function ArticleShareBar({
  articleId,
  title,
  shareUrl,
  onShareRecorded,
  leadingAction,
}: ArticleShareBarProps) {
  const t = useTranslations("article");
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

      const nextCount = await trackArticleShare(articleId, platform);
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
      <div
        aria-label={t("shareTitle")}
        className="editorial-share-items flex flex-wrap gap-2"
        role="group"
      >
        {leadingAction}
        {SHARE_ACTIONS.map((action) => {
          const label =
            action.platform === "copy_link" && copied
              ? t("linkCopied")
              : t(action.labelKey);

          return (
            <button
              key={action.platform}
              aria-label={label}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center border border-neutral-300 bg-white p-0 text-neutral-700 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-60",
                action.platform === "copy_link" &&
                  copied &&
                  "border-accent bg-accent/5",
              )}
              disabled={pending === action.platform}
              onClick={() => void handleShare(action.platform)}
              type="button"
            >
              <ArticleActionIcon name={action.platform} />
            </button>
          );
        })}
      </div>
      <span aria-live="polite" className="sr-only" role="status">
        {copied ? t("linkCopied") : ""}
      </span>
    </div>
  );
}
