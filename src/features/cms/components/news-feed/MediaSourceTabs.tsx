"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

import type { NewsFeedSourceId } from "@/features/cms/constants/news-feed.constants";
import { NEWS_FEED_TABS } from "@/features/cms/constants/news-feed.constants";
import { cn } from "@/shared/lib/cn";

interface MediaSourceTabsProps {
  value: NewsFeedSourceId;
  onChange: (value: NewsFeedSourceId) => void;
}

const SCROLL_STEP = 220;
const DRAG_THRESHOLD_PX = 5;

export function MediaSourceTabs({ value, onChange }: MediaSourceTabsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    dragging: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const updateOverflow = useCallback(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const maxScroll = node.scrollWidth - node.clientWidth;
    const hasOverflow = maxScroll > 2;
    setCanScrollLeft(hasOverflow && node.scrollLeft > 2);
    setCanScrollRight(hasOverflow && node.scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;

    updateOverflow();
    node.addEventListener("scroll", updateOverflow, { passive: true });
    window.addEventListener("resize", updateOverflow);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateOverflow())
        : null;
    resizeObserver?.observe(node);

    return () => {
      node.removeEventListener("scroll", updateOverflow);
      window.removeEventListener("resize", updateOverflow);
      resizeObserver?.disconnect();
    };
  }, [updateOverflow]);

  function scrollBy(direction: "left" | "right") {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({
      left: direction === "right" ? SCROLL_STEP : -SCROLL_STEP,
      behavior: "smooth",
    });
  }

  function onWheel(event: ReactWheelEvent<HTMLDivElement>) {
    const node = scrollerRef.current;
    if (!node) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    if (node.scrollWidth <= node.clientWidth) return;
    event.preventDefault();
    node.scrollBy({ left: event.deltaY });
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const node = scrollerRef.current;
    if (!node || node.scrollWidth <= node.clientWidth) return;

    // Record intent only — do not capture yet so normal tab clicks still fire.
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: node.scrollLeft,
      dragging: false,
    };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const node = scrollerRef.current;
    if (!drag || !node || drag.pointerId !== event.pointerId) return;

    const delta = event.clientX - drag.startX;

    if (!drag.dragging) {
      if (Math.abs(delta) < DRAG_THRESHOLD_PX) return;
      drag.dragging = true;
      setIsDragging(true);
      node.setPointerCapture(event.pointerId);
    }

    node.scrollLeft = drag.startScrollLeft - delta;
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const node = scrollerRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    // Only suppress the following click when a real drag happened.
    if (drag.dragging) {
      suppressClickRef.current = true;
    }

    if (drag.dragging && node?.hasPointerCapture(event.pointerId)) {
      node.releasePointerCapture(event.pointerId);
    }

    dragRef.current = null;
    setIsDragging(false);
  }

  function onTabClick(
    event: ReactMouseEvent<HTMLButtonElement>,
    next: NewsFeedSourceId,
  ) {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
      return;
    }
    onChange(next);
  }

  return (
    <div className="relative border-b border-neutral-200 dark:border-neutral-800">
      {canScrollLeft ? (
        <ScrollEdgeButton
          direction="left"
          onClick={() => scrollBy("left")}
          className="left-0"
        />
      ) : null}
      {canScrollRight ? (
        <ScrollEdgeButton
          direction="right"
          onClick={() => scrollBy("right")}
          className="right-0"
        />
      ) : null}

      <div
        ref={scrollerRef}
        role="tablist"
        aria-label="Filter news feed by media source"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          "flex gap-1 overflow-x-auto scroll-smooth whitespace-nowrap px-2",
          "select-none [-ms-overflow-style:none] [scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
          isDragging ? "cursor-grabbing" : "cursor-grab",
          canScrollLeft && "pl-9",
          canScrollRight && "pr-9",
        )}
      >
        {NEWS_FEED_TABS.map((tab) => {
          const active = value === tab.value;
          return (
            <button
              key={tab.value || "viral"}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={(event) => onTabClick(event, tab.value)}
              className={cn(
                "relative shrink-0 whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-accent"
                  : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
              )}
            >
              {tab.label}
              {active ? (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ScrollEdgeButton({
  direction,
  onClick,
  className,
}: {
  direction: "left" | "right";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "left" ? "Scroll tabs left" : "Scroll tabs right"}
      onClick={onClick}
      className={cn(
        "absolute top-0 z-10 flex h-full w-8 items-center justify-center",
        "bg-white text-neutral-500 transition-colors hover:text-neutral-900",
        "dark:bg-neutral-900 dark:hover:text-neutral-100",
        className,
      )}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    </button>
  );
}
