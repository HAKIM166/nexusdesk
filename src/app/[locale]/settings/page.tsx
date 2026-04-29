"use client";

import { useMemo } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";
import { getMessages } from "@/lib/helpers";
import { Locale } from "@/lib/constants";
import { useUIStore } from "@/store/ui-store";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";
import { usePathname, useRouter } from "next/navigation";

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
    ]
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
      <div className="space-y-10">
        <div className={isArabic ? "text-right" : "text-left"}>
          <h1 className="section-title">{messages.settings.title}</h1>
          <p className="section-subtitle">{messages.settings.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Appearance */}
          <div className="panel p-6">
            <div className={isArabic ? "text-right" : "text-left"}>
              <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
                {messages.settings.appearance}
              </h2>
              <p className="mb-6 text-sm text-[var(--foreground-soft)]">
                {messages.settings.appearanceDesc}
              </p>
            </div>

            <div className="space-y-4">
              <div
                className={`rounded-2xl border border-[var(--border)] p-4 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {messages.settings.theme}
                </p>
                <p className="mb-4 text-xs text-[var(--foreground-soft)]">
                  {messages.settings.themeDesc}
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      theme === "dark"
                        ? "border-[var(--primary)] bg-[var(--surface-muted)] text-[var(--foreground)]"
                        : "border-[var(--border)] text-[var(--foreground-soft)] hover:bg-[var(--surface-muted)]"
                    }`}
                  >
                    {messages.topbar.dark}
                  </button>

                  <button
                    onClick={() => setTheme("light")}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      theme === "light"
                        ? "border-[var(--primary)] bg-[var(--surface-muted)] text-[var(--foreground)]"
                        : "border-[var(--border)] text-[var(--foreground-soft)] hover:bg-[var(--surface-muted)]"
                    }`}
                  >
                    {messages.topbar.light}
                  </button>
                </div>
              </div>

              <div
                className={`rounded-2xl border border-[var(--border)] p-4 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {messages.settings.density}
                </p>
                <p className="mb-4 text-xs text-[var(--foreground-soft)]">
                  {messages.settings.densityDesc}
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDensity("comfortable")}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      density === "comfortable"
                        ? "border-[var(--primary)] bg-[var(--surface-muted)] text-[var(--foreground)]"
                        : "border-[var(--border)] text-[var(--foreground-soft)] hover:bg-[var(--surface-muted)]"
                    }`}
                  >
                    {messages.settings.comfortable}
                  </button>

                  <button
                    onClick={() => setDensity("compact")}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      density === "compact"
                        ? "border-[var(--primary)] bg-[var(--surface-muted)] text-[var(--foreground)]"
                        : "border-[var(--border)] text-[var(--foreground-soft)] hover:bg-[var(--surface-muted)]"
                    }`}
                  >
                    {messages.settings.compact}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Localization */}
          <div className="panel p-6">
            <div className={isArabic ? "text-right" : "text-left"}>
              <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
                {messages.settings.localization}
              </h2>
              <p className="mb-6 text-sm text-[var(--foreground-soft)]">
                {messages.settings.localizationDesc}
              </p>
            </div>

            <div className="space-y-4">
              <div
                className={`rounded-2xl border border-[var(--border)] p-4 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {messages.settings.language}
                </p>
                <p className="mb-4 text-xs text-[var(--foreground-soft)]">
                  {messages.settings.languageDesc}
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      locale === "en"
                        ? "border-[var(--primary)] bg-[var(--surface-muted)] text-[var(--foreground)]"
                        : "border-[var(--border)] text-[var(--foreground-soft)] hover:bg-[var(--surface-muted)]"
                    }`}
                  >
                    English
                  </button>

                  <button
                    onClick={() => handleLanguageChange("ar")}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      locale === "ar"
                        ? "border-[var(--primary)] bg-[var(--surface-muted)] text-[var(--foreground)]"
                        : "border-[var(--border)] text-[var(--foreground-soft)] hover:bg-[var(--surface-muted)]"
                    }`}
                  >
                    العربية
                  </button>
                </div>
              </div>

              <div
                className={`rounded-2xl border border-[var(--border)] p-4 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {messages.settings.direction}
                </p>
                <p className="mb-4 text-xs text-[var(--foreground-soft)]">
                  {messages.settings.directionDesc}
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDirectionChange("ltr")}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      direction === "ltr"
                        ? "border-[var(--primary)] bg-[var(--surface-muted)] text-[var(--foreground)]"
                        : "border-[var(--border)] text-[var(--foreground-soft)] hover:bg-[var(--surface-muted)]"
                    }`}
                  >
                    LTR
                  </button>

                  <button
                    onClick={() => handleDirectionChange("rtl")}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      direction === "rtl"
                        ? "border-[var(--primary)] bg-[var(--surface-muted)] text-[var(--foreground)]"
                        : "border-[var(--border)] text-[var(--foreground-soft)] hover:bg-[var(--surface-muted)]"
                    }`}
                  >
                    RTL
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Data */}
          <div className="panel p-6">
            <div className={isArabic ? "text-right" : "text-left"}>
              <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
                {messages.settings.dataExport}
              </h2>
              <p className="mb-6 text-sm text-[var(--foreground-soft)]">
                {messages.settings.dataExportDesc}
              </p>
            </div>

            <div
              className={`rounded-2xl border border-[var(--border)] p-4 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              <div className="mb-4">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {messages.settings.exportPlaceholderTitle}
                </p>
                <p className="text-xs text-[var(--foreground-soft)]">
                  {messages.settings.exportPlaceholderDesc}
                </p>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                  <p className="text-xs text-[var(--foreground-soft)]">
                    {messages.dashboard.kpis.clients}
                  </p>
                  <p className="text-xl font-semibold text-[var(--foreground)]">
                    {exportStats.clientsCount}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                  <p className="text-xs text-[var(--foreground-soft)]">
                    {messages.dashboard.totalProjects}
                  </p>
                  <p className="text-xl font-semibold text-[var(--foreground)]">
                    {exportStats.projectsCount}
                  </p>
                </div>
              </div>

              <button
                onClick={handleExportWorkspaceData}
                className="rounded-full border border-[var(--primary)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--primary)] hover:text-[var(--background)]"
              >
                {isArabic ? "تصدير بيانات مساحة العمل" : "Export workspace data"}
              </button>
            </div>
          </div>

          {/* AI */}
          <div className="panel p-6">
            <div className={isArabic ? "text-right" : "text-left"}>
              <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
                {messages.settings.aiPreferences}
              </h2>
              <p className="mb-6 text-sm text-[var(--foreground-soft)]">
                {messages.settings.aiPreferencesDesc}
              </p>
            </div>

            <div className="space-y-4">
              <div
                className={`rounded-2xl border border-[var(--border)] p-4 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {messages.settings.aiEnabled}
                    </p>
                    <p className="text-xs text-[var(--foreground-soft)]">
                      {messages.settings.aiEnabledDesc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setAIEnabled(true)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        aiEnabled
                          ? "bg-[var(--foreground)] text-[var(--background)]"
                          : "border border-[var(--border)] text-[var(--foreground-soft)]"
                      }`}
                    >
                      {messages.settings.enabled}
                    </button>

                    <button
                      onClick={() => setAIEnabled(false)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        !aiEnabled
                          ? "bg-[var(--foreground)] text-[var(--background)]"
                          : "border border-[var(--border)] text-[var(--foreground-soft)]"
                      }`}
                    >
                      {messages.settings.disabled}
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-2xl border border-[var(--border)] p-4 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {messages.settings.aiSuggestions}
                    </p>
                    <p className="text-xs text-[var(--foreground-soft)]">
                      {messages.settings.aiSuggestionsDesc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setAISuggestions(true)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        aiAutoSuggestions
                          ? "bg-[var(--foreground)] text-[var(--background)]"
                          : "border border-[var(--border)] text-[var(--foreground-soft)]"
                      }`}
                    >
                      {messages.settings.enabled}
                    </button>

                    <button
                      onClick={() => setAISuggestions(false)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        !aiAutoSuggestions
                          ? "bg-[var(--foreground)] text-[var(--background)]"
                          : "border border-[var(--border)] text-[var(--foreground-soft)]"
                      }`}
                    >
                      {messages.settings.disabled}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}