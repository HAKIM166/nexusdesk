"use client";

import { getMessages } from "@/lib/helpers";

type ClientItem = {
  id?: string;
  name?: string;
  email?: string;
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

export default function RecentListsSection({
  messages,
  recentClients,
  recentProjects,
}: RecentListsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* =========================
     RECENT CLIENTS CARD
     ========================= */}

      <div className="glass-card overflow-hidden">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h3 className="text-lg font-semibold">
            {messages.dashboard.clientsTitle}
          </h3>

          <p className="mt-1 text-sm text-muted">
            {messages.dashboard.clientsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-[1.2fr_1.5fr] border-b border-[var(--border)] px-5 py-3 text-xs text-soft">
          <span>Name</span>
          <span>Email</span>
        </div>

        <div>
          {recentClients.length > 0 ? (
            recentClients.map((client, index) => (
              <div
                key={client.id || index}
                className="grid grid-cols-[1.2fr_1.5fr] items-center border-b border-[var(--border)] px-5 py-4 text-sm last:border-b-0 hover:bg-[var(--surface-muted)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-semibold text-primary">
                    {(client.name || "-").slice(0, 1).toUpperCase()}
                  </div>

                  <p className="font-medium">{client.name || "-"}</p>
                </div>

                <p className="truncate text-muted">{client.email || "-"}</p>
              </div>
            ))
          ) : (
            <p className="px-5 py-5 text-sm text-muted">
              {messages.dashboard.noClients}
            </p>
          )}
        </div>
      </div>

      {/* =========================
     RECENT PROJECTS CARD
     ========================= */}

      <div className="glass-card overflow-hidden ">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h3 className="text-lg font-semibold">
            {messages.dashboard.projectsTableTitle}
          </h3>

          <p className="mt-1 text-sm text-muted">
            {messages.dashboard.projectsTableSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-[1.4fr_0.8fr] border-b border-[var(--border)] px-5 py-3 text-xs text-soft">
          <span>Project</span>
          <span>Status</span>
        </div>

        <div>
          {recentProjects.length > 0 ? (
            recentProjects.map((project, index) => (
              <div
                key={project.id || index}
                className="grid grid-cols-[1.4fr_0.8fr] items-center border-b border-[var(--border)] px-5 py-4 text-sm last:border-b-0 hover:bg-[var(--surface-muted)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-semibold text-primary">
                    {(project.name || project.title || "-")
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>

                  <p className="font-medium">
                    {project.name || project.title || "-"}
                  </p>
                </div>

                <span className="w-fit rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs text-primary">
                  {translateStatus(project.status, messages)}
                </span>
              </div>
            ))
          ) : (
            <p className="px-5 py-5 text-sm text-muted">
              {messages.dashboard.noProjects}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}