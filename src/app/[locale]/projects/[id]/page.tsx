"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import DashboardShell from "@/components/layout/dashboard-shell";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import { useProjectStore } from "@/store/project-store";
import { useClientStore } from "@/store/client-store";

type ProjectStatus = "Planned" | "In Progress" | "Completed" | "On Hold";

function getStatusClasses(status: string) {
  switch (status) {
    case "Planned":
      return "border-[var(--project-status-planned-border)] bg-[var(--project-status-planned-bg)] text-[var(--project-status-planned-text)]";
    case "In Progress":
      return "border-[var(--project-status-progress-border)] bg-[var(--project-status-progress-bg)] text-[var(--project-status-progress-text)]";
    case "Completed":
      return "border-[var(--project-status-completed-border)] bg-[var(--project-status-completed-bg)] text-[var(--project-status-completed-text)]";
    case "On Hold":
      return "border-[var(--project-status-hold-border)] bg-[var(--project-status-hold-bg)] text-[var(--project-status-hold-text)]";
    default:
      return "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground-muted)]";
  }
}

function getLocalizedProjectStatus(
  status: string,
  locale: Locale,
  messages: ReturnType<typeof getMessages>,
) {
  if (locale === "ar") {
    if (status === "Planned") return messages.projects.status.planned;
    if (status === "In Progress") return messages.projects.status.inProgress;
    if (status === "Completed") return messages.projects.status.completed;
    if (status === "On Hold") return messages.projects.status.onHold;
  }

  return status;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const locale = (params?.locale as Locale) || "en";
  const id = String(params?.id || "");

  const messages = getMessages(locale);
  const isArabic = locale === "ar";
  const detailsText = messages.projects.details;

  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const projects = useProjectStore((state) => state.projects);
  const initializeProjects = useProjectStore(
    (state) => state.initializeProjects,
  );
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const setSelectedProject = useProjectStore(
    (state) => state.setSelectedProject,
  );
  const clients = useClientStore((state) => state.clients);
  const initializeClients = useClientStore((state) => state.initializeClients);

  const project = useMemo(
    () => projects.find((item) => item.id === id),
    [projects, id],
  );

  const [statusValue, setStatusValue] = useState<ProjectStatus>(
    (project?.status as ProjectStatus) || "Planned",
  );

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      await Promise.all([initializeProjects(), initializeClients()]);

      if (isMounted) {
        setIsLoadingProject(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [initializeClients, initializeProjects]);

  if (!project && isLoadingProject) {
    return null;
  }

  if (!project && !isDeleting) {
    notFound();
  }

  if (!project) {
    return null;
  }

  const client = clients.find((c) => c.id === project.clientId);

  const localizedStatus = getLocalizedProjectStatus(
    project.status,
    locale,
    messages,
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(isArabic ? "ar-EG" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const budget = Number(project.budget) || 0;
  const paidAmount = Number(project.paidAmount) || 0;
  const remainingAmount = Math.max(budget - paidAmount, 0);

  const showToast = (message: string) => {
    setToast(message);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  const handleAskAIAboutProject = () => {
    const query = new URLSearchParams({
      mode: "project",
      projectId: project.id,
    }).toString();

    router.push(`/${locale}/messages-ai?${query}`);
  };

  const handleEditProject = () => {
    setSelectedProject(project);
    router.push(`/${locale}/projects`);
  };

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    await deleteProject(project.id);
    router.push(`/${locale}/projects`);
  };

  const handleUpdateStatus = async () => {
    if (statusValue === project.status) return;

    await updateProject(project.id, {
      title: project.title,
      description: project.description,
      clientId: project.clientId,
      status: statusValue,
      deadline: project.deadline,
      budget: project.budget,
      paidAmount: project.paidAmount,
    });

    showToast(detailsText.statusUpdatedToast);
  };

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <DashboardShell>
      <div className="space-y-4 pb-8 md:space-y-7">
        {toast && (
          <div
            className={`fixed inset-x-4 bottom-4 z-50 animate-fade-in rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm text-[var(--foreground)] shadow-sm sm:inset-x-auto sm:bottom-5 ${
              isArabic ? "sm:left-5" : "sm:right-5"
            }`}
          >
            {toast}
          </div>
        )}

        <div className={isArabic ? "text-right" : "text-left"}>
          <p className="text-xs font-medium text-[var(--foreground-muted)] md:text-sm">
            {detailsText.label}
          </p>

          <div
            className={`mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 ${
              isArabic ? "sm:justify-end" : "sm:justify-start"
            }`}
          >
            <h1 className="text-2xl font-bold leading-tight text-[var(--foreground)] md:text-3xl">
              {project.title}
            </h1>

            <span
              className={`inline-flex w-fit items-center rounded-md border px-2.5 py-1 text-[11px] font-medium md:px-3 md:text-xs ${getStatusClasses(
                project.status,
              )}`}
            >
              {localizedStatus}
            </span>
          </div>

          {project.description && (
            <p className="mt-3 line-clamp-3 max-w-3xl text-sm leading-6 text-[var(--foreground-muted)] md:line-clamp-none">
              {project.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-3">
          <div className="card space-y-4 p-4 md:space-y-6 md:p-6 xl:col-span-2">
            <div className={isArabic ? "text-right" : "text-left"}>
              <h2 className="text-base font-semibold text-[var(--foreground)] md:text-lg">
                {detailsText.informationTitle}
              </h2>

              <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)] md:text-sm">
                {detailsText.informationSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 md:col-span-1 md:p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {detailsText.projectName}
                </p>

                <p className="mt-2 line-clamp-2 text-sm font-medium text-[var(--foreground)] md:text-base">
                  {project.title}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 md:p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {messages.projectsTable.status}
                </p>

                <p className="mt-2 text-sm font-medium text-[var(--foreground)] md:text-base">
                  {localizedStatus}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 md:p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {messages.projectsTable.client}
                </p>

                <p className="mt-2 truncate text-sm font-medium text-[var(--foreground)] md:text-base">
                  {client?.name || "-"}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 md:p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {messages.projects.form.deadline}
                </p>

                <p className="mt-2 text-sm font-medium text-[var(--foreground)] md:text-base">
                  {project.deadline || messages.projects.notSet}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 md:p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {detailsText.projectBudget}
                </p>

                <p className="mt-2 text-sm font-medium text-[var(--foreground)] md:text-base">
                  {formatCurrency(budget)}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 md:p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {detailsText.paidAmount}
                </p>

                <p className="mt-2 text-sm font-medium text-[var(--success)] md:text-base">
                  {formatCurrency(paidAmount)}
                </p>
              </div>

              <div className="col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 md:p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {detailsText.remainingAmount}
                </p>

                <p className="mt-2 text-sm font-medium text-[var(--warning)] md:text-base">
                  {formatCurrency(remainingAmount)}
                </p>
              </div>

              <div className="col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 md:p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {detailsText.projectDescription}
                </p>

                <p className="mt-2 max-h-32 overflow-y-auto text-sm leading-6 text-[var(--foreground)] md:max-h-none md:overflow-visible">
                  {project.description || detailsText.noDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-1">
            <div className="card space-y-4 p-4 md:p-6">
              <div className={isArabic ? "text-right" : "text-left"}>
                <h2 className="text-base font-semibold text-[var(--foreground)] md:text-lg">
                  {detailsText.quickActions}
                </h2>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleEditProject}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]"
                >
                  {detailsText.editProject}
                </button>

                <button
                  type="button"
                  onClick={handleDeleteProject}
                  className="w-full rounded-xl border border-[var(--project-status-hold-border)] bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--project-status-hold-text)] transition-colors hover:bg-[var(--project-status-hold-bg)]"
                >
                  {detailsText.deleteProject}
                </button>

                <button
                  type="button"
                  onClick={handleAskAIAboutProject}
                  className="w-full rounded-xl border border-[var(--border-strong)] bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--sidebar-hover)]"
                >
                  {detailsText.askAi}
                </button>
              </div>
            </div>

            <div className="card space-y-4 p-4 md:p-6">
              <h2
                className={`text-base font-semibold text-[var(--foreground)] md:text-lg ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {detailsText.updateStatus}
              </h2>

              <div className="space-y-3">
                <select
                  value={statusValue}
                  onChange={(e) =>
                    setStatusValue(e.target.value as ProjectStatus)
                  }
                  className={`input-base min-h-11 w-full text-sm md:min-h-12 ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  <option value="Planned">
                    {messages.projects.status.planned}
                  </option>
                  <option value="In Progress">
                    {messages.projects.status.inProgress}
                  </option>
                  <option value="Completed">
                    {messages.projects.status.completed}
                  </option>
                  <option value="On Hold">
                    {messages.projects.status.onHold}
                  </option>
                </select>

                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]"
                >
                  {detailsText.updateStatus}
                </button>
              </div>
            </div>

            <div className="card space-y-4 p-4 md:col-span-2 md:p-6 xl:col-span-1">
              <h2
                className={`text-base font-semibold text-[var(--foreground)] md:text-lg ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {detailsText.summaryTitle}
              </h2>

              <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2">
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {messages.projectsTable.status}:
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                    {localizedStatus}
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2">
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {messages.projectsTable.client}:
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-[var(--foreground)]">
                    {client?.name || "-"}
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2">
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {messages.projects.form.deadline}:
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                    {project.deadline || messages.projects.notSet}
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2">
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {messages.projectsTable.budget}:
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                    {formatCurrency(budget)}
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2">
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {detailsText.paid}:
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--success)]">
                    {formatCurrency(paidAmount)}
                  </p>
                </div>

                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2">
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {detailsText.remaining}:
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--warning)]">
                    {formatCurrency(remainingAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`pt-1 ${isArabic ? "text-right" : "text-left"}`}>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/projects`)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--accent)] sm:w-auto"
          >
            <BackIcon className="h-4 w-4" />
            <span>{detailsText.back}</span>
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
