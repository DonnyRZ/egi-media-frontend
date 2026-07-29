"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib/cn";

interface HorizontalScrollerProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  /** Left side of the carousel header (title / kicker). */
  heading?: ReactNode;
  /** Right side beside nav arrows (e.g. “7 series”). */
  trailing?: ReactNode;
}

export function HorizontalScroller({
  children,
  className,
  ariaLabel,
  heading,
  trailing,
}: HorizontalScrollerProps) {
  const t = useTranslations("common");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const node = scrollerRef.current;
    if (!node) return;

    const maxScroll = node.scrollWidth - node.clientWidth;
    const hasOverflow = maxScroll > 2;
    setCanScrollPrev(hasOverflow && node.scrollLeft > 2);
    setCanScrollNext(hasOverflow && node.scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;

    updateScrollState();

    const onScroll = () => updateScrollState();
    node.addEventListener("scroll", onScroll, { passive: true });

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateScrollState())
        : null;
    resizeObserver?.observe(node);

    const mutationObserver =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => updateScrollState())
        : null;
    mutationObserver?.observe(node, { childList: true, subtree: true });

    window.addEventListener("resize", updateScrollState);

    return () => {
      node.removeEventListener("scroll", onScroll);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, children]);

  function scrollByDirection(direction: "prev" | "next") {
    const node = scrollerRef.current;
    if (!node) return;

    const amount = Math.max(node.clientWidth * 0.85, 280);
    node.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }

  const showControls = canScrollPrev || canScrollNext;
  const hasHeader = Boolean(heading || trailing || showControls);

  return (
    <div className={cn("min-w-0 space-y-5", className)}>
      {hasHeader ? (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0 flex-1">{heading}</div>
          <div className="flex shrink-0 items-center gap-3">
            {trailing}
            {showControls ? (
              <div className="hidden items-center gap-1 md:flex">
                <CarouselArrow
                  ariaLabel={t("previous")}
                  disabled={!canScrollPrev}
                  direction="prev"
                  onClick={() => scrollByDirection("prev")}
                />
                <CarouselArrow
                  ariaLabel={t("next")}
                  disabled={!canScrollNext}
                  direction="next"
                  onClick={() => scrollByDirection("next")}
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div
        aria-label={ariaLabel}
        className={cn(
          "flex w-full min-w-0 flex-nowrap gap-5 overflow-x-auto overscroll-x-contain",
          "scroll-smooth snap-x snap-mandatory pb-3 scrollbar-hide",
        )}
        ref={scrollerRef}
        role="list"
      >
        {children}
      </div>
    </div>
  );
}

function CarouselArrow({
  direction,
  onClick,
  disabled,
  ariaLabel,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center border border-neutral-200 bg-white text-neutral-700 transition-colors",
        "hover:border-ink hover:text-ink",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        "disabled:cursor-not-allowed disabled:border-neutral-100 disabled:text-neutral-300 disabled:hover:border-neutral-100 disabled:hover:text-neutral-300",
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <ArrowIcon direction={direction} />
    </button>
  );
}

function ArrowIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
