"use client";

import { usePathname, useRouter } from "next/navigation";
import { Download, Languages, Settings } from "lucide-react";

import { getMessages } from "@/lib/helpers";
import { Locale } from "@/lib/constants";
import { useUIStore } from "@/store/ui-store";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";

import TopbarDatePicker from "@/components/layout/topbar-date-picker";
import TopbarNotifications from "@/components/layout/topbar-notifications";
import { useNotificationStore } from "@/store/notification-store";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();

  const locale = (pathname.split("/")[1] || "en") as Locale;
  const messages = getMessages(locale);

  const sidebarMessages = messages.sidebar as Record<string, string>;
  const topbarMessages = messages.topbar as Record<string, string>;

  const direction = useUIStore((state) => state.direction);
  const theme = useUIStore((state) => state.theme);
  const density = useUIStore((state) => state.density);
  const aiEnabled = useUIStore((state) => state.aiEnabled);
  const aiAutoSuggestions = useUIStore((state) => state.aiAutoSuggestions);

  const clients = useClientStore((state) => state.clients);
  const projects = useProjectStore((state) => state.projects);

  const isArabic = direction === "rtl" || locale === "ar";

  const currentSection = pathname.split("/")[2] || "dashboard";
  const currentSubPage = pathname.split("/")[3];

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  /* =========================
     Page Title Resolver
  ========================= */
  function getPageTitle() {
    if (currentSection === "clients")
      return sidebarMessages.clients ?? "Clients";
    if (currentSection === "projects")
      return sidebarMessages.projects ?? "Projects";
    if (currentSection === "calendar")
      return sidebarMessages.calendar ?? "Calendar";
    if (currentSection === "tasks") return sidebarMessages.tasks ?? "Tasks";
    if (currentSection === "settings")
      return sidebarMessages.settings ?? "Settings";

    if (currentSection === "messages-ai") {
      return sidebarMessages.aiMessages ?? "AI Messages";
    }

    return sidebarMessages.dashboard ?? "Dashboard";
  }

  /* =========================
     Breadcrumb
  ========================= */
  function getOverviewLabel() {
    if (currentSection === "tasks" && currentSubPage) {
      const taskLabels: Record<string, string> = {
        backlog: isArabic ? "المهام المؤجلة" : "Backlog",
        "in-progress": isArabic ? "قيد التنفيذ" : "In Progress",
        done: isArabic ? "المكتملة" : "Done",
      };

      const subPageLabel =
        taskLabels[currentSubPage] ??
        currentSubPage
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      return `${sidebarMessages.tasks ?? "Tasks"} / ${subPageLabel}`;
    }

    return topbarMessages.overview ?? "Overview";
  }

  /* =========================
     Export
  ========================= */
  function handleExport() {
    const exportDate = new Date().toISOString().slice(0, 10);

    const payload = {
      app: "NexusDesk",
      exportedAt: new Date().toISOString(),
      selectedDate: exportDate,

      settings: {
        locale,
        direction,
        theme,
        density,
        aiEnabled,
        aiAutoSuggestions,
      },

      summary: {
        clientsCount: clients.length,
        projectsCount: projects.length,
      },

      clients,
      projects,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `nexusdesk-export-${exportDate}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function toggleLanguage() {
    const newLocale = locale === "en" ? "ar" : "en";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);

    addNotification({
      type: "language",
      title: isArabic ? "تم تغيير اللغة" : "Language changed",
      description:
        newLocale === "ar"
          ? "NexusDesk workspace switched to Arabic."
          : "NexusDesk workspace switched to English.",
    });

    router.push(newPath);
  }

  const actionButtonClass =
    "inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--topbar-muted)] transition-all duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--topbar-text)]";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--topbar-bg)] px-5 py-4 backdrop-blur-xl md:px-7 lg:px-8">
      {/* TITLE */}
      <div className="min-w-0">
        <p
          className={`text-xs text-[var(--topbar-muted)] ${isArabic ? "text-right" : "text-left"}`}
        >
          {getOverviewLabel()}
        </p>

        <h1
          className={`mt-1 text-xl font-semibold text-[var(--topbar-text)] ${isArabic ? "text-right" : "text-left"}`}
        >
          {getPageTitle()}
        </h1>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2.5">
        <TopbarDatePicker
          locale={locale}
          actionButtonClass={actionButtonClass}
        />

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--export-border)] bg-[var(--export-bg)] px-4 py-2 text-xs font-semibold text-[var(--export-text)]"
        >
          <Download size={15} />
          {topbarMessages.export ?? "Export"}
        </button>

        <TopbarNotifications
          locale={locale}
          isArabic={isArabic}
          actionButtonClass={actionButtonClass}
        />

        <button
          onClick={() => router.push(`/${locale}/settings`)}
          className={`${actionButtonClass} h-10 w-10`}
        >
          <Settings size={17} />
        </button>

        <button
          onClick={toggleLanguage}
          className={`${actionButtonClass} gap-2 px-3.5 py-2 text-xs font-semibold`}
        >
          <Languages size={15} />
          {locale === "en" ? "AR" : "EN"}
        </button>
      </div>
    </header>
  );
}
