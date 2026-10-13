import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

interface EmptyStateProps {
  title?: string;
  message?: string;
  className?: string;
}

export function EmptyState({ title, message, className }: EmptyStateProps) {
  const t = useTranslations("states");
  const e=useTranslations("editorial");

  return (
    <div
      className={cn(
        "border border-neutral-300 bg-white p-8 text-center",
        className,
      )}
    >
      <h3 className="editorial-card-title text-lg font-semibold text-neutral-900">
        {title ?? t("emptyTitle")}
      </h3>
      <p className="mt-2 text-sm text-neutral-500">
        {message ?? t("emptyMessage")}
      </p>
      <Link className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold underline" href="/latest">{e("latest")} →</Link>
    </div>
  );
}
