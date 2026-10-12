import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface FramePageHeroProps {
  title: string;
  titleId: string;
  kicker?: string;
  lede?: string;
  leading?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * Title band for the first FrameModule on listing/detail pages.
 * Separation from the next module comes from ContentFrame divide-y — no outer border-b.
 */
export function FramePageHero({
  title,
  titleId,
  kicker,
  lede,
  leading,
  actions,
  className,
}: FramePageHeroProps) {
  return (
    <div className={cn("bg-white px-5 py-5 lg:py-6", className)}>
      {leading ? <div className="mb-3">{leading}</div> : null}
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <div
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
          kicker && "mt-2",
        )}
      >
        <div className="min-w-0">
          <h1
            className="max-w-3xl font-sans text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl"
            id={titleId}
          >
            {title}
          </h1>
          {lede ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 lg:text-base lg:leading-7">
              {lede}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
