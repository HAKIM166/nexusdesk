"use client";

import { useEffect, useMemo } from "react";
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

type KpiTone = {
  gradient: string;
  badge: string;
  icon: string;
  glow: string;
};

export default function DashboardOverview() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  const clients = useClientStore((state) => state.clients);
  const projects = useProjectStore((state) => state.projects);
  const initializeClients = useClientStore((state) => state.initializeClients);

  const initializeProjects = useProjectStore(
    (state) => state.initializeProjects,
  );

  const clientsLoading = useClientStore((state) => state.isLoading);

  const projectsLoading = useProjectStore((state) => state.isLoading);

  useEffect(() => {
    initializeClients();
    initializeProjects();
  }, [initializeClients, initializeProjects]);
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

  const tones: Record<string, KpiTone> = {
    revenue: {
      gradient: "from-[var(--kpi-revenue-soft)] via-transparent to-transparent",
      badge:
        "border-[var(--kpi-revenue-soft)] bg-[var(--kpi-revenue-soft)] text-[var(--kpi-revenue-icon)]",
      icon: "border-[var(--kpi-revenue-soft)] bg-[var(--kpi-revenue-soft)] text-[var(--kpi-revenue-icon)]",
      glow: "bg-[var(--kpi-revenue-soft)]",
    },
    clients: {
      gradient: "from-[var(--kpi-clients-soft)] via-transparent to-transparent",
      badge:
        "border-[var(--kpi-clients-soft)] bg-[var(--kpi-clients-soft)] text-[var(--kpi-clients-icon)]",
      icon: "border-[var(--kpi-clients-soft)] bg-[var(--kpi-clients-soft)] text-[var(--kpi-clients-icon)]",
      glow: "bg-[var(--kpi-clients-soft)]",
    },
    projects: {
      gradient:
        "from-[var(--kpi-projects-soft)] via-transparent to-transparent",
      badge:
        "border-[var(--kpi-projects-soft)] bg-[var(--kpi-projects-soft)] text-[var(--kpi-projects-icon)]",
      icon: "border-[var(--kpi-projects-soft)] bg-[var(--kpi-projects-soft)] text-[var(--kpi-projects-icon)]",
      glow: "bg-[var(--kpi-projects-soft)]",
    },
    completion: {
      gradient:
        "from-[var(--kpi-completion-soft)] via-transparent to-transparent",
      badge:
        "border-[var(--kpi-completion-soft)] bg-[var(--kpi-completion-soft)] text-[var(--kpi-completion-icon)]",
      icon: "border-[var(--kpi-completion-soft)] bg-[var(--kpi-completion-soft)] text-[var(--kpi-completion-icon)]",
      glow: "bg-[var(--kpi-completion-soft)]",
    },
  };

  const revenueTrend =
    metrics.totalPipeline > 0
      ? Math.round((metrics.totalRevenue / metrics.totalPipeline) * 100)
      : 0;

  const clientsTrend =
    metrics.totalClients > 0 ? Math.min(metrics.totalClients * 6, 99) : 0;

  const projectsTrend =
    metrics.totalProjects > 0
      ? Math.round((metrics.activeProjects / metrics.totalProjects) * 100)
      : 0;

  const completionTrend = Math.round(metrics.completionRate);

  const kpis = [
    {
      label: isArabic ? "الإيرادات" : "Revenue",
      value: formatCurrency(metrics.totalRevenue),
      hint: isArabic
        ? `من إجمالي ${formatCurrency(metrics.totalPipeline)}`
        : `From ${formatCurrency(metrics.totalPipeline)} pipeline`,
      trend: `+${formatNumber(revenueTrend)}%`,
      icon: DollarSign,
      tone: tones.revenue,
    },
    {
      label: messages.dashboard.kpis.clients,
      value: formatNumber(metrics.totalClients),
      hint: isArabic ? "إجمالي العملاء المسجلين" : "Total tracked clients",
      trend: `+${formatNumber(clientsTrend)}%`,
      icon: Users,
      tone: tones.clients,
    },
    {
      label: messages.dashboard.kpis.projects,
      value: formatNumber(metrics.activeProjects),
      hint: isArabic
        ? `من أصل ${formatNumber(metrics.totalProjects)} مشروع`
        : `Out of ${formatNumber(metrics.totalProjects)} total projects`,
      trend: `+${formatNumber(projectsTrend)}%`,
      icon: Briefcase,
      tone: tones.projects,
    },
    {
      label: messages.dashboard.completionRate,
      value: `${formatNumber(metrics.completionRate)}%`,
      hint: isArabic
        ? `${formatNumber(metrics.completedProjects)} مشاريع مكتملة`
        : `${formatNumber(metrics.completedProjects)} completed projects`,
      trend: `+${formatNumber(completionTrend)}%`,
      icon: CheckCircle2,
      tone: tones.completion,
    },
  ];
  if (clientsLoading || projectsLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[156px] animate-pulse rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)]"
          />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <div
            key={kpi.label}
            className={`relative min-h-[132px] overflow-hidden border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-all duration-300 sm:min-h-[156px] sm:p-4 sm:shadow-[0_14px_34px_rgba(15,23,42,0.06)] ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${kpi.tone.gradient} opacity-60 transition-opacity duration-300 sm:h-24 dark:opacity-80`}
            />

            <div
              className={`pointer-events-none absolute -end-8 -top-8 h-20 w-20 rounded-full ${kpi.tone.glow} blur-2xl transition-opacity duration-300 sm:-end-10 sm:-top-10 sm:h-28 sm:w-28`}
            />

            <div className="relative z-10 flex items-start justify-between gap-2 sm:gap-4">
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-[var(--muted-foreground)] sm:text-[13px]">
                  {kpi.label}
                </p>

                <div className="mt-2 flex flex-col items-start gap-1.5 sm:mt-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                  <h3 className="max-w-full truncate text-[18px] font-semibold leading-none tracking-tight text-[var(--foreground)] sm:text-[28px]">
                    {kpi.value}
                  </h3>

                  <span
                    className={`inline-flex w-fit items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold sm:px-2 sm:text-[10px] ${kpi.tone.badge}`}
                  >
                    <ArrowUpRight
                      size={10}
                      className="sm:h-[11px] sm:w-[11px]"
                    />
                    {kpi.trend}
                  </span>
                </div>
              </div>

              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border shadow-sm sm:h-10 sm:w-10 ${kpi.tone.icon}`}
              >
                <Icon size={15} className="sm:h-[18px] sm:w-[18px]" />
              </div>
            </div>

            <div className="relative z-10 mt-3 border-t border-[var(--border)]/80 pt-2 sm:mt-4 sm:pt-3">
              <p className="line-clamp-2 text-[10px] leading-4 text-[var(--muted-foreground)] sm:text-[11px]">
                {kpi.hint}
              </p>
            </div>

            <span className="absolute bottom-3 end-3 text-[var(--muted-foreground)] opacity-20 transition-all duration-300 sm:bottom-4 sm:end-4 sm:opacity-30">
              <ArrowUpRight size={12} className="sm:h-[14px] sm:w-[14px]" />
            </span>
          </div>
        );
      })}
    </div>
  );
}
