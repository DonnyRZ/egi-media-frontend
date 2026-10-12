import { Fragment, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface AdaptiveCardGridProps<T> {
  items: T[];
  /** Must render a self-contained cell (own background/padding), same as the card would render in a manual grid today. */
  renderItem: (item: T) => ReactNode;
  keyForItem: (item: T) => string | number;
  /** Column count at the lg breakpoint when there are enough items to fill it. Defaults to 3. */
  maxCols?: 2 | 3;
  className?: string;
}

/**
 * Card grid that adapts its column count to the item count so a `gap-px`
 * grid never needs filler cells to look intentional:
 * - 0 items: renders nothing (caller owns its own empty state).
 * - 1 item: sized to a single column of the target grid (same breakpoints
 *   as the 3+ case) so the card keeps a normal card width with empty space
 *   beside it, instead of stretching edge-to-edge like a banner.
 * - 2 items: two columns from `sm`, no `lg` bump — fills exactly, no fillers.
 * - 3+ items: full grid (`sm:grid-cols-2 lg:grid-cols-3`, or `sm:grid-cols-2`
 *   when `maxCols` is 2) with `GridFillers` completing the last row.
 */
export function AdaptiveCardGrid<T>({
  items,
  renderItem,
  keyForItem,
  maxCols = 3,
  className,
}: AdaptiveCardGridProps<T>) {
  if (items.length === 0) return null;

  if (items.length === 1) return <div className={cn("mx-auto w-full max-w-[560px]",className)}>{renderItem(items[0])}</div>;

  if (items.length === 2) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-px bg-neutral-200 sm:grid-cols-2",
          className,
        )}
      >
        {items.map((item) => (
          <Fragment key={keyForItem(item)}>{renderItem(item)}</Fragment>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-px bg-neutral-200 sm:grid-cols-2",
        maxCols === 3 && "lg:grid-cols-3",
        className,
      )}
    >
      {items.map((item) => (
        <Fragment key={keyForItem(item)}>{renderItem(item)}</Fragment>
      ))}
    </div>
  );
}
