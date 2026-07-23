"use client";

import { cn } from "@/shared/lib/cn";

export type UserRoleFilter =
  | ""
  | "superadmin"
  | "author"
  | "member"
  | "visitor";

interface UserRoleTabsProps {
  value: UserRoleFilter;
  onChange: (value: UserRoleFilter) => void;
}

const TABS: { value: UserRoleFilter; label: string }[] = [
  { value: "", label: "All" },
  { value: "superadmin", label: "Superadmin" },
  { value: "author", label: "Author" },
  { value: "member", label: "Member" },
  { value: "visitor", label: "Visitor" },
];

export function UserRoleTabs({ value, onChange }: UserRoleTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter users by role"
      className="flex gap-1 overflow-x-auto border-b border-neutral-200 px-2 dark:border-neutral-800"
    >
      {TABS.map((tab) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value || "all"}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "text-accent"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
            )}
          >
            {tab.label}
            {active ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
