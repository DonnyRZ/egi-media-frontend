import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-400"
        htmlFor={htmlFor}
      >
        {label}
        {required ? <span className="ml-0.5 text-accent">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-error">{error}</p>
      ) : hint ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>
      ) : null}
    </div>
  );
}
