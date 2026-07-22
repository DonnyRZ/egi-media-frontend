"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Button } from "@/shared/components/ui/Button";
import { Container } from "@/shared/components/layout/Container";

export function ColumnsHero() {
  const t = useTranslations("columnsPage");
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section
      aria-labelledby="columns-hero-heading"
      className="border-b border-neutral-200 bg-neutral-50"
    >
      <Container className="py-8 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="kicker">{t("kicker")}</p>
            <h1
              className="mt-2 font-serif text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl"
              id="columns-hero-heading"
            >
              {t("headline")}
            </h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600 lg:text-base lg:leading-7">
              {t("lede")}
            </p>
          </div>

          {isHydrated ? (
            <div className="flex flex-wrap gap-3">
              {isAuthenticated ? (
                <>
                  <Link href="/kolom/tulis">
                    <Button className="rounded-none" type="button">
                      {t("writeCta")}
                    </Button>
                  </Link>
                  <Link href="/kolom/saya">
                    <Button
                      className="rounded-none"
                      type="button"
                      variant="secondary"
                    >
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
              )}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
