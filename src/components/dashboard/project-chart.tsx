"use client";

import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Locale } from "@/lib/constants";
import { getDashboardMetrics } from "@/lib/dashboard-helpers";
import { getMessages } from "@/lib/helpers";
import { useProjectStore } from "@/store/project-store";

const COLORS = [
  "var(--primary)",
  "var(--success)",
  "var(--warning)",
  "var(--foreground-soft)",
];

type ProjectChartProps = {
  locale: Locale;
};

type StatusName = keyof ReturnType<typeof getMessages>["common"]["status"];

function translateStatus(
  name: string,
  messages: ReturnType<typeof getMessages>,
) {
  return (
    messages.common.status[name as StatusName] ||
    messages.common.status[name.toLowerCase() as StatusName] ||
    name
  );
}

export default function ProjectChart({ locale }: ProjectChartProps) {
  const messages = getMessages(locale);
  const isArabic = locale === "ar";
  const [animationKey, setAnimationKey] = useState(0);

  const projects = useProjectStore((state) => state.projects);

  const chartData = useMemo(() => {
    const metrics = getDashboardMetrics([], projects);
    return metrics.statusDistribution.filter((item) => item.value > 0);
  }, [projects]);

  const totalProjects = chartData.reduce((total, item) => total + item.value, 0);
  const mainStatus = chartData[0];

  const statusSummary =
    chartData.length > 0
      ? isArabic
        ? `يعرض الشارت ${totalProjects} ${
            totalProjects === 1 ? "مشروع" : "مشاريع"
          } حسب الحالة. الحالة الأبرز: ${translateStatus(
            mainStatus.name,
            messages,
          )}.`
        : `Shows ${totalProjects} ${
            totalProjects === 1 ? "project" : "projects"
          } by status. Leading status: ${translateStatus(
            mainStatus.name,
            messages,
          )}.`
      : isArabic
        ? "لا توجد مشاريع لعرض حالتها بعد."
        : "No projects to display yet.";

  return (
    <section
      className="group relative overflow-hidden border-t border-[var(--border)] pt-4 transition md:pt-5"
      onMouseEnter={() => setAnimationKey((current) => current + 1)}
    >
      <div
        className={`mb-4 px-1 md:mb-5 ${
          isArabic ? "text-right" : "text-left"
        }`}
      >
        <h2 className="text-[18px] font-semibold leading-6 text-[var(--foreground)] md:text-lg">
          {messages.dashboard.projectStatusTitle}
        </h2>

        <p className="mt-1 text-[12px] leading-5 text-[var(--foreground-soft)] md:text-sm">
          {messages.dashboard.projectStatusSubtitle}
        </p>
      </div>

      <div className="relative h-[245px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/25 px-3 py-4 md:h-[320px] md:px-4 md:py-5">
        {chartData.length > 0 ? (
          <div className="flex h-full flex-col">
            <div className="min-h-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart key={animationKey}>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="48%"
                    outerRadius="68%"
                    paddingAngle={4}
                    isAnimationActive
                    animationBegin={120}
                    animationDuration={1600}
                    animationEasing="ease-in-out"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                        stroke="var(--surface)"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      translateStatus(String(name), messages),
                    ]}
                    contentStyle={{
                      background: "var(--chart-tooltip-bg)",
                      border: "1px solid var(--chart-tooltip-border)",
                      borderRadius: "12px",
                      color: "var(--chart-tooltip-text)",
                      direction: isArabic ? "rtl" : "ltr",
                      textAlign: isArabic ? "right" : "left",
                      fontSize: "12px",
                      lineHeight: "18px",
                      padding: "8px 10px",
                      boxShadow: "none",
                    }}
                    labelStyle={{
                      color: "var(--chart-tooltip-label)",
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <p
              className={`mx-auto mt-2 max-w-[250px] shrink-0 text-center text-[11.5px] font-medium leading-5 text-[var(--foreground-soft)] md:max-w-[245px] md:text-[12px] ${
                isArabic ? "tracking-[-0.01em]" : ""
              }`}
            >
              {statusSummary}
            </p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-[13px] leading-5 text-[var(--foreground-soft)] md:text-sm">
            {isArabic
              ? "لا توجد مشاريع لعرضها بعد."
              : "No projects to display yet."}
          </div>
        )}
      </div>
    </section>
  );
}