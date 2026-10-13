import type { ReactNode } from "react";
import { Container } from "@/shared/components/layout/Container";

/** Dark media pages share the masthead's container; content owns its padding. */
export function VideoPageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="video-page-shell min-w-0 bg-[#050a16] text-white">
      <Container className="video-page-container px-0 md:px-0 lg:px-0">
        {children}
      </Container>
    </div>
  );
}
