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
        dense ? "py-6 first:pt-0 lg:py-8" : "py-12 lg:py-16",
        className,
      )}
    >
      {children}
    </section>
  );
}
