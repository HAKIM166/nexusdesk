"use client";

import { usePathname, useRouter } from "next/navigation";
import { getMessages } from "@/lib/helpers";
import { Locale } from "@/lib/constants";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();

  const locale = (pathname.split("/")[1] || "en") as Locale;
  const isRTL = locale === "ar";

  const messages = getMessages(locale);

  function toggleLanguage() {
    const newLocale = locale === "en" ? "ar" : "en";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  }

  return (
    <div
      className={[
        "flex items-center border-b border-[var(--border)] px-6 py-4",
        isRTL
          ? "flex-row-reverse justify-between text-right"
          : "justify-between text-left",
      ].join(" ")}
    >
      <div>
        <p className="text-sm text-[var(--foreground-soft)]">
          {messages.topbar.overview}
        </p>

        <h1 className="text-xl font-semibold text-white">
          {messages.sidebar.dashboard} - NexusDesk
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-white">
          {messages.topbar.export}
        </button>

        <ThemeToggle />

        <button
          onClick={toggleLanguage}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-white"
        >
          {locale === "en" ? "AR" : "EN"}
        </button>
      </div>
    </div>
  );
}
