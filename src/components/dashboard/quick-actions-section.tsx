"use client";

import Link from "next/link";
import Lottie from "lottie-react";
import clientAnimation from "../../../public/animations/dashboard/client-management.json";
import workflowAnimation from "../../../public/animations/dashboard/workflow.json";
import aiAnimation from "../../../public/animations/dashboard/ai-assistant.json";
import { Locale } from "@/lib/constants";

type QuickActionType = "clients" | "projects" | "ai";

type QuickActionsSectionProps = {
  locale: Locale;
  isArabic: boolean;
};

type QuickAction = {
  href: string;
  badge: string;
  title: string;
  description: string;
  button: string;
  type: QuickActionType;
};

const animations = {
  clients: clientAnimation,
  projects: workflowAnimation,
  ai: aiAnimation,
};

function ActionPreview({
  type,
  featured = false,
}: {
  type: QuickActionType;
  featured?: boolean;
}) {
  return (
    <div className="pointer-events-none flex w-full justify-center overflow-hidden">
      <Lottie
        animationData={animations[type]}
        loop
        autoplay
        className={
          featured
            ? "h-[145px] w-[210px] opacity-95 sm:h-[190px] sm:w-[260px] md:h-[240px] md:w-[330px] xl:h-[270px] xl:w-[380px]"
            : "h-[95px] w-[125px] opacity-95 sm:h-[150px] sm:w-[185px] md:h-[205px] md:w-[245px] xl:h-[230px] xl:w-[280px]"
        }
      />
    </div>
  );
}

function ActionButton({
  href,
  children,
  isArabic,
}: {
  href: string;
  children: string;
  isArabic: boolean;
}) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-[11px] font-medium text-[var(--foreground)] transition hover:border-[var(--border-strong)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] md:px-4 md:text-sm"
    >
      {children}
      <span className={isArabic ? "rotate-180" : ""}>↗</span>
    </Link>
  );
}

function ActionItem({
  action,
  isArabic,
  featured = false,
}: {
  action: QuickAction;
  isArabic: boolean;
  featured?: boolean;
}) {
  return (
    <article
      className={
        featured
          ? "grid gap-4 border-t border-[var(--border)] pt-5 md:grid-cols-[1fr_340px] md:items-center md:gap-8 md:pt-7"
          : "grid min-w-0 gap-3 border-t border-[var(--border)] pt-4 sm:pt-5 md:grid-cols-[1fr_245px] md:items-center md:gap-5"
      }
    >
      <div className="md:hidden">
        <ActionPreview type={action.type} featured={featured} />
      </div>

      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-1 text-[10px] font-medium text-primary md:px-2.5 md:text-xs">
          <span className="badge-dot" />
          {action.badge}
        </span>

        <h4
          className={
            featured
              ? "mt-3 text-[21px] font-semibold leading-7 tracking-tight text-[var(--foreground)] md:text-3xl md:leading-tight"
              : "mt-3 text-[15px] font-semibold leading-6 tracking-tight text-[var(--foreground)] sm:text-[18px] md:text-2xl md:leading-tight"
          }
        >
          {action.title}
        </h4>

        <p className="mt-2 line-clamp-3 text-[11px] leading-5 text-muted sm:text-[12px] md:text-sm md:leading-6">
          {action.description}
        </p>

        <div className="mt-3 md:mt-5">
          <ActionButton href={action.href} isArabic={isArabic}>
            {action.button}
          </ActionButton>
        </div>
      </div>

      <div className="hidden md:block">
        <ActionPreview type={action.type} featured={featured} />
      </div>
    </article>
  );
}

export default function QuickActionsSection({
  locale,
  isArabic,
}: QuickActionsSectionProps) {
  const quickActions: QuickAction[] = [
    {
      href: `/${locale}/clients`,
      badge: isArabic ? "العملاء" : "Clients",
      title: isArabic ? "إدارة العملاء بذكاء" : "Smart Client Management",
      description: isArabic
        ? "نظّم بيانات العملاء والتواصل والملاحظات في مكان واحد واضح وسهل."
        : "Keep every lead, contact, and client detail organized in one clean hub.",
      button: isArabic ? "إدارة العملاء" : "Manage clients",
      type: "clients",
    },
    {
      href: `/${locale}/projects`,
      badge: isArabic ? "المشاريع" : "Workflows",
      title: isArabic ? "سير عمل منظم" : "Automated Workflows",
      description: isArabic
        ? "تابع المشاريع والخطوات المهمة بدون زحمة أو تعقيد."
        : "Track project progress and keep your workflow moving without clutter.",
      button: isArabic ? "إدارة المشاريع" : "Manage projects",
      type: "projects",
    },
    {
      href: `/${locale}/messages-ai`,
      badge: isArabic ? "الذكاء الاصطناعي" : "AI Assistant",
      title: isArabic ? "مساعد ذكي سريع" : "Real-Time Assistant",
      description: isArabic
        ? "اسأل الذكاء الاصطناعي واحصل على ملخصات وتحليلات سريعة."
        : "Ask for insights, summaries, and quick decisions across your workspace.",
      button: isArabic ? "اسأل الآن" : "Ask now",
      type: "ai",
    },
  ];

  return (
    <section id="dashboard-quick-actions" className="space-y-5 md:space-y-7">
      <div>
        <span className="mb-2 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-medium text-primary md:mb-3 md:px-3 md:text-xs">
          <span className="badge-dot" />
          {isArabic ? "إجراءات سريعة" : "Quick Actions"}
        </span>

        <h3 className="text-[20px] font-semibold leading-7 tracking-tight text-[var(--foreground)] md:text-3xl">
          {isArabic
            ? "كل إجراءاتك المهمة في مكان واحد."
            : "All Your Key Actions. One Smart Hub."}
        </h3>

        <p className="mt-1.5 max-w-xl text-[12px] leading-5 text-muted md:mt-2 md:text-sm md:leading-6">
          {isArabic
            ? "اختصارات سريعة لإدارة العملاء والمشاريع والذكاء الاصطناعي بشكل بسيط."
            : "Fast shortcuts to manage clients, workflows, and AI without clutter."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6 xl:gap-8">
        {quickActions.slice(0, 2).map((action) => (
          <ActionItem key={action.type} action={action} isArabic={isArabic} />
        ))}
      </div>

      <ActionItem action={quickActions[2]} isArabic={isArabic} featured />
    </section>
  );
}
