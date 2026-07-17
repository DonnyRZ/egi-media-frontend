import Link from "next/link";

import { Container } from "@/shared/components/layout/Container";
import { SITE_NAME } from "@/shared/constants/site.constants";

const FOOTER_LINKS = {
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  social: [
    { label: "YouTube", href: "https://youtube.com" },
    { label: "X", href: "https://x.com" },
    { label: "Spotify", href: "https://spotify.com" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-accent bg-ink text-white">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-serif text-2xl font-bold">{SITE_NAME}</p>
            <p className="mt-3 text-sm leading-6 text-neutral-400">
              Premium digital news with editorial clarity, professional design,
              and trusted reporting.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
              Company
            </h2>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link className="text-sm text-neutral-300 hover:text-accent" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
              Legal
            </h2>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link className="text-sm text-neutral-300 hover:text-accent" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
              Follow Us
            </h2>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.social.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-sm text-neutral-300 hover:text-accent"
                    href={link.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-800 pt-6 text-sm text-neutral-500">
          <p>© {currentYear} {SITE_NAME}. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
