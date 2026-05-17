import Link from "next/link";

import DashboardShell from "@/components/layout/dashboard-shell";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

type DocumentationPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

type LegalSection = {
  title: string;
  description: string;
};

export default async function DocumentationPage({
  params,
}: DocumentationPageProps) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const isArabic = locale === "ar";
  const page = messages.legal.documentation;

  return (
    <DashboardShell>
      <section
        className={`mx-auto max-w-5xl py-6 md:py-10 ${
          isArabic ? "text-right" : "text-left"
        }`}
      >
        <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-medium text-soft">
          {page.badge}
        </span>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl">
          {page.title}
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted md:text-base">
          {page.subtitle}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {page.sections.map((section: LegalSection) => (
            <article
              key={section.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
            >
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                {section.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--background)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--primary)]"
          >
            {messages.legal.backToDashboard}
          </Link>
        </div>
      </section>
    </DashboardShell>
  );
}