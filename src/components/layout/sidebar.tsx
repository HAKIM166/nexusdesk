"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMessages } from "@/lib/helpers";
import { Locale } from "@/lib/constants";

export default function Sidebar() {
  const pathname = usePathname();
  const locale = (pathname.split("/")[1] || "en") as Locale;
  const messages = getMessages(locale);

  const navItems = [
    { label: messages.sidebar.dashboard, href: "/dashboard" },
    { label: messages.sidebar.clients, href: "/clients" },
    { label: messages.sidebar.projects, href: "/projects" },
    { label: messages.sidebar.ai, href: "/messages-ai" },
    { label: messages.sidebar.settings, href: "/settings" },
  ];

  return (
    <aside className="hidden md:flex min-h-screen w-[280px] shrink-0 border-[var(--border)] border-r bg-[rgba(7,17,12,0.88)] backdrop-blur-xl">
      <div className="flex w-full flex-col p-5">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)] font-bold text-[var(--primary-foreground)] shadow-[0_0_30px_rgba(182,255,102,0.25)]">
            N
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white">
              NexusDesk
            </h2>
            <p className="text-sm text-[var(--foreground-soft)]">
              Premium CRM
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="input-base flex items-center">
            <span className="text-sm text-[var(--foreground-soft)]">
              {messages.sidebar.search}
            </span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const fullHref = `/${locale}${item.href}`;
            const isActive = pathname === fullHref;

            return (
              <Link
                key={item.label}
                href={fullHref}
                className={[
                  "rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "border border-[rgba(182,255,102,0.14)] bg-[rgba(182,255,102,0.12)] text-[var(--primary)] shadow-[0_0_24px_rgba(182,255,102,0.07)]"
                    : "text-[var(--foreground-muted)] hover:bg-[rgba(255,255,255,0.03)] hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-4">
          <p className="mb-1 text-sm font-medium text-white">
            {messages.sidebar.workspace}
          </p>
          <p className="text-sm text-[var(--foreground-soft)]">
            {messages.sidebar.workspaceDescription}
          </p>
        </div>
      </div>
    </aside>
  );
}