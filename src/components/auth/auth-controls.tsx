import { Languages, Moon, Sun } from "lucide-react";
import type { ThemeMode } from "./auth-types";

type AuthControlsProps = {

  theme: ThemeMode;
  lightModeLabel: string;
  darkModeLabel: string;
  languageLabel: string;
  onToggleLocale: () => void;
  onToggleTheme: () => void;
};

export function AuthControls({
  theme,
  lightModeLabel,
  darkModeLabel,
  languageLabel,
  onToggleLocale,
  onToggleTheme,
}: AuthControlsProps) {
  const buttonClass =
  "inline-flex h-11 items-center justify-center rounded-[1.15rem] border border-[var(--border)] bg-[var(--surface-strong)] text-sm font-semibold text-[var(--foreground)] shadow-none transition hover:border-[var(--primary)] hover:bg-[var(--surface-muted)]";

  return (
    <div className="flex items-center justify-end gap-2.5">
      <button
        type="button"
        onClick={onToggleLocale}
        className={`${buttonClass} gap-2 px-4`}
      >
        <Languages className="size-4 text-[var(--primary)]" />
        {languageLabel}
      </button>

      <button
        type="button"
        onClick={onToggleTheme}
        className={`${buttonClass} w-11`}
        aria-label={theme === "dark" ? lightModeLabel : darkModeLabel}
      >
        {theme === "dark" ? (
          <Sun className="size-4 text-[var(--primary)]" />
        ) : (
          <Moon className="size-4 text-[var(--primary)]" />
        )}
      </button>
    </div>
  );
}
