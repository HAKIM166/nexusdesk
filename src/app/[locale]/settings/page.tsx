"use client";

import { useMemo } from "react";
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

export default function SettingsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const locale = (pathname.split("/")[1] || "en") as Locale;
  const isArabicLocale = locale === "ar";
  const messages = getMessages(locale);

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

  const isArabic = direction === "rtl" || isArabicLocale;

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
      {/* SETTINGS_PAGE_ROOT: الصفحة الأساسية للإعدادات بدون مربعات كثيرة */}
      <div className="space-y-8">
        {/* SETTINGS_HEADER: عنوان الصفحة والوصف */}
        <div className={isArabic ? "text-right" : "text-left"}>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-emerald-300/80">
            NexusDesk Control
          </p>

          <h1 className="section-title">{messages.settings.title}</h1>

          <p className="section-subtitle max-w-3xl">
            {messages.settings.subtitle}
          </p>
        </div>

        {/* SETTINGS_OVERVIEW: شريط معلومات خفيف يملأ الصفحة بدون كروت تقيلة */}
        <div className="grid gap-4 border-y border-white/[0.07] py-5 md:grid-cols-4">
          <div className={isArabic ? "text-right" : "text-left"}>
            <p className="text-xs text-[var(--foreground-muted)]">Theme</p>
            <p className="mt-1 text-sm font-semibold capitalize text-[var(--foreground)]">
              {exportStats.theme}
            </p>
          </div>

          <div className={isArabic ? "text-right" : "text-left"}>
            <p className="text-xs text-[var(--foreground-muted)]">Language</p>
            <p className="mt-1 text-sm font-semibold uppercase text-[var(--foreground)]">
              {exportStats.language}
            </p>
          </div>

          <div className={isArabic ? "text-right" : "text-left"}>
            <p className="text-xs text-[var(--foreground-muted)]">
              Workspace data
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {exportStats.clientsCount} clients · {exportStats.projectsCount}{" "}
              projects
            </p>
          </div>

          <div className={isArabic ? "text-right" : "text-left"}>
            <p className="text-xs text-[var(--foreground-muted)]">AI status</p>
            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {aiEnabled
                ? messages.settings.enabled
                : messages.settings.disabled}
            </p>
          </div>
        </div>

        {/* SETTINGS_CONTENT: محتوى الإعدادات الرئيسي */}
        <div className="space-y-10">
          {/* SETTINGS_APPEARANCE: إعدادات الشكل والكثافة */}
          <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <div className={isArabic ? "text-right" : "text-left"}>
              <div
                className={`mb-3 flex items-center gap-2 ${
                  isArabic ? "justify-end" : "justify-start"
                }`}
              >
                <MonitorCog className="h-4 w-4 text-emerald-400" />
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  {messages.settings.appearance}
                </h2>
              </div>

              <p className="text-sm leading-6 text-[var(--foreground-soft)]">
                {messages.settings.appearanceDesc}
              </p>
            </div>

            <div className="space-y-6">
              {/* SETTINGS_THEME: اختيار الثيم */}
              <div
                className={`border-b border-white/[0.07] pb-6 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {messages.settings.theme}
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--foreground-soft)]">
                  {messages.settings.themeDesc}
                </p>

                <div
                  className={`mt-4 flex flex-wrap gap-2 ${
                    isArabic ? "justify-end" : "justify-start"
                  }`}
                >
                  <button
                    onClick={() => setTheme("dark")}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                      theme === "dark"
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 text-[var(--foreground-soft)] hover:border-white/20 hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    {messages.topbar.dark}
                  </button>

                  <button
                    onClick={() => setTheme("light")}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                      theme === "light"
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 text-[var(--foreground-soft)] hover:border-white/20 hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    {messages.topbar.light}
                  </button>
                </div>
              </div>

              {/* SETTINGS_DENSITY: اختيار كثافة الواجهة */}
              <div className={isArabic ? "text-right" : "text-left"}>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {messages.settings.density}
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--foreground-soft)]">
                  {messages.settings.densityDesc}
                </p>

                <div
                  className={`mt-4 flex flex-wrap gap-2 ${
                    isArabic ? "justify-end" : "justify-start"
                  }`}
                >
                  <button
                    onClick={() => setDensity("comfortable")}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      density === "comfortable"
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 text-[var(--foreground-soft)] hover:border-white/20 hover:text-[var(--foreground)]"
                    }`}
                  >
                    {messages.settings.comfortable}
                  </button>

                  <button
                    onClick={() => setDensity("compact")}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      density === "compact"
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 text-[var(--foreground-soft)] hover:border-white/20 hover:text-[var(--foreground)]"
                    }`}
                  >
                    {messages.settings.compact}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SETTINGS_LOCALIZATION: اللغة واتجاه الصفحة */}
          <section className="grid gap-6 border-t border-white/[0.07] pt-8 lg:grid-cols-[260px_1fr]">
            <div className={isArabic ? "text-right" : "text-left"}>
              <div
                className={`mb-3 flex items-center gap-2 ${
                  isArabic ? "justify-end" : "justify-start"
                }`}
              >
                <Languages className="h-4 w-4 text-emerald-400" />
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  {messages.settings.localization}
                </h2>
              </div>

              <p className="text-sm leading-6 text-[var(--foreground-soft)]">
                {messages.settings.localizationDesc}
              </p>
            </div>

            <div className="space-y-6">
              {/* SETTINGS_LANGUAGE: تغيير اللغة */}
              <div
                className={`border-b border-white/[0.07] pb-6 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {messages.settings.language}
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--foreground-soft)]">
                  {messages.settings.languageDesc}
                </p>

                <div
                  className={`mt-4 flex flex-wrap gap-2 ${
                    isArabic ? "justify-end" : "justify-start"
                  }`}
                >
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      locale === "en"
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 text-[var(--foreground-soft)] hover:border-white/20 hover:text-[var(--foreground)]"
                    }`}
                  >
                    English
                  </button>

                  <button
                    onClick={() => handleLanguageChange("ar")}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      locale === "ar"
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 text-[var(--foreground-soft)] hover:border-white/20 hover:text-[var(--foreground)]"
                    }`}
                  >
                    العربية
                  </button>
                </div>
              </div>

              {/* SETTINGS_DIRECTION: تغيير اتجاه الواجهة */}
              <div className={isArabic ? "text-right" : "text-left"}>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {messages.settings.direction}
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--foreground-soft)]">
                  {messages.settings.directionDesc}
                </p>

                <div
                  className={`mt-4 flex flex-wrap gap-2 ${
                    isArabic ? "justify-end" : "justify-start"
                  }`}
                >
                  <button
                    onClick={() => handleDirectionChange("ltr")}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      direction === "ltr"
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 text-[var(--foreground-soft)] hover:border-white/20 hover:text-[var(--foreground)]"
                    }`}
                  >
                    LTR
                  </button>

                  <button
                    onClick={() => handleDirectionChange("rtl")}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      direction === "rtl"
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 text-[var(--foreground-soft)] hover:border-white/20 hover:text-[var(--foreground)]"
                    }`}
                  >
                    RTL
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SETTINGS_AI: إعدادات الذكاء الاصطناعي */}
          <section className="grid gap-6 border-t border-white/[0.07] pt-8 lg:grid-cols-[260px_1fr]">
            <div className={isArabic ? "text-right" : "text-left"}>
              <div
                className={`mb-3 flex items-center gap-2 ${
                  isArabic ? "justify-end" : "justify-start"
                }`}
              >
                <Bot className="h-4 w-4 text-emerald-400" />
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  {messages.settings.aiPreferences}
                </h2>
              </div>

              <p className="text-sm leading-6 text-[var(--foreground-soft)]">
                {messages.settings.aiPreferencesDesc}
              </p>
            </div>

            <div className="space-y-6">
              {/* SETTINGS_AI_ENABLED: تشغيل أو تعطيل مساعد الذكاء الاصطناعي */}
              <div
                className={`border-b border-white/[0.07] pb-6 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {messages.settings.aiEnabled}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--foreground-soft)]">
                      {messages.settings.aiEnabledDesc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setAIEnabled(true)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        aiEnabled
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                          : "border-white/10 text-[var(--foreground-soft)] hover:border-white/20 hover:text-[var(--foreground)]"
                      }`}
                    >
                      {messages.settings.enabled}
                    </button>

                    <button
                      onClick={() => setAIEnabled(false)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        !aiEnabled
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                          : "border-white/10 text-[var(--foreground-soft)] hover:border-white/20 hover:text-[var(--foreground)]"
                      }`}
                    >
                      {messages.settings.disabled}
                    </button>
                  </div>
                </div>
              </div>

              {/* SETTINGS_AI_SUGGESTIONS: تفعيل أو تعطيل الاقتراحات التلقائية */}
              <div className={isArabic ? "text-right" : "text-left"}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {messages.settings.aiSuggestions}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--foreground-soft)]">
                      {messages.settings.aiSuggestionsDesc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setAISuggestions(true)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        aiAutoSuggestions
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                          : "border-white/10 text-[var(--foreground-soft)] hover:border-white/20 hover:text-[var(--foreground)]"
                      }`}
                    >
                      {messages.settings.enabled}
                    </button>

                    <button
                      onClick={() => setAISuggestions(false)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        !aiAutoSuggestions
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                          : "border-white/10 text-[var(--foreground-soft)] hover:border-white/20 hover:text-[var(--foreground)]"
                      }`}
                    >
                      {messages.settings.disabled}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SETTINGS_DATA_EXPORT: تصدير بيانات مساحة العمل */}
          <section className="grid gap-6 border-t border-white/[0.07] pt-8 pb-12 lg:grid-cols-[260px_1fr]">
            <div className={isArabic ? "text-right" : "text-left"}>
              <div
                className={`mb-3 flex items-center gap-2 ${
                  isArabic ? "justify-end" : "justify-start"
                }`}
              >
                <Database className="h-4 w-4 text-emerald-400" />
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  {messages.settings.dataExport}
                </h2>
              </div>

              <p className="text-sm leading-6 text-[var(--foreground-soft)]">
                {messages.settings.dataExportDesc}
              </p>
            </div>

            <div className={isArabic ? "text-right" : "text-left"}>
              {/* SETTINGS_EXPORT_SUMMARY: ملخص البيانات المتاحة للتصدير */}
              <div className="mb-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {messages.dashboard.kpis.clients}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                    {exportStats.clientsCount}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {messages.dashboard.totalProjects}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                    {exportStats.projectsCount}
                  </p>
                </div>
              </div>

              <p className="mb-4 max-w-2xl text-sm leading-6 text-[var(--foreground-soft)]">
                {messages.settings.exportPlaceholderDesc}
              </p>

              <button
                onClick={handleExportWorkspaceData}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/15"
              >
                <LayoutDashboard className="h-4 w-4" />
                {isArabic
                  ? "تصدير بيانات مساحة العمل"
                  : "Export workspace data"}
              </button>
            </div>
          </section>
          {/* SETTINGS_FOOTER_NOTE: ملاحظة هادئة في نهاية صفحة الإعدادات */}
          <div
            className={`border-t border-white/[0.07] pt-5 pb-4 ${isArabic ? "text-right" : "text-left"}`}
          >
            <p className="text-xs leading-5 text-[var(--foreground-muted)]">
              {isArabic
                ? "يتم حفظ إعدادات مساحة العمل محليًا الآن، وسيتم ربطها بالخادم لاحقًا."
                : "Workspace preferences are saved locally for now and can be connected to the backend later."}
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
