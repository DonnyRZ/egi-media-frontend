import type { ReactNode } from "react";

import { ProfesionalFooter } from "@/features/profesional/components/ProfesionalFooter";
import { ProfesionalHeader } from "@/features/profesional/components/ProfesionalHeader";

interface ProfesionalShellProps {
  children: ReactNode;
}

export function ProfesionalShell({ children }: ProfesionalShellProps) {
  return (
    <div className="profesional-root" id="top">
      <ProfesionalHeader />
      <main>{children}</main>
      <ProfesionalFooter />
    </div>
  );
}
