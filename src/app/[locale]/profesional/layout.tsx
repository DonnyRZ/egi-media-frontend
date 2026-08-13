import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";

import { ProfesionalShell } from "@/features/profesional/components/ProfesionalShell";
import { PROFESIONAL_LOCALE } from "@/features/profesional/constants/profesional.constants";

interface ProfesionalLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function ProfesionalLayout({
  children,
  params,
}: ProfesionalLayoutProps) {
  await params;
  setRequestLocale(PROFESIONAL_LOCALE);

  return <ProfesionalShell>{children}</ProfesionalShell>;
}
