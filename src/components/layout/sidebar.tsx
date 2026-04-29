"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
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

/* =========================
   Type: Search result shape
   شكل نتيجة البحث
========================= */
type SearchResult = {
  id: string;
  type: "client" | "project";
  title: string;
  subtitle: string;
  href: string;
};

/* =========================
   Helper: safe string getter
   يحميك لو القيمة مش string
========================= */
function getTextValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

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
  const [tasksOpen, setTasksOpen] = useState(false);

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
  const searchResults = useMemo<SearchResult[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const clientResults = clients
      .map((client) => {
        const clientRecord = client as Record<string, unknown>;

        const id = getTextValue(clientRecord["id"]);
        const name = getTextValue(clientRecord["name"]);
        const company = getTextValue(clientRecord["company"]);
        const email = getTextValue(clientRecord["email"]);

        return {
          id,
          type: "client" as const,
          title: name || company || email || "Unnamed client",
          subtitle: company || email || "Client",
          href: `/${locale}/clients/${id}`,
          searchable: `${name} ${company} ${email}`.toLowerCase(),
        };
      })
      .filter((client) => client.id && client.searchable.includes(query))
      .map(({ searchable, ...client }) => client);

    const projectResults = projects
      .map((project) => {
        const projectRecord = project as Record<string, unknown>;

        const id = getTextValue(projectRecord["id"]);
        const name = getTextValue(projectRecord["name"]);
        const title = getTextValue(projectRecord["title"]);
        const status = getTextValue(projectRecord["status"]);

        return {
          id,
          type: "project" as const,
          title: name || title || "Untitled project",
          subtitle: status || "Project",
          href: `/${locale}/projects/${id}`,
          searchable: `${name} ${title} ${status}`.toLowerCase(),
        };
      })
      .filter((project) => project.id && project.searchable.includes(query))
      .map(({ searchable, ...project }) => project);

    return [...clientResults, ...projectResults].slice(0, 6);
  }, [clients, projects, searchQuery, locale]);

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
      "relative flex h-[40px] items-center gap-3 rounded-[10px] px-3 text-start text-[13px] font-medium transition-all duration-200",
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
      {/* =========================
          Sidebar Inner Wrapper
          التحكم في padding الداخلي والمسافة من فوق
      ========================= */}
      <div className="sidebar-scroll relative flex h-full w-full flex-col overflow-y-auto px-4 pb-5 pt-8">
        {/* =========================
    Logo Section
    شعار NexusDesk أعلى السايدبار
========================= */}
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

        {/* =========================
            Search Section
            صندوق البحث + الأيقونة + اختصار CMD/F + النتائج
        ========================= */}
        <div className="relative z-50 mb-4">
          {/* Search Icon */}
          <Search
            size={15}
            className={`pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-[var(--sidebar-text)] ${
              isArabic ? "right-3" : "left-3"
            }`}
          />

          {/* Search Input */}
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={searchQuery ? "" : messages.sidebar.search}
            className={`h-10 w-full rounded-[6px] border border-[var(--border)] bg-[var(--sidebar-input)] text-[13px] leading-10 text-[var(--sidebar-text)] outline-none transition placeholder:text-center placeholder:tracking-wide placeholder:text-[var(--sidebar-soft)] focus:border-[var(--primary)] focus:bg-[var(--sidebar-input)] ${
              isArabic ? "pr-11 pl-14 text-right" : "pl-11 pr-14 text-left"
            }`}
          />

          {/* Keyboard Shortcut */}
          <div
            className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded bg-[var(--surface-muted)] px-1.5 py-0.5 text-[9px] text-[var(--sidebar-soft)] lg:flex ${
              isArabic ? "left-2" : "right-2"
            }`}
          >
            <span>⌘</span>
            <span>F</span>
          </div>

          {/* Search Results Dropdown */}
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

        {/* =========================
            Navigation Section
            كل روابط السايدبار الأساسية
        ========================= */}
        <nav className="flex flex-1 flex-col">
          {/* =========================
              Home Section
              Dashboard / Calendar / Tasks
          ========================= */}
          <div>
            <p className="mb-2 px-3 text-start text-[11px] font-medium text-[var(--sidebar-soft)]">
              {labels.home}
            </p>

            <div className="space-y-1.5">
              {/* Dashboard Link */}
              <Link
                href={`/${locale}/dashboard`}
                className={`group ${linkClass("/dashboard")}`}
              >
                <Home size={15} className={iconClass("/dashboard")} />
                <span>{messages.sidebar.dashboard}</span>
              </Link>

              {/* Calendar Button */}
              <button type="button" className={`group w-full ${linkClass()}`}>
                <CalendarDays size={15} className={iconClass()} />
                <span>{labels.calendar}</span>
              </button>

              {/* =========================
                  Tasks Dropdown Section
                  زر المهام والقائمة اللي تحته
              ========================= */}
              <div>
                <button
                  type="button"
                  onClick={() => setTasksOpen((value) => !value)}
                  className="group flex h-[40px] w-full items-center justify-between rounded-[10px] px-3 text-start text-[13px] font-medium text-[var(--sidebar-muted)] transition-all duration-200 hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-hover-text)]"
                >
                  <span className="flex items-center gap-3">
                    <ListTodo
                      size={15}
                      className="text-[var(--sidebar-soft)] transition-colors group-hover:text-[var(--sidebar-hover-text)]"
                    />
                    <span>{labels.tasks}</span>
                  </span>

                  <ChevronDown
                    size={14}
                    className={`text-[var(--sidebar-soft)] transition group-hover:text-[var(--sidebar-hover-text)] ${
                      tasksOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Tasks Submenu */}
                {tasksOpen && (
                  <div className="ms-5 mt-2 space-y-1.5 border-s border-[var(--border-strong)] ps-4">
                    {[labels.backlog, labels.inProgress, labels.done].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          style={{
                            fontSize: "11px",
                            fontWeight: 400,
                          }}
                          className="block w-full rounded-md px-2 py-1.5 text-start text-[var(--sidebar-muted)] transition hover:bg-[var(--sidebar-hover)] hover:!text-[var(--sidebar-hover-text)]"
                        >
                          {item}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================
              Workspace Section
              Clients / Projects
          ========================= */}
          <div className="mt-7">
            <p className="mb-2 px-3 text-start text-[11px] font-medium text-[var(--sidebar-soft)]">
              {labels.workspace}
            </p>

            <div className="space-y-1.5">
              {/* Clients Link */}
              <Link
                href={`/${locale}/clients`}
                className={`group ${linkClass("/clients")}`}
              >
                <UsersRound size={15} className={iconClass("/clients")} />
                <span>{messages.sidebar.clients}</span>
              </Link>

              {/* Projects Link */}
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

          {/* =========================
              System Section
              AI Messages / Settings
          ========================= */}
          <div className="mt-7">
            <p className="mb-2 px-3 text-start text-[11px] font-medium text-[var(--sidebar-soft)]">
              {labels.system}
            </p>

            <div className="space-y-1.5">
              {/* AI Messages Link */}
              <Link
                href={`/${locale}/messages-ai`}
                className={`group ${linkClass("/messages-ai")}`}
              >
                <Bot size={15} className={iconClass("/messages-ai")} />
                <span>{messages.sidebar.ai}</span>
              </Link>

              {/* Settings Link */}
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

        {/* =========================
            Theme Toggle Section
            زرار تغيير الثيم تحت
        ========================= */}
        <div className="mt-6">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
