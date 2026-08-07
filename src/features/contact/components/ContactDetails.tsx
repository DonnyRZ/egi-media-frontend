import Image from "next/image";
import { useTranslations } from "next-intl";

import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_IMAGE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from "@/features/contact/constants/contact.constants";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";

export function ContactDetails() {
  const t = useTranslations("contact");

  return (
    <Section ariaLabelledby="contact-details-heading">
      <Container>
        <h2 id="contact-details-heading" className="sr-only">
          {t("kicker")}
        </h2>

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-10 lg:col-span-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                {t("studioTitle")}
              </h3>
              <p className="mt-3 font-serif text-2xl font-bold text-ink">{t("building")}</p>
              <p className="mt-2 text-base leading-7 text-neutral-700">{t("addressLine")}</p>
              <p className="text-base leading-7 text-neutral-700">{t("addressCity")}</p>
            </div>

            <div className="border-t border-neutral-200 pt-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                {t("callTitle")}
              </h3>
              <a
                className="mt-3 inline-block font-serif text-xl font-semibold text-ink transition-colors hover:text-accent"
                href={CONTACT_PHONE_HREF}
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>

            <div className="border-t border-neutral-200 pt-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                {t("mailTitle")}
              </h3>
              <a
                className="mt-3 inline-block font-serif text-xl font-semibold text-ink transition-colors hover:text-accent"
                href={CONTACT_EMAIL_HREF}
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 lg:col-span-7 lg:aspect-[5/4]">
            <Image
              alt={t("imageAlt")}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              src={CONTACT_IMAGE}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
