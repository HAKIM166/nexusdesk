"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getMessages } from "@/lib/helpers";
import { Locale } from "@/lib/constants";

type ThemeMode = "dark" | "light";

export default function ThemeToggle() {
  const pathname = usePathname();
  const locale = (pathname.split("/")[1] || "en") as Locale;
  const messages = getMessages(locale);

  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  function toggleTheme() {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-white"
    >
      {theme === "dark" ? messages.topbar.dark : messages.topbar.light}
    </button>
  );
}