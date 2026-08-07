import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  id: string;
  className?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function SectionHeading({
  title,
  subtitle,
  id,
  className,
  actionHref,
  actionLabel,
}: SectionHeadingProps) {
  const t = useTranslations("common");

  return (
    <div className={cn("mb-4 lg:mb-5", className)}>
      <div className="flex items-end justify-between gap-4">
        <h2
          id={id}
          className="text-lg font-bold uppercase tracking-wide text-ink sm:text-xl"
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
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">{subtitle}</p>
      ) : null}
    </div>
  );
}
