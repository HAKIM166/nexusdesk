"use client";

import { getMessages } from "@/lib/helpers";

type ClientItem = {
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  image?: string;
  imageUrl?: string;
};

type ProjectItem = {
  id?: string;
  name?: string;
  title?: string;
  status?: string;
};

type RecentListsSectionProps = {
  messages: ReturnType<typeof getMessages>;
  recentClients: ClientItem[];
  recentProjects: ProjectItem[];
};

function isArabicText(value: string) {
  return /[\u0600-\u06FF]/.test(value);
}

function translateStatus(
  status: string | undefined,
  messages: ReturnType<typeof getMessages>,
) {
  const value = String(status || "").toLowerCase();

  const statusMap: Record<string, string> = {
    active: messages.common.status.Active,
    pending: messages.common.status.Pending,
    inactive: messages.common.status.Inactive,
    completed: messages.common.status.Completed,
    planned: messages.common.status.Planned,
    "in progress": messages.common.status["In Progress"],
    inprogress: messages.common.status["In Progress"],
    "in-progress": messages.common.status["In Progress"],
    onhold: messages.common.status["On Hold"],
    "on hold": messages.common.status["On Hold"],
    "on-hold": messages.common.status["On Hold"],
  };

  return statusMap[value] || status || "-";
}

function getStatusStyles(status?: string) {
  const value = String(status || "").toLowerCase();

  if (value.includes("completed") || value.includes("complete")) {
    return "border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]";
  }

  if (value.includes("progress") || value.includes("active")) {
    return "border-[var(--info)] bg-[var(--info-soft)] text-[var(--info)]";
  }

  if (value.includes("planned") || value.includes("pending")) {
    return "border-[var(--primary)] bg-[var(--primary-soft)] text-primary";
  }

  if (value.includes("hold") || value.includes("warning")) {
    return "border-[var(--warning)] bg-[var(--warning-soft)] text-[var(--warning)]";
  }

  return "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground-soft)]";
}

function getProjectIndicatorStyles(status?: string) {
  const value = String(status || "").toLowerCase();

  if (value.includes("completed") || value.includes("complete")) {
    return "bg-[var(--success)]";
  }

  if (value.includes("progress") || value.includes("active")) {
    return "bg-[var(--info)]";
  }

  if (value.includes("planned") || value.includes("pending")) {
    return "bg-[var(--primary)]";
  }

  if (value.includes("hold") || value.includes("warning")) {
    return "bg-[var(--warning)]";
  }

  return "bg-[var(--foreground-soft)]";
}

function getClientAvatar(client: ClientItem) {
  return client.avatarUrl || client.imageUrl || client.image;
}

export default function RecentListsSection({
  messages,
  recentClients,
  recentProjects,
}: RecentListsSectionProps) {
  const isArabic = isArabicText(messages.dashboard.clientsTitle);

  const labels = {
    name: isArabic ? "الاسم" : "Name",
    email: isArabic ? "البريد الإلكتروني" : "Email",
    project: isArabic ? "المشروع" : "Project",
    status: isArabic ? "الحالة" : "Status",
  };

  return (
    <div className="grid grid-cols-1 gap-7 xl:grid-cols-2 xl:gap-8">
      <section className="min-w-0 border-t border-[var(--border)] pt-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-[20px] font-semibold leading-6 text-[var(--foreground)]">
              {messages.dashboard.clientsTitle}
            </h3>
            <p className="mt-1 text-sm leading-5 text-muted">
              {messages.dashboard.clientsSubtitle}
            </p>
          </div>

          <span className="shrink-0 text-xs text-soft">
            {recentClients.length}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_1.35fr] border-y border-[var(--border)] bg-[var(--surface-muted)]/35 px-3 py-2.5 text-xs text-soft">
          <span>{labels.name}</span>
          <span>{labels.email}</span>
        </div>

        <div className="max-h-[300px] overflow-y-auto pe-1 md:max-h-[320px]">
          <div className="divide-y divide-[var(--border)]">
            {recentClients.length > 0 ? (
              recentClients.map((client, index) => {
                const avatar = getClientAvatar(client);

                return (
                  <div
                    key={client.id || index}
                    className="grid grid-cols-[1fr_1.35fr] items-center gap-3 px-3 py-4 transition hover:bg-[var(--surface-muted)]/30"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--surface-muted)] text-xs font-semibold text-primary">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={client.name || "Client"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          (client.name || "-").slice(0, 1).toUpperCase()
                        )}
                      </div>

                      <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                        {client.name || "-"}
                      </p>
                    </div>

                    <p className="truncate text-sm text-muted">
                      {client.email || "-"}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="px-3 py-4 text-sm text-muted">
                {messages.dashboard.noClients}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="min-w-0 border-t border-[var(--border)] pt-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-[20px] font-semibold leading-6 text-[var(--foreground)]">
              {messages.dashboard.projectsTableTitle}
            </h3>
            <p className="mt-1 text-sm leading-5 text-muted">
              {messages.dashboard.projectsTableSubtitle}
            </p>
          </div>

          <span className="shrink-0 text-xs text-soft">
            {recentProjects.length}
          </span>
        </div>

        <div className="grid grid-cols-[1.35fr_0.75fr] border-y border-[var(--border)] bg-[var(--surface-muted)]/35 px-3 py-2.5 text-xs text-soft">
          <span>{labels.project}</span>
          <span>{labels.status}</span>
        </div>

        <div className="max-h-[360px] overflow-y-auto pe-1 md:max-h-[390px]">
          <div className="divide-y divide-[var(--border)]">
            {recentProjects.length > 0 ? (
              recentProjects.map((project, index) => (
                <div
                  key={project.id || index}
                  className="grid grid-cols-[1.35fr_0.75fr] items-center gap-3 px-3 py-4 transition hover:bg-[var(--surface-muted)]/30"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${getProjectIndicatorStyles(
                        project.status,
                      )}`}
                    />

                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                      {project.name || project.title || "-"}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-md border px-2.5 py-1 text-xs leading-4 ${getStatusStyles(
                      project.status,
                    )}`}
                  >
                    {translateStatus(project.status, messages)}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-3 py-4 text-sm text-muted">
                {messages.dashboard.noProjects}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}