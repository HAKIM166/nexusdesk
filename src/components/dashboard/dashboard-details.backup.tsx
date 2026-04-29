"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { getDashboardMetrics } from "@/lib/dashboard-helpers";
import { getMessages } from "@/lib/helpers";
import { Locale } from "@/lib/constants";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";

import {
  Box,
  FileText,
  Search,
  MessageSquare,
  Video,
  Square,
  Mail,
} from "lucide-react";

/* =========================
   TYPES
   ========================= */

type ClientItem = {
  id?: string;
  name?: string;
  email?: string;
};

type ProjectItem = {
  id?: string;
  name?: string;
  title?: string;
  status?: string;
};

type QuickActionType = "clients" | "projects" | "ai";

/* =========================
   HELPERS
   ========================= */

function translateStatus(
  status: string | undefined,
  messages: ReturnType<typeof getMessages>,
) {
  const value = String(status || "").toLowerCase();

  const statusMap: Record<string, string> = {
    active: messages.common.status.Active,
    pending: messages.common.status.Pending,
    inactive: messages.common.status.Inactive,
    completed: messages.common.status.Completed,
    planned: messages.common.status.Planned,
    "in progress": messages.common.status["In Progress"],
    inprogress: messages.common.status["In Progress"],
    "in-progress": messages.common.status["In Progress"],
    onhold: messages.common.status["On Hold"],
    "on hold": messages.common.status["On Hold"],
    "on-hold": messages.common.status["On Hold"],
  };

  return statusMap[value] || status || "-";
}

/* =========================
   DASHBOARD DETAILS COMPONENT
   ========================= */

export default function DashboardDetails() {
  /* =========================
     ROUTE / LANGUAGE
     ========================= */

  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  /* =========================
     STORES DATA
     ========================= */

  const clients = useClientStore((state) => state.clients);
  const projects = useProjectStore((state) => state.projects);

  /* =========================
     DASHBOARD METRICS
     ========================= */

  const metrics = useMemo(
    () => getDashboardMetrics(clients, projects),
    [clients, projects],
  );

  const recentClients = metrics.recentClients as ClientItem[];
  const recentProjects = metrics.recentProjects as ProjectItem[];

  /* =========================
   QUICK ACTIONS DATA
   ========================= */

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
    <div className="space-y-6">
      {/* =========================
   QUICK ACTIONS CARDS SECTION
   - Two small cards on top
   - One wide card under them
   - No slider / no state
   - Links and logic stay the same
   ========================= */}

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
      {/* =========================
   RECENT CLIENTS / RECENT PROJECTS GRID
   ========================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* =========================
     RECENT CLIENTS CARD
     ========================= */}

        <div className="glass-card overflow-hidden">
          {/* Card header */}
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h3 className="text-lg font-semibold">
              {messages.dashboard.clientsTitle}
            </h3>

            <p className="mt-1 text-sm text-muted">
              {messages.dashboard.clientsSubtitle}
            </p>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[1.2fr_1.5fr] border-b border-[var(--border)] px-5 py-3 text-xs text-soft">
            <span>Name</span>
            <span>Email</span>
          </div>

          {/* Clients rows */}
          <div>
            {recentClients.length > 0 ? (
              recentClients.map((client, index) => (
                <div
                  key={client.id || index}
                  className="grid grid-cols-[1.2fr_1.5fr] items-center border-b border-[var(--border)] px-5 py-4 text-sm last:border-b-0 hover:bg-[var(--surface-muted)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-semibold text-primary">
                      {(client.name || "-").slice(0, 1).toUpperCase()}
                    </div>

                    <p className="font-medium">{client.name || "-"}</p>
                  </div>

                  <p className="truncate text-muted">{client.email || "-"}</p>
                </div>
              ))
            ) : (
              <p className="px-5 py-5 text-sm text-muted">
                {messages.dashboard.noClients}
              </p>
            )}
          </div>
        </div>

        {/* =========================
     RECENT PROJECTS CARD
     ========================= */}

        <div className="glass-card overflow-hidden ">
          {/* Card header */}
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h3 className="text-lg font-semibold">
              {messages.dashboard.projectsTableTitle}
            </h3>

            <p className="mt-1 text-sm text-muted">
              {messages.dashboard.projectsTableSubtitle}
            </p>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[1.4fr_0.8fr] border-b border-[var(--border)] px-5 py-3 text-xs text-soft">
            <span>Project</span>
            <span>Status</span>
          </div>

          {/* Projects rows */}
          <div>
            {recentProjects.length > 0 ? (
              recentProjects.map((project, index) => (
                <div
                  key={project.id || index}
                  className="grid grid-cols-[1.4fr_0.8fr] items-center border-b border-[var(--border)] px-5 py-4 text-sm last:border-b-0 hover:bg-[var(--surface-muted)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-semibold text-primary">
                      {(project.name || project.title || "-")
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>

                    <p className="font-medium">
                      {project.name || project.title || "-"}
                    </p>
                  </div>

                  <span className="w-fit rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs text-primary">
                    {translateStatus(project.status, messages)}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-5 py-5 text-sm text-muted">
                {messages.dashboard.noProjects}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* =========================
   PLANS / WORKSPACE PACKAGES SECTION
   ========================= */}

      <section className="space-y-10 py-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-md border border-[var(--border-strong)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-primary">
            <span className="badge-dot" />
            {isArabic ? "خطط العمل" : "Pricing"}
          </span>

          <h3 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {isArabic
              ? "خطط بسيطة وواضحة، مناسبة لكل فريق"
              : "Simple, Transparent Pricing, Built for Every Business"}
          </h3>

          <p className="mt-3 text-xs text-muted">
            {isArabic
              ? "اختر الخطة المناسبة لفريقك. بدون تعقيد، ويمكنك التطوير في أي وقت."
              : "Choose a plan that fits your team. No hidden fees. Cancel anytime."}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-3">
          {[
            {
              name: "Starter",
              price: "$19",
              badge: "",
              description: isArabic
                ? "للمستقلين والفرق الصغيرة في البداية"
                : "For small teams getting started",
              features: isArabic
                ? [
                    "إدارة العملاء والبيانات الأساسية",
                    "متابعة المشاريع البسيطة",
                    "قوائم العملاء الحديثة",
                    "إعدادات اللغة والثيم",
                    "حتى 3 أعضاء فريق",
                  ]
                : [
                    "Contact & Lead Management",
                    "Simple Project Tracking",
                    "Recent Clients Overview",
                    "Theme & Language Settings",
                    "Up to 3 Team Members",
                  ],
            },
            {
              name: "Growth",
              price: "$49",
              badge: isArabic ? "الأشهر" : "Popular",
              description: isArabic
                ? "للفرق التي تحتاج سير عمل أذكى"
                : "For growing teams getting smarter",
              features: isArabic
                ? [
                    "كل مميزات Starter",
                    "إدارة مشاريع متقدمة",
                    "مساعد ذكاء اصطناعي",
                    "تحليلات لوحة التحكم",
                    "دعم أولوية",
                  ]
                : [
                    "Advanced Project Workflows",
                    "AI Workspace Assistant",
                    "Dashboard Analytics",
                    "Team Collaboration Tools",
                    "Priority Support",
                  ],
            },
            {
              name: "Pro",
              price: "$99",
              badge: "",
              description: isArabic
                ? "للشركات التي تحتاج تحكم وتوسع كامل"
                : "For teams that need full control",
              features: isArabic
                ? [
                    "عملاء ومشاريع غير محدودة",
                    "تحليلات متقدمة",
                    "صلاحيات للفريق",
                    "رؤى ذكية بالذكاء الاصطناعي",
                    "مدير حساب مخصص",
                  ]
                : [
                    "Unlimited Clients & Projects",
                    "Advanced Analytics",
                    "Team Permissions",
                    "AI-Powered Insights",
                    "Dedicated Account Manager",
                  ],
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className="overflow-hidden  border border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="rounded-b-md border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-strong)] to-[var(--surface-muted)] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-2xl font-medium tracking-tight">
                      {plan.name}
                    </h4>

                    <p className="mt-4 text-sm text-muted">
                      {plan.description}
                    </p>
                  </div>

                  {plan.badge && (
                    <span className="py-1 text-xs text-[var(--warning)]">
                      • {plan.badge}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-3xl font-medium tracking-tight">
                    {plan.price}
                  </span>

                  <span className="pb-1 text-sm text-muted">
                    {isArabic ? "/ شهريًا" : "/ month"}
                  </span>
                </div>

                <button
                  type="button"
                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    plan.badge
                      ? "bg-[var(--primary)] !text-black"
                      : "bg-[var(--background)] hover:bg-[var(--surface-strong)]"
                  }`}
                >
                  {isArabic ? "ابدأ الآن" : "Get started"}
                  <span className={isArabic ? "rotate-180" : ""}>↗</span>
                </button>
              </div>

              <div className="space-y-4 p-5">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] text-[10px] text-primary">
                      ✓
                    </span>

                    <span className="text-muted">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================
   TESTIMONIALS SECTION
   ========================= */}

      <section className="space-y-10 py-6">
        <div className="mx-auto max-w-4xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-primary">
            <span className="badge-dot" />
            {isArabic ? "آراء العملاء" : "Testimonials"}
          </span>

          <h3 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {isArabic
              ? "موثوق من فرق تضع العلاقات أولًا"
              : "Trusted by Teams Who Put Relationships First"}
          </h3>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            {isArabic
              ? "من المستقلين إلى الفرق النامية — يساعد NexusDesk الفرق على تنظيم العملاء والمشاريع والعمل بذكاء."
              : "From freelancers to growing teams — NexusDesk helps teams stay organized, work smarter, and move faster."}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              company: "Microsoft",
              icon: Box,
              quote:
                "NexusDesk changed the way we manage leads. Everything feels organized, fast, and easy to follow.",
              name: "Sarah L.",
              role: "Co-Founder",
            },
            {
              company: "Notion",
              icon: FileText,
              quote:
                "Our workflow used to be chaotic. Now we have a clear view of clients, projects, and priorities.",
              name: "Daniel K.",
              role: "Sales Manager",
            },
            {
              company: "Google",
              icon: Search,
              quote:
                "What I love most is how simple it feels. It helps us keep client work organized without extra noise.",
              name: "Maya P.",
              role: "Customer Success Lead",
            },
            {
              company: "Slack",
              icon: MessageSquare,
              quote:
                "We can track campaigns, clients, and tasks from one clean dashboard. It made our work much smoother.",
              name: "Olivia R.",
              role: "Marketing Director",
            },
            {
              company: "Zoom",
              icon: Video,
              quote:
                "Before NexusDesk, managing customer data was scattered. Now everything is clean and easy to understand.",
              name: "Amir H.",
              role: "Founder",
            },
            {
              company: "Square",
              icon: Square,
              quote:
                "Our support team can follow client context faster. The dashboard gives us exactly what we need.",
              name: "Jenna P.",
              role: "Support Manager",
            },
          ].map((item) => {
            const CompanyIcon = item.icon;

            return (
              <div
                key={item.company}
                className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="min-h-[190px] border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-strong)] to-[var(--surface-muted)] p-5">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <CompanyIcon className="h-5 w-5 text-muted" />

                      <h4 className="text-xl font-semibold text-muted">
                        {item.company}
                      </h4>
                    </div>

                    <div className="text-sm tracking-[0.15em] text-[var(--warning)]">
                      ★★★★★
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-muted">{item.quote}</p>
                </div>

                <div className="flex items-center gap-3 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-sm font-semibold text-primary">
                    {item.name.slice(0, 1)}
                  </div>

                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-soft">{item.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* =========================
   FOOTER SECTION
   ========================= */}

      <footer className="relative mt-10 overflow-hidden border-t border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-6 pt-10">
          {/* Top footer */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold">
                {isArabic ? "تواصل معنا الآن" : "Contact Us Now"}
              </h3>

              <p className="mt-2 text-sm text-muted">
                {isArabic
                  ? "ابنِ علاقات أفضل مع عملائك"
                  : "Build Better Customer Relationships"}
              </p>
            </div>

            <div>
              <h4 className="mb-3 text-lg font-semibold">
                {isArabic
                  ? "اشترك في نشرة NexusDesk"
                  : "Subscribe to NexusDesk Newsletter"}
              </h4>

              <div className="flex items-center gap-3">
                <div className="relative w-full">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soft" />

                  <input
                    type="email"
                    placeholder={
                      isArabic ? "ادخل بريدك الإلكتروني" : "Enter your email"
                    }
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--primary)]"
                  />
                </div>

                <button
                  type="button"
                  className="rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-medium !text-[#07110c]"
                >
                  {isArabic ? "اشتراك" : "Subscribe"}
                </button>
              </div>
            </div>
          </div>

          {/* Links area */}
          <div className="mt-10 border-t border-[var(--border)] pt-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
              <div className="col-span-2 lg:col-span-1">
                <img
                  src="/logos/nexusdesk-logo-light.png"
                  alt="NexusDesk"
                  className="h-10 w-auto"
                />

                <p className="mt-5 text-sm text-muted">hello@nexusdesk.com</p>
                <p className="mt-3 text-sm text-muted">+20 100 000 0000</p>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-semibold text-soft">
                  Quick Links
                </h4>
                <ul className="space-y-3 text-sm text-muted">
                  <li>Dashboard</li>
                  <li>Clients</li>
                  <li>Projects</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-semibold text-soft">
                  Company
                </h4>
                <ul className="space-y-3 text-sm text-muted">
                  <li>About</li>
                  <li>Product</li>
                  <li>Integration</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-semibold text-soft">Others</h4>
                <ul className="space-y-3 text-sm text-muted">
                  <li>FAQ</li>
                  <li>Blog</li>
                  <li>Affiliates</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-semibold text-soft">
                  Social Media
                </h4>
                <ul className="space-y-3 text-sm text-muted">
                  <li>Instagram</li>
                  <li>Facebook</li>
                  <li>TikTok</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Big wordmark area */}
          <div className="relative mt-8 h-[250px] overflow-hidden border-t border-[var(--border)]">
            {/* Soft bottom glow */}
            <div className="pointer-events-none absolute bottom-[-135px] left-1/2 z-0 h-[260px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--primary)]/32 blur-[85px]" />

            {/* Big Nexus wordmark */}
            <img
              src="/logos/nexus-wordmark-light.png"
              alt="Nexus"
              className="pointer-events-none absolute bottom-[22px] left-1/2 z-10 w-[900px] max-w-[96%] -translate-x-1/2 select-none opacity-60 grayscale"
            />

            {/* Bottom bar */}
            <div className="absolute bottom-8 left-0 z-20 flex w-full flex-col items-center justify-between gap-4 text-sm text-muted md:flex-row">
              <p>© 2026 NexusDesk. All Rights Reserved</p>

              <div className="flex gap-6">
                <span>Documentation</span>
                <span>Privacy Policy</span>
                <span>Terms and Conditions</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
