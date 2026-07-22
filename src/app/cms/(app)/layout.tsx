import { CmsShell } from "@/features/cms/components/layout/CmsShell";

export default function CmsAppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <CmsShell>{children}</CmsShell>;
}
