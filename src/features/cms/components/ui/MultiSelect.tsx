"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";
import { BASE_FIELD } from "@/features/cms/components/ui/Input";

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  /** Optional inline creation. Omit to make the field select-only. */
  onCreate?: (label: string) => void;
  creating?: boolean;
  emptyLabel?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  onCreate,
  creating,
  emptyLabel = "No options available",
  disabled = false,
}: MultiSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedOptions = value
    .map((id) => options.find((option) => option.value === id))
    .filter((option): option is Option => Boolean(option));

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options
      .filter((option) => !value.includes(option.value))
      .filter((option) => option.label.toLowerCase().includes(q));
  }, [options, value, query]);

  const canCreate =
    !disabled &&
    onCreate &&
    query.trim().length > 0 &&
    !options.some((o) => o.label.toLowerCase() === query.trim().toLowerCase());

  function add(id: string) {
    if (disabled) return;
    onChange([...value, id]);
    setQuery("");
  }

  return (
    <div className={cn("space-y-2", disabled && "opacity-60")} ref={ref}>
      {selectedOptions.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
            >
              {option.label}
              <button
                type="button"
                aria-label={`Remove ${option.label}`}
                disabled={disabled}
                onClick={() =>
                  onChange(value.filter((id) => id !== option.value))
                }
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="relative">
        <input
          className={cn(BASE_FIELD)}
          disabled={disabled}
          placeholder={placeholder}
          value={query}
          onFocus={() => {
            if (!disabled) setOpen(true);
          }}
          onChange={(event) => {
            if (disabled) return;
            setQuery(event.target.value);
            setOpen(true);
          }}
        />

        {open && !disabled ? (
          <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
            {matches.length === 0 && !canCreate ? (
              <p className="px-3 py-2 text-sm text-neutral-400">
                {options.length === 0 ? emptyLabel : "No matches"}
              </p>
            ) : null}
            {matches.map((option) => (
              <button
                key={option.value}
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                onClick={() => add(option.value)}
              >
                {option.label}
              </button>
            ))}
            {canCreate ? (
              <button
                type="button"
                disabled={creating}
                className="block w-full border-t border-neutral-100 px-3 py-2 text-left text-sm font-medium text-accent hover:bg-accent/5 disabled:opacity-60 dark:border-neutral-800"
                onClick={() => onCreate?.(query.trim())}
              >
                {creating ? "Creating…" : `Create "${query.trim()}"`}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
