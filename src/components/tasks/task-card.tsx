"use client";

import { useParams } from "next/navigation";
import { Task } from "@/types/task";
import { useTaskStore } from "@/store/task-store";
import { ArrowRight, Check, RotateCcw, Trash2 } from "lucide-react";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

type Props = {
  task: Task;
};

export default function TaskCard({ task }: Props) {
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const messages = getMessages(locale);
  const taskCardMessages = messages.tasks.card;

  const seedTaskMessages = messages.tasks.seedTasks as Record<
    string,
    {
      title: string;
      description: string;
    }
  >;

  const translatedTask = seedTaskMessages?.[task.id];

  const taskTitle = translatedTask?.title || task.title;
  const taskDescription = translatedTask?.description || task.description;

  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  function handleMoveForward() {
    if (task.status === "backlog") {
      updateTaskStatus(task.id, "in-progress");
    } else if (task.status === "in-progress") {
      updateTaskStatus(task.id, "done");
    }
  }

  function handleMoveBack() {
    if (task.status === "in-progress") {
      updateTaskStatus(task.id, "backlog");
    } else if (task.status === "done") {
      updateTaskStatus(task.id, "in-progress");
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--task-card-border)] bg-[var(--task-card-bg)] p-4 transition hover:border-[var(--task-card-hover-border)]">
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {taskTitle}
        </p>

        <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
          {taskDescription}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {task.status !== "done" && (
            <button
              type="button"
              onClick={handleMoveForward}
              className={
                task.status === "backlog"
                  ? "inline-flex items-center gap-1.5 rounded-xl border border-[var(--task-start-border)] bg-[var(--task-start-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--task-start-text)] transition hover:bg-[var(--task-start-hover-bg)]"
                  : "inline-flex items-center gap-1.5 rounded-xl border border-[var(--task-complete-border)] bg-[var(--task-complete-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--task-complete-text)] transition hover:bg-[var(--task-complete-hover-bg)]"
              }
            >
              {task.status === "backlog" ? (
                <ArrowRight size={13} />
              ) : (
                <Check size={13} />
              )}

              {task.status === "backlog"
                ? taskCardMessages.start
                : taskCardMessages.complete}
            </button>
          )}

          {task.status !== "backlog" && (
            <button
              type="button"
              onClick={handleMoveBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--task-back-border)] bg-[var(--task-back-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--task-back-text)] transition hover:bg-[var(--task-back-hover-bg)]"
            >
              <RotateCcw size={13} />
              {taskCardMessages.back}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => deleteTask(task.id)}
          className="task-delete-button -me-1 ms-auto inline-flex h-9 w-9 items-center justify-center"
          aria-label="Delete task"
        >
          <Trash2 />
        </button>
      </div>
    </div>
  );
}