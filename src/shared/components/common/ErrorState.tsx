import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/lib/cn";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We could not load this section. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border border-error/20 bg-white p-6 text-center shadow-sm",
        className,
      )}
    >
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-2 text-sm text-neutral-500">{message}</p>
      {onRetry ? (
        <Button className="mt-4" onClick={onRetry} type="button">
          Try again
        </Button>
      ) : null}
    </div>
  );
}
