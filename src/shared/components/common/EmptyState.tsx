import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib/cn";

interface EmptyStateProps {
  title?: string;
  message?: string;
  className?: string;
}

export function EmptyState({ title, message, className }: EmptyStateProps) {
  const t = useTranslations("states");

  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-300 bg-white p-8 text-center",
        className,
      )}
    >
      <h3 className="text-lg font-semibold text-neutral-900">
        {title ?? t("emptyTitle")}
      </h3>
      <p className="mt-2 text-sm text-neutral-500">
        {message ?? t("emptyMessage")}
      </p>
    </div>
  );
}
