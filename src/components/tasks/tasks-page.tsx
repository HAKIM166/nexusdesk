"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ListPlus, Save } from "lucide-react";

import { TaskStatus } from "@/types/task";
import TaskCard from "./task-card";
import { useTaskStore } from "@/store/task-store";
import { useProjectStore } from "@/store/project-store";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

type TasksPageProps = {
  status: TaskStatus;
};

export default function TasksPage({ status }: TasksPageProps) {
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const messages = getMessages(locale);
  const tasksMessages = messages.tasks;
  const content = tasksMessages.pages[status];

  const tasks = useTaskStore((state) => state.tasks);
  const initializeTasks = useTaskStore((state) => state.initializeTasks);

  const isLoading = useTaskStore((state) => state.isLoading);
  const addTask = useTaskStore((state) => state.addTask);
  const projects = useProjectStore((state) => state.projects);
  useEffect(() => {
    initializeTasks();
  }, [initializeTasks]);

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id || "general");

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  const selectedProject = projects.find((project) => project.id === projectId);

  const currentTasks = tasks.filter((task) => task.status === status);
  const highPriorityCount = currentTasks.filter(
    (task) => task.priority === "high",
  ).length;

  const canAddTask = status === "backlog";

  function handleAddTask() {
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim() || tasksMessages.form.noDescriptionAdded,
      priority: "medium",
      projectId,
      projectName: selectedProject?.title || tasksMessages.form.generalTasks,
      clientName: "NexusDesk",
      dueDate: "2026-05-10",
    });

    setTitle("");
    setDescription("");
    setProjectId(projects[0]?.id || "general");
    setIsAdding(false);
  }

  return (
    <section className="space-y-5 pb-8 md:pb-0">
      <div className="border-b border-[var(--border)] pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--primary)]">
              {tasksMessages.breadcrumb} / {content.label}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
              {content.title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
              {content.description}
            </p>
          </div>

          {canAddTask && (
            <button
              type="button"
              onClick={() => setIsAdding((value) => !value)}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--task-add-border)] bg-[var(--task-add-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--task-add-text)] transition hover:bg-[var(--task-add-hover-bg)]"
            >
              <ListPlus className="h-4 w-4 text-[var(--task-add-icon)]" />
              <span>
                {isAdding ? tasksMessages.form.close : content.actionText}
              </span>
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-6 text-sm">
          <span className="text-[var(--foreground-muted)]">
            {tasksMessages.stats.currentSection}:{" "}
            <strong className="text-[var(--foreground)]">
              {currentTasks.length}
            </strong>
          </span>

          <span className="text-[var(--foreground-muted)]">
            {tasksMessages.stats.totalTasks}:{" "}
            <strong className="text-[var(--foreground)]">{tasks.length}</strong>
          </span>

          <span className="text-[var(--foreground-muted)]">
            {tasksMessages.stats.highPriority}:{" "}
            <strong className="text-[var(--foreground)]">
              {highPriorityCount}
            </strong>
          </span>
        </div>
      </div>

      {canAddTask && isAdding && (
        <div className="rounded-2xl border border-[var(--task-card-border)] bg-[var(--task-card-bg)] p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr_1fr_auto] lg:items-end">
            <div>
              <label className="text-xs text-[var(--foreground-muted)]">
                {tasksMessages.form.taskTitle}
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                placeholder={tasksMessages.form.taskTitlePlaceholder}
              />
            </div>

            <div>
              <label className="text-xs text-[var(--foreground-muted)]">
                {tasksMessages.form.description}
              </label>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                placeholder={tasksMessages.form.descriptionPlaceholder}
              />
            </div>

            <div>
              <label className="text-xs text-[var(--foreground-muted)]">
                {tasksMessages.form.project}
              </label>
              <select
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
              >
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))
                ) : (
                  <option value="general">
                    {tasksMessages.form.generalTasks}
                  </option>
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={handleAddTask}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--task-start-border)] bg-[var(--task-start-bg)] px-4 text-sm font-semibold text-[var(--task-start-text)] transition hover:bg-[var(--task-start-hover-bg)]"
            >
              <Save className="h-4 w-4" />
              <span>{tasksMessages.form.saveTask}</span>
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            {content.label} {tasksMessages.list.tasks}
          </h2>

          <span className="text-sm text-[var(--foreground-muted)]">
            {currentTasks.length}{" "}
            {currentTasks.length === 1
              ? tasksMessages.list.task
              : tasksMessages.list.tasksPlural}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {currentTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </section>
  );
}
