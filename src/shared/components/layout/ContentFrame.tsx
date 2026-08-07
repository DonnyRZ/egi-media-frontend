import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface ContentFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * Single outer content frame for dense Bloomberg-style stacks.
 * Visible children are separated by hairline divide-y rules; null siblings are omitted.
 */
export function ContentFrame({ children, className }: ContentFrameProps) {
  return (
    <div
      className={cn(
        "border border-neutral-200 divide-y divide-neutral-200 bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}
