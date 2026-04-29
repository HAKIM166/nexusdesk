"use client";

import { useState } from "react";
import { TaskStatus } from "@/types/task";
import TaskCard from "./task-card";
import { useTaskStore } from "@/store/task-store";
import { useProjectStore } from "@/store/project-store";

type TasksPageProps = {
  status: TaskStatus;
};

const pageContent = {
  backlog: {
    label: "Backlog",
    title: "Plan the next work",
    description: "Collect ideas, requests, and tasks before starting execution.",
    actionText: "Add Task",
  },
  "in-progress": {
    label: "In Progress",
    title: "Work in motion",
    description: "Track active tasks currently being handled by the team.",
    actionText: "",
  },
  done: {
    label: "Done",
    title: "Completed work",
    description: "Review finished tasks and keep a record of delivered work.",
    actionText: "",
  },
};

export default function TasksPage({ status }: TasksPageProps) {
  const content = pageContent[status];

  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const projects = useProjectStore((state) => state.projects);

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id || "general");

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
      description: description.trim() || "No description added yet.",
      priority: "medium",
      projectId,
      projectName: selectedProject?.title || "General Tasks",
      clientName: "NexusDesk",
      dueDate: "2026-05-10",
    });

    setTitle("");
    setDescription("");
    setProjectId(projects[0]?.id || "general");
    setIsAdding(false);
  }

  return (
    <section className="space-y-5">
      <div className="border-b border-[var(--border)] pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--primary)]">
              Tasks / {content.label}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[var(--text)]">
              {content.title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              {content.description}
            </p>
          </div>

          {canAddTask && (
            <button
              type="button"
              onClick={() => setIsAdding((value) => !value)}
              className="w-fit rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
            >
              {content.actionText}
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-6 text-sm">
          <span className="text-[var(--muted)]">
            Current section:{" "}
            <strong className="text-[var(--text)]">
              {currentTasks.length}
            </strong>
          </span>

          <span className="text-[var(--muted)]">
            Total tasks:{" "}
            <strong className="text-[var(--text)]">{tasks.length}</strong>
          </span>

          <span className="text-[var(--muted)]">
            High priority:{" "}
            <strong className="text-[var(--text)]">{highPriorityCount}</strong>
          </span>
        </div>
      </div>

      {canAddTask && isAdding && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr_1fr_auto] lg:items-end">
            <div>
              <label className="text-xs text-[var(--muted)]">Task title</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
                placeholder="Write task title"
              />
            </div>

            <div>
              <label className="text-xs text-[var(--muted)]">Description</label>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
                placeholder="Small task description"
              />
            </div>

            <div>
              <label className="text-xs text-[var(--muted)]">Project</label>
              <select
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
              >
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))
                ) : (
                  <option value="general">General Tasks</option>
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={handleAddTask}
              className="h-10 rounded-lg border border-[var(--primary)]/40 px-4 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)]/10"
            >
              Save Task
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text)]">
            {content.label} Tasks
          </h2>

          <span className="text-sm text-[var(--muted)]">
            {currentTasks.length} task{currentTasks.length === 1 ? "" : "s"}
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