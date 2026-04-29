"use client";

import { useMemo, useRef, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import { useProjectStore } from "@/store/project-store";
import { useClientStore } from "@/store/client-store";

type ProjectStatus = "Planned" | "In Progress" | "Completed" | "On Hold";

function getStatusClasses(status: string) {
  switch (status) {
    case "Planned":
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    case "In Progress":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "Completed":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "On Hold":
    default:
      return "border-white/10 bg-white/5 text-[var(--foreground-muted)]";
  }
}

function getLocalizedProjectStatus(
  status: string,
  locale: Locale,
  messages: ReturnType<typeof getMessages>
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

  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const projects = useProjectStore((state) => state.projects);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const setSelectedProject = useProjectStore(
    (state) => state.setSelectedProject
  );
  const clients = useClientStore((state) => state.clients);

  const project = useMemo(
    () => projects.find((item) => item.id === id),
    [projects, id]
  );

  const [statusValue, setStatusValue] = useState<ProjectStatus>(
    (project?.status as ProjectStatus) || "Planned"
  );

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
    messages
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

  const handleDeleteProject = () => {
    setIsDeleting(true);
    deleteProject(project.id);
    router.push(`/${locale}/projects`);
  };

  const handleUpdateStatus = () => {
    if (statusValue === project.status) return;

    updateProject(project.id, {
      title: project.title,
      description: project.description,
      clientId: project.clientId,
      status: statusValue,
      deadline: project.deadline,
      budget: project.budget,
      paidAmount: project.paidAmount,
    });

    showToast(isArabic ? "تم تحديث حالة المشروع" : "Project status updated");
  };

  return (
    <DashboardShell>
      <div className="space-y-8">
        {toast && (
          <div className="animate-fade-in fixed bottom-5 right-5 z-50 rounded-lg bg-black/80 px-4 py-2 text-sm text-white shadow-lg">
            {toast}
          </div>
        )}

        <div className={isArabic ? "text-right" : "text-left"}>
          <div className="mb-4">
            <button
              type="button"
              onClick={() => router.push(`/${locale}/projects`)}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-[var(--foreground-muted)] transition hover:bg-white/10 hover:text-[var(--foreground)]"
            >
              {isArabic ? "رجوع إلى المشاريع" : "Back to Projects"}
            </button>
          </div>

          <p className="text-sm text-[var(--foreground-muted)]">
            {isArabic ? "تفاصيل المشروع" : "Project Details"}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-[var(--foreground)]">
              {project.title}
            </h1>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                project.status
              )}`}
            >
              {localizedStatus}
            </span>
          </div>

          {project.description && (
            <p className="mt-3 text-sm text-[var(--foreground-muted)]">
              {project.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="card space-y-6 xl:col-span-2">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                {isArabic ? "معلومات المشروع" : "Project Information"}
              </h2>
              <p className="text-sm text-[var(--foreground-muted)]">
                {isArabic
                  ? "نظرة عامة على بيانات المشروع."
                  : "Overview of the project data."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {isArabic ? "اسم المشروع" : "Project Name"}
                </p>
                <p className="mt-2 font-medium text-[var(--foreground)]">
                  {project.title}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {isArabic ? "الحالة" : "Status"}
                </p>
                <p className="mt-2 font-medium text-[var(--foreground)]">
                  {localizedStatus}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {isArabic ? "العميل" : "Client"}
                </p>
                <p className="mt-2 font-medium text-[var(--foreground)]">
                  {client?.name || "-"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {isArabic ? "الموعد النهائي" : "Deadline"}
                </p>
                <p className="mt-2 font-medium text-[var(--foreground)]">
                  {project.deadline || messages.projects.notSet}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {isArabic ? "ميزانية المشروع" : "Project Budget"}
                </p>
                <p className="mt-2 font-medium text-[var(--foreground)]">
                  {formatCurrency(budget)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {isArabic ? "المبلغ المدفوع" : "Paid Amount"}
                </p>
                <p className="mt-2 font-medium text-emerald-300">
                  {formatCurrency(paidAmount)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:col-span-2">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {isArabic ? "المبلغ المتبقي" : "Remaining Amount"}
                </p>
                <p className="mt-2 font-medium text-amber-300">
                  {formatCurrency(remainingAmount)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:col-span-2">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {isArabic ? "وصف المشروع" : "Project Description"}
                </p>
                <p className="mt-2 text-sm text-[var(--foreground)]">
                  {project.description ||
                    (isArabic ? "لا يوجد وصف بعد" : "No description yet")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  {isArabic ? "إجراءات سريعة" : "Quick Actions"}
                </h2>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleEditProject}
                  className="w-full rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10"
                >
                  {isArabic ? "تعديل المشروع" : "Edit Project"}
                </button>

                <button
                  type="button"
                  onClick={handleDeleteProject}
                  className="w-full rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                >
                  {isArabic ? "حذف المشروع" : "Delete Project"}
                </button>

                <button
                  type="button"
                  onClick={handleAskAIAboutProject}
                  className="w-full rounded-lg border border-emerald-400/30 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-500/10"
                >
                  {isArabic
                    ? "اسأل الذكاء الاصطناعي عن المشروع"
                    : "Ask AI About Project"}
                </button>
              </div>
            </div>

            <div className="card space-y-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                {isArabic ? "تعديل الحالة" : "Update Status"}
              </h2>

              <div className="space-y-3">
                <select
                  value={statusValue}
                  onChange={(e) =>
                    setStatusValue(e.target.value as ProjectStatus)
                  }
                  className={`input-base w-full ${
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
                  className="w-full rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10"
                >
                  {isArabic ? "تحديث الحالة" : "Update Status"}
                </button>
              </div>
            </div>

            <div className="card space-y-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                {isArabic ? "ملخص سريع" : "Quick Summary"}
              </h2>

              <div className="space-y-2 text-sm">
                <p className="text-[var(--foreground-muted)]">
                  {isArabic ? "الحالة" : "Status"}:
                </p>
                <p className="text-[var(--foreground)]">{localizedStatus}</p>

                <p className="text-[var(--foreground-muted)]">
                  {isArabic ? "العميل" : "Client"}:
                </p>
                <p className="text-[var(--foreground)]">
                  {client?.name || "-"}
                </p>

                <p className="text-[var(--foreground-muted)]">
                  {isArabic ? "الموعد النهائي" : "Deadline"}:
                </p>
                <p className="text-[var(--foreground)]">
                  {project.deadline || messages.projects.notSet}
                </p>

                <p className="text-[var(--foreground-muted)]">
                  {isArabic ? "الميزانية" : "Budget"}:
                </p>
                <p className="text-[var(--foreground)]">
                  {formatCurrency(budget)}
                </p>

                <p className="text-[var(--foreground-muted)]">
                  {isArabic ? "المدفوع" : "Paid"}:
                </p>
                <p className="text-emerald-300">
                  {formatCurrency(paidAmount)}
                </p>

                <p className="text-[var(--foreground-muted)]">
                  {isArabic ? "المتبقي" : "Remaining"}:
                </p>
                <p className="text-amber-300">
                  {formatCurrency(remainingAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={isArabic ? "text-right" : "text-left"}>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/projects`)}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-[var(--foreground-muted)] transition hover:bg-white/10 hover:text-[var(--foreground)]"
          >
            {isArabic ? "رجوع إلى المشاريع" : "Back to Projects"}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}