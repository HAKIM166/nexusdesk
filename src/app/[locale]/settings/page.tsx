"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";
import { getMessages } from "@/lib/helpers";
import { Locale } from "@/lib/constants";
import { useUIStore } from "@/store/ui-store";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";
import { usePathname, useRouter } from "next/navigation";
import {
  Bot,
  Database,
  Languages,
  LayoutDashboard,
  MonitorCog,
  Moon,
  Sun,
} from "lucide-react";

import { createSupabaseClient } from "@/lib/supabase/client";
import LogoutButton from "@/components/auth/logout-button";
import { LogIn, MonitorCheck, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseClient();

  const locale = (pathname.split("/")[1] || "en") as Locale;
  const isArabicLocale = locale === "ar";
  const messages = getMessages(locale);

  const settingsFallback = isArabicLocale
    ? {
        controlLabel: "NexusDesk Control",
        workspaceData: "بيانات مساحة العمل",
        workspaceClients: "عملاء",
        workspaceProjects: "مشاريع",
        aiStatus: "حالة الذكاء الاصطناعي",
        english: "English",
        arabic: "العربية",
        exportWorkspaceData: "تصدير بيانات مساحة العمل",
        footerNote:
          "يتم حفظ إعدادات مساحة العمل محليًا الآن، وسيتم ربطها بالخادم لاحقًا.",
      }
    : {
        controlLabel: "NexusDesk Control",
        workspaceData: "Workspace data",
        workspaceClients: "clients",
        workspaceProjects: "projects",
        aiStatus: "AI status",
        english: "English",
        arabic: "العربية",
        exportWorkspaceData: "Export workspace data",
        footerNote:
          "Workspace preferences are saved locally for now and can be connected to the backend later.",
      };

  const settingsText = {
    ...settingsFallback,
    ...messages.settings,
  };

  const accountSessionText = isArabicLocale
    ? {
        title: "الحساب والجلسة",
        subtitle: "إدارة وصولك الحالي وجلسة مساحة العمل.",
        currentSession: "الجلسة الحالية",
        secureAccess: "وصول آمن لمساحة العمل",
        signedInWith: "تم تسجيل الدخول باستخدام",
        savedAccess: "جلسة نشطة تحفظ وصولك إلى بيانات NexusDesk الخاصة بك.",
        signInHint: "سجّل الدخول للوصول إلى بيانات مساحة العمل المحفوظة.",
        guestSession: "جلسة غير مسجلة",
      }
    : {
        title: "Account & Session",
        subtitle: "Manage your current access and workspace session.",
        currentSession: "Current session",
        secureAccess: "Secure workspace access",
        signedInWith: "Signed in with",
        savedAccess: "Active session keeps your NexusDesk workspace data available.",
        signInHint: "Sign in to access your saved workspace data.",
        guestSession: "Guest session",
      };

  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);

  const density = useUIStore((state) => state.density);
  const setDensity = useUIStore((state) => state.setDensity);

  const direction = useUIStore((state) => state.direction);
  const setDirection = useUIStore((state) => state.setDirection);

  const aiEnabled = useUIStore((state) => state.aiEnabled);
  const setAIEnabled = useUIStore((state) => state.setAIEnabled);

  const aiAutoSuggestions = useUIStore((state) => state.aiAutoSuggestions);
  const setAISuggestions = useUIStore((state) => state.setAISuggestions);

  const clients = useClientStore((state) => state.clients);
  const projects = useProjectStore((state) => state.projects);

  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      setUserEmail(session?.user?.email ?? null);
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const isArabic = direction === "rtl" || isArabicLocale;

  const sectionTitleClass = isArabic
    ? "text-lg font-semibold text-[var(--foreground)] md:text-xl"
    : "text-base font-semibold text-[var(--foreground)] md:text-lg";

  const sectionDescriptionClass = isArabic
    ? "text-sm leading-6 text-[var(--foreground-soft)] md:text-[15px] md:leading-7"
    : "text-xs leading-5 text-[var(--foreground-soft)] md:text-sm md:leading-6";

  const settingLabelClass = isArabic
    ? "text-sm font-medium text-[var(--foreground)] md:text-[15px]"
    : "text-sm font-medium text-[var(--foreground)]";

  const settingDescriptionClass = isArabic
    ? "mt-1 text-xs leading-5 text-[var(--foreground-soft)] md:text-sm md:leading-6"
    : "mt-1 text-xs leading-5 text-[var(--foreground-soft)]";

  const buttonTextClass = isArabic ? "text-sm md:text-[15px]" : "text-sm";

  const textAlignClassName = isArabic ? "text-right" : "text-left";
  const titleRowClassName = isArabic
    ? "flex-row-reverse justify-end"
    : "justify-start";
  const optionGroupClassName = isArabic ? "justify-end" : "justify-start";

  const exportStats = useMemo(
    () => ({
      clientsCount: clients.length,
      projectsCount: projects.length,
      theme,
      density,
      direction,
      aiEnabled,
      aiAutoSuggestions,
      language: locale,
    }),
    [
      clients.length,
      projects.length,
      theme,
      density,
      direction,
      aiEnabled,
      aiAutoSuggestions,
      locale,
    ],
  );

  function handleLanguageChange(nextLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    router.push(segments.join("/"));
  }

  function handleDirectionChange(nextDirection: "ltr" | "rtl") {
    setDirection(nextDirection);
    document.documentElement.setAttribute("dir", nextDirection);
  }

  function handleExportWorkspaceData() {
    const payload = {
      app: "NexusDesk",
      exportedAt: new Date().toISOString(),
      settings: {
        theme,
        density,
        direction,
        aiEnabled,
        aiAutoSuggestions,
        language: locale,
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
    link.download = `nexusdesk-export-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <DashboardShell>
      <div className="space-y-5 pb-8 md:space-y-8 md:pb-0">
        <div className={textAlignClassName}>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--settings-kicker-text)] md:mb-2 md:text-xs md:tracking-[0.22em]">
            {settingsText.controlLabel}
          </p>

          <h1 className="section-title">{messages.settings.title}</h1>

          <p className="section-subtitle mt-2 max-w-3xl">
            {messages.settings.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 border-y border-[var(--settings-divider)] py-4 md:grid-cols-4 md:gap-4 md:py-5">
          <div className={textAlignClassName}>
            <p className="text-[11px] text-[var(--foreground-muted)] md:text-xs">
              {messages.settings.theme}
            </p>
            <p className="mt-1 text-xs font-semibold capitalize text-[var(--foreground)] md:text-sm">
              {exportStats.theme}
            </p>
          </div>

          <div className={textAlignClassName}>
            <p className="text-[11px] text-[var(--foreground-muted)] md:text-xs">
              {messages.settings.language}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase text-[var(--foreground)] md:text-sm">
              {exportStats.language}
            </p>
          </div>

          <div className={textAlignClassName}>
            <p className="text-[11px] text-[var(--foreground-muted)] md:text-xs">
              {settingsText.workspaceData}
            </p>
            <p className="mt-1 text-xs font-semibold leading-5 text-[var(--foreground)] md:text-sm">
              {exportStats.clientsCount} {settingsText.workspaceClients} ·{" "}
              {exportStats.projectsCount} {settingsText.workspaceProjects}
            </p>
          </div>

          <div className={textAlignClassName}>
            <p className="text-[11px] text-[var(--foreground-muted)] md:text-xs">
              {settingsText.aiStatus}
            </p>
            <p className="mt-1 text-xs font-semibold text-[var(--foreground)] md:text-sm">
              {aiEnabled
                ? messages.settings.enabled
                : messages.settings.disabled}
            </p>
          </div>
        </div>

        <div className="space-y-7 md:space-y-10">
          <section className="grid gap-4 md:gap-6 lg:grid-cols-[260px_1fr]">
            <div className={textAlignClassName}>
              <div
                className={`mb-2.5 flex items-center gap-2 md:mb-3 ${titleRowClassName}`}
              >
                <MonitorCog
                  className={`text-[var(--settings-icon-text)] ${
                    isArabic ? "h-5 w-5" : "h-4 w-4"
                  }`}
                />
                <h2 className={sectionTitleClass}>
                  {messages.settings.appearance}
                </h2>
              </div>

              <p className={sectionDescriptionClass}>
                {messages.settings.appearanceDesc}
              </p>
            </div>

            <div className="space-y-5 md:space-y-6">
              <div
                className={`border-b border-[var(--settings-divider)] pb-5 md:pb-6 ${textAlignClassName}`}
              >
                <p className={settingLabelClass}>{messages.settings.theme}</p>

                <p className={settingDescriptionClass}>
                  {messages.settings.themeDesc}
                </p>

                <div
                  className={`mt-3 flex flex-wrap gap-2 md:mt-4 ${optionGroupClassName}`}
                >
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition md:px-4 ${
                      theme === "dark"
                        ? "border-[var(--settings-option-active-border)] bg-[var(--settings-option-active-bg)] text-[var(--settings-option-active-text)]"
                        : "border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] text-[var(--settings-option-text)] hover:border-[var(--settings-option-hover-border)] hover:bg-[var(--settings-option-hover-bg)] hover:text-[var(--settings-option-hover-text)]"
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    {messages.topbar.dark}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition md:px-4 ${
                      theme === "light"
                        ? "border-[var(--settings-option-active-border)] bg-[var(--settings-option-active-bg)] text-[var(--settings-option-active-text)]"
                        : "border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] text-[var(--settings-option-text)] hover:border-[var(--settings-option-hover-border)] hover:bg-[var(--settings-option-hover-bg)] hover:text-[var(--settings-option-hover-text)]"
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    {messages.topbar.light}
                  </button>
                </div>
              </div>

              <div className={textAlignClassName}>
                <p className={settingLabelClass}>{messages.settings.density}</p>

                <p className={settingDescriptionClass}>
                  {messages.settings.densityDesc}
                </p>

                <div
                  className={`mt-3 flex flex-wrap gap-2 md:mt-4 ${optionGroupClassName}`}
                >
                  <button
                    type="button"
                    onClick={() => setDensity("comfortable")}
                    className={`rounded-xl border px-3 py-2 md:px-4 ${buttonTextClass} transition ${
                      density === "comfortable"
                        ? "border-[var(--settings-option-active-border)] bg-[var(--settings-option-active-bg)] text-[var(--settings-option-active-text)]"
                        : "border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] text-[var(--settings-option-text)] hover:border-[var(--settings-option-hover-border)] hover:bg-[var(--settings-option-hover-bg)] hover:text-[var(--settings-option-hover-text)]"
                    }`}
                  >
                    {messages.settings.comfortable}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDensity("compact")}
                    className={`rounded-xl border px-3 py-2 md:px-4 ${buttonTextClass} transition ${
                      density === "compact"
                        ? "border-[var(--settings-option-active-border)] bg-[var(--settings-option-active-bg)] text-[var(--settings-option-active-text)]"
                        : "border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] text-[var(--settings-option-text)] hover:border-[var(--settings-option-hover-border)] hover:bg-[var(--settings-option-hover-bg)] hover:text-[var(--settings-option-hover-text)]"
                    }`}
                  >
                    {messages.settings.compact}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 border-t border-[var(--settings-divider)] pt-6 md:gap-6 md:pt-8 lg:grid-cols-[260px_1fr]">
            <div className={textAlignClassName}>
              <div
                className={`mb-2.5 flex items-center gap-2 md:mb-3 ${titleRowClassName}`}
              >
                <Languages
                  className={`text-[var(--settings-icon-text)] ${
                    isArabic ? "h-5 w-5" : "h-4 w-4"
                  }`}
                />
                <h2 className={sectionTitleClass}>
                  {messages.settings.localization}
                </h2>
              </div>

              <p className={sectionDescriptionClass}>
                {messages.settings.localizationDesc}
              </p>
            </div>

            <div className="space-y-5 md:space-y-6">
              <div
                className={`border-b border-[var(--settings-divider)] pb-5 md:pb-6 ${textAlignClassName}`}
              >
                <p className={settingLabelClass}>
                  {messages.settings.language}
                </p>

                <p className={settingDescriptionClass}>
                  {messages.settings.languageDesc}
                </p>

                <div
                  className={`mt-3 flex flex-wrap gap-2 md:mt-4 ${optionGroupClassName}`}
                >
                  <button
                    type="button"
                    onClick={() => handleLanguageChange("en")}
                    className={`rounded-xl border px-3 py-2 md:px-4 ${buttonTextClass} transition ${
                      locale === "en"
                        ? "border-[var(--settings-option-active-border)] bg-[var(--settings-option-active-bg)] text-[var(--settings-option-active-text)]"
                        : "border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] text-[var(--settings-option-text)] hover:border-[var(--settings-option-hover-border)] hover:bg-[var(--settings-option-hover-bg)] hover:text-[var(--settings-option-hover-text)]"
                    }`}
                  >
                    {settingsText.english}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLanguageChange("ar")}
                    className={`rounded-xl border px-3 py-2 text-sm transition md:px-4 ${
                      locale === "ar"
                        ? "border-[var(--settings-option-active-border)] bg-[var(--settings-option-active-bg)] text-[var(--settings-option-active-text)]"
                        : "border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] text-[var(--settings-option-text)] hover:border-[var(--settings-option-hover-border)] hover:bg-[var(--settings-option-hover-bg)] hover:text-[var(--settings-option-hover-text)]"
                    }`}
                  >
                    {settingsText.arabic}
                  </button>
                </div>
              </div>

              <div className={textAlignClassName}>
                <p className={settingLabelClass}>
                  {messages.settings.direction}
                </p>

                <p className={settingDescriptionClass}>
                  {messages.settings.directionDesc}
                </p>

                <div
                  className={`mt-3 flex flex-wrap gap-2 md:mt-4 ${optionGroupClassName}`}
                >
                  <button
                    type="button"
                    onClick={() => handleDirectionChange("ltr")}
                    className={`rounded-xl border px-3 py-2 md:px-4 ${buttonTextClass} transition ${
                      direction === "ltr"
                        ? "border-[var(--settings-option-active-border)] bg-[var(--settings-option-active-bg)] text-[var(--settings-option-active-text)]"
                        : "border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] text-[var(--settings-option-text)] hover:border-[var(--settings-option-hover-border)] hover:bg-[var(--settings-option-hover-bg)] hover:text-[var(--settings-option-hover-text)]"
                    }`}
                  >
                    LTR
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectionChange("rtl")}
                    className={`rounded-xl border px-3 py-2 md:px-4 ${buttonTextClass} transition ${
                      direction === "rtl"
                        ? "border-[var(--settings-option-active-border)] bg-[var(--settings-option-active-bg)] text-[var(--settings-option-active-text)]"
                        : "border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] text-[var(--settings-option-text)] hover:border-[var(--settings-option-hover-border)] hover:bg-[var(--settings-option-hover-bg)] hover:text-[var(--settings-option-hover-text)]"
                    }`}
                  >
                    RTL
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 border-t border-[var(--settings-divider)] pt-6 md:gap-6 md:pt-8 lg:grid-cols-[260px_1fr]">
            <div className={textAlignClassName}>
              <div
                className={`mb-2.5 flex items-center gap-2 md:mb-3 ${titleRowClassName}`}
              >
                <Bot
                  className={`text-[var(--settings-icon-text)] ${
                    isArabic ? "h-5 w-5" : "h-4 w-4"
                  }`}
                />
                <h2 className={sectionTitleClass}>
                  {messages.settings.aiPreferences}
                </h2>
              </div>

              <p className={sectionDescriptionClass}>
                {messages.settings.aiPreferencesDesc}
              </p>
            </div>

            <div className="space-y-5 md:space-y-6">
              <div
                className={`border-b border-[var(--settings-divider)] pb-5 md:pb-6 ${textAlignClassName}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:gap-4">
                  <div>
                    <p className={settingLabelClass}>
                      {messages.settings.aiEnabled}
                    </p>

                    <p className={settingDescriptionClass}>
                      {messages.settings.aiEnabledDesc}
                    </p>
                  </div>

                  <div
                    className={`flex flex-wrap gap-2 ${optionGroupClassName}`}
                  >
                    <button
                      type="button"
                      onClick={() => setAIEnabled(true)}
                      className={`rounded-xl border px-3 py-2 text-sm transition md:px-4 ${
                        aiEnabled
                          ? "border-[var(--settings-option-active-border)] bg-[var(--settings-option-active-bg)] text-[var(--settings-option-active-text)]"
                          : "border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] text-[var(--settings-option-text)] hover:border-[var(--settings-option-hover-border)] hover:bg-[var(--settings-option-hover-bg)] hover:text-[var(--settings-option-hover-text)]"
                      }`}
                    >
                      {messages.settings.enabled}
                    </button>

                    <button
                      type="button"
                      onClick={() => setAIEnabled(false)}
                      className={`rounded-xl border px-3 py-2 md:px-4 ${buttonTextClass} transition ${
                        !aiEnabled
                          ? "border-[var(--settings-option-active-border)] bg-[var(--settings-option-active-bg)] text-[var(--settings-option-active-text)]"
                          : "border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] text-[var(--settings-option-text)] hover:border-[var(--settings-option-hover-border)] hover:bg-[var(--settings-option-hover-bg)] hover:text-[var(--settings-option-hover-text)]"
                      }`}
                    >
                      {messages.settings.disabled}
                    </button>
                  </div>
                </div>
              </div>

              <div className={textAlignClassName}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:gap-4">
                  <div>
                    <p className={settingLabelClass}>
                      {messages.settings.aiSuggestions}
                    </p>

                    <p className={settingDescriptionClass}>
                      {messages.settings.aiSuggestionsDesc}
                    </p>
                  </div>

                  <div
                    className={`flex flex-wrap gap-2 ${optionGroupClassName}`}
                  >
                    <button
                      type="button"
                      onClick={() => setAISuggestions(true)}
                      className={`rounded-xl border px-3 py-2 md:px-4 ${buttonTextClass} transition ${
                        aiAutoSuggestions
                          ? "border-[var(--settings-option-active-border)] bg-[var(--settings-option-active-bg)] text-[var(--settings-option-active-text)]"
                          : "border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] text-[var(--settings-option-text)] hover:border-[var(--settings-option-hover-border)] hover:bg-[var(--settings-option-hover-bg)] hover:text-[var(--settings-option-hover-text)]"
                      }`}
                    >
                      {messages.settings.enabled}
                    </button>

                    <button
                      type="button"
                      onClick={() => setAISuggestions(false)}
                      className={`rounded-xl border px-3 py-2 md:px-4 ${buttonTextClass} transition ${
                        !aiAutoSuggestions
                          ? "border-[var(--settings-option-active-border)] bg-[var(--settings-option-active-bg)] text-[var(--settings-option-active-text)]"
                          : "border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] text-[var(--settings-option-text)] hover:border-[var(--settings-option-hover-border)] hover:bg-[var(--settings-option-hover-bg)] hover:text-[var(--settings-option-hover-text)]"
                      }`}
                    >
                      {messages.settings.disabled}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 border-t border-[var(--settings-divider)] pt-6 pb-8 md:gap-6 md:pt-8 md:pb-12 lg:grid-cols-[260px_1fr]">
            <div className={textAlignClassName}>
              <div
                className={`mb-2.5 flex items-center gap-2 md:mb-3 ${titleRowClassName}`}
              >
                <Database
                  className={`text-[var(--settings-icon-text)] ${
                    isArabic ? "h-5 w-5" : "h-4 w-4"
                  }`}
                />
                <h2 className={sectionTitleClass}>
                  {messages.settings.dataExport}
                </h2>
              </div>

              <p className={sectionDescriptionClass}>
                {messages.settings.dataExportDesc}
              </p>
            </div>

            <div className={textAlignClassName}>
              <div className="mb-4 grid grid-cols-2 gap-3 md:mb-5 md:gap-4">
                <div>
                  <p className="text-[11px] text-[var(--foreground-muted)] md:text-xs">
                    {messages.dashboard.kpis.clients}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-[var(--foreground)] md:text-2xl">
                    {exportStats.clientsCount}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-[var(--foreground-muted)] md:text-xs">
                    {messages.dashboard.totalProjects}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-[var(--foreground)] md:text-2xl">
                    {exportStats.projectsCount}
                  </p>
                </div>
              </div>

              <p className="mb-4 max-w-2xl text-xs leading-5 text-[var(--foreground-soft)] md:text-sm md:leading-6">
                {messages.settings.exportPlaceholderDesc}
              </p>

              <button
                type="button"
                onClick={handleExportWorkspaceData}
                className={`inline-flex items-center gap-2 rounded-xl border border-[var(--settings-export-border)] bg-[var(--settings-export-bg)] px-4 py-2 text-sm font-medium text-[var(--settings-export-text)] transition hover:bg-[var(--settings-export-hover-bg)] ${
                  isArabic ? "flex-row-reverse" : ""
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                {settingsText.exportWorkspaceData}
              </button>
            </div>
          </section>

          <section className="grid gap-4 border-t border-[var(--settings-divider)] pt-6 md:gap-6 md:pt-8 lg:grid-cols-[260px_1fr]">
            <div className={textAlignClassName}>
              <div
                className={`mb-2.5 flex items-center gap-2 md:mb-3 ${titleRowClassName}`}
              >
                <ShieldCheck
                  className={`text-[var(--settings-icon-text)] ${
                    isArabic ? "h-5 w-5" : "h-4 w-4"
                  }`}
                />
                <h2 className={sectionTitleClass}>
                  {accountSessionText.title}
                </h2>
              </div>

              <p className={sectionDescriptionClass}>
                {accountSessionText.subtitle}
              </p>
            </div>

            <div className={textAlignClassName}>
              <div
                className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:gap-5 ${
                  isArabic ? "sm:flex-row-reverse" : ""
                }`}
              >
                <div className="space-y-3">
                  <div>
                    <p className={settingLabelClass}>
                      {accountSessionText.currentSession}
                    </p>

                    <p className={settingDescriptionClass}>
                      {userEmail
                        ? `${accountSessionText.signedInWith} ${userEmail}`
                        : accountSessionText.signInHint}
                    </p>
                  </div>

                  <div
                    className={`flex flex-wrap gap-2 ${optionGroupClassName}`}
                  >
                    <span
                      className={`inline-flex items-center gap-2 rounded-xl border border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] px-3 py-2 text-xs font-medium text-[var(--settings-option-text)] ${
                        isArabic ? "flex-row-reverse" : ""
                      }`}
                    >
                      <MonitorCheck className="h-4 w-4 text-[var(--settings-icon-text)]" />
                      {userEmail
                        ? accountSessionText.secureAccess
                        : accountSessionText.guestSession}
                    </span>

                    {userEmail ? (
                      <span
                        className={`inline-flex items-center gap-2 rounded-xl border border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] px-3 py-2 text-xs font-medium text-[var(--settings-option-text)] ${
                          isArabic ? "flex-row-reverse" : ""
                        }`}
                      >
                        <ShieldCheck className="h-4 w-4 text-[var(--settings-icon-text)]" />
                        {accountSessionText.savedAccess}
                      </span>
                    ) : null}
                  </div>
                </div>

                {userEmail ? (
                  <LogoutButton
                    locale={locale}
                    isArabic={isArabic}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--settings-option-border)] bg-[var(--settings-option-bg)] px-4 py-2.5 text-sm font-medium text-[var(--settings-option-text)] transition hover:border-red-400/40 hover:bg-[var(--settings-option-hover-bg)] hover:text-red-300"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push(`/${locale}/login`)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--settings-export-border)] bg-[var(--settings-export-bg)] px-4 py-2.5 text-sm font-medium text-[var(--settings-export-text)] transition hover:bg-[var(--settings-export-hover-bg)] ${
                      isArabic ? "flex-row-reverse" : ""
                    }`}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>{isArabic ? "تسجيل الدخول" : "Login"}</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          <div
            className={`border-t border-[var(--settings-divider)] pt-4 pb-3 md:pt-5 md:pb-4 ${textAlignClassName}`}
          >
            <p className="text-xs leading-5 text-[var(--foreground-muted)]">
              {settingsText.footerNote}
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
