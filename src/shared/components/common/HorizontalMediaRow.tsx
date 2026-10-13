"use client";

import type { CSSProperties, ReactNode } from "react";

import { useBalancedMediaRow } from "@/shared/hooks/useBalancedMediaRow";
import { cn } from "@/shared/lib/cn";

interface HorizontalMediaRowProps {
  media: ReactNode;
  title: ReactNode;
  kicker?: ReactNode;
  metadata?: ReactNode;
  description?: ReactNode;
  side?: "left" | "right";
  className?: string;
}

export function HorizontalMediaRow({ media, title, kicker, metadata, description, side = "left", className }: HorizontalMediaRowProps) {
  const { frameRef, copyRef, mediaWidth } = useBalancedMediaRow();
  const style = mediaWidth ? { "--media-row-width": `${mediaWidth}px` } as CSSProperties : undefined;
  return <div ref={frameRef} className={cn("media-row-frame", className)}>
    <div className="media-row" data-media-side={side} style={style}>
      <div className="media-row-photo">{media}</div>
      <div ref={copyRef} className="media-row-copy">
        {kicker ? <div className="media-row-kicker">{kicker}</div> : null}
        <div className="media-row-title">{title}</div>
        {description ? <div className="media-row-description">{description}</div> : null}
        {metadata ? <div className="media-row-metadata">{metadata}</div> : null}
      </div>
    </div>
  </div>;
}
