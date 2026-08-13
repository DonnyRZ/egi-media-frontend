"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { ProfesionalDesktopNav } from "@/features/profesional/components/ProfesionalDesktopNav";
import { ProfesionalHeaderActions } from "@/features/profesional/components/ProfesionalHeaderActions";
import { ProfesionalMegaMenu } from "@/features/profesional/components/ProfesionalMegaMenu";
import { ProfesionalMobileNav } from "@/features/profesional/components/ProfesionalMobileNav";
import { ProfesionalUtilityBar } from "@/features/profesional/components/ProfesionalUtilityBar";
import { PROFESIONAL_ROUTES } from "@/features/profesional/constants/profesional.constants";
import { Link } from "@/i18n/navigation";

export function ProfesionalHeader() {
  const t = useTranslations("profesional");
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);

  return (
    <header className="profesional-header">
      <ProfesionalUtilityBar />
      <div className="profesional-header-bar" onMouseLeave={() => setMega(false)}>
        <div className="profesional-header-main">
          <Link className="profesional-brand" href={PROFESIONAL_ROUTES.home}>
            {t("brand")}
          </Link>
          <ProfesionalDesktopNav megaOpen={mega} onMega={setMega} />
          <ProfesionalHeaderActions menuOpen={open} onMenu={() => setOpen((value) => !value)} />
        </div>
        <ProfesionalMegaMenu open={mega} />
      </div>
      {open ? <ProfesionalMobileNav onClose={() => setOpen(false)} /> : null}
    </header>
  );
}
