import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("editorial-container mx-auto w-full max-w-[1584px] px-4 md:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
