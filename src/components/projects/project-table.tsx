"use client";

import { useEffect, useRef, useState } from "react";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import { useProjectStore } from "@/store/project-store";
import { useClientStore } from "@/store/client-store";
import Link from "next/link";

type ProjectTableProps = {
  locale: Locale;
};

export default function ProjectTable({ locale }: ProjectTableProps) {
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  const projects = useProjectStore((state) => state.projects);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const setSelectedProject = useProjectStore(
    (state) => state.setSelectedProject
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
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleDelete = (projectId: string) => {
    deleteProject(projectId);
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

  if (projects.length === 0) {
    return (
      <div
        className={`text-sm text-[var(--foreground-muted)] ${
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
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in rounded-lg bg-black/80 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="space-y-4">
        <div className={isArabic ? "text-right" : "text-left"}>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {messages.projects.listTitle}
          </h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            {messages.projects.listSubtitle}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table
            dir={isArabic ? "rtl" : "ltr"}
            className={`w-full table-fixed text-sm ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <thead>
              <tr className="border-b border-white/10 text-[var(--foreground-muted)]">
                <th className="w-[36%] py-3">
                  {messages.projectsTable.project}
                </th>
                <th className="w-[18%] py-3">
                  {messages.projectsTable.client}
                </th>
                <th className="w-[14%] py-3">
                  {messages.projectsTable.status}
                </th>
                <th className="w-[16%] py-3">
                  {messages.projects.form.deadline}
                </th>
                <th className="w-[16%] py-3">
                  {messages.projects.actions}
                </th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-white/5 transition hover:bg-white/5"
                >
                  <td className="py-3 font-medium text-[var(--foreground)]">
                    <div className="space-y-1">
                      <div>
                        <Link
                          href={`/${locale}/projects/${project.id}`}
                          className="transition hover:underline"
                        >
                          {project.title}
                        </Link>
                      </div>

                      {project.description && (
                        <div className="text-xs text-[var(--foreground-muted)]">
                          {project.description}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-3 text-[var(--foreground-muted)]">
                    {getClientName(project.clientId)}
                  </td>

                  <td className="py-3">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-emerald-300">
                      {getStatusLabel(project.status)}
                    </span>
                  </td>

                  <td className="py-3 text-[var(--foreground-muted)]">
                    {project.deadline || messages.projects.notSet}
                  </td>

                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="rounded-lg border border-white/10 px-3 py-1 text-xs transition hover:bg-white/10"
                      >
                        {messages.projects.edit}
                      </button>

                      <button
                        onClick={() => handleDelete(project.id)}
                        className="rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
                      >
                        {messages.projects.delete}
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