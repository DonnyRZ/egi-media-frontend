import { useTranslations } from "next-intl";

import { PROFESIONAL_ANCHORS } from "@/features/profesional/constants/profesional.constants";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from "@/features/contact/constants/contact.constants";
import { Link } from "@/i18n/navigation";
import { env } from "@/shared/config/env";

export function ProfesionalFooter() {
  const t = useTranslations("profesional");
  const year = new Date().getFullYear();

  return (
    <footer className="profesional-footer">
      <div className="profesional-footer-inner">
        <div>
          <p className="profesional-footer-brand">{t("brand")}</p>
          <p className="profesional-footer-blurb">{t("footerBlurb")}</p>
        </div>
        <div>
          <p className="profesional-kicker">{t("footerContact")}</p>
          <a href={CONTACT_EMAIL_HREF}>{CONTACT_EMAIL}</a>
        </div>
        <div className="profesional-footer-links">
          <a href={`#${PROFESIONAL_ANCHORS.demo}`}>{t("requestDemo")}</a>
          <a href={env.aiAppUrl} rel="noreferrer">{t("signIn")}</a>
          <Link href="/">{t("footerNews")}</Link>
          <Link href="/privacy">{t("footerPrivacy")}</Link>
        </div>
      </div>
      <p className="profesional-footer-copy">© {year} {t("brand")}</p>
    </footer>
  );
}
