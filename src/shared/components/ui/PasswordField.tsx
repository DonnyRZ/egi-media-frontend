"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  showLabel: string;
  hideLabel: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    { label, error, showLabel, hideLabel, className, id, ...props },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const inputId = id ?? props.name;

    return (
      <div className="space-y-1.5">
        <label
          className="block text-xs font-semibold uppercase tracking-wide text-neutral-600"
          htmlFor={inputId}
        >
          {label}
        </label>
        <div className="relative">
          <input
            className={cn(
              "w-full border border-neutral-300 bg-white px-3 py-2.5 pr-12 text-sm text-ink outline-none transition-colors placeholder:text-neutral-400 focus:border-ink",
              error && "border-red-500",
              className,
            )}
            id={inputId}
            ref={ref}
            type={visible ? "text" : "password"}
            {...props}
          />
          <button
            aria-label={visible ? hideLabel : showLabel}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            onClick={() => setVisible((value) => !value)}
            type="button"
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
      </div>
    );
  },
);

function EyeIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M3 3l18 18M9.9 5.1C10.6 4.9 11.3 4.8 12 4.8c6 0 9.5 7.2 9.5 7.2a17.5 17.5 0 0 1-3.1 3.8M6.1 6.7A17.6 17.6 0 0 0 2.5 12S6 18.5 12 18.5c1.2 0 2.3-.2 3.3-.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M9.9 9.9a2.75 2.75 0 0 0 3.9 3.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}
