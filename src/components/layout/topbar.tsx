"use client";

/* =========================
   Imports Section
   استدعاء المكتبات والأيقونات والـ stores
========================= */
import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  Download,
  Languages,
  Settings,
} from "lucide-react";

import { getMessages } from "@/lib/helpers";
import { Locale } from "@/lib/constants";
import { useUIStore } from "@/store/ui-store";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";

/* =========================
   Date Input Formatter
   تحويل التاريخ لصيغة input type="date"
========================= */
function formatDateForInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================
   Date Label Formatter
   تحويل التاريخ لشكل مقروء حسب اللغة
========================= */
function formatDateLabel(value: string, locale: Locale) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/* =========================
   Topbar Component
   الشريط العلوي للداشبورد
========================= */
export default function Topbar() {
  /* =========================
     Router / Pathname Section
     معرفة المسار الحالي والتنقل بين الصفحات
  ========================= */
  const pathname = usePathname();
  const router = useRouter();

  /* =========================
     Date Picker Ref
     مرجع مخفي لفتح date picker
  ========================= */
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  /* =========================
     Locale / Messages Section
     تحديد اللغة وجلب النصوص
  ========================= */
  const locale = (pathname.split("/")[1] || "en") as Locale;
  const messages = getMessages(locale);

  /* =========================
     UI Store Section
     إعدادات الواجهة العامة
  ========================= */
  const direction = useUIStore((state) => state.direction);
  const theme = useUIStore((state) => state.theme);
  const density = useUIStore((state) => state.density);
  const aiEnabled = useUIStore((state) => state.aiEnabled);
  const aiAutoSuggestions = useUIStore((state) => state.aiAutoSuggestions);

  /* =========================
     Data Stores Section
     بيانات العملاء والمشاريع المستخدمة في Export
  ========================= */
  const clients = useClientStore((state) => state.clients);
  const projects = useProjectStore((state) => state.projects);

  /* =========================
     Selected Date State
     التاريخ المختار في التوب بار
  ========================= */
  const [selectedDate, setSelectedDate] = useState(() =>
    formatDateForInput(new Date())
  );

  /* =========================
     Direction Checker
     تحديد هل الواجهة عربي / RTL
  ========================= */
  const isArabic = direction === "rtl" || locale === "ar";

  /* =========================
     Current Route Section
     تحديد الصفحة الحالية من الرابط
  ========================= */
  const currentSection = pathname.split("/")[2] || "dashboard";
  const currentSubPage = pathname.split("/")[3];

  /* =========================
     Page Title Resolver
     تغيير عنوان التوب بار حسب الصفحة الحالية
  ========================= */
  function getPageTitle() {
    if (currentSection === "clients") return messages.sidebar.clients;
    if (currentSection === "projects") return messages.sidebar.projects;
    if (currentSection === "calendar") return messages.sidebar.calendar;
    if (currentSection === "tasks") return messages.sidebar.tasks;
    if (currentSection === "settings") return messages.sidebar.settings;
    if (currentSection === "ai") return messages.sidebar.aiMessages;

    return messages.sidebar.dashboard;
  }

  /* =========================
     Overview / Breadcrumb Resolver
     تغيير النص الصغير فوق العنوان
  ========================= */
  function getOverviewLabel() {
    if (currentSection === "tasks" && currentSubPage) {
      const subPageLabel = currentSubPage
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return `${messages.sidebar.tasks} / ${subPageLabel}`;
    }

    return messages.topbar.overview;
  }

  /* =========================
     Language Toggle Handler
     تبديل اللغة بين EN و AR
  ========================= */
  function toggleLanguage() {
    const newLocale = locale === "en" ? "ar" : "en";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  }

  /* =========================
     Open Date Picker Handler
     فتح date picker المخفي
  ========================= */
  function openDatePicker() {
    const input = dateInputRef.current;

    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.click();
  }

  /* =========================
     Export Handler
     تصدير بيانات المشروع كـ JSON
  ========================= */
  function handleExport() {
    const payload = {
      app: "NexusDesk",
      exportedAt: new Date().toISOString(),
      selectedDate,

      settings: {
        locale,
        direction,
        theme,
        density,
        aiEnabled,
        aiAutoSuggestions,
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
    link.download = `nexusdesk-export-${selectedDate}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  /* =========================
     Shared Action Button Classes
     كلاس موحد لأزرار التاريخ / الإشعارات / الإعدادات / اللغة
  ========================= */
  const actionButtonClass =
    "inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--topbar-muted)] transition-all duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--topbar-text)]";

  return (
    /* =========================
       Topbar Main Wrapper
       الشريط العلوي بالكامل
    ========================= */
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--topbar-bg)] px-5 py-4 backdrop-blur-xl md:px-7 lg:px-8">
      {/* =========================
          Page Title Section
          عنوان الصفحة والوصف الصغير
      ========================= */}
      <div className="min-w-0">
        {/* Small Overview / Breadcrumb Text */}
        <p
          className={`text-xs font-medium text-[var(--topbar-muted)] ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {getOverviewLabel()}
        </p>

        {/* Main Page Title */}
        <h1
          className={`mt-1 text-xl font-semibold tracking-[-0.03em] text-[var(--topbar-text)] ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {getPageTitle()}
        </h1>
      </div>

      {/* =========================
          Topbar Actions Section
          التاريخ / التصدير / الإشعارات / الإعدادات / اللغة
      ========================= */}
      <div className="flex items-center gap-2.5">
        {/* =========================
            Date Picker Section
            زر التاريخ + input مخفي
        ========================= */}
        <div className="relative">
          {/* Date Button */}
          <button
            type="button"
            onClick={openDatePicker}
            className={`${actionButtonClass} gap-2 px-3.5 py-2 text-xs font-medium`}
          >
            <CalendarDays size={15} />
            {formatDateLabel(selectedDate, locale)}
          </button>

          {/* Hidden Date Input */}
          <input
            ref={dateInputRef}
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="pointer-events-none absolute right-0 top-0 h-0 w-0 opacity-0"
            aria-label="Select date"
          />
        </div>

        {/* =========================
            Export Button Section
            زر تصدير البيانات
        ========================= */}
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--export-border)] bg-[var(--export-bg)] px-4 py-2 text-xs font-semibold text-[var(--export-text)] shadow-[var(--export-shadow)] transition-all duration-200 hover:bg-[var(--export-hover-bg)]"
        >
          <Download size={15} />
          {messages.topbar.export}
        </button>

        {/* =========================
            Notifications Button Section
            زر الإشعارات + النقطة الحمراء
        ========================= */}
        <button
          type="button"
          className={`${actionButtonClass} relative h-10 w-10`}
        >
          <Bell size={17} />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        {/* =========================
            Settings Button Section
            زر الذهاب للإعدادات
        ========================= */}
        <button
          type="button"
          onClick={() => router.push(`/${locale}/settings`)}
          className={`${actionButtonClass} h-10 w-10`}
        >
          <Settings size={17} />
        </button>

        {/* =========================
            Language Toggle Section
            زر تغيير اللغة
        ========================= */}
        <button
          type="button"
          onClick={toggleLanguage}
          className={`${actionButtonClass} gap-2 px-3.5 py-2 text-xs font-semibold`}
        >
          <Languages size={15} />
          {locale === "en" ? "AR" : "EN"}
        </button>
      </div>
    </header>
  );
}