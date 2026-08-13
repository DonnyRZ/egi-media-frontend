import { useTranslations } from "next-intl";

import {
  PRODUCT_CARDS,
  PROFESIONAL_NAV,
  PROFESIONAL_ROUTES,
} from "@/features/profesional/constants/profesional.constants";
import { copyKey } from "@/features/profesional/utils/copy-key";
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from "@/features/contact/constants/contact.constants";
import { Link } from "@/i18n/navigation";
import { env } from "@/shared/config/env";

export function ProfesionalFooter() {
  const t = useTranslations("profesional");
  const year = new Date().getFullYear();

  return (
    <footer className="profesional-footer">
      <div className="profesional-footer-grid">
        <div>
          <h2>{t("footerContact")}</h2>
          <div className="profesional-footer-links">
            <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE_DISPLAY}</a>
            <a href={CONTACT_EMAIL_HREF}>{CONTACT_EMAIL}</a>
          </div>
        </div>
        <div>
          <h2>{t("navProducts")}</h2>
          <div className="profesional-footer-links">
            {PRODUCT_CARDS.map((item) => (
              <Link href={item.href} key={item.key}>
                {t(copyKey("product", item.key))}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2>{t("footerAccess")}</h2>
          <div className="profesional-footer-links">
            <a href={env.aiAppUrl} rel="noreferrer">{t("signIn")}</a>
            <Link href="/" locale="id">{t("footerNews")}</Link>
            {PROFESIONAL_NAV.map((item) => (
              <Link href={item.href} key={item.key}>{t(item.key)}</Link>
            ))}
          </div>
        </div>
        <div>
          <p>{t("footerBlurb")}</p>
          <p>
            <Link href={PROFESIONAL_ROUTES.support}>{t("requestDemo")} →</Link>
          </p>
        </div>
      </div>
      <p className="profesional-footer-copy">© {year} {t("brand")}</p>
    </footer>
  );
}
