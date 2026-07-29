import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    { label, error, className, id, rows = 8, ...props },
    ref,
  ) {
    const inputId = id ?? props.name;

    return (
      <div className="space-y-1.5">
        <label
          className="block text-xs font-semibold uppercase tracking-wide text-neutral-600"
          htmlFor={inputId}
        >
          {label}
        </label>
        <textarea
          className={cn(
            "w-full resize-y border border-neutral-300 bg-white px-3 py-2.5 text-sm leading-6 text-ink outline-none transition-colors placeholder:text-neutral-400 focus:border-ink",
            error && "border-red-500",
            className,
          )}
          id={inputId}
          ref={ref}
          rows={rows}
          {...props}
        />
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
      </div>
    );
  },
);
