"use client";

import { useEffect, useRef, useState } from "react";

import { ArticleShareBar } from "@/features/article/components/ArticleShareBar";
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
  initialShareCount: number;
}

export function ArticleEngagement({
  articleId,
  title,
  shareUrl,
  initialShareCount,
}: ArticleEngagementProps) {
  const [shareCount, setShareCount] = useState(initialShareCount);
  const activeArticleId = useRef(articleId);

  useEffect(() => {
    if (activeArticleId.current !== articleId) {
      activeArticleId.current = articleId;
      setShareCount(initialShareCount);
    }
  }, [articleId, initialShareCount]);

  useEffect(() => {
    void recordViewOnce(articleViewSessionKey(articleId), () =>
      trackArticleView(articleId),
    ).catch(() => undefined);
  }, [articleId]);

  return (
    <div className="flex flex-wrap items-center gap-3 border-y border-neutral-200 py-3">
      {shareCount > 0 ? <span className="sr-only">{shareCount}</span> : null}
      <div className="flex flex-wrap items-center gap-3">
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
