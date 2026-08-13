"use client";

import { useLocale, useTranslations } from "next-intl";

import { googleOAuthStartUrl } from "@/features/auth/lib/oauth-next";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { PROFESIONAL_ROUTES } from "@/features/profesional/constants/profesional.constants";
import { useRouter } from "@/i18n/navigation";

export function ProfesionalSignIn() {
  const locale = useLocale();
  const t = useTranslations("profesional");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const logout = useAuthStore((state) => state.logout);

  if (!isHydrated) {
    return <span aria-hidden="true" className="profesional-sign-in" />;
  }

  if (user) {
    async function handleLogout() {
      await logout();
      router.replace(PROFESIONAL_ROUTES.home);
      router.refresh();
    }

    return (
      <span className="profesional-session">
        <span className="profesional-session-name">{user.fullName || user.email}</span>
        <button className="profesional-sign-in" onClick={() => void handleLogout()} type="button">
          {tAuth("signOut")}
        </button>
      </span>
    );
  }

  return (
    <button
      className="profesional-sign-in"
      onClick={() => {
        window.location.assign(googleOAuthStartUrl(locale, PROFESIONAL_ROUTES.home));
      }}
      type="button"
    >
      {t("signIn")}
    </button>
  );
}
