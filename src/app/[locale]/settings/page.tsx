import DashboardShell from "@/components/layout/dashboard-shell";

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="space-y-10">
        <div>
          <h1 className="section-title">Settings</h1>
          <p className="section-subtitle">
            Manage your workspace preferences and application options.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="panel p-6">
            <h2 className="mb-2 text-lg font-semibold text-white">Appearance</h2>
            <p className="mb-4 text-sm text-[var(--foreground-soft)]">
              Control theme and visual preferences.
            </p>

            <div className="space-y-3">
              <div className="rounded-2xl border border-[var(--border)] p-4">
                <p className="text-sm text-white">Theme</p>
                <p className="text-xs text-[var(--foreground-soft)]">
                  Dark and light mode support
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] p-4">
                <p className="text-sm text-white">Density</p>
                <p className="text-xs text-[var(--foreground-soft)]">
                  Compact and comfortable layout modes
                </p>
              </div>
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="mb-2 text-lg font-semibold text-white">Localization</h2>
            <p className="mb-4 text-sm text-[var(--foreground-soft)]">
              Manage language and regional behavior.
            </p>

            <div className="space-y-3">
              <div className="rounded-2xl border border-[var(--border)] p-4">
                <p className="text-sm text-white">Language</p>
                <p className="text-xs text-[var(--foreground-soft)]">
                  English / Arabic support
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] p-4">
                <p className="text-sm text-white">Direction</p>
                <p className="text-xs text-[var(--foreground-soft)]">
                  RTL / LTR switching
                </p>
              </div>
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="mb-2 text-lg font-semibold text-white">Data & Export</h2>
            <p className="mb-4 text-sm text-[var(--foreground-soft)]">
              Export reports and manage workspace data.
            </p>

            <div className="space-y-3">
              <div className="rounded-2xl border border-[var(--border)] p-4">
                <p className="text-sm text-white">Export Reports</p>
                <p className="text-xs text-[var(--foreground-soft)]">
                  CSV / PDF export support later
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] p-4">
                <p className="text-sm text-white">Backups</p>
                <p className="text-xs text-[var(--foreground-soft)]">
                  Workspace backup and restore settings
                </p>
              </div>
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="mb-2 text-lg font-semibold text-white">AI Preferences</h2>
            <p className="mb-4 text-sm text-[var(--foreground-soft)]">
              Control AI generation behavior and prompts.
            </p>

            <div className="space-y-3">
              <div className="rounded-2xl border border-[var(--border)] p-4">
                <p className="text-sm text-white">Message Tone</p>
                <p className="text-xs text-[var(--foreground-soft)]">
                  Formal, friendly, or concise output
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] p-4">
                <p className="text-sm text-white">Prompt Templates</p>
                <p className="text-xs text-[var(--foreground-soft)]">
                  Save reusable AI prompt presets
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}