import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

interface FrameHeadingProps {
  title: string;
  countLabel?: string;
  id: string;
  className?: string;
  actionHref?: string;
  actionLabel?: string;
  variant?: "default" | "trending";
}

/**
 * Section title band that lives inside a FrameModule (flush to content below via border-b).
 */
export function FrameHeading({
  title,
  countLabel,
  id,
  className,
  actionHref,
  actionLabel,
  variant = "default",
}: FrameHeadingProps) {
  const t = useTranslations("common");

  return (
    <div
      className={cn(
        "editorial-heading-band border-b border-neutral-200 bg-white px-4 py-3 md:px-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2
            id={id}
            className={cn(
              "editorial-section-title min-w-0 break-words text-lg font-bold uppercase tracking-wide text-ink sm:text-xl",
              variant === "trending" && "editorial-trending-title",
            )}
          >
            {title}
          </h2>
          {countLabel ? (
            <span className="text-xs text-neutral-500">{countLabel}</span>
          ) : null}
        </div>
        {actionHref ? (
          <Link
            className="shrink-0 text-xs font-semibold uppercase tracking-wide text-neutral-500 transition-colors hover:text-accent"
            href={actionHref}
          >
            {actionLabel ?? t("viewAll")} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
