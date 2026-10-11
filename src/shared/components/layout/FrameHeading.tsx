import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

interface FrameHeadingProps {
  title: string;
  subtitle?: string;
  id: string;
  className?: string;
  actionHref?: string;
  actionLabel?: string;
}

/**
 * Section title band that lives inside a FrameModule (flush to content below via border-b).
 */
export function FrameHeading({
  title,
  subtitle,
  id,
  className,
  actionHref,
  actionLabel,
}: FrameHeadingProps) {
  const t = useTranslations("common");

  return (
    <div
      className={cn(
        "border-b border-neutral-200 bg-white px-5 py-3",
        className,
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <h2
          id={id}
          className="min-w-0 break-words text-lg font-bold uppercase tracking-wide text-ink sm:text-xl"
        >
          {title}
        </h2>
        {actionHref ? (
          <Link
            className="shrink-0 text-xs font-semibold uppercase tracking-wide text-neutral-500 transition-colors hover:text-accent"
            href={actionHref}
          >
            {actionLabel ?? t("viewAll")} →
          </Link>
        ) : null}
      </div>
      {subtitle ? (
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">{subtitle}</p>
      ) : null}
    </div>
  );
}
