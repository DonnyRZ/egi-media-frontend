import type { ReactNode } from "react";

import { Container } from "@/shared/components/layout/Container";
import { ContentFrame } from "@/shared/components/layout/ContentFrame";
import { cn } from "@/shared/lib/cn";

interface PageFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * Page-level shell for editorial listings/details: one Container + one ContentFrame.
 * Children should be FrameModule(s) only — no nested Container/Section/outer borders.
 */
export function PageFrame({ children, className }: PageFrameProps) {
  return (
    <Container className={cn("editorial-page-frame px-0 py-0 md:px-6 lg:px-8", className)}>
      <ContentFrame>{children}</ContentFrame>
    </Container>
  );
}
