"use client";

import { useEffect, useRef, useState } from "react";

import { ArticleStats } from "@/features/article/components/ArticleStats";
import { ColumnShareBar } from "@/features/columns/components/ColumnShareBar";
import { SaveColumnButton } from "@/features/columns/components/SaveColumnButton";
import { trackColumnView } from "@/features/columns/repositories/column.repository";
import {
  columnViewSessionKey,
  recordViewOnce,
} from "@/shared/lib/engagement-session";

interface ColumnEngagementProps {
  columnId: string;
  title: string;
  shareUrl: string;
  initialViewCount: number;
  initialShareCount: number;
}

export function ColumnEngagement({
  columnId,
  title,
  shareUrl,
  initialViewCount,
  initialShareCount,
}: ColumnEngagementProps) {
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [shareCount, setShareCount] = useState(initialShareCount);
  const activeColumnId = useRef(columnId);

  useEffect(() => {
    if (activeColumnId.current !== columnId) {
      activeColumnId.current = columnId;
      setViewCount(initialViewCount);
      setShareCount(initialShareCount);
    }
  }, [columnId, initialViewCount, initialShareCount]);

  useEffect(() => {
    void recordViewOnce(columnViewSessionKey(columnId), () =>
      trackColumnView(columnId),
    )
      .then((nextCount) => {
        if (typeof nextCount === "number") {
          setViewCount((current) => Math.max(current, nextCount));
          return;
        }
        setViewCount((current) => current + 1);
      })
      .catch(() => undefined);
  }, [columnId]);

  return (
    <div className="flex flex-col gap-6 border-y border-neutral-200 py-6 sm:flex-row sm:items-start sm:justify-between">
      <ArticleStats shareCount={shareCount} viewCount={viewCount} />
      <div className="flex flex-col gap-5 sm:items-end">
        <SaveColumnButton columnId={columnId} />
        <ColumnShareBar
          columnId={columnId}
          onShareRecorded={setShareCount}
          shareUrl={shareUrl}
          title={title}
        />
      </div>
    </div>
  );
}
