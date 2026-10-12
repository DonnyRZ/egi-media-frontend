import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/lib/cn";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  tone?: "light" | "dark";
}

export function ErrorState({ title, message, onRetry, className, tone = "light" }: ErrorStateProps) {
  const t = useTranslations();

  return (
    <div
      role="alert"
      className={cn(
        "border p-6 text-center",
        tone === "dark" ? "border-white/25 bg-white/5" : "border-error/20 bg-white",
        className,
      )}
    >
      <h3 className={cn("text-lg font-semibold",tone === "dark" ? "text-white" : "text-neutral-900")}>
        {title ?? t("states.errorTitle")}
      </h3>
      <p className={cn("mt-2 text-sm",tone === "dark" ? "text-neutral-300" : "text-neutral-500")}>
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
