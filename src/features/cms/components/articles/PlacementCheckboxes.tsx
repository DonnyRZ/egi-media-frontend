"use client";

import {
  ARTICLE_PLACEMENT_META,
  ARTICLE_PLACEMENTS,
} from "@/features/cms/constants/cms.constants";
import type { ArticlePlacement } from "@/features/cms/types/cms.types";

const HEADLINE_POSITIONS = [1, 2, 3, 4, 5] as const;

interface PlacementCheckboxesProps {
  value: ArticlePlacement[];
  headlinePosition: number | null;
  onChange: (next: ArticlePlacement[]) => void;
  onHeadlinePositionChange: (position: number | null) => void;
  idPrefix?: string;
}

export function PlacementCheckboxes({
  value,
  headlinePosition,
  onChange,
  onHeadlinePositionChange,
  idPrefix = "placement",
}: PlacementCheckboxesProps) {
  function toggle(placement: ArticlePlacement, checked: boolean) {
    if (checked) {
      onChange([...value, placement]);
      if (placement === "headline" && headlinePosition == null) {
        onHeadlinePositionChange(1);
      }
      return;
    }
    onChange(value.filter((item) => item !== placement));
    if (placement === "headline") {
      onHeadlinePositionChange(null);
    }
  }

  return (
    <div className="space-y-2.5">
      {ARTICLE_PLACEMENTS.map((placement) => {
        const meta = ARTICLE_PLACEMENT_META[placement];
        const inputId = `${idPrefix}-${placement}`;
        return (
          <div key={placement} className="space-y-2">
            <label
              htmlFor={inputId}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300"
            >
              <input
                id={inputId}
                type="checkbox"
                className="h-4 w-4 accent-accent"
                checked={value.includes(placement)}
                onChange={(event) => toggle(placement, event.target.checked)}
              />
              <span>{meta.label}</span>
            </label>
            {placement === "headline" && value.includes("headline") ? (
              <div className="ml-6">
                <label
                  htmlFor={`${idPrefix}-headline-position`}
                  className="mb-1 block text-xs font-medium text-neutral-500"
                >
                  Headline Position (1–5)
                </label>
                <select
                  id={`${idPrefix}-headline-position`}
                  className="h-9 w-full max-w-[12rem] rounded-md border border-neutral-300 bg-white px-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  value={headlinePosition ?? 1}
                  onChange={(event) =>
                    onHeadlinePositionChange(Number(event.target.value))
                  }
                >
                  {HEADLINE_POSITIONS.map((position) => (
                    <option key={position} value={position}>
                      #{String(position).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-neutral-400">
                  Existing articles at this slot and below shift down; #05 drops
                  off.
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
