"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Button } from "@/shared/components/ui/Button";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";

export function ColumnsHero() {
  const t = useTranslations("columnsPage");
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const actions = isHydrated ? (
    isAuthenticated ? (
      <>
        <Link href="/kolom/tulis">
          <Button className="rounded-none" type="button">
            {t("writeCta")}
          </Button>
        </Link>
        <Link href="/kolom/saya">
          <Button className="rounded-none" type="button" variant="secondary">
            {t("myColumnsCta")}
          </Button>
        </Link>
      </>
    ) : (
      <Link href="/login">
        <Button className="rounded-none" type="button">
          {t("signInToWrite")}
        </Button>
      </Link>
    )
  ) : null;

  return (
    <FrameModule ariaLabelledby="columns-hero-heading">
      <FramePageHero
        actions={actions}
        kicker={t("kicker")}
        lede={t("lede")}
        title={t("headline")}
        titleId="columns-hero-heading"
      />
    </FrameModule>
  );
}
