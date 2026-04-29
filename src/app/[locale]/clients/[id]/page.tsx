"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";

function getStatusClasses(status: string) {
  switch (status) {
    case "Active":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Pending":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "Inactive":
    default:
      return "border-white/10 bg-white/5 text-[var(--foreground-muted)]";
  }
}

function getLocalizedClientStatus(
  status: string,
  locale: Locale,
  messages: ReturnType<typeof getMessages>
) {
  if (locale === "ar") {
    if (status === "Active") return messages.common.status.Active;
    if (status === "Pending") return messages.common.status.Pending;
    if (status === "Inactive") return messages.common.status.Inactive;
  }

  return status;
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

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const locale = (params?.locale as Locale) || "en";
  const id = String(params?.id || "");

  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  const [isDeleting, setIsDeleting] = useState(false);

  const clients = useClientStore((state) => state.clients);
  const deleteClient = useClientStore((state) => state.deleteClient);
  const setSelectedClient = useClientStore((state) => state.setSelectedClient);
  const allProjects = useProjectStore((state) => state.projects);

  const client = useMemo(
    () => clients.find((item) => item.id === id),
    [clients, id]
  );

  const projects = useMemo(
    () => allProjects.filter((project) => project.clientId === id),
    [allProjects, id]
  );

  if (!client && !isDeleting) {
    notFound();
  }

  if (!client) {
    return null;
  }

  const localizedStatus = getLocalizedClientStatus(
    client.status,
    locale,
    messages
  );

  const numberLocale = isArabic ? "ar-EG" : "en-US";

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat(numberLocale).format(value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(numberLocale, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalBudget = projects.reduce((sum, project) => {
    return sum + (Number(project.budget) || 0);
  }, 0);

  const totalPaid = projects.reduce((sum, project) => {
    return sum + (Number(project.paidAmount) || 0);
  }, 0);

  const remainingAmount = Math.max(totalBudget - totalPaid, 0);

  const handleAskAIAboutClient = () => {
    const query = new URLSearchParams({
      mode: "client",
      clientId: client.id,
    }).toString();

    router.push(`/${locale}/messages-ai?${query}`);
  };

  const handleEditClient = () => {
    setSelectedClient(client);
    router.push(`/${locale}/clients`);
  };

  const handleDeleteClient = () => {
    setIsDeleting(true);
    deleteClient(client.id);
    router.push(`/${locale}/clients`);
  };

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className={isArabic ? "text-right" : "text-left"}>
          <div className="mb-4">
            <button
              type="button"
              onClick={() => router.push(`/${locale}/clients`)}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-[var(--foreground-muted)] transition hover:bg-white/10 hover:text-[var(--foreground)]"
            >
              {isArabic ? "رجوع إلى العملاء" : "Back to Clients"}
            </button>
          </div>

          <p className="text-sm text-[var(--foreground-muted)]">
            {isArabic ? "تفاصيل العميل" : "Client Details"}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-[var(--foreground)]">
              {client.name}
            </h1>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                client.status
              )}`}
            >
              {localizedStatus}
            </span>
          </div>

          <p className="mt-3 text-sm text-[var(--foreground-muted)]">
            {client.company}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className={`card space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
            <p className="text-xs text-[var(--foreground-muted)]">
              {isArabic ? "عدد المشاريع" : "Total Projects"}
            </p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {formatNumber(projects.length)}
            </p>
          </div>

          <div className={`card space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
            <p className="text-xs text-[var(--foreground-muted)]">
              {isArabic ? "إجمالي الميزانية" : "Total Budget"}
            </p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {formatCurrency(totalBudget)}
            </p>
          </div>

          <div className={`card space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
            <p className="text-xs text-[var(--foreground-muted)]">
              {isArabic ? "المدفوع" : "Paid Amount"}
            </p>
            <p className="text-2xl font-bold text-emerald-300">
              {formatCurrency(totalPaid)}
            </p>
          </div>

          <div className={`card space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
            <p className="text-xs text-[var(--foreground-muted)]">
              {isArabic ? "المتبقي" : "Remaining"}
            </p>
            <p className="text-2xl font-bold text-amber-300">
              {formatCurrency(remainingAmount)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="card space-y-6 xl:col-span-2">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                {isArabic ? "معلومات العميل" : "Client Information"}
              </h2>
              <p className="text-sm text-[var(--foreground-muted)]">
                {isArabic
                  ? "نظرة عامة على بيانات العميل الحالية."
                  : "Overview of the current client data."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {isArabic ? "اسم العميل" : "Client Name"}
                </p>
                <p className="mt-2 font-medium text-[var(--foreground)]">
                  {client.name}
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
                  {isArabic ? "الشركة" : "Company"}
                </p>
                <p className="mt-2 font-medium text-[var(--foreground)]">
                  {client.company}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-[var(--foreground-muted)]">
                  {isArabic ? "البريد الإلكتروني" : "Email"}
                </p>
                <p className="mt-2 font-medium text-[var(--foreground)]">
                  {client.email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  {isArabic ? "مشاريع العميل" : "Client Projects"}
                </h2>
                <p className="text-sm text-[var(--foreground-muted)]">
                  {isArabic
                    ? "كل المشاريع المرتبطة بهذا العميل."
                    : "All projects linked to this client."}
                </p>
              </div>

              {projects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table
                    className={`w-full text-sm ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    <thead>
                      <tr className="border-b border-white/10 text-[var(--foreground-muted)]">
                        <th className="py-3">
                          {messages.projectsTable.project}
                        </th>
                        <th className="py-3">
                          {messages.projectsTable.status}
                        </th>
                        <th className="py-3">
                          {messages.projects.form.deadline}
                        </th>
                        <th className="py-3">
                          {isArabic ? "المدفوع" : "Paid"}
                        </th>
                        <th className="py-3">
                          {isArabic ? "المتبقي" : "Remaining"}
                        </th>
                        <th className="py-3">
                          {isArabic ? "الانتقال" : "Open"}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {projects.map((project) => {
                        const projectBudget = Number(project.budget) || 0;
                        const projectPaid = Number(project.paidAmount) || 0;
                        const projectRemaining = Math.max(
                          projectBudget - projectPaid,
                          0
                        );

                        return (
                          <tr
                            key={project.id}
                            className="border-b border-white/5 transition hover:bg-white/5"
                          >
                            <td className="py-3 font-medium text-[var(--foreground)]">
                              <div className="space-y-1">
                                <div>{project.title}</div>
                                {project.description && (
                                  <div className="text-xs text-[var(--foreground-muted)]">
                                    {project.description}
                                  </div>
                                )}
                              </div>
                            </td>

                            <td className="py-3 text-[var(--foreground-muted)]">
                              {getLocalizedProjectStatus(
                                project.status,
                                locale,
                                messages
                              )}
                            </td>

                            <td className="py-3 text-[var(--foreground-muted)]">
                              {project.deadline || messages.projects.notSet}
                            </td>

                            <td className="py-3 text-emerald-300">
                              {formatCurrency(projectPaid)}
                            </td>

                            <td className="py-3 text-amber-300">
                              {formatCurrency(projectRemaining)}
                            </td>

                            <td className="py-3">
                              <Link
                                href={`/${locale}/projects/${project.id}`}
                                className="rounded-lg border border-white/10 px-3 py-1 text-xs transition hover:bg-white/10"
                              >
                                {isArabic ? "فتح" : "Open"}
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-[var(--foreground-muted)]">
                  {isArabic
                    ? "لا توجد مشاريع مرتبطة بهذا العميل حتى الآن."
                    : "No projects linked to this client yet."}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  {isArabic ? "إجراءات سريعة" : "Quick Actions"}
                </h2>
                <p className="text-sm text-[var(--foreground-muted)]">
                  {isArabic
                    ? "نفّذ أهم الإجراءات الخاصة بالعميل."
                    : "Perform the most important client actions."}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleEditClient}
                  className="w-full rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10"
                >
                  {isArabic ? "تعديل العميل" : "Edit Client"}
                </button>

                <button
                  type="button"
                  onClick={handleDeleteClient}
                  className="w-full rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                >
                  {isArabic ? "حذف العميل" : "Delete Client"}
                </button>

                <button
                  type="button"
                  onClick={handleAskAIAboutClient}
                  className="w-full rounded-lg border border-emerald-400/30 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-500/10"
                >
                  {isArabic
                    ? "اسأل الذكاء الاصطناعي عن العميل"
                    : "Ask AI About Client"}
                </button>
              </div>
            </div>

            <div className="card space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  {isArabic ? "ملخص سريع" : "Quick Summary"}
                </h2>
                <p className="text-sm text-[var(--foreground-muted)]">
                  {isArabic
                    ? "معلومات سريعة عن نشاط العميل."
                    : "Quick facts about this client's activity."}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[var(--foreground-muted)]">
                    {isArabic ? "عدد المشاريع" : "Total Projects"}
                  </p>
                  <p className="font-medium text-[var(--foreground)]">
                    {formatNumber(projects.length)}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--foreground-muted)]">
                    {isArabic ? "إجمالي الميزانية" : "Total Budget"}
                  </p>
                  <p className="font-medium text-[var(--foreground)]">
                    {formatCurrency(totalBudget)}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--foreground-muted)]">
                    {isArabic ? "المدفوع" : "Paid Amount"}
                  </p>
                  <p className="font-medium text-emerald-300">
                    {formatCurrency(totalPaid)}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--foreground-muted)]">
                    {isArabic ? "المتبقي" : "Remaining"}
                  </p>
                  <p className="font-medium text-amber-300">
                    {formatCurrency(remainingAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--foreground-muted)]">
                    {isArabic ? "الحالة الحالية" : "Current Status"}
                  </p>
                  <p className="font-medium text-[var(--foreground)]">
                    {localizedStatus}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--foreground-muted)]">
                    {isArabic ? "الشركة" : "Company"}
                  </p>
                  <p className="font-medium text-[var(--foreground)]">
                    {client.company}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={isArabic ? "text-right" : "text-left"}>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/clients`)}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-[var(--foreground-muted)] transition hover:bg-white/10 hover:text-[var(--foreground)]"
          >
            {isArabic ? "رجوع إلى العملاء" : "Back to Clients"}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}