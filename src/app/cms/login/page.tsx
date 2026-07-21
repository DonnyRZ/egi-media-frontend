import { CmsLoginForm } from "@/features/cms/components/auth/CmsLoginForm";

export default function CmsLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent font-serif text-lg font-bold text-white">
            E
          </span>
          <h1 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            EGI Media Editorial
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Sign in to the newsroom CMS
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <CmsLoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-neutral-400">
          Authorized authors and administrators only.
        </p>
      </div>
    </div>
  );
}
