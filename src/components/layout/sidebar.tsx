"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Home,
  ListTodo,
  Search,
  Settings,
  UsersRound,
} from "lucide-react";

import { getMessages } from "@/lib/helpers";
import { Locale } from "@/lib/constants";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useUIStore } from "@/store/ui-store";
import { useSidebarSearch } from "@/hooks/use-sidebar-search";

export default function Sidebar() {
  /* =========================
     Routing / Locale Section
     تحديد اللغة والمسار الحالي
  ========================= */
  const pathname = usePathname();
  const router = useRouter();

  const locale = (pathname.split("/")[1] || "en") as Locale;
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  const theme = useUIStore((state) => state.theme);

  /* =========================
     Stores Section
     بيانات العملاء والمشاريع من Zustand
  ========================= */
  const clients = useClientStore((state) => state.clients);
  const projects = useProjectStore((state) => state.projects);

  /* =========================
     Local State Section
     حالة البحث وفتح/قفل tasks
  ========================= */
  const [searchQuery, setSearchQuery] = useState("");
  const [tasksOpen, setTasksOpen] = useState(
    pathname.startsWith(`/${locale}/tasks`),
  );

  /* =========================
     Labels Section
     النصوص حسب اللغة
  ========================= */
  const labels = {
    home: isArabic ? "الرئيسية" : "Home",
    calendar: isArabic ? "التقويم" : "Calendar",
    tasks: isArabic ? "المهام" : "Tasks",
    backlog: isArabic ? "المؤجلة" : "Backlog",
    inProgress: isArabic ? "قيد التنفيذ" : "In Progress",
    done: isArabic ? "مكتملة" : "Done",
    workspace: messages.sidebar.workspace,
    system: isArabic ? "النظام" : "System",
  };

  /* =========================
     Search Logic Section
     من هنا بيتعمل فلترة للعملاء والمشاريع
  ========================= */
  const searchResults = useSidebarSearch(searchQuery, clients, projects, locale);

  /* =========================
     Search Click Handler
     عند الضغط على نتيجة بحث
  ========================= */
  function handleSearchResultClick(href: string) {
    setSearchQuery("");
    router.push(href);
  }

  /* =========================
     Active Link Checker
     يحدد اللينك النشط حسب الصفحة الحالية
  ========================= */
  function isActive(href: string) {
    const fullHref = `/${locale}${href}`;

    if (href === "/dashboard") {
      return pathname === fullHref;
    }

    return pathname === fullHref || pathname.startsWith(`${fullHref}/`);
  }

  /* =========================
     Link Style Section
     ستايل روابط السايدبار
  ========================= */
  const linkClass = (href?: string) =>
    [
      "relative flex h-[40px] items-center gap-3 rounded-sm px-3 text-start text-[13px] font-medium transition-all duration-200",
      href && isActive(href)
        ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] shadow-[var(--sidebar-active-shadow)] before:absolute before:top-1/2 before:h-6 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-[var(--sidebar-active-border)] ltr:before:-left-[11px] rtl:before:-right-[11px]"
        : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-hover-text)]",
    ].join(" ");

  /* =========================
     Icon Style Section
     لون الأيقونات active / hover
  ========================= */
  const iconClass = (href?: string) =>
    href && isActive(href)
      ? "text-[var(--sidebar-active-text)]"
      : "text-[var(--sidebar-soft)] transition-colors group-hover:text-[var(--sidebar-hover-text)]";

  return (
    /* =========================
       Sidebar Main Wrapper
       الشريط الجانبي بالكامل
    ========================= */
    <aside
      className={`fixed top-0 z-20 hidden h-screen w-[252px] bg-[var(--sidebar-bg)] md:flex ${
        isArabic
          ? "right-0 border-l border-[var(--border)]"
          : "left-0 border-r border-[var(--border)]"
      }`}
    >
      <div className="sidebar-scroll relative flex h-full w-full flex-col overflow-y-auto px-4 pb-5 pt-8">
        <div className="mb-7 flex items-center px-1">
          <Image
            src={
              theme === "dark"
                ? "/logos/nexusdesk-logo-dark.png"
                : "/logos/nexusdesk-logo-light.png"
            }
            alt="NexusDesk"
            width={178}
            height={48}
            priority
            className="h-auto w-[190px] object-contain opacity-95 transition-all duration-300"
          />
        </div>

        {/* Search Section */}
        <div className="relative z-50 mb-4">
          <Search
            size={15}
            className={`pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-[var(--sidebar-text)] ${
              isArabic ? "right-3" : "left-3"
            }`}
          />

          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={searchQuery ? "" : messages.sidebar.search}
            className={`h-10 w-full rounded-[6px] border border-[var(--border)] bg-[var(--sidebar-input)] text-[13px] leading-10 text-[var(--sidebar-text)] outline-none transition placeholder:text-center placeholder:tracking-wide placeholder:text-[var(--sidebar-soft)] focus:border-[var(--primary)] focus:bg-[var(--sidebar-input)] ${
              isArabic ? "pr-11 pl-14 text-right" : "pl-11 pr-14 text-left"
            }`}
          />

          <div
            className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded bg-[var(--surface-muted)] px-1.5 py-0.5 text-[9px] text-[var(--sidebar-soft)] lg:flex ${
              isArabic ? "left-2" : "right-2"
            }`}
          >
            <span>⌘</span>
            <span>F</span>
          </div>

          {searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-[48px] z-[999] max-h-[260px] overflow-y-auto rounded-xl border border-[var(--primary)]/15 bg-[#07140f] shadow-[0_24px_80px_rgba(0,0,0,0.75)]">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    type="button"
                    onClick={() => handleSearchResultClick(result.href)}
                    className="block w-full border-b border-white/[0.06] px-3 py-2.5 text-start text-xs transition last:border-b-0 hover:bg-white/[0.07]"
                  >
                    <span className="block truncate font-semibold text-[var(--sidebar-text)]">
                      {result.title}
                    </span>
                    <span className="mt-1 block truncate text-[11px] text-[var(--sidebar-text)]/45">
                      {result.type === "client"
                        ? locale === "ar"
                          ? "عميل"
                          : "Client"
                        : locale === "ar"
                          ? "مشروع"
                          : "Project"}{" "}
                      · {result.subtitle}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2.5 text-start text-xs text-[var(--sidebar-text)]/45">
                  {locale === "ar" ? "لا توجد نتائج" : "No results found"}
                </p>
              )}
            </div>
          )}
        </div>

        <nav className="flex flex-1 flex-col">
          <div>
            <p className="mb-2 px-3 text-start text-[11px] font-medium text-[var(--sidebar-soft)]">
              {labels.home}
            </p>

            <div className="space-y-1.5">
              <Link
                href={`/${locale}/dashboard`}
                className={`group ${linkClass("/dashboard")}`}
              >
                <Home size={15} className={iconClass("/dashboard")} />
                <span>{messages.sidebar.dashboard}</span>
              </Link>

              <Link
                href={`/${locale}/calendar`}
                className={`group ${linkClass("/calendar")}`}
              >
                <CalendarDays size={15} className={iconClass("/calendar")} />
                <span>{labels.calendar}</span>
              </Link>

              <div>
                <button
                  type="button"
                  onClick={() => setTasksOpen((value) => !value)}
                  className={`group flex h-[40px] w-full items-center justify-between rounded-[10px] px-3 text-start text-[13px] font-medium transition-all duration-200 ${
                    pathname.startsWith(`/${locale}/tasks`)
                      ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] shadow-[var(--sidebar-active-shadow)]"
                      : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-hover-text)]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <ListTodo
                      size={15}
                      className={
                        pathname.startsWith(`/${locale}/tasks`)
                          ? "text-[var(--sidebar-active-text)]"
                          : "text-[var(--sidebar-soft)] transition-colors group-hover:text-[var(--sidebar-hover-text)]"
                      }
                    />
                    <span>{labels.tasks}</span>
                  </span>

                  <ChevronDown
                    size={14}
                    className={`transition ${
                      pathname.startsWith(`/${locale}/tasks`)
                        ? "text-[var(--sidebar-active-text)]"
                        : "text-[var(--sidebar-soft)] group-hover:text-[var(--sidebar-hover-text)]"
                    } ${tasksOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {tasksOpen && (
                  <div className="ms-5 mt-2 space-y-1.5 border-s border-[var(--border-strong)] ps-4">
                    {[
                      { label: labels.backlog, href: "/tasks/backlog" },
                      { label: labels.inProgress, href: "/tasks/in-progress" },
                      { label: labels.done, href: "/tasks/done" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={`/${locale}${item.href}`}
                        className={`block rounded-md px-2 py-1.5 text-start text-[11px] font-normal transition ${
                          isActive(item.href)
                            ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)]"
                            : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-hover-text)]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-7">
            <p className="mb-2 px-3 text-start text-[11px] font-medium text-[var(--sidebar-soft)]">
              {labels.workspace}
            </p>

            <div className="space-y-1.5">
              <Link
                href={`/${locale}/clients`}
                className={`group ${linkClass("/clients")}`}
              >
                <UsersRound size={15} className={iconClass("/clients")} />
                <span>{messages.sidebar.clients}</span>
              </Link>

              <Link
                href={`/${locale}/projects`}
                className={`group ${linkClass("/projects")}`}
              >
                <BriefcaseBusiness
                  size={15}
                  className={iconClass("/projects")}
                />
                <span>{messages.sidebar.projects}</span>
              </Link>
            </div>
          </div>

          <div className="mt-7">
            <p className="mb-2 px-3 text-start text-[11px] font-medium text-[var(--sidebar-soft)]">
              {labels.system}
            </p>

            <div className="space-y-1.5">
              <Link
                href={`/${locale}/messages-ai`}
                className={`group ${linkClass("/messages-ai")}`}
              >
                <Bot size={15} className={iconClass("/messages-ai")} />
                <span>{messages.sidebar.ai}</span>
              </Link>

              <Link
                href={`/${locale}/settings`}
                className={`group ${linkClass("/settings")}`}
              >
                <Settings size={15} className={iconClass("/settings")} />
                <span>{messages.sidebar.settings}</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="mt-6">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}