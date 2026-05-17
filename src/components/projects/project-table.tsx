"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import { useProjectStore } from "@/store/project-store";
import { useClientStore } from "@/store/client-store";

type ProjectTableProps = {
  locale: Locale;
};

export default function ProjectTable({ locale }: ProjectTableProps) {
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  const projects = useProjectStore((state) => state.projects);
  const initializeProjects = useProjectStore(
    (state) => state.initializeProjects,
  );
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const setSelectedProject = useProjectStore(
    (state) => state.setSelectedProject,
  );

  const clients = useClientStore((state) => state.clients);

  const [toast, setToast] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    setToast(message);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  useEffect(() => {
    initializeProjects();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [initializeProjects]);

  const handleDelete = async (projectId: string) => {
    await deleteProject(projectId);
    showToast(isArabic ? "تم حذف المشروع" : "Project deleted");
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((item) => item.id === clientId);
    return client ? client.name : messages.projects.unknownClient;
  };

  const getStatusLabel = (status: string) => {
    if (status === "Planned") return messages.projects.status.planned;
    if (status === "In Progress") return messages.projects.status.inProgress;
    if (status === "Completed") return messages.projects.status.completed;
    if (status === "On Hold") return messages.projects.status.onHold;
    return status;
  };

  const getStatusClassName = (status: string) => {
    if (status === "Completed") {
      return "border-[var(--project-status-completed-border)] bg-[var(--project-status-completed-bg)] text-[var(--project-status-completed-text)]";
    }

    if (status === "In Progress") {
      return "border-[var(--project-status-progress-border)] bg-[var(--project-status-progress-bg)] text-[var(--project-status-progress-text)]";
    }

    if (status === "Planned") {
      return "border-[var(--project-status-planned-border)] bg-[var(--project-status-planned-bg)] text-[var(--project-status-planned-text)]";
    }

    if (status === "On Hold") {
      return "border-[var(--project-status-hold-border)] bg-[var(--project-status-hold-bg)] text-[var(--project-status-hold-text)]";
    }

    return "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground-muted)]";
  };

  if (projects.length === 0) {
    return (
      <div
        className={`rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-6 text-sm text-[var(--foreground-muted)] ${
          isArabic ? "text-right" : "text-left"
        }`}
      >
        {messages.projects.empty}
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div
          className={`fixed inset-x-4 bottom-4 z-50 animate-fade-in rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm text-[var(--foreground)] shadow-sm sm:inset-x-auto sm:bottom-5 ${
            isArabic ? "sm:left-5" : "sm:right-5"
          }`}
        >
          {toast}
        </div>
      )}

      <div className="space-y-4 md:space-y-5">
        <div
          className={`flex flex-col gap-1 border-b border-[var(--border)] pb-4 md:pb-5 ${
            isArabic ? "items-end text-right" : "items-start text-left"
          }`}
        >
          <h2 className="text-base font-semibold text-[var(--foreground)] md:text-lg">
            {messages.projects.listTitle}
          </h2>

          <p className="text-xs leading-5 text-[var(--foreground-muted)] md:text-sm">
            {messages.projects.listSubtitle}
          </p>
        </div>

        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="max-h-[520px] space-y-2.5 overflow-y-auto pr-1 lg:hidden"
        >
          {projects.map((project) => (
            <article
              key={project.id}
              className={`rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-2.5 md:rounded-xl md:p-3 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              <div className="space-y-2.5 md:space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <Link
                      href={`/${locale}/projects/${project.id}`}
                      className="line-clamp-2 text-[13px] font-semibold leading-5 md:text-sm text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
                    >
                      {project.title}
                    </Link>

                    {project.description && (
                      <p className="line-clamp-2 text-[11px] leading-5 md:text-xs text-[var(--foreground-muted)]">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <span
                    className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] md:px-2 md:py-1 md:text-[11px] font-medium ${getStatusClassName(
                      project.status,
                    )}`}
                  >
                    {getStatusLabel(project.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-2 md:rounded-lg md:px-3">
                    <p className="mb-1 text-[11px] font-medium text-[var(--foreground-muted)]">
                      {messages.projectsTable.client}
                    </p>

                    <p className="truncate font-medium text-[var(--foreground)]">
                      {getClientName(project.clientId)}
                    </p>
                  </div>

                  <div className="rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-2 md:rounded-lg md:px-3">
                    <p className="mb-1 text-[11px] font-medium text-[var(--foreground-muted)]">
                      {messages.projects.form.deadline}
                    </p>

                    <p className="truncate font-medium text-[var(--foreground)]">
                      {project.deadline || messages.projects.notSet}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-[11px] md:px-3 md:py-2 md:text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)] hover:text-[var(--primary)]"
                  >
                    <Pencil className="h-4 w-4 shrink-0 stroke-[2.2]" />
                    <span>{messages.projects.edit}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5 text-[11px] md:px-3 md:py-2 md:text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:border-[var(--project-status-hold-border)] hover:bg-[var(--project-status-hold-bg)] hover:text-[var(--project-status-hold-text)]"
                  >
                    <Trash2 className="h-4 w-4 shrink-0 stroke-[2.2]" />
                    <span>{messages.projects.delete}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table
            dir={isArabic ? "rtl" : "ltr"}
            className={`w-full min-w-full border-collapse text-sm ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <thead>
              <tr className="border-b border-[var(--border-strong)] bg-[var(--surface-muted)] text-xs font-semibold uppercase tracking-[0.08em] text-[var(--primary)]">
                <th className="w-[36%] px-4 py-3.5">
                  {messages.projectsTable.project}
                </th>

                <th className="w-[18%] px-4 py-3.5">
                  {messages.projectsTable.client}
                </th>

                <th className="w-[14%] px-4 py-3.5">
                  {messages.projectsTable.status}
                </th>

                <th className="w-[16%] px-4 py-3.5">
                  {messages.projects.form.deadline}
                </th>

                <th className="w-[16%] px-4 py-3.5">
                  {messages.projects.actions}
                </th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-[var(--border)] transition-colors last:border-b-0 hover:bg-[var(--surface-muted)]"
                >
                  <td className="px-4 py-4 align-top">
                    <div className="space-y-1.5">
                      <Link
                        href={`/${locale}/projects/${project.id}`}
                        className="font-medium text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
                      >
                        {project.title}
                      </Link>

                      {project.description && (
                        <p className="line-clamp-1 max-w-xl text-xs leading-5 text-[var(--foreground-muted)]">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4 align-top text-[var(--foreground-muted)]">
                    {getClientName(project.clientId)}
                  </td>

                  <td className="px-4 py-4 align-top">
                    <span
                      className={`inline-flex items-center border px-2.5 py-1 text-xs font-medium ${getStatusClassName(
                        project.status,
                      )}`}
                    >
                      {getStatusLabel(project.status)}
                    </span>
                  </td>

                  <td className="px-4 py-4 align-top text-[var(--foreground-muted)]">
                    {project.deadline || messages.projects.notSet}
                  </td>

                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-2 border border-[var(--border)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)] hover:text-[var(--primary)]"
                      >
                        <Pencil className="h-4 w-4 shrink-0 stroke-[2.2]" />
                        <span>{messages.projects.edit}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(project.id)}
                        className="inline-flex items-center gap-2 border border-[var(--border)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:border-[var(--project-status-hold-border)] hover:bg-[var(--project-status-hold-bg)] hover:text-[var(--project-status-hold-text)]"
                      >
                        <Trash2 className="h-4 w-4 shrink-0 stroke-[2.2]" />
                        <span>{messages.projects.delete}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
