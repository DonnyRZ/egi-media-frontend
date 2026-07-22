"use client";

import {
  ARTICLE_PLACEMENT_META,
  ARTICLE_PLACEMENTS,
} from "@/features/cms/constants/cms.constants";
import type { ArticlePlacement } from "@/features/cms/types/cms.types";

interface PlacementCheckboxesProps {
  value: ArticlePlacement[];
  onChange: (next: ArticlePlacement[]) => void;
  idPrefix?: string;
}

export function PlacementCheckboxes({
  value,
  onChange,
  idPrefix = "placement",
}: PlacementCheckboxesProps) {
  function toggle(placement: ArticlePlacement, checked: boolean) {
    if (checked) {
      onChange([...value, placement]);
      return;
    }
    onChange(value.filter((item) => item !== placement));
  }

  return (
    <div className="space-y-2.5">
      {ARTICLE_PLACEMENTS.map((placement) => {
        const meta = ARTICLE_PLACEMENT_META[placement];
        const inputId = `${idPrefix}-${placement}`;
        return (
          <label
            key={placement}
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
        );
      })}
    </div>
  );
}
