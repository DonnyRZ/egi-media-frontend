"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/Button";

export function ForYouGuestCta() {
  const t = useTranslations("forYou");

  return (
    <div className="bg-white px-4 py-10 text-center md:px-6">
      <h3 className="editorial-card-title font-sans text-2xl font-bold text-ink">{t("guestTitle")}</h3>
      <p className="editorial-summary mx-auto mt-2 max-w-xl text-sm leading-6 text-neutral-600">
        {t("guestMessage")}
      </p>
      <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/register">
          <Button type="button">{t("guestSignUpCta")}</Button>
        </Link>
        <Link href="/login">
          <Button type="button" variant="secondary">
            {t("guestSignInCta")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
