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
    <div className={cn("mb-6 border-b-2 border-ink pb-2 lg:mb-8", className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="h-5 w-1.5 bg-accent" />
          <h2
            id={id}
            className="text-lg font-bold uppercase tracking-wide text-ink sm:text-xl"
          >
            {title}
          </h2>
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
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">{subtitle}</p>
      ) : null}
    </div>
  );
}
