import ProjectChart from "@/components/dashboard/project-chart";
import RevenueChart from "@/components/dashboard/revenue-chart";
import DashboardDetails from "@/components/dashboard/dashboard-details";
import DashboardOverview from "@/components/dashboard/dashboard-overview";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

import MarketingFooter from "@/components/marketing/dashboard-footer";

import PipelinePulseCard from "@/components/dashboard/pipeline-pulse-card";

type DashboardPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  return (
    <DashboardShell>
      <div className="space-y-5 md:space-y-8">
        <div className={isArabic ? "text-right" : "text-left"}>
          <h1 className="section-title">{messages.dashboard.title}</h1>
          <p className="section-subtitle">{messages.dashboard.subtitle}</p>
        </div>

        <DashboardOverview />

        <div className="grid grid-cols-1 items-stretch gap-4 md:gap-6 xl:grid-cols-12">
          <div className="min-w-0 xl:col-span-6">
            <RevenueChart locale={locale} />
          </div>

          <div className="min-w-0 xl:col-span-3">
            <ProjectChart locale={locale} />
          </div>

          <div className="min-w-0 xl:col-span-3">
            <PipelinePulseCard />
          </div>
        </div>

        <DashboardDetails />

        <div className="-mx-4 pt-1 md:-mx-7 md:pt-4 lg:-mx-8">
          <MarketingFooter isArabic={isArabic} variant="dashboard" />
        </div>
      </div>
    </DashboardShell>
  );
}