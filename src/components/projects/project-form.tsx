"use client";

import { useEffect, useRef, useState } from "react";
import { useProjectStore } from "@/store/project-store";
import { useClientStore } from "@/store/client-store";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

import { Plus } from "lucide-react";

type ProjectFormProps = {
  locale: Locale;
};

type ProjectFormInnerProps = {
  locale: Locale;
};

export default function ProjectForm({ locale }: ProjectFormProps) {
  const selectedProject = useProjectStore((state) => state.selectedProject);

  return (
    <ProjectFormInner
      key={selectedProject?.id ?? "new-project"}
      locale={locale}
    />
  );
}

function ProjectFormInner({ locale }: ProjectFormInnerProps) {
  const addProject = useProjectStore((state) => state.addProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const setSelectedProject = useProjectStore(
    (state) => state.setSelectedProject,
  );

  const clients = useClientStore((state) => state.clients);

  const initializeClients = useClientStore(
    (state) => state.initializeClients,
  );

  const [title, setTitle] = useState(selectedProject?.title ?? "");
  const [description, setDescription] = useState(
    selectedProject?.description ?? "",
  );
  const [clientId, setClientId] = useState(selectedProject?.clientId ?? "");
  const [deadline, setDeadline] = useState(selectedProject?.deadline ?? "");
  const [budget, setBudget] = useState(
    selectedProject?.budget?.toString() ?? "",
  );
  const [paidAmount, setPaidAmount] = useState(
    selectedProject?.paidAmount?.toString() ?? "",
  );
  const [toast, setToast] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  useEffect(() => {
    initializeClients();
  }, [initializeClients]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setClientId("");
    setDeadline("");
    setBudget("");
    setPaidAmount("");
  };

  const showToast = (message: string) => {
    setToast(message);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !clientId) return;

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      clientId,
      deadline,
      budget: Number(budget) || 0,
      paidAmount: Number(paidAmount) || 0,
    };

    if (selectedProject) {
      updateProject(selectedProject.id, {
        ...projectData,
        status: selectedProject.status,
      });

      setSelectedProject(null);
      showToast(isArabic ? "تم تحديث المشروع" : "Project updated");
      return;
    }

    addProject({
      ...projectData,
      status: "Planned",
    });

    resetForm();
    showToast(isArabic ? "تمت إضافة المشروع" : "Project added");
  };

  const handleCancelEdit = () => {
    setSelectedProject(null);
    resetForm();
  };

  return (
    <div className="space-y-3 md:space-y-5">
      {toast && (
        <div
          className={`fixed inset-x-4 bottom-4 z-50 animate-fade-in rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-3.5 py-2 text-[13px] text-[var(--foreground)] shadow-sm sm:inset-x-auto sm:bottom-5 ${
            isArabic ? "sm:left-5" : "sm:right-5"
          }`}
        >
          {toast}
        </div>
      )}

      <div className={`space-y-1 ${isArabic ? "text-right" : "text-left"}`}>
        <h2 className="text-[15px] font-semibold text-[var(--foreground)] md:text-lg">
          {selectedProject
            ? isArabic
              ? "تعديل المشروع"
              : "Edit Project"
            : messages.projects.form.title}
        </h2>

        <p className="text-[12px] leading-5 text-[var(--foreground-muted)] md:text-sm">
          {selectedProject
            ? isArabic
              ? "قم بتحديث بيانات المشروع المحدد"
              : "Update the selected project details"
            : messages.projects.form.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5 pt-1 md:space-y-4">
        <div className="flex flex-col gap-2.5 md:flex-row md:gap-3">
          <input
            type="text"
            placeholder={messages.projects.form.name}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`input-base min-h-10 flex-1 text-[13px] md:min-h-12 md:text-sm ${
              isArabic ? "text-right" : "text-left"
            }`}
          />

          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className={`input-base min-h-10 flex-1 text-[13px] md:min-h-12 md:text-sm ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <option value="">{messages.projects.form.client}</option>

            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={`input-base min-h-10 flex-1 text-[13px] md:min-h-12 md:text-sm ${
              isArabic ? "text-right" : "text-left"
            }`}
            aria-label={messages.projects.form.deadline}
          />
        </div>

        <div className="flex flex-col gap-2.5 md:flex-row md:gap-3">
          <input
            type="number"
            min="0"
            placeholder={isArabic ? "ميزانية المشروع ($)" : "Budget ($)"}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={`input-base min-h-10 flex-1 text-[13px] md:min-h-12 md:text-sm ${
              isArabic ? "text-right" : "text-left"
            }`}
          />

          <input
            type="number"
            min="0"
            placeholder={isArabic ? "المبلغ المدفوع ($)" : "Paid Amount ($)"}
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className={`input-base min-h-10 flex-1 text-[13px] md:min-h-12 md:text-sm ${
              isArabic ? "text-right" : "text-left"
            }`}
          />
        </div>

        <textarea
          placeholder={messages.projects.form.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`input-base min-h-[74px] w-full resize-none text-[13px] md:min-h-[96px] md:text-sm ${
            isArabic ? "text-right" : "text-left"
          }`}
        />

        <div
          className={`flex flex-col-reverse gap-2.5 pt-1 sm:flex-row md:gap-3 ${
            isArabic ? "sm:justify-end" : "sm:justify-start"
          }`}
        >
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--export-border)] bg-[var(--export-bg)] px-4 py-2.5 text-[13px] font-semibold text-[var(--export-text)] transition-colors hover:bg-[var(--export-hover-bg)] sm:w-auto sm:px-5 md:rounded-xl md:text-sm"
          >
            <Plus className="h-4 w-4" />

            <span>
              {selectedProject
                ? isArabic
                  ? "تحديث المشروع"
                  : "Update Project"
                : messages.projects.form.button}
            </span>
          </button>

          {selectedProject && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-[13px] font-medium text-[var(--foreground)] transition hover:bg-[var(--accent)] sm:w-auto sm:px-5 md:rounded-xl md:text-sm"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}