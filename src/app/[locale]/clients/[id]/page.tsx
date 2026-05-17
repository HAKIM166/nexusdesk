"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";

import { ArrowLeft } from "lucide-react";

function getStatusClasses(status: string) {
  switch (status) {
    case "Active":
      return "border-[var(--client-status-active-bg)] bg-[var(--client-status-active-bg)] text-[var(--client-status-active-text)]";
    case "Pending":
      return "border-[var(--client-status-pending-bg)] bg-[var(--client-status-pending-bg)] text-[var(--client-status-pending-text)]";
    case "Inactive":
    default:
      return "border-[var(--client-status-inactive-bg)] bg-[var(--client-status-inactive-bg)] text-[var(--client-status-inactive-text)]";
  }
}

function getLocalizedClientStatus(
  status: string,
  locale: Locale,
  messages: ReturnType<typeof getMessages>,
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

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const locale = (params?.locale as Locale) || "en";
  const id = String(params?.id || "");

  const messages = getMessages(locale);
  const isArabic = locale === "ar";
  const clientDetailsText = messages.clients.details;

  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingClient, setIsLoadingClient] = useState(true);

  const clients = useClientStore((state) => state.clients);
  const deleteClient = useClientStore((state) => state.deleteClient);
  const setSelectedClient = useClientStore((state) => state.setSelectedClient);
  const initializeClients = useClientStore((state) => state.initializeClients);
  const allProjects = useProjectStore((state) => state.projects);

  const client = useMemo(
    () => clients.find((item) => item.id === id),
    [clients, id],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadClient() {
      if (!id) {
        if (isMounted) setIsLoadingClient(false);
        return;
      }

      if (client) {
        if (isMounted) setIsLoadingClient(false);
        return;
      }

      await initializeClients();

      if (isMounted) {
        setIsLoadingClient(false);
      }
    }

    loadClient();

    return () => {
      isMounted = false;
    };
  }, [client, id, initializeClients]);

  const projects = useMemo(
    () => allProjects.filter((project) => project.clientId === id),
    [allProjects, id],
  );

  if (!client && isLoadingClient) {
    return null;
  }

  if (!client && !isDeleting) {
    notFound();
  }
  if (!client) {
    return null;
  }

  const localizedStatus = getLocalizedClientStatus(
    client.status,
    locale,
    messages,
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
      <div className="space-y-5 pb-8 md:space-y-8 md:pb-0">
        {/* Header */}
        <div className={isArabic ? "text-right" : "text-left"}>
          <p className="text-[12px] text-[var(--foreground-muted)] md:text-sm">
            {clientDetailsText.label}
          </p>

          <div
            className={`mt-3 flex items-start gap-4 md:mt-2 md:items-center ${
              isArabic ? "flex-row-reverse md:flex-row" : ""
            } md:flex-wrap`}
          >
            {client.avatarUrl ? (
              <img
                src={client.avatarUrl}
                alt={client.name}
                className="h-16 w-16 shrink-0 rounded-2xl border-2 border-[var(--client-card-border)] bg-[var(--client-avatar-bg)] object-cover p-0.5 md:rounded-full"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--client-card-border)] bg-[var(--client-avatar-bg)] text-xl font-semibold text-[var(--client-avatar-text)] md:rounded-full">
                {client.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1 space-y-2 md:space-y-1">
              <div
                className={`flex min-w-0 flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-3 ${
                  isArabic ? "items-end md:justify-end" : "items-start"
                }`}
              >
                <h1 className="max-w-full truncate text-[28px] font-bold leading-tight text-[var(--foreground)] md:text-3xl">
                  {client.name}
                </h1>

                <span
                  className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                    client.status,
                  )}`}
                >
                  {localizedStatus}
                </span>
              </div>

              <div
                className={`flex min-w-0 flex-col gap-1 text-[13px] text-[var(--foreground-muted)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 md:text-sm ${
                  isArabic ? "sm:justify-end" : ""
                }`}
              >
                <span className="truncate">{client.company}</span>
                <span className="hidden h-1 w-1 rounded-full bg-[var(--foreground-soft)] sm:block" />
                <span className="truncate">{client.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
          <div
            className={`card space-y-1.5 p-4 md:space-y-2 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <p className="text-[11px] leading-4 text-[var(--foreground-muted)] md:text-xs">
              {clientDetailsText.totalProjects}
            </p>
            <p className="text-[22px] font-bold leading-tight text-[var(--foreground)] md:text-2xl">
              {formatNumber(projects.length)}
            </p>
          </div>

          <div
            className={`card space-y-1.5 p-4 md:space-y-2 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <p className="text-[11px] leading-4 text-[var(--foreground-muted)] md:text-xs">
              {clientDetailsText.totalBudget}
            </p>
            <p className="truncate text-[20px] font-bold leading-tight text-[var(--foreground)] md:text-2xl">
              {formatCurrency(totalBudget)}
            </p>
          </div>

          <div
            className={`card space-y-1.5 p-4 md:space-y-2 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <p className="text-[11px] leading-4 text-[var(--foreground-muted)] md:text-xs">
              {clientDetailsText.paidAmount}
            </p>
            <p className="truncate text-[20px] font-bold leading-tight text-[var(--client-stat-paid)] md:text-2xl">
              {formatCurrency(totalPaid)}
            </p>
          </div>

          <div
            className={`card space-y-1.5 p-4 md:space-y-2 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <p className="text-[11px] leading-4 text-[var(--foreground-muted)] md:text-xs">
              {clientDetailsText.remaining}
            </p>
            <p className="truncate text-[20px] font-bold leading-tight text-[var(--client-stat-remaining)] md:text-2xl">
              {formatCurrency(remainingAmount)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:gap-6 xl:grid-cols-3">
          <div className="card space-y-5 p-4 md:space-y-6 md:p-6 xl:col-span-2">
            {/* Information */}
            <div>
              <h2 className="text-[18px] font-semibold leading-6 text-[var(--foreground)] md:text-lg">
                {clientDetailsText.informationTitle}
              </h2>
              <p className="mt-1 text-[13px] leading-5 text-[var(--foreground-muted)] md:text-sm">
                {clientDetailsText.informationSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              <div className="rounded-xl border border-[var(--client-card-border)] bg-[var(--client-card-bg)] p-3 md:p-4">
                <p className="text-[11px] text-[var(--foreground-muted)] md:text-xs">
                  {clientDetailsText.clientName}
                </p>
                <p className="mt-1.5 truncate text-sm font-medium text-[var(--foreground)] md:mt-2 md:text-base">
                  {client.name}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--client-card-border)] bg-[var(--client-card-bg)] p-3 md:p-4">
                <p className="text-[11px] text-[var(--foreground-muted)] md:text-xs">
                  {messages.clientsTable.status}
                </p>
                <p className="mt-1.5 text-sm font-medium text-[var(--foreground)] md:mt-2 md:text-base">
                  {localizedStatus}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--client-card-border)] bg-[var(--client-card-bg)] p-3 md:p-4">
                <p className="text-[11px] text-[var(--foreground-muted)] md:text-xs">
                  {messages.clientsTable.company}
                </p>
                <p className="mt-1.5 truncate text-sm font-medium text-[var(--foreground)] md:mt-2 md:text-base">
                  {client.company}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--client-card-border)] bg-[var(--client-card-bg)] p-3 md:p-4">
                <p className="text-[11px] text-[var(--foreground-muted)] md:text-xs">
                  {messages.clientsTable.email}
                </p>
                <p className="mt-1.5 truncate text-sm font-medium text-[var(--foreground)] md:mt-2 md:text-base">
                  {client.email}
                </p>
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-4">
              <div>
                <h2 className="text-[18px] font-semibold leading-6 text-[var(--foreground)] md:text-lg">
                  {clientDetailsText.projectsTitle}
                </h2>
                <p className="mt-1 text-[13px] leading-5 text-[var(--foreground-muted)] md:text-sm">
                  {clientDetailsText.projectsSubtitle}
                </p>
              </div>

              {projects.length > 0 ? (
                <>
                  {/* Mobile Projects Cards */}
                  <div className="sidebar-scroll max-h-[420px] space-y-3 overflow-y-auto pr-1 md:hidden">
                    {projects.map((project) => {
                      const projectBudget = Number(project.budget) || 0;
                      const projectPaid = Number(project.paidAmount) || 0;
                      const projectRemaining = Math.max(
                        projectBudget - projectPaid,
                        0,
                      );

                      return (
                        <div
                          key={project.id}
                          className="rounded-xl border border-[var(--client-card-border)] bg-[var(--client-card-bg)] p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                                {project.title}
                              </p>

                              {project.description && (
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--foreground-muted)]">
                                  {project.description}
                                </p>
                              )}
                            </div>

                            <span className="shrink-0 rounded-lg border border-[var(--client-action-border)] bg-[var(--client-action-bg)] px-2 py-1 text-[11px] text-[var(--foreground-muted)]">
                              {getLocalizedProjectStatus(
                                project.status,
                                locale,
                                messages,
                              )}
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-lg bg-[var(--surface-muted)] px-2 py-2">
                              <p className="text-[var(--foreground-soft)]">
                                {messages.projects.form.deadline}
                              </p>
                              <p className="mt-1 truncate text-[var(--foreground-muted)]">
                                {project.deadline || messages.projects.notSet}
                              </p>
                            </div>

                            <div className="rounded-lg bg-[var(--surface-muted)] px-2 py-2">
                              <p className="text-[var(--foreground-soft)]">
                                {clientDetailsText.paid}
                              </p>
                              <p className="mt-1 truncate font-semibold text-[var(--client-stat-paid)]">
                                {formatCurrency(projectPaid)}
                              </p>
                            </div>

                            <div className="rounded-lg bg-[var(--surface-muted)] px-2 py-2">
                              <p className="text-[var(--foreground-soft)]">
                                {clientDetailsText.remaining}
                              </p>
                              <p className="mt-1 truncate font-semibold text-[var(--client-stat-remaining)]">
                                {formatCurrency(projectRemaining)}
                              </p>
                            </div>

                            <Link
                              href={`/${locale}/projects/${project.id}`}
                              className="inline-flex items-center justify-center rounded-lg border border-[var(--client-action-border)] bg-[var(--client-action-bg)] px-2 py-2 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--client-action-hover)]"
                            >
                              {clientDetailsText.openAction}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop / Tablet Table */}
                  <div className="hidden overflow-x-auto md:block">
                    <table
                      className={`w-full text-sm ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                    >
                      <thead>
                        <tr className="border-b border-[var(--client-card-border)] text-[var(--foreground-muted)]">
                          <th className="py-3">
                            {messages.projectsTable.project}
                          </th>
                          <th className="py-3">
                            {messages.projectsTable.status}
                          </th>
                          <th className="py-3">
                            {messages.projects.form.deadline}
                          </th>
                          <th className="py-3">{clientDetailsText.paid}</th>
                          <th className="py-3">
                            {clientDetailsText.remaining}
                          </th>
                          <th className="py-3">
                            {clientDetailsText.openColumn}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {projects.map((project) => {
                          const projectBudget = Number(project.budget) || 0;
                          const projectPaid = Number(project.paidAmount) || 0;
                          const projectRemaining = Math.max(
                            projectBudget - projectPaid,
                            0,
                          );

                          return (
                            <tr
                              key={project.id}
                              className="border-b border-[var(--client-card-border)] transition hover:bg-[var(--client-action-hover)]"
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
                                  messages,
                                )}
                              </td>

                              <td className="py-3 text-[var(--foreground-muted)]">
                                {project.deadline || messages.projects.notSet}
                              </td>

                              <td className="py-3 text-[var(--client-stat-paid)]">
                                {formatCurrency(projectPaid)}
                              </td>

                              <td className="py-3 text-[var(--client-stat-remaining)]">
                                {formatCurrency(projectRemaining)}
                              </td>

                              <td className="py-3">
                                <Link
                                  href={`/${locale}/projects/${project.id}`}
                                  className="rounded-lg border border-[var(--client-action-border)] bg-[var(--client-action-bg)] px-3 py-1 text-xs transition hover:bg-[var(--client-action-hover)]"
                                >
                                  {clientDetailsText.openAction}
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-[var(--client-card-border)] bg-[var(--client-card-bg)] p-4 text-sm text-[var(--foreground-muted)]">
                  {clientDetailsText.noProjects}
                </div>
              )}
            </div>
          </div>

          {/* Side Column */}
          <div className="space-y-5 md:space-y-6">
            <div className="card space-y-4 p-4 md:p-6">
              <div>
                <h2 className="text-[18px] font-semibold leading-6 text-[var(--foreground)] md:text-lg">
                  {clientDetailsText.quickActions}
                </h2>
                <p className="mt-1 text-[13px] leading-5 text-[var(--foreground-muted)] md:text-sm">
                  {clientDetailsText.quickActionsSubtitle}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
                <button
                  type="button"
                  onClick={handleEditClient}
                  className="w-full rounded-lg border border-[var(--client-action-border)] bg-[var(--client-action-bg)] px-4 py-2.5 text-sm transition hover:bg-[var(--client-action-hover)]"
                >
                  {clientDetailsText.editClient}
                </button>

                <button
                  type="button"
                  onClick={handleDeleteClient}
                  className="w-full rounded-lg border border-[var(--client-status-inactive-bg)] bg-[var(--client-status-inactive-bg)] px-4 py-2.5 text-sm text-[var(--client-status-inactive-text)] transition hover:bg-[var(--client-status-inactive-bg)]"
                >
                  {clientDetailsText.deleteClient}
                </button>

                <button
                  type="button"
                  onClick={handleAskAIAboutClient}
                  className="w-full rounded-lg border border-emerald-400/30 px-4 py-2.5 text-sm text-[var(--client-stat-paid)] transition hover:bg-emerald-500/10"
                >
                  {clientDetailsText.askAi}
                </button>
              </div>
            </div>

            <div className="card space-y-4 p-4 md:p-6">
              <div>
                <h2 className="text-[18px] font-semibold leading-6 text-[var(--foreground)] md:text-lg">
                  {clientDetailsText.summaryTitle}
                </h2>
                <p className="mt-1 text-[13px] leading-5 text-[var(--foreground-muted)] md:text-sm">
                  {clientDetailsText.summarySubtitle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm xl:grid-cols-1">
                <div>
                  <p className="text-[12px] text-[var(--foreground-muted)]">
                    {clientDetailsText.totalProjects}
                  </p>
                  <p className="mt-1 font-medium text-[var(--foreground)]">
                    {formatNumber(projects.length)}
                  </p>
                </div>

                <div>
                  <p className="text-[12px] text-[var(--foreground-muted)]">
                    {clientDetailsText.totalBudget}
                  </p>
                  <p className="mt-1 truncate font-medium text-[var(--foreground)]">
                    {formatCurrency(totalBudget)}
                  </p>
                </div>

                <div>
                  <p className="text-[12px] text-[var(--foreground-muted)]">
                    {clientDetailsText.paidAmount}
                  </p>
                  <p className="mt-1 truncate font-medium text-[var(--client-stat-paid)]">
                    {formatCurrency(totalPaid)}
                  </p>
                </div>

                <div>
                  <p className="text-[12px] text-[var(--foreground-muted)]">
                    {clientDetailsText.remaining}
                  </p>
                  <p className="mt-1 truncate font-medium text-[var(--client-stat-remaining)]">
                    {formatCurrency(remainingAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-[12px] text-[var(--foreground-muted)]">
                    {clientDetailsText.currentStatus}
                  </p>
                  <p className="mt-1 font-medium text-[var(--foreground)]">
                    {localizedStatus}
                  </p>
                </div>

                <div>
                  <p className="text-[12px] text-[var(--foreground-muted)]">
                    {messages.clientsTable.company}
                  </p>
                  <p className="mt-1 truncate font-medium text-[var(--foreground)]">
                    {client.company}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`pb-2 md:pb-6 ${isArabic ? "text-right" : "text-left"}`}
        >
          <button
            type="button"
            onClick={() => router.push(`/${locale}/clients`)}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--client-action-border)] bg-[var(--client-action-bg)] px-4 py-2 text-sm text-[var(--foreground-muted)] transition hover:bg-[var(--client-action-hover)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft size={16} className={isArabic ? "rotate-180" : ""} />
            {clientDetailsText.back}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
