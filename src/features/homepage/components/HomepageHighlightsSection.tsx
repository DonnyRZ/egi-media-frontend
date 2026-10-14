"use client";

import { useTranslations } from "next-intl";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { useHomepageHighlights } from "../hooks/useHomepageHighlights";
import { useHighlightSnapshot } from "../hooks/useHighlightSnapshot";
import { HighlightsContent } from "./HighlightsContent";
import { HighlightsSkeleton } from "./HighlightsSkeleton";

export function HomepageHighlightsSection() {
  const query = useHomepageHighlights();
  const t = useTranslations("homepageHighlights");
  const { snapshot, frameRef, setFocused, gesture, endGesture } = useHighlightSnapshot(query.data, query.dataUpdatedAt);
  if (snapshot && !snapshot.primary.length && !snapshot.supporting.length && !query.isError) return null;
  return <FrameModule ariaLabelledby="homepage-highlights-heading" className="homepage-highlights">
    <FrameHeading id="homepage-highlights-heading" title={t("sectionTitle")} />
    <div ref={frameRef} onFocusCapture={() => setFocused(true)} onBlurCapture={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
    }} onPointerDownCapture={gesture} onPointerMoveCapture={event => { if (event.buttons) gesture(); }}
      onPointerUpCapture={endGesture} onPointerCancelCapture={endGesture} onWheelCapture={gesture}>
      {!snapshot && query.isPending && <HighlightsSkeleton />}
      {!snapshot && query.isError && <ErrorState onRetry={() => void query.refetch()} />}
      {snapshot && <HighlightsContent data={snapshot} />}
      {snapshot && query.isError && <div className="highlight-refresh-notice editorial-gutter" role="status">
        <span>{t("refreshError")}</span><button type="button" onClick={() => void query.refetch()}>{t("retry")}</button>
      </div>}
    </div>
  </FrameModule>;
}
