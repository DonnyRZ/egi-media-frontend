import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface SectionProps {
  children: ReactNode;
  className?: string;
  ariaLabelledby?: string;
  dense?: boolean;
}

export function Section({ children, className, ariaLabelledby, dense }: SectionProps) {
  return (
    <section
      aria-labelledby={ariaLabelledby}
      className={cn(
        dense
          ? "border-t border-neutral-200 py-8 lg:py-10 first:border-t-0 first:pt-0"
          : "py-12 lg:py-16",
        className,
      )}
    >
      {children}
    </section>
  );
}
