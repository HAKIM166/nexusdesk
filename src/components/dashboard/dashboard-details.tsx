"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { getDashboardMetrics } from "@/lib/dashboard-helpers";
import { getMessages } from "@/lib/helpers";
import { Locale } from "@/lib/constants";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";

import QuickActionsSection from "./quick-actions-section";
import RecentListsSection from "./recent-lists-section";

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

/* =========================
   HELPERS
   ========================= */

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

  return (
    <div className="space-y-6">
      {/* =========================
   QUICK ACTIONS CARDS SECTION
   - Two small cards on top
   - One wide card under them
   - No slider / no state
   - Links and logic stay the same
   ========================= */}

      <QuickActionsSection locale={locale} isArabic={isArabic} />
      {/* =========================
   RECENT CLIENTS / RECENT PROJECTS GRID
   ========================= */}

      <RecentListsSection
        messages={messages}
        recentClients={recentClients}
        recentProjects={recentProjects}
      />

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
