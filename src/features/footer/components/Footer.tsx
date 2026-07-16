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
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "X", href: "https://x.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-300 bg-primary-900 text-white">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xl font-bold">{SITE_NAME}</p>
            <p className="mt-3 text-sm leading-6 text-primary-100">
              Premium digital news with editorial clarity, professional design,
              and trusted reporting.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide">Company</h2>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link className="text-sm text-primary-100 hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide">Legal</h2>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link className="text-sm text-primary-100 hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide">Follow Us</h2>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.social.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-sm text-primary-100 hover:text-white"
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

        <div className="mt-10 border-t border-primary-700 pt-6 text-sm text-primary-100">
          <p>© {currentYear} {SITE_NAME}. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
