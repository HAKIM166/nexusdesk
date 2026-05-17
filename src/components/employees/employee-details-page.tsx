/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Download,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  FileText,
  IdCard,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import EmployeeSkillsEditor from "@/components/employees/employee-skills-editor";
import {
  employeeSkillLimits,
  getEmployeeDepartmentLabel,
  getEmployeeSkillLabel,
  normalizeEmployeeSkills,
} from "@/data/employee-options";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import { useEmployeeStore } from "@/store/employee-store";
import { EmployeeStatus } from "@/types/employee";

import {
  getEmployeeLocationCityLabel,
  getEmployeeLocationCountryByCode,
  getEmployeeLocationCountryLabel,
  parseEmployeeLocation,
} from "@/data/employee-location-options";

import { getEmploymentTypeLabel } from "@/components/employees/employee-form-helpers";

type EmployeeDetailsPageProps = {
  locale: Locale;
  employeeId: string;
};

type EmployeeMessages = ReturnType<typeof getMessages>;
type EditableSection = "skills" | "notes" | null;

const MAX_SKILLS = employeeSkillLimits.maxSkills;
const MAX_NOTES_LENGTH = 500;

const statusClassMap: Record<EmployeeStatus, string> = {
  Active:
    "border-[color:var(--employee-status-active-border)] bg-[color:var(--employee-status-active-bg)] text-[color:var(--employee-status-active-text)]",
  Pending:
    "border-[color:var(--employee-status-pending-border)] bg-[color:var(--employee-status-pending-bg)] text-[color:var(--employee-status-pending-text)]",
  Inactive:
    "border-[color:var(--employee-status-inactive-border)] bg-[color:var(--employee-status-inactive-bg)] text-[color:var(--employee-status-inactive-text)]",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusDotClass(status: EmployeeStatus) {
  if (status === "Active") return "bg-[color:var(--employee-dot-active)]";
  if (status === "Pending") return "bg-[color:var(--employee-dot-pending)]";
  return "bg-[color:var(--employee-dot-inactive)]";
}

function translateStatus(status: EmployeeStatus, messages: EmployeeMessages) {
  const normalizedStatus =
    status.toLowerCase() as keyof typeof messages.employees.status;

  const employeeStatusMessages = messages.employees.status as Partial<
    Record<string, string>
  >;

  const commonStatusMessages = messages.common.status as Partial<
    Record<string, string>
  >;

  return (
    employeeStatusMessages[normalizedStatus] ||
    commonStatusMessages[status] ||
    status
  );
}

function formatJoinedDate(joinedAt: string | undefined, locale: Locale) {
  if (!joinedAt) return null;

  const date = new Date(joinedAt);

  if (Number.isNaN(date.getTime())) {
    return joinedAt;
  }

  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function sanitizeEmployeeFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function downloadTextFile(fileName: string, content: string) {
  const blob = new Blob([content], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

function formatEmployeeLocationLabel(
  location: string | undefined,
  locale: "ar" | "en",
) {
  const parsedLocation = parseEmployeeLocation(location);
  const country = getEmployeeLocationCountryByCode(parsedLocation.countryCode);

  const cityLabel = parsedLocation.city
    ? getEmployeeLocationCityLabel(parsedLocation.city, locale)
    : "";

  const countryLabel = country
    ? getEmployeeLocationCountryLabel(country, locale)
    : "";

  if (cityLabel && countryLabel) {
    return locale === "ar"
      ? `${cityLabel}، ${countryLabel}`
      : `${cityLabel}, ${countryLabel}`;
  }

  return cityLabel || countryLabel || location || "";
}

export default function EmployeeDetailsPage({
  locale,
  employeeId,
}: EmployeeDetailsPageProps) {
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  const employee = useEmployeeStore((state) =>
    state.getEmployeeById(employeeId),
  );
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);
  const initializeEmployees = useEmployeeStore(
  (state) => state.initializeEmployees,
);

const isLoading = useEmployeeStore((state) => state.isLoading);

  const [editingSection, setEditingSection] = useState<EditableSection>(null);
  const [skillsDraft, setSkillsDraft] = useState<string[]>([]);
  const [notesDraft, setNotesDraft] = useState("");
  const [editError, setEditError] = useState("");
  useEffect(() => {
  initializeEmployees();
}, [initializeEmployees]);

  const details = messages.employees.details;
  const actions = messages.employees.actions;

  const formatMessage = (
    template: string,
    values: Record<string, string | number>,
  ) =>
    Object.entries(values).reduce(
      (text, [key, value]) => text.replace(`{${key}}`, String(value)),
      template,
    );

  const labels = {
    phone: details.phone,
    location: details.location,
    joinedAt: details.joinedAt,
    employmentType: details.employmentType,
    skills: details.skills,
    notes: details.notes,
    noNotes: details.noNotes,
    profileSummary: details.profileSummary,
    workDetails: details.workDetails,
    contactDetails: details.contactDetails,
    edit: actions.edit,
    save: actions.save,
    cancel: actions.cancel,
    skillsPlaceholder: details.skillsEditor.searchPlaceholder,
    notesPlaceholder: details.notesEditor.placeholder,
    skillsHint: formatMessage(details.skillsEditor.hint, {
      max: MAX_SKILLS,
    }),
    notesHint: formatMessage(details.notesEditor.hint, {
      max: MAX_NOTES_LENGTH,
    }),
    skillsLimitError: formatMessage(details.skillsEditor.limitError, {
      max: MAX_SKILLS,
    }),
    notesLimitError: formatMessage(details.notesEditor.limitError, {
      max: MAX_NOTES_LENGTH,
    }),
    selectedSkills: details.skillsEditor.selectedTitle,
    suggestedSkills: details.skillsEditor.suggestedTitle,
    noMatchingSkills: details.skillsEditor.emptyText,
    maxSkillsReached: formatMessage(details.skillsEditor.maxReachedText, {
      max: MAX_SKILLS,
    }),
    addSkill: details.skillsEditor.addSkill,
    removeSkill: details.skillsEditor.removeSkill,
  };

  if (isLoading) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

  if (!employee) {
    return (
      <section className="space-y-4 pb-8 md:space-y-6 md:pb-0">
        <Link
          href={`/${locale}/employees`}
          className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--employee-soft-action-border)] bg-[color:var(--employee-soft-action-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--foreground-muted)] transition hover:bg-[color:var(--employee-action-hover-bg)] md:px-4"
        >
          <ArrowLeft
            size={16}
            className={isArabic ? "rotate-180" : undefined}
          />
          {details.back}
        </Link>

        <div className="rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--employee-card-bg)] p-5 text-center shadow-[0_8px_20px_var(--employee-card-shadow)] md:rounded-xl md:p-8 md:shadow-[0_12px_32px_var(--employee-card-shadow)]">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-[color:var(--employee-avatar-border)] bg-[linear-gradient(135deg,var(--employee-avatar-bg),var(--employee-avatar-bg-soft))] text-[color:var(--employee-avatar-text)] md:size-14">
            <UserRound size={22} className="md:size-6" />
          </div>

          <h1 className="mt-4 text-xl font-semibold text-[color:var(--foreground)] md:mt-5 md:text-2xl">
            {details.notFoundTitle}
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[color:var(--foreground-muted)] md:leading-7">
            {details.notFoundDescription}
          </p>
        </div>
      </section>
    );
  }

  const joinedDate = formatJoinedDate(employee.joinedAt, locale);
  const displayLocale = isArabic ? "ar" : "en";
  const employeeLocationLabel = formatEmployeeLocationLabel(
    employee.location,
    displayLocale,
  );
  const departmentLabel = getEmployeeDepartmentLabel(
    employee.department,
    displayLocale,
  );

  const employmentTypeLabel = employee.employmentType
    ? getEmploymentTypeLabel(employee.employmentType, isArabic, messages)
    : null;

  const skillLocale = isArabic ? "ar" : "en";

  const profileItems = [
    {
      label: details.employeeId,
      value: `#${employee.id}`,
      icon: IdCard,
    },
    {
      label: details.name,
      value: employee.name,
      icon: UserRound,
    },
    {
      label: details.role,
      value: employee.role,
      icon: BriefcaseBusiness,
    },
    {
      label: details.department,
      value: departmentLabel,
      icon: Building2,
    },
    {
      label: labels.employmentType,
      value: employmentTypeLabel,
      icon: ShieldCheck,
    },
    {
      label: labels.joinedAt,
      value: joinedDate,
      icon: CalendarDays,
    },
  ].filter((item) => item.value);

  const startEditingSkills = () => {
    setEditingSection("skills");
    setSkillsDraft(normalizeEmployeeSkills(employee.skills || [], MAX_SKILLS));
    setEditError("");
  };

  const startEditingNotes = () => {
    setEditingSection("notes");
    setNotesDraft(employee.notes || "");
    setEditError("");
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setSkillsDraft([]);
    setNotesDraft("");
    setEditError("");
  };

  const saveSkills = () => {
    const nextSkills = normalizeEmployeeSkills(skillsDraft, MAX_SKILLS);

    if (skillsDraft.length > MAX_SKILLS) {
      setEditError(labels.skillsLimitError);
      return;
    }

    const { id, ...employeeData } = employee;

    updateEmployee(id, {
      ...employeeData,
      skills: nextSkills.length ? nextSkills : undefined,
    });

    cancelEditing();
  };

  const saveNotes = () => {
    const nextNotes = notesDraft.trim();

    if (nextNotes.length > MAX_NOTES_LENGTH) {
      setEditError(labels.notesLimitError);
      return;
    }

    const { id, ...employeeData } = employee;

    updateEmployee(id, {
      ...employeeData,
      notes: nextNotes || undefined,
    });

    cancelEditing();
  };

  const downloadEmployeeData = () => {
    const employeeDataText = [
      details.downloadTitle,
      "--------------------------",
      "",
      `${details.employeeId}: #${employee.id}`,
      `${details.name}: ${employee.name}`,
      `${details.role}: ${employee.role}`,
      `${details.department}: ${departmentLabel}`,
      `${details.status}: ${translateStatus(employee.status, messages)}`,
      `${labels.employmentType}: ${employmentTypeLabel || "-"}`,
      `${labels.joinedAt}: ${joinedDate || "-"}`,
      "",
      details.contact,
      "-------",
      `${details.email}: ${employee.email}`,
      `${labels.phone}: ${employee.phone || "-"}`,
      `${labels.location}: ${employeeLocationLabel || "-"}`,
      "",
      labels.skills,
      "------",
      employee.skills?.length
        ? employee.skills
            .map((skill) => getEmployeeSkillLabel(skill, skillLocale))
            .join(", ")
        : "-",
      "",
      labels.notes,
      "-----",
      employee.notes || "-",
      "",
    ].join("\n");

    const fileName = `${sanitizeEmployeeFileName(employee.name || employee.id)}-profile.txt`;

    downloadTextFile(fileName, employeeDataText);
  };

  return (
    <section className="space-y-4 pb-8 md:space-y-6 md:pb-0">
      <Link
        href={`/${locale}/employees`}
        className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--employee-soft-action-border)] bg-[color:var(--employee-soft-action-bg)] px-3 py-2 text-sm font-semibold text-[color:var(--foreground-muted)] transition hover:bg-[color:var(--employee-action-hover-bg)] md:px-4"
      >
        <ArrowLeft size={16} className={isArabic ? "rotate-180" : undefined} />
        {details.back}
      </Link>

      <div className="relative overflow-hidden rounded-lg border border-[color:var(--employee-hero-border)] bg-[linear-gradient(135deg,var(--employee-hero-bg),var(--employee-hero-bg-soft))] p-4 shadow-[0_10px_24px_var(--employee-hero-shadow)] md:rounded-xl md:p-6 md:shadow-[0_14px_34px_var(--employee-hero-shadow)]">
        <div className="relative flex flex-col gap-4 md:gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3 md:gap-5">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[color:var(--employee-avatar-border)] bg-[linear-gradient(135deg,var(--employee-avatar-bg),var(--employee-avatar-bg-soft))] text-lg font-semibold text-[color:var(--employee-avatar-text)] shadow-[0_10px_24px_var(--employee-card-shadow)] md:size-24 md:text-2xl md:shadow-[0_14px_34px_var(--employee-card-shadow)]">
              {employee.avatarDataUrl ? (
                <img
                  src={employee.avatarDataUrl}
                  alt={employee.name}
                  className="size-full object-cover"
                />
              ) : (
                getInitials(employee.name)
              )}
            </div>

            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--employee-table-chip-border)] bg-[color:var(--employee-table-chip-bg)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--employee-table-chip-text)] md:rounded-full md:px-3 md:text-xs md:tracking-[0.18em]">
                <BadgeCheck size={13} className="md:size-3.5" />
                {details.profile}
              </div>

              <h1 className="mt-3 truncate text-2xl font-semibold tracking-tight text-[color:var(--foreground)] md:mt-4 md:text-4xl">
                {employee.name}
              </h1>

              <p className="mt-1 line-clamp-2 text-sm leading-6 text-[color:var(--foreground-muted)] md:mt-2 md:leading-7">
                {employee.role} · {departmentLabel}
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center lg:justify-end">
            <span
              className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold md:rounded-full md:px-4 md:text-sm ${
                statusClassMap[employee.status]
              }`}
            >
              <span
                className={`size-2 rounded-full ${getStatusDotClass(
                  employee.status,
                )}`}
              />
              {translateStatus(employee.status, messages)}
            </span>

            <a
              href={`mailto:${employee.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[color:var(--employee-primary-action-border)] bg-[color:var(--employee-primary-action-bg)] px-4 py-2 text-sm font-semibold text-[color:var(--employee-primary-action-text)] shadow-[0_10px_24px_var(--employee-primary-action-shadow)] transition hover:bg-[color:var(--employee-primary-action-hover-bg)] md:shadow-[0_14px_32px_var(--employee-primary-action-shadow)]"
            >
              <Mail size={16} />
              {details.sendEmail}
            </a>

            <button
              type="button"
              onClick={downloadEmployeeData}
              className="inline-flex items-center justify-center rounded-lg border border-[color:var(--employee-action-border)] bg-[color:var(--employee-action-bg)] px-4 py-2 text-[color:var(--foreground-muted)] transition hover:bg-[color:var(--employee-action-hover-bg)] hover:text-[color:var(--employee-table-chip-text)] sm:size-9 sm:px-0"
              aria-label={details.downloadData}
              title={details.downloadData}
            >
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4 md:space-y-6">
          <div className="rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--employee-card-bg)] p-4 shadow-[0_8px_20px_var(--employee-card-shadow)] md:rounded-xl md:p-5 md:shadow-[0_12px_32px_var(--employee-card-shadow)]">
            <div className="flex items-start justify-between gap-3 border-b border-[color:var(--employee-card-border)] pb-3 md:items-center md:gap-4 md:pb-4">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-[color:var(--foreground)] md:text-lg">
                  {details.overview}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[color:var(--foreground-muted)] md:text-sm md:leading-6">
                  {labels.profileSummary}
                </p>
              </div>

              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[color:var(--employee-department-icon-bg)] text-[color:var(--employee-department-icon-text)] md:size-11">
                <UsersRound size={18} className="md:size-[19px]" />
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:mt-5 md:gap-4">
              {profileItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-lg border border-[color:var(--employee-department-row-border)] bg-[color:var(--employee-department-row-bg)] p-3 md:p-4"
                  >
                    <div className="flex items-start gap-2.5 md:items-center md:gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[color:var(--employee-action-bg)] text-[color:var(--employee-action-text)] md:size-9">
                        <Icon size={15} className="md:size-4" />
                      </span>

                      <div className="min-w-0">
                        <p className="line-clamp-1 text-[11px] font-medium text-[color:var(--foreground-muted)] md:text-xs">
                          {item.label}
                        </p>
                        <p className="mt-1 truncate text-xs font-semibold text-[color:var(--foreground)] md:text-sm">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--employee-card-bg)] p-4 shadow-[0_8px_20px_var(--employee-card-shadow)] md:rounded-xl md:p-5 md:shadow-[0_12px_32px_var(--employee-card-shadow)]">
            <div className="flex items-start justify-between gap-3 border-b border-[color:var(--employee-card-border)] pb-3 md:items-center md:gap-4 md:pb-4">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-[color:var(--foreground)] md:text-lg">
                  {labels.skills}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[color:var(--foreground-muted)] md:text-sm md:leading-6">
                  {labels.workDetails}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {editingSection === "skills" ? (
                  <>
                    <button
                      type="button"
                      onClick={saveSkills}
                      className="flex size-8 items-center justify-center rounded-lg border border-[color:var(--employee-primary-action-border)] bg-[color:var(--employee-primary-action-bg)] text-[color:var(--employee-primary-action-text)] transition hover:bg-[color:var(--employee-primary-action-hover-bg)] md:size-9"
                      aria-label={labels.save}
                    >
                      <Check size={15} className="md:size-4" />
                    </button>

                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="flex size-8 items-center justify-center rounded-lg border border-[color:var(--employee-action-border)] bg-[color:var(--employee-action-bg)] text-[color:var(--employee-action-text)] transition hover:bg-[color:var(--employee-action-hover-bg)] md:size-9"
                      aria-label={labels.cancel}
                    >
                      <X size={15} className="md:size-4" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={startEditingSkills}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--employee-action-border)] bg-[color:var(--employee-action-bg)] px-2.5 py-2 text-xs font-semibold text-[color:var(--employee-action-text)] transition hover:bg-[color:var(--employee-action-hover-bg)] md:gap-2 md:px-3"
                  >
                    <Pencil size={14} />
                    {labels.edit}
                  </button>
                )}

                <span className="hidden size-9 items-center justify-center rounded-md bg-[color:var(--employee-stat-active-icon-bg)] text-[color:var(--employee-stat-active-icon-text)] sm:flex md:size-11">
                  <Sparkles size={18} className="md:size-[19px]" />
                </span>
              </div>
            </div>

            {editingSection === "skills" ? (
              <div className="mt-4 space-y-3 md:mt-5">
                <EmployeeSkillsEditor
                  value={skillsDraft}
                  role={employee.role}
                  department={departmentLabel}
                  isArabic={isArabic}
                  labels={{
                    searchPlaceholder: labels.skillsPlaceholder,
                    selectedTitle: labels.selectedSkills,
                    suggestedTitle: labels.suggestedSkills,
                    emptyText: labels.noMatchingSkills,
                    maxReachedText: labels.maxSkillsReached,
                    addSkillLabel: labels.addSkill,
                    removeSkillLabel: labels.removeSkill,
                  }}
                  maxSkills={MAX_SKILLS}
                  onChange={(nextSkills) => {
                    setSkillsDraft(nextSkills);
                    setEditError("");
                  }}
                />

                <p className="text-xs leading-5 text-[color:var(--foreground-muted)] md:leading-6">
                  {labels.skillsHint}
                </p>

                {editError ? (
                  <p className="rounded-lg border border-[color:var(--danger)] bg-[color:var(--surface-muted)] px-3 py-2 text-xs font-semibold text-[color:var(--danger)]">
                    {editError}
                  </p>
                ) : null}
              </div>
            ) : employee.skills?.length ? (
              <div className="mt-4 flex max-h-[150px] flex-wrap gap-2 overflow-y-auto pr-1 md:mt-5 md:max-h-none md:overflow-visible md:pr-0">
                {employee.skills.map((skill) => {
                  const skillLabel = getEmployeeSkillLabel(skill, skillLocale);

                  return (
                    <span
                      key={skill}
                      className="rounded-md border border-[color:var(--employee-department-badge-border)] bg-[color:var(--employee-department-badge-bg)] px-2.5 py-1.5 text-[11px] font-semibold text-[color:var(--employee-department-badge-text)] md:rounded-full md:px-3 md:text-xs"
                    >
                      {skillLabel}
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[color:var(--foreground-muted)] md:mt-5">
                —
              </p>
            )}
          </div>

          <div className="rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--employee-card-bg)] p-4 shadow-[0_8px_20px_var(--employee-card-shadow)] md:rounded-xl md:p-5 md:shadow-[0_12px_32px_var(--employee-card-shadow)]">
            <div className="flex items-start justify-between gap-3 border-b border-[color:var(--employee-card-border)] pb-3 md:items-center md:gap-4 md:pb-4">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-[color:var(--foreground)] md:text-lg">
                  {labels.notes}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[color:var(--foreground-muted)] md:text-sm md:leading-6">
                  {labels.profileSummary}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {editingSection === "notes" ? (
                  <>
                    <button
                      type="button"
                      onClick={saveNotes}
                      className="flex size-8 items-center justify-center rounded-lg border border-[color:var(--employee-primary-action-border)] bg-[color:var(--employee-primary-action-bg)] text-[color:var(--employee-primary-action-text)] transition hover:bg-[color:var(--employee-primary-action-hover-bg)] md:size-9"
                      aria-label={labels.save}
                    >
                      <Check size={15} className="md:size-4" />
                    </button>

                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="flex size-8 items-center justify-center rounded-lg border border-[color:var(--employee-action-border)] bg-[color:var(--employee-action-bg)] text-[color:var(--employee-action-text)] transition hover:bg-[color:var(--employee-action-hover-bg)] md:size-9"
                      aria-label={labels.cancel}
                    >
                      <X size={15} className="md:size-4" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={startEditingNotes}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--employee-action-border)] bg-[color:var(--employee-action-bg)] px-2.5 py-2 text-xs font-semibold text-[color:var(--employee-action-text)] transition hover:bg-[color:var(--employee-action-hover-bg)] md:gap-2 md:px-3"
                  >
                    <Pencil size={14} />
                    {labels.edit}
                  </button>
                )}

                <span className="hidden size-9 items-center justify-center rounded-md bg-[color:var(--employee-stat-pending-icon-bg)] text-[color:var(--employee-stat-pending-icon-text)] sm:flex md:size-11">
                  <FileText size={18} className="md:size-[19px]" />
                </span>
              </div>
            </div>

            {editingSection === "notes" ? (
              <div className="mt-4 space-y-3 md:mt-5">
                <textarea
                  value={notesDraft}
                  onChange={(event) => {
                    setNotesDraft(event.target.value);
                    setEditError("");
                  }}
                  placeholder={labels.notesPlaceholder}
                  rows={4}
                  maxLength={MAX_NOTES_LENGTH}
                  className="w-full resize-none rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--background)] px-3.5 py-2.5 text-sm leading-6 text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--foreground-soft)] focus:border-[color:var(--employee-primary-action-border)] md:px-4 md:py-3 md:leading-7"
                />

                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs leading-5 text-[color:var(--foreground-muted)] md:leading-6">
                    {labels.notesHint}
                  </p>

                  <span className="shrink-0 text-xs font-semibold text-[color:var(--foreground-muted)]">
                    {notesDraft.length}/{MAX_NOTES_LENGTH}
                  </span>
                </div>

                {editError ? (
                  <p className="rounded-lg border border-[color:var(--danger)] bg-[color:var(--surface-muted)] px-3 py-2 text-xs font-semibold text-[color:var(--danger)]">
                    {editError}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-[color:var(--foreground-muted)] md:mt-5 md:leading-7">
                {employee.notes || labels.noNotes}
              </p>
            )}
          </div>
        </div>

        <aside className="grid gap-4 md:grid-cols-2 md:gap-6 xl:block xl:space-y-6">
          <div className="rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--employee-card-bg)] p-4 shadow-[0_8px_20px_var(--employee-card-shadow)] md:rounded-xl md:p-5 md:shadow-[0_12px_32px_var(--employee-card-shadow)]">
            <div className="flex items-start justify-between gap-3 md:items-center md:gap-4">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-[color:var(--foreground)] md:text-lg">
                  {details.contact}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[color:var(--foreground-muted)] md:text-sm md:leading-6">
                  {labels.contactDetails}
                </p>
              </div>

              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[color:var(--employee-stat-active-icon-bg)] text-[color:var(--employee-stat-active-icon-text)] md:size-11">
                <Mail size={18} className="md:size-[19px]" />
              </span>
            </div>

            <div className="mt-4 space-y-2.5 md:mt-5 md:space-y-3">
              <div className="rounded-lg border border-[color:var(--employee-department-row-border)] bg-[color:var(--employee-department-row-bg)] p-3 md:p-4">
                <p className="text-xs font-medium text-[color:var(--foreground-muted)]">
                  {details.email}
                </p>

                <a
                  href={`mailto:${employee.email}`}
                  className="mt-1 block break-all text-sm font-semibold text-[color:var(--foreground)] transition hover:text-[color:var(--employee-table-chip-text)]"
                >
                  {employee.email}
                </a>
              </div>

              {employee.phone ? (
                <div className="rounded-lg border border-[color:var(--employee-department-row-border)] bg-[color:var(--employee-department-row-bg)] p-3 md:p-4">
                  <div className="flex items-center gap-3">
                    <Phone
                      size={16}
                      className="shrink-0 text-[color:var(--foreground-muted)]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[color:var(--foreground-muted)]">
                        {labels.phone}
                      </p>
                      <a
                        href={`tel:${employee.phone}`}
                        className="mt-1 block text-sm font-semibold text-[color:var(--foreground)] transition hover:text-[color:var(--employee-table-chip-text)]"
                      >
                        <span dir="ltr" className="inline-block text-left">
                          {employee.phone}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : null}

              {employeeLocationLabel ? (
                <div className="rounded-lg border border-[color:var(--employee-department-row-border)] bg-[color:var(--employee-department-row-bg)] p-3 md:p-4">
                  <div className="flex items-center gap-3">
                    <MapPin
                      size={16}
                      className="shrink-0 text-[color:var(--foreground-muted)]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[color:var(--foreground-muted)]">
                        {labels.location}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[color:var(--foreground)]">
                        {employeeLocationLabel}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--employee-card-bg)] p-4 shadow-[0_8px_20px_var(--employee-card-shadow)] md:rounded-xl md:p-5 md:shadow-[0_12px_32px_var(--employee-card-shadow)]">
            <div className="flex items-start justify-between gap-3 md:items-center md:gap-4">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-[color:var(--foreground)] md:text-lg">
                  {details.team}
                </h2>
                <p className="mt-1 truncate text-xs text-[color:var(--foreground-muted)] md:text-sm">
                  {departmentLabel}
                </p>
              </div>

              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[color:var(--employee-stat-departments-icon-bg)] text-[color:var(--employee-stat-departments-icon-text)] md:size-11">
                <ShieldCheck size={18} className="md:size-[19px]" />
              </span>
            </div>

            <div className="mt-4 space-y-2.5 md:mt-5 md:space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-[color:var(--employee-department-row-border)] bg-[color:var(--employee-department-row-bg)] px-3 py-2.5 md:gap-4 md:px-4 md:py-3">
                <span className="text-xs text-[color:var(--foreground-muted)] md:text-sm">
                  {details.department}
                </span>
                <span className="truncate text-end text-xs font-semibold text-[color:var(--foreground)] md:text-sm">
                  {departmentLabel}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg border border-[color:var(--employee-department-row-border)] bg-[color:var(--employee-department-row-bg)] px-3 py-2.5 md:gap-4 md:px-4 md:py-3">
                <span className="text-xs text-[color:var(--foreground-muted)] md:text-sm">
                  {details.status}
                </span>
                <span className="truncate text-end text-xs font-semibold text-[color:var(--foreground)] md:text-sm">
                  {translateStatus(employee.status, messages)}
                </span>
              </div>

              {employee.employmentType ? (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-[color:var(--employee-department-row-border)] bg-[color:var(--employee-department-row-bg)] px-3 py-2.5 md:gap-4 md:px-4 md:py-3">
                  <span className="text-xs text-[color:var(--foreground-muted)] md:text-sm">
                    {labels.employmentType}
                  </span>
                  <span className="truncate text-end text-xs font-semibold text-[color:var(--foreground)] md:text-sm">
                    {employmentTypeLabel}
                  </span>
                </div>
              ) : null}

              {joinedDate ? (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-[color:var(--employee-department-row-border)] bg-[color:var(--employee-department-row-bg)] px-3 py-2.5 md:gap-4 md:px-4 md:py-3">
                  <span className="text-xs text-[color:var(--foreground-muted)] md:text-sm">
                    {labels.joinedAt}
                  </span>
                  <span className="truncate text-end text-xs font-semibold text-[color:var(--foreground)] md:text-sm">
                    {joinedDate}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </div>

      <p className="pb-4 pt-1 text-center text-xs leading-6 text-[color:var(--foreground-soft)] md:pb-8 md:pt-2">
        {details.footerNote}
      </p>
    </section>
  );
}