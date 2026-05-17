import DashboardShell from "@/components/layout/dashboard-shell";
import ProjectTable from "@/components/projects/project-table";
import ProjectForm from "@/components/projects/project-form";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

type ProjectsPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  return (
    <DashboardShell>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 pb-7 md:gap-6 md:pb-10 lg:gap-8">
        <header
          className={`max-w-2xl ${isArabic ? "mr-0 ml-auto text-right" : "text-left"}`}
        >
          <p className="mb-1 text-[11px] font-medium text-[var(--foreground-muted)] md:text-sm">
            {messages.topbar.overview}
          </p>

          <h1 className="section-title">{messages.sidebar.projects}</h1>

          <p className="section-subtitle mt-1.5 md:mt-2">
            {messages.projects.subtitle}
          </p>
        </header>

        <section>
          <ProjectForm locale={locale} />
        </section>

        <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2.5 md:rounded-xl md:p-4 lg:rounded-2xl lg:p-6">
          <ProjectTable locale={locale} />
        </section>
      </div>
    </DashboardShell>
  );
}