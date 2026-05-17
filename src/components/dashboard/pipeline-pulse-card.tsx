"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { Locale } from "@/lib/constants";
import { getDashboardMetrics } from "@/lib/dashboard-helpers";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";

export default function PipelinePulseCard() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const isArabic = locale === "ar";

  const clients = useClientStore((state) => state.clients);
  const projects = useProjectStore((state) => state.projects);

  const metrics = useMemo(
    () => getDashboardMetrics(clients, projects),
    [clients, projects],
  );

  const numberLocale = isArabic ? "ar-EG" : "en-US";

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(numberLocale, {
        maximumFractionDigits: 0,
      }),
    [numberLocale],
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(numberLocale, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const handleViewActions = () => {
    document
      .getElementById("dashboard-quick-actions")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const remainingPipeline = Math.max(
    metrics.totalPipeline - metrics.totalRevenue,
    0,
  );

  const salesPulseRate =
    metrics.totalPipeline > 0
      ? Math.round((metrics.totalRevenue / metrics.totalPipeline) * 100)
      : 0;

  const bars = [
    30, 44, 58, 72, 64, 82, 54, 42, 68, 76, 96, 56, 70, 88, 62, 74, 52,
  ];

  return (
    <motion.section
      initial="rest"
      animate="rest"
      whileHover="hover"
      className={`relative overflow-hidden border-t border-[var(--border)] pt-4 transition md:pt-5 ${
        isArabic ? "text-right" : "text-left"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3 px-1 md:mb-5">
        <div className="min-w-0">
          <h2 className="text-[18px] font-semibold leading-6 text-[var(--foreground)] md:text-lg">
            {isArabic ? "نبض المبيعات" : "Sales Pulse"}
          </h2>

          <p className="mt-1 text-[12px] leading-5 text-[var(--foreground-soft)] md:text-sm">
            {isArabic ? "أداء الإيرادات الحالية" : "Current revenue movement"}
          </p>
        </div>

        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--foreground-soft)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
          aria-label={isArabic ? "المزيد" : "More"}
        >
          <MoreHorizontal size={17} />
        </button>
      </div>

      <div className="flex h-[245px] flex-col justify-between overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/25 px-4 py-4 md:h-[320px] md:px-5 md:py-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-[21px] font-semibold tracking-tight text-[var(--foreground)] md:text-2xl">
            {formatCurrency(metrics.totalPipeline)}
          </h3>

          <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
            <ArrowUpRight size={11} />
            {numberFormatter.format(salesPulseRate)}%
          </span>
        </div>

        <div className="relative mx-auto flex h-[70px] max-w-[270px] items-end justify-center gap-2 md:h-[98px] md:max-w-[260px]">
          {bars.map((height, index) => (
            <motion.span
              key={index}
              variants={{
                rest: {
                  height: height * 0.72,
                  opacity: 0.72,
                },
                hover: {
                  height: [
                    height * 0.72,
                    height,
                    height * 0.82,
                    height * 0.95,
                    height * 0.72,
                  ],
                  opacity: [0.72, 1, 0.82, 0.95, 0.72],
                  transition: {
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.04,
                  },
                },
              }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
              className="w-[7px] rounded-full bg-gradient-to-t from-[var(--primary)] via-[var(--primary)]/80 to-[var(--accent-soft)] md:w-[6px]"
            />
          ))}
        </div>

        <div className="space-y-2.5 md:space-y-3">
          <div className="flex items-center justify-between gap-3 text-[13px] md:text-sm">
            <span className="flex min-w-0 items-center gap-2 text-[var(--foreground-soft)]">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />
              <span className="truncate">
                {isArabic ? "الإيرادات" : "Revenue"}
              </span>
            </span>

            <span className="shrink-0 font-semibold text-[var(--foreground)]">
              {formatCurrency(metrics.totalRevenue)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-[13px] md:text-sm">
            <span className="flex min-w-0 items-center gap-2 text-[var(--foreground-soft)]">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent-soft)]" />
              <span className="truncate">
                {isArabic ? "المتبقي" : "Remaining"}
              </span>
            </span>

            <span className="shrink-0 font-semibold text-[var(--foreground)]">
              {formatCurrency(remainingPipeline)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleViewActions}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[13px] font-medium text-[var(--foreground)] transition hover:border-[var(--primary)]/35 hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] md:px-4 md:py-3 md:text-sm"
        >
          {isArabic ? "عرض الإجراءات" : "View actions"}
          <ArrowUpRight size={13} />
        </button>
      </div>
    </motion.section>
  );
}