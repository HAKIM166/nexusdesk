/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Eye,
  IdCard,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import { Employee, EmployeeStatus } from "@/types/employee";

type EmployeeMessages = ReturnType<typeof getMessages>;

type EmployeeTableProps = {
  employees: Employee[];
  messages: EmployeeMessages;
  isArabic: boolean;
  locale: Locale;
  onViewEmployee: (employeeId: string) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employee: Employee) => void;
  onStatusChange: (employeeId: string, status: EmployeeStatus) => void;
};

type ActionsMenuState = {
  employee: Employee;
  top: number;
  left: number;
} | null;

const statusOptions: EmployeeStatus[] = ["Active", "Pending", "Inactive"];

const statusClassMap: Record<EmployeeStatus, string> = {
  Active:
    "border-[color:var(--employee-status-active-border)] bg-[color:var(--employee-status-active-bg)] text-[color:var(--employee-status-active-text)]",
  Pending:
    "border-[color:var(--employee-status-pending-border)] bg-[color:var(--employee-status-pending-bg)] text-[color:var(--employee-status-pending-text)]",
  Inactive:
    "border-[color:var(--employee-status-inactive-border)] bg-[color:var(--employee-status-inactive-bg)] text-[color:var(--employee-status-inactive-text)]",
};

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

function getActionLabels(messages: EmployeeMessages, isArabic: boolean) {
  const actions = messages.employees.actions as Partial<
    Record<"view" | "edit" | "delete", string>
  >;

  return {
    view: actions.view || (isArabic ? "عرض التفاصيل" : "View details"),
    edit: actions.edit || (isArabic ? "تعديل" : "Edit"),
    delete: actions.delete || (isArabic ? "حذف" : "Delete"),
    status: isArabic ? "تغيير الحالة" : "Change status",
  };
}

export default function EmployeeTable({
  employees,
  messages,
  isArabic,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onStatusChange,
}: EmployeeTableProps) {
  const [actionsMenu, setActionsMenu] = useState<ActionsMenuState>(null);

  const labels = getActionLabels(messages, isArabic);

  useEffect(() => {
    if (!actionsMenu) return;

    const closeMenu = () => setActionsMenu(null);

    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);

    return () => {
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, [actionsMenu]);

  const handleToggleActions = (
    employee: Employee,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const menuWidth = 224;
    const menuHeight = 318;
    const gap = 10;
    const viewportPadding = 24;
    const rect = event.currentTarget.getBoundingClientRect();

    const preferredLeft = isArabic ? rect.left : rect.right - menuWidth;

    const safeLeft = Math.min(
      Math.max(viewportPadding, preferredLeft),
      window.innerWidth - menuWidth - viewportPadding,
    );

    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;

    const shouldOpenUp = spaceBelow < menuHeight;

    const preferredTop = shouldOpenUp
      ? rect.top - menuHeight - gap
      : rect.bottom + gap;

    const safeTop = Math.min(
      Math.max(viewportPadding, preferredTop),
      window.innerHeight - menuHeight - viewportPadding,
    );

    setActionsMenu((currentMenu) =>
      currentMenu?.employee.id === employee.id
        ? null
        : {
            employee,
            top: safeTop,
            left: safeLeft,
          },
    );
  };

  const handleViewEmployee = (employeeId: string) => {
    setActionsMenu(null);
    onViewEmployee(employeeId);
  };

  const handleEditEmployee = (employee: Employee) => {
    setActionsMenu(null);
    onEditEmployee(employee);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setActionsMenu(null);
    onDeleteEmployee(employee);
  };

  const handleStatusChange = (
    employeeId: string,
    nextStatus: EmployeeStatus,
  ) => {
    setActionsMenu(null);
    onStatusChange(employeeId, nextStatus);
  };

  return (
    <div className="mb-8 overflow-hidden rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--employee-card-bg)] shadow-[0_8px_20px_var(--employee-card-shadow)] md:mb-10 md:rounded-sm md:shadow-[0_12px_32px_var(--employee-card-shadow)]">
      <div className="flex flex-col gap-3 border-b border-[color:var(--employee-card-border)] px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-4 md:px-6 md:py-5">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-[color:var(--foreground)] md:text-xl">
            {messages.employees.title}
          </h2>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[color:var(--foreground-muted)] md:text-sm md:leading-6">
            {messages.employees.subtitle}
          </p>
        </div>

        <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--employee-table-chip-border)] bg-[color:var(--employee-table-chip-bg)] px-3 py-2 text-xs font-semibold text-[color:var(--employee-table-chip-text)] sm:w-fit md:rounded-2xl">
          <IdCard size={15} />
          <span>
            {isArabic
              ? `${employees.length} أعضاء`
              : `${employees.length} members`}
          </span>
        </div>
      </div>

      {employees.length > 0 ? (
        <>
          <div className="max-h-[520px] space-y-3 overflow-y-auto p-3 md:hidden">
            {employees.map((employee) => (
              <article
                key={employee.id}
                className="rounded-lg border border-[color:var(--employee-row-border)] bg-[color:var(--employee-department-row-bg)] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleViewEmployee(employee.id)}
                      className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[color:var(--employee-avatar-border)] bg-[linear-gradient(135deg,var(--employee-avatar-bg),var(--employee-avatar-bg-soft))] text-sm font-semibold text-[color:var(--employee-avatar-text)] transition hover:scale-105"
                    >
                      {employee.avatarDataUrl ? (
                        <img
                          src={employee.avatarDataUrl}
                          alt={employee.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        getInitials(employee.name)
                      )}
                    </button>

                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => handleViewEmployee(employee.id)}
                        className="block truncate text-start text-sm font-semibold text-[color:var(--foreground)] transition hover:text-[color:var(--employee-table-chip-text)]"
                      >
                        {employee.name}
                      </button>

                      <p className="mt-0.5 truncate text-xs text-[color:var(--foreground-muted)]">
                        {employee.role}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={messages.employees.table.actions}
                    onClick={(event) => handleToggleActions(employee, event)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[color:var(--employee-action-border)] bg-[color:var(--employee-action-bg)] text-[color:var(--employee-action-text)] transition hover:bg-[color:var(--employee-action-hover-bg)]"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <div className="mt-3 grid gap-2 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[color:var(--foreground-soft)]">
                      {messages.employees.table.department}
                    </span>

                    <span className="max-w-[58%] truncate rounded-md border border-[color:var(--employee-department-badge-border)] bg-[color:var(--employee-department-badge-bg)] px-2 py-1 font-medium text-[color:var(--employee-department-badge-text)]">
                      {employee.department}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[color:var(--foreground-soft)]">
                      {messages.employees.table.email}
                    </span>

                    <span className="max-w-[58%] truncate text-[color:var(--foreground-muted)]">
                      {employee.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[color:var(--foreground-soft)]">
                      {messages.employees.table.status}
                    </span>

                    <span
                      className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-[11px] font-semibold ${
                        statusClassMap[employee.status]
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${getStatusDotClass(
                          employee.status,
                        )}`}
                      />
                      {translateStatus(employee.status, messages)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-[color:var(--employee-row-border)] pt-3">
                  <span className="truncate text-[11px] text-[color:var(--foreground-muted)]">
                    #{employee.id}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleViewEmployee(employee.id)}
                    className="text-xs font-semibold text-[color:var(--employee-table-chip-text)] transition hover:opacity-80"
                  >
                    {labels.view}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto overflow-y-visible md:block">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[color:var(--employee-card-border)] text-xs uppercase tracking-[0.2em] text-[color:var(--foreground-muted)]">
                  <th className="px-6 py-4 text-start font-semibold">
                    {messages.employees.table.name}
                  </th>

                  <th className="px-6 py-4 text-start font-semibold">
                    {messages.employees.table.role}
                  </th>

                  <th className="px-6 py-4 text-start font-semibold">
                    {messages.employees.table.department}
                  </th>

                  <th className="px-6 py-4 text-start font-semibold">
                    {messages.employees.table.email}
                  </th>

                  <th className="px-6 py-4 text-start font-semibold">
                    {messages.employees.table.status}
                  </th>

                  <th className="px-6 py-4 text-end font-semibold">
                    {messages.employees.table.actions}
                  </th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee) => {
                  return (
                    <tr
                      key={employee.id}
                      className="group border-b border-[color:var(--employee-row-border)] transition last:border-0 hover:bg-[color:var(--employee-row-hover-bg)]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleViewEmployee(employee.id)}
                            className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-[color:var(--employee-avatar-border)] bg-[linear-gradient(135deg,var(--employee-avatar-bg),var(--employee-avatar-bg-soft))] text-sm font-semibold text-[color:var(--employee-avatar-text)] transition hover:scale-105"
                          >
                            {employee.avatarDataUrl ? (
                              <img
                                src={employee.avatarDataUrl}
                                alt={employee.name}
                                className="size-full object-cover"
                              />
                            ) : (
                              getInitials(employee.name)
                            )}
                          </button>

                          <div>
                            <button
                              type="button"
                              onClick={() => handleViewEmployee(employee.id)}
                              className="text-start font-semibold text-[color:var(--foreground)] transition hover:text-[color:var(--employee-table-chip-text)]"
                            >
                              {employee.name}
                            </button>

                            <p className="mt-1 text-xs text-[color:var(--foreground-muted)]">
                              #{employee.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-[color:var(--foreground-muted)]">
                        {employee.role}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full border border-[color:var(--employee-department-badge-border)] bg-[color:var(--employee-department-badge-bg)] px-3 py-1 text-xs font-medium text-[color:var(--employee-department-badge-text)]">
                          {employee.department}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-[color:var(--foreground-muted)]">
                        {employee.email}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                            statusClassMap[employee.status]
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${getStatusDotClass(
                              employee.status,
                            )}`}
                          />
                          {translateStatus(employee.status, messages)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div
                          className={`flex items-center ${
                            isArabic ? "justify-start" : "justify-end"
                          }`}
                        >
                          <button
                            type="button"
                            aria-label={messages.employees.table.actions}
                            onClick={(event) =>
                              handleToggleActions(employee, event)
                            }
                            className="flex size-9 items-center justify-center rounded-xl border border-[color:var(--employee-action-border)] bg-[color:var(--employee-action-bg)] text-[color:var(--employee-action-text)] transition hover:bg-[color:var(--employee-action-hover-bg)]"
                          >
                            <MoreHorizontal size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="px-4 py-10 text-center text-sm text-[color:var(--foreground-muted)] md:px-6 md:py-12">
          {messages.employees.empty}
        </div>
      )}

      {actionsMenu ? (
        <>
          <button
            type="button"
            aria-label="Close actions menu"
            onClick={() => setActionsMenu(null)}
            className="fixed inset-0 z-40 cursor-default bg-transparent"
          />

          <div
            className="fixed z-50 w-56 overflow-hidden rounded-xl border border-[color:var(--employee-card-border)] p-2 text-start shadow-[0_18px_54px_rgba(0,0,0,0.46)] ring-1 ring-white/10 md:rounded-2xl md:shadow-[0_24px_80px_rgba(0,0,0,0.62)]"
            style={{
              top: actionsMenu.top,
              left: actionsMenu.left,
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--background) 98%, var(--employee-card-bg)), color-mix(in srgb, var(--background) 94%, var(--employee-card-bg)))",
            }}
          >
            <button
              type="button"
              onClick={() => handleViewEmployee(actionsMenu.employee.id)}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--employee-action-hover-bg)]"
            >
              <Eye size={15} />
              <span>{labels.view}</span>
            </button>

            <button
              type="button"
              onClick={() => handleEditEmployee(actionsMenu.employee)}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--employee-action-hover-bg)]"
            >
              <Pencil size={15} />
              <span>{labels.edit}</span>
            </button>

            <div className="my-1 h-px bg-[color:var(--employee-card-border)]" />

            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)]">
              {labels.status}
            </div>

            <div className="space-y-0.5">
              {statusOptions.map((status) => {
                const isCurrentStatus = actionsMenu.employee.status === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      handleStatusChange(actionsMenu.employee.id, status)
                    }
                    className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-[color:var(--employee-action-hover-bg)] ${
                      isCurrentStatus
                        ? "text-[color:var(--foreground)]"
                        : "text-[color:var(--foreground-muted)]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`size-1.5 rounded-full ${getStatusDotClass(
                          status,
                        )}`}
                      />
                      {translateStatus(status, messages)}
                    </span>

                    {isCurrentStatus ? <CheckCircle2 size={15} /> : null}
                  </button>
                );
              })}
            </div>

            <div className="my-1 h-px bg-[color:var(--employee-card-border)]" />

            <button
              type="button"
              onClick={() => handleDeleteEmployee(actionsMenu.employee)}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-bold text-red-500 transition hover:bg-red-500/10"
            >
              <Trash2 size={15} />
              <span>{labels.delete}</span>
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}