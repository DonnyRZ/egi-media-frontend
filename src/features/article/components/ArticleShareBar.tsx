"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { trackArticleShare } from "@/shared/repositories/article.repository";
import { cn } from "@/shared/lib/cn";
import type { SharePlatform } from "@/shared/types/article.types";
import { buildShareUrl } from "@/features/article/utils/article.utils";

interface ArticleShareBarProps {
  articleId: string;
  title: string;
  shareUrl: string;
  onShareRecorded: (shareCount: number) => void;
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
      }
    } catch {
      // Keep UI usable even if tracking fails.
    } finally {
      setPending(null);
    }
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
        {t("shareTitle")}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {SHARE_ACTIONS.map((action) => (
          <button
            key={action.platform}
            className={cn(
              "border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-60",
              action.platform === "copy_link" && copied && "border-accent text-accent",
            )}
            disabled={pending === action.platform}
            onClick={() => void handleShare(action.platform)}
            type="button"
          >
            {action.platform === "copy_link" && copied
              ? t("linkCopied")
              : t(action.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
