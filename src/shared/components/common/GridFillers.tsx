import { cn } from "@/shared/lib/cn";

interface GridFillersProps {
  /** Number of real items rendered in the grid. */
  count: number;
  /** Column count at the lg breakpoint (grid must be sm:grid-cols-2, and lg:grid-cols-3 when lgCols is 3). */
  lgCols?: 2 | 3;
}

/**
 * White filler cells that complete the last row of a `gap-px` dense grid,
 * so hairline dividers never dangle into empty space. Emits fillers per
 * breakpoint: 2 columns from `sm`, and 3 columns from `lg` when lgCols is 3.
 */
export function GridFillers({ count, lgCols = 3 }: GridFillersProps) {
  const smFill = count % 2 === 0 ? 0 : 1;
  const lgFill = lgCols === 3 ? (3 - (count % 3)) % 3 : 0;

  return (
    <>
      {Array.from({ length: smFill }).map((_, index) => (
        <div
          aria-hidden="true"
          className={cn("hidden bg-white sm:block", lgCols === 3 && "lg:hidden")}
          key={`sm-fill-${index}`}
        />
      ))}
      {lgCols === 3
        ? Array.from({ length: lgFill }).map((_, index) => (
            <div
              aria-hidden="true"
              className="hidden bg-white lg:block"
              key={`lg-fill-${index}`}
            />
          ))
        : null}
    </>
  );
}
