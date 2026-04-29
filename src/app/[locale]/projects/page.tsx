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
      <div className="space-y-10">
        {/* Header */}
        <div className={isArabic ? "text-right" : "text-left"}>
          <h1 className="section-title">
            {messages.sidebar.projects}
          </h1>

          <p className="section-subtitle">
            {locale === "ar"
              ? "إدارة جميع مشاريعك ومتابعة حالتها."
              : "Manage all your projects and track their status."}
          </p>
        </div>

        {/* Form */}
        <div className="panel">
          <ProjectForm locale={locale} />
        </div>

        {/* Table */}
        <div className="panel">
          <ProjectTable locale={locale} />
        </div>
      </div>
    </DashboardShell>
  );
}