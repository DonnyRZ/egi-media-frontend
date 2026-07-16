import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface SectionProps {
  children: ReactNode;
  className?: string;
  ariaLabelledby?: string;
}

export function Section({ children, className, ariaLabelledby }: SectionProps) {
  return (
    <section
      aria-labelledby={ariaLabelledby}
      className={cn("py-12 lg:py-16", className)}
    >
      {children}
    </section>
  );
}
