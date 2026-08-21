import { useTranslations } from "next-intl";

export function ContactFormSuccess() {
  const t = useTranslations("contact");

  return (
    <div
      className="border border-neutral-200 bg-neutral-50 px-6 py-10"
      role="status"
    >
      <p className="kicker">{t("formSuccessKicker")}</p>
      <p className="mt-3 font-serif text-2xl font-bold leading-snug text-ink">
        {t("formSuccess")}
      </p>
    </div>
  );
}
