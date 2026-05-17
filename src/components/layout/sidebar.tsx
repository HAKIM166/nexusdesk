"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type RefObject,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Home,
  IdCard,
  ListTodo,
  Search,
  Settings,
  UsersRound,
  X,
} from "lucide-react";

import { getMessages } from "@/lib/helpers";
import { Locale } from "@/lib/constants";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";
import { useEmployeeStore } from "@/store/employee-store";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useSidebarSearch } from "@/hooks/use-sidebar-search";

import NexusLogo from "@/components/common/nexus-logo";

type MobileSidebarAction = "open" | "close" | "toggle";

function mobileSidebarReducer(state: boolean, action: MobileSidebarAction) {
  if (action === "open") return true;
  if (action === "close") return false;
  return !state;
}

type SearchQueryAction =
  | {
      type: "change";
      value: string;
    }
  | {
      type: "clear";
    };

function searchQueryReducer(_state: string, action: SearchQueryAction) {
  if (action.type === "clear") return "";
  return action.value;
}

type SearchOpenAction = "open" | "close";

function searchOpenReducer(state: boolean, action: SearchOpenAction) {
  if (action === "open") return true;
  if (action === "close") return false;
  return state;
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

  /* =========================
   Stores Section
   بيانات العملاء والمشاريع والموظفين من Zustand
========================= */
  const clients = useClientStore((state) => state.clients);
  const projects = useProjectStore((state) => state.projects);
  const employees = useEmployeeStore((state) => state.employees);

  /* =========================
     Local State Section
     حالة البحث وفتح/قفل tasks
  ========================= */
  const [searchQuery, updateSearchQuery] = useReducer(searchQueryReducer, "");
  const [isSearchOpen, updateSearchOpen] = useReducer(searchOpenReducer, false);

  const desktopSearchBoxRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchBoxRef = useRef<HTMLDivElement | null>(null);

  const [isMobileSidebarOpen, updateMobileSidebar] = useReducer(
    mobileSidebarReducer,
    false,
  );

  const changeSearchQuery = useCallback((value: string) => {
    updateSearchQuery({
      type: "change",
      value,
    });
  }, []);

  const clearSearchQuery = useCallback(() => {
    updateSearchQuery({
      type: "clear",
    });
  }, []);

  const openSearchPanel = useCallback(() => {
    updateSearchOpen("open");
  }, []);

  const closeSearchPanel = useCallback(() => {
    updateSearchOpen("close");
  }, []);

  const openMobileSidebar = useCallback(() => {
    updateMobileSidebar("open");
  }, []);

  const closeMobileSidebar = useCallback(() => {
    updateMobileSidebar("close");
  }, []);

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
   من هنا بيتعمل فلترة للعملاء والمشاريع والموظفين
========================= */
  const searchResults = useSidebarSearch(
    searchQuery,
    clients,
    projects,
    employees,
    locale,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      const isInsideDesktopSearch =
        desktopSearchBoxRef.current?.contains(target);
      const isInsideMobileSearch = mobileSearchBoxRef.current?.contains(target);

      if (!isInsideDesktopSearch && !isInsideMobileSearch) {
        closeSearchPanel();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeSearchPanel]);

  useEffect(() => {
    closeMobileSidebar();
    clearSearchQuery();
    closeSearchPanel();
  }, [clearSearchQuery, closeMobileSidebar, closeSearchPanel, pathname]);

  /* =========================
     Search Click Handler
     عند الضغط على نتيجة بحث
  ========================= */
  function handleSearchResultClick(href: string) {
    clearSearchQuery();
    closeSearchPanel();
    closeMobileSidebar();
    router.push(href);
  }

  function getSearchResultTypeLabel(type: "client" | "project" | "employee") {
    if (type === "client") {
      return isArabic ? "عميل" : "Client";
    }

    if (type === "employee") {
      return isArabic ? "موظف" : "Employee";
    }

    return isArabic ? "مشروع" : "Project";
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
     Desktop Link Style Section
     ستايل روابط الديسكتوب كما هو
  ========================= */
  const linkClass = (href?: string) =>
    [
      "relative flex h-[40px] items-center gap-3 rounded-sm px-3 text-start text-[13px] font-medium transition-all duration-200",
      href && isActive(href)
        ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] shadow-[var(--sidebar-active-shadow)] before:absolute before:top-1/2 before:h-6 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-[var(--sidebar-active-border)] ltr:before:-left-[11px] rtl:before:-right-[11px]"
        : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-hover-text)]",
    ].join(" ");

  /* =========================
     Mobile Link Style Section
     ستايل الموبايل فقط
  ========================= */
  const mobileLinkClass = (href?: string) =>
    [
      "relative flex h-10 items-center gap-2.5 rounded-md border px-3 text-start text-[12.5px] font-semibold transition-all duration-200",
      href && isActive(href)
        ? "border-[var(--primary)] bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)]"
        : "border-[var(--border)] bg-[var(--surface)] text-[var(--sidebar-muted)] hover:border-[var(--primary)]/40 hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-hover-text)]",
    ].join(" ");

  const mobileSubLinkClass = (href: string) =>
    [
      "block rounded-md border px-3 py-2 text-start text-[12px] font-medium transition",
      isActive(href)
        ? "border-[var(--primary)] bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)]"
        : "border-[var(--border)] bg-[var(--surface)] text-[var(--sidebar-muted)] hover:border-[var(--primary)]/40 hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-hover-text)]",
    ].join(" ");

  /* =========================
     Icon Style Section
     لون الأيقونات active / hover
  ========================= */
  const iconClass = (href?: string) =>
    href && isActive(href)
      ? "text-[var(--sidebar-active-text)]"
      : "text-[var(--sidebar-soft)] transition-colors group-hover:text-[var(--sidebar-hover-text)]";

  function renderSidebarContent(
    searchRef: RefObject<HTMLDivElement | null>,
    variant: "desktop" | "mobile" = "desktop",
  ) {
    const isMobile = variant === "mobile";

    return (
      <div
        className={
          isMobile
            ? "sidebar-scroll relative flex h-full w-full flex-col overflow-y-auto px-4 pb-4 pt-4"
            : "sidebar-scroll relative flex h-full w-full flex-col overflow-y-auto px-4 pb-3 pt-6"
        }
      >
        <div
          className={
            isMobile
              ? `mb-5 flex items-center border-b border-[var(--border)] pb-5 ${
                  isArabic ? "justify-center" : "justify-between"
                }`
              : "mb-5 flex items-center px-1"
          }
        >
          <NexusLogo
            layout="sidebar"
            tone="soft"
            showTagline
            className={
              isMobile
                ? "h-auto w-[160px] opacity-100"
                : "h-auto w-[176px] opacity-95 transition-all duration-300"
            }
          />

          {isMobile && (
            <button
              type="button"
              onClick={closeMobileSidebar}
              aria-label={isArabic ? "إغلاق القائمة" : "Close menu"}
              className={`flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition hover:border-[var(--primary)]/40 hover:bg-[var(--sidebar-hover)] ${
                isArabic ? "absolute left-5 top-5" : ""
              }`}
            >
              <X size={17} />
            </button>
          )}
        </div>

        {/* Search Section */}
        <div
          ref={searchRef}
          className={isMobile ? "relative z-50 mb-5" : "relative z-50 mb-4"}
        >
          <Search
            size={15}
            className={`pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-[var(--sidebar-text)] ${
              isArabic ? "right-3" : "left-3"
            }`}
          />

          <input
            value={searchQuery}
            onFocus={() => {
              if (searchQuery.trim()) openSearchPanel();
            }}
            onChange={(event) => {
              const value = event.target.value;

              changeSearchQuery(value);

              if (value.trim()) {
                openSearchPanel();
              } else {
                closeSearchPanel();
              }
            }}
            placeholder={searchQuery ? "" : messages.sidebar.search}
            className={`h-10 w-full border border-[var(--border)] bg-[var(--sidebar-input)] text-[13px] leading-10 text-[var(--sidebar-text)] outline-none transition placeholder:text-center placeholder:tracking-wide placeholder:text-[var(--sidebar-soft)] focus:border-[var(--primary)] focus:bg-[var(--sidebar-input)] ${
              isMobile ? "" : "rounded-[6px]"
            } ${isArabic ? "pr-11 pl-14 text-right" : "pl-11 pr-14 text-left"}`}
          />

          <div
            className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded bg-[var(--surface-muted)] px-1.5 py-0.5 text-[9px] text-[var(--sidebar-soft)] lg:flex ${
              isArabic ? "left-2" : "right-2"
            }`}
          >
            <span>⌘</span>
            <span>F</span>
          </div>

          {isSearchOpen && searchQuery.trim() && (
            <div
              className={
                isMobile
                  ? "absolute left-0 right-0 top-[48px] z-[999] max-h-[260px] overflow-y-auto border border-[var(--sidebar-search-panel-border)] bg-[var(--sidebar-search-panel-bg)]"
                  : "absolute left-0 right-0 top-[48px] z-[999] max-h-[260px] overflow-y-auto rounded-xl border border-[var(--sidebar-search-panel-border)] bg-[var(--sidebar-search-panel-bg)] shadow-none backdrop-blur-xl"
              }
            >
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    type="button"
                    onClick={() => handleSearchResultClick(result.href)}
                    className="block w-full border-b border-[var(--sidebar-search-item-border)] px-3 py-2.5 text-start text-xs transition last:border-b-0 hover:bg-[var(--sidebar-search-item-hover-bg)]"
                  >
                    <span className="block truncate font-semibold text-[var(--sidebar-search-title)]">
                      {result.title}
                    </span>
                    <span className="mt-1 block truncate text-[11px] text-[var(--sidebar-search-meta)]">
                      {getSearchResultTypeLabel(result.type)} ·{" "}
                      {result.subtitle}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2.5 text-start text-xs text-[var(--sidebar-search-empty)]">
                  {locale === "ar" ? "لا توجد نتائج" : "No results found"}
                </p>
              )}
            </div>
          )}
        </div>

        <nav className="flex flex-1 flex-col">
          <div>
            <p
              className={
                isMobile
                  ? "mb-2 px-1 text-start text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-soft)]"
                  : "mb-2 px-3 text-start text-[11px] font-medium text-[var(--sidebar-soft)]"
              }
            >
              {labels.home}
            </p>

            <div className={isMobile ? "space-y-2" : "space-y-1.5"}>
              <Link
                href={`/${locale}/dashboard`}
                className={`group ${
                  isMobile
                    ? mobileLinkClass("/dashboard")
                    : linkClass("/dashboard")
                }`}
              >
                <Home size={15} className={iconClass("/dashboard")} />
                <span>{messages.sidebar.dashboard}</span>
              </Link>

              <Link
                href={`/${locale}/calendar`}
                className={`group ${
                  isMobile
                    ? mobileLinkClass("/calendar")
                    : linkClass("/calendar")
                }`}
              >
                <CalendarDays size={15} className={iconClass("/calendar")} />
                <span>{labels.calendar}</span>
              </Link>

              <div>
                <button
                  type="button"
                  onClick={() => setTasksOpen((value) => !value)}
                  className={
                    isMobile
                      ? `group flex h-10 w-full items-center justify-between rounded-md border px-3 text-start text-[13px] font-semibold transition-all duration-200 ${
                          pathname.startsWith(`/${locale}/tasks`)
                            ? "border-[var(--primary)] bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)]"
                            : "border-[var(--border)] bg-[var(--surface)] text-[var(--sidebar-muted)] hover:border-[var(--primary)]/40 hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-hover-text)]"
                        }`
                      : `group flex h-[40px] w-full items-center justify-between rounded-[10px] px-3 text-start text-[13px] font-medium transition-all duration-200 ${
                          pathname.startsWith(`/${locale}/tasks`)
                            ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] shadow-[var(--sidebar-active-shadow)]"
                            : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-hover-text)]"
                        }`
                  }
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
                  <div
                    className={
                      isMobile
                        ? "ms-4 mt-2 space-y-2 border-s border-[var(--border-strong)] ps-3"
                        : "ms-5 mt-2 space-y-1.5 border-s border-[var(--border-strong)] ps-4"
                    }
                  >
                    {[
                      { label: labels.backlog, href: "/tasks/backlog" },
                      { label: labels.inProgress, href: "/tasks/in-progress" },
                      { label: labels.done, href: "/tasks/done" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={`/${locale}${item.href}`}
                        className={
                          isMobile
                            ? mobileSubLinkClass(item.href)
                            : `block rounded-md px-2 py-1.5 text-start text-[11px] font-normal transition ${
                                isActive(item.href)
                                  ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)]"
                                  : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-hover-text)]"
                              }`
                        }
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={isMobile ? "mt-6" : "mt-5"}>
            <p
              className={
                isMobile
                  ? "mb-2 px-1 text-start text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-soft)]"
                  : "mb-2 px-3 text-start text-[11px] font-medium text-[var(--sidebar-soft)]"
              }
            >
              {labels.workspace}
            </p>

            <div className={isMobile ? "space-y-2" : "space-y-1.5"}>
              <Link
                href={`/${locale}/clients`}
                className={`group ${
                  isMobile ? mobileLinkClass("/clients") : linkClass("/clients")
                }`}
              >
                <UsersRound size={15} className={iconClass("/clients")} />
                <span>{messages.sidebar.clients}</span>
              </Link>

              <Link
                href={`/${locale}/employees`}
                className={`group ${
                  isMobile
                    ? mobileLinkClass("/employees")
                    : linkClass("/employees")
                }`}
              >
                <IdCard size={15} className={iconClass("/employees")} />
                <span>{messages.sidebar.employees}</span>
              </Link>

              <Link
                href={`/${locale}/projects`}
                className={`group ${
                  isMobile
                    ? mobileLinkClass("/projects")
                    : linkClass("/projects")
                }`}
              >
                <BriefcaseBusiness
                  size={15}
                  className={iconClass("/projects")}
                />
                <span>{messages.sidebar.projects}</span>
              </Link>
            </div>
          </div>

          <div className={isMobile ? "mt-6" : "mt-7"}>
            <p
              className={
                isMobile
                  ? "mb-2 px-1 text-start text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--sidebar-soft)]"
                  : "mb-2 px-3 text-start text-[11px] font-medium text-[var(--sidebar-soft)]"
              }
            >
              {labels.system}
            </p>

            <div className={isMobile ? "space-y-2" : "space-y-1.5"}>
              <Link
                href={`/${locale}/messages-ai`}
                className={`group ${
                  isMobile
                    ? mobileLinkClass("/messages-ai")
                    : linkClass("/messages-ai")
                }`}
              >
                <Bot size={15} className={iconClass("/messages-ai")} />
                <span>{messages.sidebar.ai}</span>
              </Link>

              <Link
                href={`/${locale}/settings`}
                className={`group ${
                  isMobile
                    ? mobileLinkClass("/settings")
                    : linkClass("/settings")
                }`}
              >
                <Settings size={15} className={iconClass("/settings")} />
                <span>{messages.sidebar.settings}</span>
              </Link>
            </div>
          </div>
        </nav>

        <div
          className={
            isMobile ? "mt-6 border-t border-[var(--border)] pt-4" : "mt-4"
          }
        >
          <ThemeToggle />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Sidebar Button */}
      <button
        type="button"
        onClick={openMobileSidebar}
        aria-label={isArabic ? "فتح القائمة" : "Open menu"}
        className={`fixed top-[14px] z-40 flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_8px_20px_rgba(15,23,42,0.10)] transition hover:border-[var(--primary)]/45 hover:bg-[var(--surface-muted)] md:hidden ${
          isArabic ? "right-3" : "left-3"
        }`}
      >
        <span className="flex h-4 w-4 flex-col justify-center gap-[4px]">
          <span className="block h-[2px] w-4 rounded-sm bg-[var(--foreground)]" />
          <span className="block h-[2px] w-3 rounded-sm bg-[var(--primary)]" />
          <span className="block h-[2px] w-4 rounded-sm bg-[var(--foreground)]" />
        </span>
      </button>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <button
          type="button"
          onClick={closeMobileSidebar}
          aria-label={isArabic ? "إغلاق القائمة" : "Close menu"}
          className="fixed inset-0 z-40 bg-black/45 md:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 z-50 flex h-screen w-[min(82vw,310px)] bg-[var(--sidebar-bg)] transition-transform duration-300 md:hidden ${
          isArabic
            ? `right-0 border-l border-[var(--border)] ${
                isMobileSidebarOpen ? "translate-x-0" : "translate-x-full"
              }`
            : `left-0 border-r border-[var(--border)] ${
                isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
        }`}
      >
        {renderSidebarContent(mobileSearchBoxRef, "mobile")}
      </aside>

      {/* Desktop / Tablet Sidebar */}
      <aside
        className={`fixed top-0 z-20 hidden h-screen w-[252px] bg-[var(--sidebar-bg)] md:flex ${
          isArabic
            ? "right-0 border-l border-[var(--border)]"
            : "left-0 border-r border-[var(--border)]"
        }`}
      >
        {renderSidebarContent(desktopSearchBoxRef, "desktop")}
      </aside>
    </>
  );
}
