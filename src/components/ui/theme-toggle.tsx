"use client";

import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useUIStore } from "@/store/ui-store";

export default function ThemeToggle() {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const buttonClass = (mode: "light" | "dark") => {
    const isActive = theme === mode;

    return [
      "flex h-9 w-9 items-center justify-center rounded-lg border",
      "transition-all duration-200",
      isActive
        ? "border-[var(--toggle-active-border)] bg-[var(--toggle-active-bg)] text-[var(--toggle-active-color)] shadow-[var(--toggle-active-shadow)]"
        : "border-[var(--toggle-border)] bg-[var(--toggle-bg)] text-[var(--toggle-muted-color)] hover:border-[var(--toggle-hover-border)] hover:bg-[var(--toggle-hover-bg)] hover:text-[var(--toggle-hover-color)] hover:shadow-[var(--toggle-hover-shadow)]",
    ].join(" ");
  };

  return (
    <div className="flex flex-col items-start gap-2 px-3">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={buttonClass("light")}
        aria-label="Switch to light theme"
        title="Light theme"
      >
        <Sun size={18} strokeWidth={1.9} />
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={buttonClass("dark")}
        aria-label="Switch to dark theme"
        title="Dark theme"
      >
        <Moon size={18} strokeWidth={1.9} />
      </button>
    </div>
  );
}