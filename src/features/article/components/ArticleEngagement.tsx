"use client";

import { useEffect, useRef, useState } from "react";

import { ArticleShareBar } from "@/features/article/components/ArticleShareBar";
import { ArticleStats } from "@/features/article/components/ArticleStats";
import { SaveArticleButton } from "@/features/saved-articles/components/SaveArticleButton";
import {
  articleViewSessionKey,
  recordViewOnce,
} from "@/shared/lib/engagement-session";
import { trackArticleView } from "@/shared/repositories/article.repository";

interface ArticleEngagementProps {
  articleId: string;
  title: string;
  shareUrl: string;
  initialViewCount: number;
  initialShareCount: number;
}

export function ArticleEngagement({
  articleId,
  title,
  shareUrl,
  initialViewCount,
  initialShareCount,
}: ArticleEngagementProps) {
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [shareCount, setShareCount] = useState(initialShareCount);
  const activeArticleId = useRef(articleId);

  useEffect(() => {
    if (activeArticleId.current !== articleId) {
      activeArticleId.current = articleId;
      setViewCount(initialViewCount);
      setShareCount(initialShareCount);
    }
  }, [articleId, initialViewCount, initialShareCount]);

  useEffect(() => {
    void recordViewOnce(articleViewSessionKey(articleId), () =>
      trackArticleView(articleId),
    )
      .then((nextCount) => {
        if (typeof nextCount === "number") {
          setViewCount((current) => Math.max(current, nextCount));
          return;
        }
        setViewCount((current) => current + 1);
      })
      .catch(() => undefined);
  }, [articleId]);

  return (
    <div className="flex flex-col gap-6 border-y border-neutral-200 py-6 sm:flex-row sm:items-start sm:justify-between">
      <ArticleStats shareCount={shareCount} viewCount={viewCount} />
      <div className="flex flex-col gap-5 sm:items-end">
        <SaveArticleButton articleId={articleId} />
        <ArticleShareBar
          articleId={articleId}
          onShareRecorded={setShareCount}
          shareUrl={shareUrl}
          title={title}
        />
      </div>
    </div>
  );
}
