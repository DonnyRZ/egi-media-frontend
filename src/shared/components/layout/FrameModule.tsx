import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface FrameModuleProps {
  children: ReactNode;
  className?: string;
  ariaLabelledby?: string;
}

/**
 * One flush module inside ContentFrame. No outer border or vertical section padding.
 */
export function FrameModule({
  children,
  className,
  ariaLabelledby,
}: FrameModuleProps) {
  return (
    <section aria-labelledby={ariaLabelledby} className={cn(className)}>
      {children}
    </section>
  );
}
