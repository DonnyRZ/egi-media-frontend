"use client";

import type { ReactNode } from "react";

import { PROFESIONAL_PATH } from "@/features/profesional/constants/profesional.constants";
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

  if (pathname === PROFESIONAL_PATH) {
    return <>{children}</>;
  }

  const isMediaPage = pathname === "/videos" || pathname.startsWith("/videos/") || pathname === "/shorts";

  return (
    <>
      {ad}
      {header}
      <main className={isMediaPage ? "bg-[#050a16] text-white" : undefined}>{children}</main>
      {footer}
    </>
  );
}
