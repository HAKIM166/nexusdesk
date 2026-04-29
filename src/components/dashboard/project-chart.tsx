"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Locale } from "@/lib/constants";
import { getDashboardMetrics } from "@/lib/dashboard-helpers";
import { getMessages } from "@/lib/helpers";
import { useProjectStore } from "@/store/project-store";

const COLORS = ["#b6ff66", "#22c55e", "#facc15", "#64748b"];

type ProjectChartProps = {
  locale: Locale;
};

type StatusName = keyof ReturnType<typeof getMessages>["common"]["status"];

function translateStatus(
  name: string,
  messages: ReturnType<typeof getMessages>
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

  const projects = useProjectStore((state) => state.projects);

  const chartData = useMemo(() => {
    const metrics = getDashboardMetrics([], projects);

    return metrics.statusDistribution.filter((item) => item.value > 0);
  }, [projects]);

  return (
    <div className="panel overflow-hidden">
      <div
        className={`border-b border-[var(--border)] px-6 py-4 ${
          isArabic ? "text-right" : "text-left"
        }`}
      >
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          {messages.dashboard.projectStatusTitle}
        </h2>
        <p className="text-sm text-[var(--foreground-soft)]">
          {messages.dashboard.projectStatusSubtitle}
        </p>
      </div>

      <div className="h-[320px] w-full px-4 py-6">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  value,
                  translateStatus(String(name), messages),
                ]}
                contentStyle={{
                  background: "rgba(10, 22, 17, 0.96)",
                  border: "1px solid rgba(168, 255, 196, 0.12)",
                  borderRadius: "16px",
                  color: "#f5fff8",
                  direction: isArabic ? "rtl" : "ltr",
                  textAlign: isArabic ? "right" : "left",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div
            className={`flex h-full items-center justify-center text-sm text-[var(--foreground-soft)] ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {locale === "ar"
              ? "لا توجد مشاريع لعرضها بعد."
              : "No projects to display yet."}
          </div>
        )}
      </div>
    </div>
  );
}