import { cn } from "@/shared/lib/cn";

interface EmptyStateProps {
  title?: string;
  message?: string;
  className?: string;
}

export function EmptyState({
  title = "No content yet",
  message = "Check back soon for new stories.",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-300 bg-white p-8 text-center",
        className,
      )}
    >
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-2 text-sm text-neutral-500">{message}</p>
    </div>
  );
}
