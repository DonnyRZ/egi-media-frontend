import Image from "next/image";
import { useTranslations } from "next-intl";

import { SocialLinks } from "@/features/footer/components/SocialLinks";
import { Link } from "@/i18n/navigation";
import { Container } from "@/shared/components/layout/Container";
import { SITE_NAME } from "@/shared/constants/site.constants";

const COMPANY_LINKS = [
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

const LEGAL_LINKS = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "pedomanMediaSiber", href: "/pedoman-media-siber" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-800 bg-ink text-white">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              aria-label={SITE_NAME}
              className="inline-flex"
              href="/"
            >
              <Image
                alt={SITE_NAME}
                className="h-12 w-auto"
                height={857}
                src="/images/Logo_EGI-Media-2.png"
                width={1536}
              />
            </Link>
            <p className="mt-4 text-sm leading-6 text-neutral-400">{t("tagline")}</p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
              {t("company")}
            </h2>
            <ul className="mt-4 space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link className="text-sm text-neutral-300 hover:text-white" href={link.href}>
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
              {t("legal")}
            </h2>
            <ul className="mt-4 space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link className="text-sm text-neutral-300 hover:text-white" href={link.href}>
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
              {t("followUs")}
            </h2>
            <SocialLinks />
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-800 pt-6 text-sm text-neutral-500">
          <p>{t("copyright", { year: currentYear, siteName: SITE_NAME })}</p>
        </div>
      </Container>
    </footer>
  );
}
