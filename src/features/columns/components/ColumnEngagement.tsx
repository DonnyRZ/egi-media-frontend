"use client";

import { useEffect, useRef, useState } from "react";

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
  initialShareCount: number;
}

export function ColumnEngagement({
  columnId,
  title,
  shareUrl,
  initialShareCount,
}: ColumnEngagementProps) {
  const [shareCount, setShareCount] = useState(initialShareCount);
  const activeColumnId = useRef(columnId);

  useEffect(() => {
    if (activeColumnId.current !== columnId) {
      activeColumnId.current = columnId;
      setShareCount(initialShareCount);
    }
  }, [columnId, initialShareCount]);

  useEffect(() => {
    void recordViewOnce(columnViewSessionKey(columnId), () =>
      trackColumnView(columnId),
    ).catch(() => undefined);
  }, [columnId]);

  return (
    <div className="flex flex-wrap items-center gap-3 border-y border-neutral-200 py-3">
      {shareCount>0?<span className="sr-only">{shareCount}</span>:null}
      <div className="flex flex-wrap items-center gap-3">
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
