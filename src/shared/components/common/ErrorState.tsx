import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/lib/cn";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title, message, onRetry, className }: ErrorStateProps) {
  const t = useTranslations();

  return (
    <div
      role="alert"
      className={cn(
        "border border-error/20 bg-white p-6 text-center shadow-sm",
        className,
      )}
    >
      <h3 className="text-lg font-semibold text-neutral-900">
        {title ?? t("states.errorTitle")}
      </h3>
      <p className="mt-2 text-sm text-neutral-500">
        {message ?? t("states.errorMessage")}
      </p>
      {onRetry ? (
        <Button className="mt-4" onClick={onRetry} type="button">
          {t("common.tryAgain")}
        </Button>
      ) : null}
    </div>
  );
}
