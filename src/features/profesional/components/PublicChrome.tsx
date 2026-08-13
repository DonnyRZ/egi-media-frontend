"use client";

import type { ReactNode } from "react";

import { isProfesionalPath } from "@/features/profesional/constants/profesional.constants";
import { usePathname } from "@/i18n/navigation";

const GOOGLE_CALLBACK_PATH = "/auth/google/callback";

function hidePublicChrome(pathname: string) {
  return isProfesionalPath(pathname) || pathname === GOOGLE_CALLBACK_PATH;
}

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

  if (hidePublicChrome(pathname)) {
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
