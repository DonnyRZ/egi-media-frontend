import type { ReactNode } from "react";

import { ProfesionalFooter } from "@/features/profesional/components/ProfesionalFooter";
import { ProfesionalHeader } from "@/features/profesional/components/ProfesionalHeader";
import "@/features/profesional/profesional.css";
import "@/features/profesional/profesional-content.css";
import "@/features/profesional/profesional-pages.css";

interface ProfesionalShellProps {
  children: ReactNode;
}

export function ProfesionalShell({ children }: ProfesionalShellProps) {
  return (
    <div className="profesional-root">
      <ProfesionalHeader />
      <main>{children}</main>
      <ProfesionalFooter />
    </div>
  );
}
