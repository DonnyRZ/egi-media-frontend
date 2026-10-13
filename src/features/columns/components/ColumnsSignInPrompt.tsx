"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/Button";

export function ColumnsSignInPrompt() {
  const t = useTranslations("columnsPage");

  return (
    <div className="mx-auto max-w-md border border-neutral-300 bg-white p-8 text-center shadow-sm">
      <h2 className="editorial-section-title font-sans text-xl font-bold text-ink">{t("signInTitle")}</h2>
      <p className="editorial-summary mt-2 text-sm leading-6 text-neutral-600">
        {t("signInMessage")}
      </p>
      <Link className="mt-5 inline-block" href="/login">
        <Button className="rounded-none" type="button">
          {t("signInCta")}
        </Button>
      </Link>
    </div>
  );
}
