"use client";

import { useLocale, useTranslations } from "next-intl";

import { AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { Button } from "@/shared/components/ui/Button";
import { env } from "@/shared/config/env";

export function GoogleLoginButton() {
  const t = useTranslations("auth");
  const locale = useLocale();

  function handleGoogleLogin() {
    const apiBase = env.apiUrl.replace(/\/$/, "");
    const siteBase = env.siteUrl.replace(/\/$/, "");
    const origin = `${siteBase}/${locale}`;
    const url = new URL(`${apiBase}${AUTH_ENDPOINTS.google}`);
    url.searchParams.set("origin", origin);
    window.location.assign(url.toString());
  }

  return (
    <Button
      className="w-full rounded-none border border-neutral-300 bg-white text-ink hover:bg-neutral-50"
      onClick={handleGoogleLogin}
      type="button"
      variant="secondary"
    >
      <span className="mr-2 inline-flex h-4 w-4 items-center justify-center font-serif text-sm font-bold text-[#4285F4]">
        G
      </span>
      {t("continueWithGoogle")}
    </Button>
  );
}
