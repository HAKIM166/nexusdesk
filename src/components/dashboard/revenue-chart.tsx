"use client";

import { useMemo, useState } from "react";
import { useProjectStore } from "@/store/project-store";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RevenueChartProps = {
  locale: Locale;
};

const monthLabels = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو"],
};

export default function RevenueChart({ locale }: RevenueChartProps) {
  const messages = getMessages(locale);
  const isArabic = locale === "ar";
  const [animationKey, setAnimationKey] = useState(0);
  const projects = useProjectStore((state) => state.projects);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(isArabic ? "ar-EG" : "en-US", {
        maximumFractionDigits: 0,
      }),
    [isArabic],
  );

  const compactNumberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(isArabic ? "ar-EG" : "en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    [isArabic],
  );

  const revenueData = useMemo(() => {
    const labels = isArabic ? monthLabels.ar : monthLabels.en;

    const totalPaid = projects.reduce((total, project) => {
      const amount = Number(project.paidAmount ?? 0);
      return total + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    const fallbackBase = projects.length > 0 ? 900 : 600;
    const weights = [0.08, 0.1, 0.12, 0.14, 0.15, 0.19, 0.22];

    return labels.map((month, index) => ({
      month,
      revenue:
        totalPaid > 0
          ? Math.max(Math.round(totalPaid * weights[index]), 500)
          : fallbackBase + index * 180,
    }));
  }, [isArabic, projects]);

  return (
    <section
      className="group relative overflow-hidden border-t border-[var(--border)] pt-4 transition md:pt-5"
      onMouseEnter={() => setAnimationKey((current) => current + 1)}
    >
      <div
        className={`mb-4 px-1 md:mb-5 ${isArabic ? "text-right" : "text-left"}`}
      >
        <h2 className="text-[18px] font-semibold leading-6 text-[var(--foreground)] md:text-lg">
          {messages.dashboard.revenueTitle}
        </h2>

        <p className="mt-1 text-[12px] leading-5 text-[var(--foreground-soft)] md:text-sm">
          {messages.dashboard.revenueSubtitle}
        </p>
      </div>

      <div className="relative h-[220px] w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/25 px-1.5 py-3 md:h-[320px] md:px-4 md:py-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            key={animationKey}
            data={revenueData}
            margin={{
              top: 8,
              right: 10,
              left: 2,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-revenue-fill)"
                  stopOpacity={0.28}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-revenue-fill)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="var(--chart-revenue-grid)"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "var(--chart-revenue-tick)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />

            <YAxis
  tick={{ fill: "var(--chart-revenue-tick)", fontSize: 10 }}
  tickFormatter={(value) => compactNumberFormatter.format(value)}
  axisLine={false}
  tickLine={false}
  width={46}
/>

            <Tooltip
              formatter={(value) => [
                numberFormatter.format(Number(value)),
                messages.dashboard.revenueTitle,
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

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--chart-revenue-line)"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
              dot={{
                r: 3,
                fill: "var(--chart-revenue-line)",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 4.5,
                fill: "var(--chart-revenue-active)",
                strokeWidth: 0,
              }}
              isAnimationActive
              animationBegin={120}
              animationDuration={1800}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
