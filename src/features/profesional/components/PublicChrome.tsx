"use client";

import type { ReactNode } from "react";

import { isProfesionalPath } from "@/features/profesional/constants/profesional.constants";
import { usePathname } from "@/i18n/navigation";

interface PublicChromeProps {
  ad: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

export function PublicChrome({
  ad,
  header,
  footer,
  children,
}: PublicChromeProps) {
  const pathname = usePathname();

  if (isProfesionalPath(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      {ad}
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
