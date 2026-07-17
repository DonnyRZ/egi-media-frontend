"use client";

import { useEffect, useRef, useState } from "react";

import { ArticleShareBar } from "@/features/article/components/ArticleShareBar";
import { ArticleStats } from "@/features/article/components/ArticleStats";
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
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;

    const storageKey = `egi-article-viewed:${articleId}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(storageKey)) {
      return;
    }

    void trackArticleView(articleId)
      .then((nextCount) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(storageKey, "1");
        }
        if (typeof nextCount === "number") {
          setViewCount(nextCount);
        }
      })
      .catch(() => undefined);
  }, [articleId]);

  return (
    <div className="flex flex-col gap-6 border-y border-neutral-200 py-6 sm:flex-row sm:items-start sm:justify-between">
      <ArticleStats shareCount={shareCount} viewCount={viewCount} />
      <ArticleShareBar
        articleId={articleId}
        onShareRecorded={setShareCount}
        shareUrl={shareUrl}
        title={title}
      />
    </div>
  );
}
