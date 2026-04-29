"use client";

import Link from "next/link";
import { Locale } from "@/lib/constants";

type QuickActionType = "clients" | "projects" | "ai";

type QuickActionsSectionProps = {
  locale: Locale;
  isArabic: boolean;
};

export default function QuickActionsSection({
  locale,
  isArabic,
}: QuickActionsSectionProps) {
  const quickActions: {
    href: string;
    badge: string;
    title: string;
    description: string;
    button: string;
    type: QuickActionType;
  }[] = [
    {
      href: `/${locale}/clients`,
      badge: isArabic ? "العملاء" : "Clients",
      title: isArabic ? "إدارة العملاء بذكاء" : "Smart Client Management",
      description: isArabic
        ? "نظّم بيانات العملاء والتواصل والملاحظات في مكان واحد واضح وسهل."
        : "Keep every lead, contact, and client detail organized in one clean hub.",
      button: isArabic ? "إدارة العملاء" : "Explore more",
      type: "clients",
    },
    {
      href: `/${locale}/projects`,
      badge: isArabic ? "المشاريع" : "Workflows",
      title: isArabic ? "سير عمل منظم" : "Automated Workflows",
      description: isArabic
        ? "تابع المشاريع والخطوات المهمة بدون زحمة أو تعقيد."
        : "Track project progress and keep your workflow moving without clutter.",
      button: isArabic ? "إدارة المشاريع" : "Explore more",
      type: "projects",
    },
    {
      href: `/${locale}/messages-ai`,
      badge: isArabic ? "الذكاء الاصطناعي" : "AI Assistant",
      title: isArabic ? "مساعد ذكي سريع" : "Real-Time Assistant",
      description: isArabic
        ? "اسأل الذكاء الاصطناعي واحصل على ملخصات وتحليلات سريعة."
        : "Ask for insights, summaries, and quick decisions across your workspace.",
      button: isArabic ? "اسأل الآن" : "Explore more",
      type: "ai",
    },
  ];

  return (
    <section className="space-y-5">
      {/* =========================
     QUICK ACTIONS HEADER
     ========================= */}

      <div>
        <span className="mb-3 inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-primary">
          <span className="badge-dot" />
          {isArabic ? "إجراءات سريعة" : "Quick Actions"}
        </span>

        <h3 className="section-title">
          {isArabic
            ? "كل إجراءاتك المهمة في مكان واحد."
            : "All Your Key Actions. One Smart Hub."}
        </h3>

        <p className="section-subtitle mt-2 max-w-xl">
          {isArabic
            ? "اختصارات سريعة لإدارة العملاء والمشاريع والذكاء الاصطناعي بشكل بسيط."
            : "Fast shortcuts to manage clients, workflows, and AI without clutter."}
        </p>
      </div>

      {/* =========================
     TOP TWO CARDS
     ========================= */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {quickActions.slice(0, 2).map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="glass-card group relative overflow-hidden rounded-md p-5 transition "
          >
            {/* Card glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--primary)] to-transparent opacity-10" />

            <div className="relative grid gap-5 md:grid-cols-[1fr_220px] md:items-center">
              {/* Text side */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)] px-3 py-1 text-xs text-primary">
                  <span className="badge-dot" />
                  {action.badge}
                </span>

                <h4 className="mt-4 text-2xl font-semibold tracking-tight">
                  {action.title}
                </h4>

                <p className="mt-3 text-sm leading-6 text-muted">
                  {action.description}
                </p>

                <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium transition group-hover:border-[var(--border-strong)] group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)]">
                  {action.button}
                  <span className={isArabic ? "rotate-180" : ""}>↗</span>
                </div>
              </div>

              {/* Preview side */}
              <div className="flex justify-end">
                {action.type === "clients" && (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-soft">Sales Target</p>
                        <p className="mt-1 text-2xl font-semibold">$20,679</p>
                      </div>

                      <span className="rounded-md bg-[var(--surface)] px-2 py-1 text-xs text-primary">
                        ↗ 7%
                      </span>
                    </div>

                    <div className="flex h-16 items-end gap-1">
                      {[42, 54, 68, 76, 64, 88, 72, 58, 80, 92].map(
                        (height, index) => (
                          <span
                            key={index}
                            className="flex-1 rounded-md bg-[var(--primary)] opacity-75"
                            style={{ height: `${height}%` }}
                          />
                        ),
                      )}
                    </div>
                  </div>
                )}

                {action.type === "projects" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-soft">Workflow Progress</p>
                        <p className="mt-1 text-2xl font-semibold">72%</p>
                      </div>

                      <span className="rounded-lg bg-[var(--primary)] px-3 py-1 text-xs font-bold text-[var(--primary-foreground)]">
                        Active
                      </span>
                    </div>

                    <div className="space-y-3">
                      {[92, 68, 84].map((width, index) => (
                        <div key={index}>
                          <div className="mb-2 h-2 w-20 rounded-full bg-[var(--foreground-soft)] opacity-25" />

                          <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                            <div
                              className="h-full rounded-full bg-[var(--primary)]"
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* =========================
   WIDE AI CARD
   ========================= */}

      <Link
        href={quickActions[2].href}
        className="glass-card group relative block overflow-hidden rounded-md p-5 transition "
      >
        {/* Card glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--primary)] to-transparent opacity-10" />

        <div className="relative grid gap-6 lg:grid-cols-[0.9fr_0.75fr] lg:items-center">
          {/* Text side */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-muted)] px-3 py-1 text-xs text-primary">
              <span className="badge-dot" />
              {quickActions[2].badge}
            </span>

            <h4 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
              {quickActions[2].title}
            </h4>

            <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
              {quickActions[2].description}
            </p>

            <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium transition group-hover:border-[var(--border-strong)] group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)]">
              {quickActions[2].button}
              <span className={isArabic ? "rotate-180" : ""}>↗</span>
            </div>
          </div>

          {/* Preview side */}
          <div className="flex justify-end">
            <div className="w-full max-w-[520px] space-y-3">
              {/* AI message preview */}
              <div className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)]">
                    AI
                  </div>

                  <div className="flex-1">
                    <div className="h-2 w-28 rounded-md bg-[var(--foreground-soft)] opacity-35" />
                    <div className="mt-3 h-2 w-40 rounded-md bg-[var(--foreground-soft)] opacity-20" />
                  </div>
                </div>
              </div>

              {/* AI insights preview */}
              <div className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs text-soft">Smart Insights</p>
                  <span className="text-xs text-primary">↗ 12%</span>
                </div>

                <div className="flex h-20 items-end gap-2">
                  {[30, 55, 42, 78, 64, 90, 52, 70].map((height, index) => (
                    <span
                      key={index}
                      className="flex-1 rounded-t-xl bg-[var(--primary)] opacity-75"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}