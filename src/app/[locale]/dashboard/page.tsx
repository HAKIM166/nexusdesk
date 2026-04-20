import ClientsTable from "@/components/dashboard/clients-table";
import KpiCard from "@/components/dashboard/kpi-card";
import ProjectChart from "@/components/dashboard/project-chart";
import RevenueChart from "@/components/dashboard/revenue-chart";
import DashboardShell from "@/components/layout/dashboard-shell";
import { kpiData } from "@/data/dashboard";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

type DashboardPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const messages = getMessages(locale);

  const localizedKpis = [
    { title: messages.dashboard.kpis.clients, value: kpiData[0].value },
    { title: messages.dashboard.kpis.projects, value: kpiData[1].value },
    { title: messages.dashboard.kpis.revenue, value: kpiData[2].value },
    { title: messages.dashboard.kpis.tasks, value: kpiData[3].value },
  ];

  return (
    <DashboardShell>
      <div className="space-y-10">
        <div>
          <h1 className="section-title">{messages.dashboard.title}</h1>
          <p className="section-subtitle">{messages.dashboard.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {localizedKpis.map((item) => (
            <KpiCard key={item.title} title={item.title} value={item.value} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RevenueChart locale={locale} />
          </div>

          <ProjectChart locale={locale} />
        </div>

        <ClientsTable locale={locale} />
      </div>
    </DashboardShell>
  );
}