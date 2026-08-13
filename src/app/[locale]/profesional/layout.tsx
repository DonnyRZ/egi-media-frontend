import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";

import { ProfesionalShell } from "@/features/profesional/components/ProfesionalShell";

interface ProfesionalLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function ProfesionalLayout({
  children,
  params,
}: ProfesionalLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProfesionalShell>{children}</ProfesionalShell>;
}
