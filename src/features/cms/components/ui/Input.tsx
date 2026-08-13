import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

const BASE_FIELD =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      {...props}
      ref={ref}
      className={cn(
        BASE_FIELD,
        "h-10 min-h-10",
        invalid && "border-error focus:border-error",
        className,
      )}
    />
  );
});

export { BASE_FIELD };
