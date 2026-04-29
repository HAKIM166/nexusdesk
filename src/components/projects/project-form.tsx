"use client";

import { useRef, useState } from "react";
import { useProjectStore } from "@/store/project-store";
import { useClientStore } from "@/store/client-store";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

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
    (state) => state.setSelectedProject
  );

  const clients = useClientStore((state) => state.clients);

  const [title, setTitle] = useState(selectedProject?.title ?? "");
  const [description, setDescription] = useState(
    selectedProject?.description ?? ""
  );
  const [clientId, setClientId] = useState(selectedProject?.clientId ?? "");
  const [deadline, setDeadline] = useState(selectedProject?.deadline ?? "");
  const [budget, setBudget] = useState(
    selectedProject?.budget?.toString() ?? ""
  );
  const [paidAmount, setPaidAmount] = useState(
    selectedProject?.paidAmount?.toString() ?? ""
  );
  const [toast, setToast] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messages = getMessages(locale);
  const isArabic = locale === "ar";

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
    <div className="space-y-4">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in rounded-lg bg-black/80 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className={isArabic ? "text-right" : "text-left"}>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          {selectedProject
            ? isArabic
              ? "تعديل المشروع"
              : "Edit Project"
            : messages.projects.form.title}
        </h2>

        <p className="text-sm text-[var(--foreground-muted)]">
          {selectedProject
            ? isArabic
              ? "قم بتحديث بيانات المشروع المحدد"
              : "Update the selected project details"
            : messages.projects.form.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder={messages.projects.form.name}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`input-base flex-1 ${
              isArabic ? "text-right" : "text-left"
            }`}
          />

          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className={`input-base flex-1 ${
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
            className={`input-base flex-1 ${
              isArabic ? "text-right" : "text-left"
            }`}
            aria-label={messages.projects.form.deadline}
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="number"
            min="0"
            placeholder={isArabic ? "ميزانية المشروع ($)" : "Budget ($)"}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={`input-base flex-1 ${
              isArabic ? "text-right" : "text-left"
            }`}
          />

          <input
            type="number"
            min="0"
            placeholder={isArabic ? "المبلغ المدفوع ($)" : "Paid Amount ($)"}
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className={`input-base flex-1 ${
              isArabic ? "text-right" : "text-left"
            }`}
          />
        </div>

        <textarea
          placeholder={messages.projects.form.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`input-base min-h-[96px] w-full resize-none ${
            isArabic ? "text-right" : "text-left"
          }`}
        />

        <div
          className={`flex flex-wrap gap-3 ${
            isArabic ? "justify-end" : "justify-start"
          }`}
        >
          <button type="submit" className="btn-primary px-6 py-2 text-sm">
            {selectedProject
              ? isArabic
                ? "تحديث المشروع"
                : "Update Project"
              : messages.projects.form.button}
          </button>

          {selectedProject && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-lg border border-white/10 px-6 py-2 text-sm transition hover:bg-white/10"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}