"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  DollarSign,
  Users,
} from "lucide-react";
import { Locale } from "@/lib/constants";
import { getDashboardMetrics } from "@/lib/dashboard-helpers";
import { getMessages } from "@/lib/helpers";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";

export default function DashboardOverview() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  const clients = useClientStore((state) => state.clients);
  const projects = useProjectStore((state) => state.projects);

  const metrics = useMemo(
    () => getDashboardMetrics(clients, projects),
    [clients, projects],
  );

  const numberLocale = isArabic ? "ar-EG" : "en-US";

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat(numberLocale).format(value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(numberLocale, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const kpis = [
    {
      label: isArabic ? "الإيرادات" : "Revenue",
      value: formatCurrency(metrics.totalRevenue),
      hint: isArabic
        ? `من إجمالي ${formatCurrency(metrics.totalPipeline)}`
        : `From ${formatCurrency(metrics.totalPipeline)} pipeline`,
      trend: "+17%",
      icon: DollarSign,
    },
    {
      label: messages.dashboard.kpis.clients,
      value: formatNumber(metrics.totalClients),
      hint: isArabic ? "إجمالي العملاء المسجلين" : "Total tracked clients",
      trend: "+12",
      icon: Users,
    },
    {
      label: messages.dashboard.kpis.projects,
      value: formatNumber(metrics.activeProjects),
      hint: isArabic
        ? `من أصل ${formatNumber(metrics.totalProjects)} مشروع`
        : `Out of ${formatNumber(metrics.totalProjects)} total projects`,
      trend: "+8%",
      icon: Briefcase,
    },
    {
      label: messages.dashboard.completionRate,
      value: `${formatNumber(metrics.completionRate)}%`,
      hint: isArabic
        ? `${formatNumber(metrics.completedProjects)} مشاريع مكتملة`
        : `${formatNumber(metrics.completedProjects)} completed projects`,
      trend: "+5%",
      icon: CheckCircle2,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <div
            key={kpi.label}
            className={`group relative overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-300 hover:border-[var(--primary)]/60 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium text-[var(--muted-foreground)]">
                  {kpi.label}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <h3 className="text-[28px] font-semibold leading-none tracking-tight text-[var(--foreground)]">
                    {kpi.value}
                  </h3>

                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                    <ArrowUpRight size={11} />
                    {kpi.trend}
                  </span>
                </div>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--primary)]">
                <Icon size={18} />
              </div>
            </div>

            <div className="mt-4 border-t border-[var(--border)] pt-3">
              <p className="text-[11px] text-[var(--muted-foreground)]">
                {kpi.hint}
              </p>
            </div>

            <span className="absolute bottom-4 end-4 text-[var(--muted-foreground)] opacity-40 transition-opacity group-hover:opacity-80">
              <ArrowUpRight size={14} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
