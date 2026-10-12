import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface ContentFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * Single outer content frame for dense Bloomberg-style stacks.
 * Mobile uses horizontal rules only; modules supply the content gutters.
 * Visible children are separated by hairline divide-y rules; null siblings are omitted.
 */
export function ContentFrame({ children, className }: ContentFrameProps) {
  return (
    <div
      data-editorial-frame
      className={cn(
        "border-y border-neutral-200 divide-y divide-neutral-200 bg-white md:border",
        className,
      )}
    >
      {children}
    </div>
  );
}
