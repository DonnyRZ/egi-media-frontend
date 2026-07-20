import type { InputHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({
  label,
  error,
  className,
  id,
  ...props
}: TextFieldProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label
        className="block text-xs font-semibold uppercase tracking-wide text-neutral-600"
        htmlFor={inputId}
      >
        {label}
      </label>
      <input
        className={cn(
          "w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-neutral-400 focus:border-ink",
          error && "border-red-500",
          className,
        )}
        id={inputId}
        {...props}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
