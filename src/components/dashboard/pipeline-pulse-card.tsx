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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(numberLocale, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const bars = [
    30, 44, 58, 72, 64, 82, 54, 42, 68, 76, 96, 56, 70, 88, 62, 74, 52,
  ];

  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      className={`panel relative h-full cursor-pointer overflow-hidden ${
        isArabic ? "text-right" : "text-left"
      }`}
    >
      <div className="flex min-h-[86px] items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
        <div>
          <p className="text-sm text-[var(--foreground-soft)]">
            {isArabic ? "نبض المبيعات" : "Sales Pulse"}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              {formatCurrency(metrics.totalPipeline)}
            </h2>

            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
              <ArrowUpRight size={11} />
              7%
            </span>
          </div>
        </div>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--foreground-soft)] transition hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
          aria-label="More"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="relative px-6 py-5">
        <div className="pointer-events-none absolute left-1/2 top-[96px] h-16 w-40 -translate-x-1/2 rounded-full bg-[var(--primary)]/15 blur-3xl" />

        <div className="relative mx-auto flex h-[98px] max-w-[230px] items-end justify-center gap-2">
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
              className="w-[6px] rounded-full bg-gradient-to-t from-[var(--primary)] to-[#b6ff66] shadow-[0_0_14px_rgba(182,255,102,0.22)]"
            />
          ))}
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2 text-[var(--foreground-soft)]">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              {isArabic ? "الإيرادات" : "Revenue"}
            </span>

            <span className="font-semibold text-[var(--foreground)]">
              {formatCurrency(metrics.totalRevenue)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2 text-[var(--foreground-soft)]">
              <span className="h-2 w-2 rounded-full bg-[var(--surface-2)]" />
              {isArabic ? "المتبقي" : "Remaining"}
            </span>

            <span className="font-semibold text-[var(--foreground)]">
              {formatCurrency(
                Math.max(metrics.totalPipeline - metrics.totalRevenue, 0),
              )}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-[8px] border border-[var(--border)]/60 bg-[var(--surface-2)] px-4 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5"
        >
          {isArabic ? "عرض التقرير" : "View report"}
          <ArrowUpRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
