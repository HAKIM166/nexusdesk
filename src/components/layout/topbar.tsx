"use client";

import { usePathname, useRouter } from "next/navigation";
import { Download, Languages, Settings } from "lucide-react";
import LogoutButton from "@/components/auth/logout-button";

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
  function getTaskSubPageLabel() {
    if (!currentSubPage) return null;

    const taskLabels: Record<string, string> = {
      backlog: isArabic ? "المهام المؤجلة" : "Backlog",
      "in-progress": isArabic ? "المهام قيد التنفيذ" : "In Progress",
      done: isArabic ? "المهام المكتملة" : "Done",
    };

    return (
      taskLabels[currentSubPage] ??
      currentSubPage
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  }

  function getPageTitle() {
    if (currentSection === "tasks" && currentSubPage) {
      return getTaskSubPageLabel() ?? sidebarMessages.tasks ?? "Tasks";
    }

    if (currentSection === "clients") {
      return sidebarMessages.clients ?? "Clients";
    }

    if (currentSection === "employees") {
      return sidebarMessages.employees ?? "Employees";
    }

    if (currentSection === "projects") {
      return sidebarMessages.projects ?? "Projects";
    }

    if (currentSection === "calendar") {
      return sidebarMessages.calendar ?? "Calendar";
    }

    if (currentSection === "tasks") {
      return sidebarMessages.tasks ?? "Tasks";
    }

    if (currentSection === "settings") {
      return sidebarMessages.settings ?? "Settings";
    }

    if (currentSection === "messages-ai") {
      return sidebarMessages.aiMessages ?? messages.ai?.title ?? "AI Messages";
    }

    return sidebarMessages.dashboard ?? "Dashboard";
  }

  /* =========================
     Breadcrumb
  ========================= */
  function getOverviewLabel() {
    if (currentSection === "tasks" && currentSubPage) {
      return sidebarMessages.tasks ?? "Tasks";
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
      description: isArabic
        ? "تم تغيير لغة مساحة العمل في NexusDesk إلى الإنجليزية."
        : "NexusDesk workspace switched to Arabic.",
    });

    router.push(newPath);
  }

  const actionButtonClass =
    "inline-flex shrink-0 items-center justify-center rounded-xl border border-[var(--topbar-action-border)] bg-[var(--topbar-action-bg)] text-[var(--topbar-action-text)] transition-colors duration-200 hover:border-[var(--topbar-action-hover-border)] hover:bg-[var(--topbar-action-hover-bg)] hover:text-[var(--topbar-action-hover-text)]";

  const mobileActionButtonClass =
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--topbar-action-border)] bg-[var(--topbar-action-bg)] text-[var(--topbar-action-text)] transition-colors duration-200 hover:border-[var(--topbar-action-hover-border)] hover:bg-[var(--topbar-action-hover-bg)] hover:text-[var(--topbar-action-hover-text)] sm:h-10 sm:w-10";
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--topbar-border)] bg-[var(--topbar-bg)] backdrop-blur-xl">
      {/* Mobile / Tablet Topbar */}
      <div className="lg:hidden">
        <div className="flex min-h-[56px] items-center gap-2 px-3 py-2 sm:min-h-[64px] sm:px-6">
          <div className="w-11 shrink-0 md:hidden" />

          <div className="min-w-0 flex-1 sm:pl-0">
            <p className="hidden text-[10px] font-medium text-[var(--topbar-muted)] sm:block">
              {getOverviewLabel()}
            </p>

            <h1 className="truncate text-[15px] font-bold leading-5 tracking-tight text-[var(--topbar-text)] sm:mt-1 sm:text-[18px]">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--export-border)] bg-[var(--export-bg)] text-[var(--export-text)] transition-colors duration-200 hover:bg-[var(--export-hover-bg)] sm:h-10 sm:w-10"
              aria-label={topbarMessages.export ?? "Export"}
            >
              <Download size={15} />
            </button>

            <TopbarNotifications
              locale={locale}
              isArabic={isArabic}
              actionButtonClass={mobileActionButtonClass}
            />

            <button
              type="button"
              onClick={() => router.push(`/${locale}/settings`)}
              className={mobileActionButtonClass}
              aria-label={topbarMessages.settings ?? "Settings"}
            >
              <Settings size={15} />
            </button>

            <LogoutButton
              locale={locale}
              isArabic={isArabic}
              className={mobileActionButtonClass}
              iconOnly
            />

            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--topbar-action-border)] bg-[var(--topbar-action-bg)] px-2 text-[12px] font-bold text-[var(--topbar-action-text)] transition-colors duration-200 hover:border-[var(--topbar-action-hover-border)] hover:bg-[var(--topbar-action-hover-bg)] hover:text-[var(--topbar-action-hover-text)] sm:h-10 sm:min-w-10"
            >
              {locale === "en" ? (
                <span className="inline-flex items-center gap-1">
                  <span>ع</span>
                  <Languages size={12} />
                </span>
              ) : (
                <span>EN</span>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Desktop / Tablet Topbar */}
      <div className="hidden items-center justify-between gap-4 px-7 py-4 lg:flex lg:px-8">
        {/* TITLE */}
        <div className="min-w-0">
          <p
            className={`text-xs text-[var(--topbar-muted)] ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {getOverviewLabel()}
          </p>

          <h1
            className={`mt-1 text-xl font-semibold text-[var(--topbar-text)] ${
              isArabic ? "text-right" : "text-left"
            }`}
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
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--export-border)] bg-[var(--export-bg)] px-4 py-2 text-xs font-semibold text-[var(--export-text)] transition-colors duration-200 hover:bg-[var(--export-hover-bg)]"
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
            type="button"
            onClick={() => router.push(`/${locale}/settings`)}
            className={`${actionButtonClass} h-10 w-10`}
            aria-label={topbarMessages.settings ?? "Settings"}
          >
            <Settings size={17} />
          </button>

          <LogoutButton
            locale={locale}
            isArabic={isArabic}
            className={`${actionButtonClass} gap-2 px-3.5 py-2 text-xs font-semibold`}
          />

          <button
            type="button"
            onClick={toggleLanguage}
            className={`${actionButtonClass} gap-2 px-3.5 py-2 text-xs font-semibold`}
          >
            <Languages size={15} />
            {locale === "en" ? "عربي" : "EN"}
          </button>
        </div>
      </div>
    </header>
  );
}
